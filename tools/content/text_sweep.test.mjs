// Tests for the vanilla text sweep (docs/specs/07_interface/05_text_sweep.md): the localisation helpers, the banned-word
// matcher, the glossary and template engine, the family writer (modules/text_sweep.mjs) and the scan
// (checks/text_scan.mjs). Every test runs on a tiny synthetic "vanilla" tree generated here; the last block also checks
// the real data files and, when HOI4_GAME points at an installed game, the real sweep and scan.
//   node --test tools/content/text_sweep.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Staged, yml } from './lib/core.mjs';
import { GAME } from './lib/paths.mjs';
import {
  parseLocText, headerOf, signature, sameSignature, signatureDiff, displayText, isStructural, expandNested, nonCp1252, isLabelKey, LANGUAGES,
} from './lib/loc_parse.mjs';
import { loadBanned, compileBanned, findBanned, allowanceCovers, loadRuleSet, glossaryRules } from './lib/banned.mjs';
import {
  loadGlossary, indexGlossary, makeEngine, expandSlots, termForm, composeLabel, applyFrame, renderFamily, loadFrames, TextError,
} from './lib/text_engine.mjs';
import { buildCalendar } from './modules/calendar.mjs';
import { buildTextSweep, loadFamilyTable, loadVanillaTable, claimsOf, peopleTerms, TEXT_DATA } from './modules/text_sweep.mjs';
import { runTextScan, writeScanReport, assertTextScan, summariseScan, SCAN_REPORT_PATH } from './checks/text_scan.mjs';

const BOM = '﻿';
const glossary = await loadGlossary();
const frames = await loadFrames();
const rules = await loadRuleSet({ glossary });
const compiled = compileBanned(rules);
const engine = makeEngine({ glossary, frames });

// ------------------------------------------------------------------------------------------------ fixtures
const tmp = () => mkdtemp(path.join(os.tmpdir(), 'zin-text-'));
const q = s => String(s).replace(/"/g, '\\"').replace(/\n/g, '\\n');
async function fakeGame(files) {
  const dir = await tmp();
  await mkdir(path.join(dir, 'localisation/english'), { recursive: true });
  for (const [name, keys] of Object.entries(files)) {
    const body = Object.entries(keys).map(([k, v]) => ` ${k}:0 "${q(v)}"`).join('\n');
    await writeFile(path.join(dir, `localisation/english/${name}_l_english.yml`), `${BOM}l_english:\n${body}\n`);
  }
  return dir;
}
const VANILLA = {
  core: {
    DIV_COUNT: 'Divisions: $VAL|H$',
    PP_LINE: '§YPolitical Power§!: $V$',
    SAVE: 'Save',
    FACTORY_LINE: '£civ_factory Civilian Factories: $N$',
    MODIFIER_FACTORY_OUTPUT: 'Factory Output',
    MODIFIER_FACTORY_OUTPUT_DESC: 'Changes factory output.',
    MODIFIER_PLAIN_THING: 'Plain Thing',
    NEST_LINE: '$DIV_COUNT$ today',
    FE_MENU: 'Start',
    OLD_THING: 'Old divisions here',
    LONG_LINE: 'Zxqvanilla sentence about the tank column and its fuel supply lines in the field',
    Monday: 'Monday',
    January: 'January',
  },
  ranks: { rank1: 'General' },
  politics: { POL_MANPOWER: 'Manpower: $V$', POL_NAME: 'Name of the country' },
  alerts: { alert_x_instant: '§HDivision lost§!', alert_x_delayed: 'A division is lost: $LIST$', alert_y_instant: 'Plain alert', unrelated_key: 'Something else' },
};
const FAM = {
  schema: 1, game: null, tagWords: [],
  families: {
    core: { files: ['core'], scope: false, gate: 'banned', reachOther: { default: 'all' } },
    politics: { files: ['politics'], scope: true, gate: 'report', reachOther: { default: 'all' } },
    alerts: { files: ['alerts'], scope: false, gate: 'banned', reachOther: { alerts: 'alerts', default: 'referenced' } },
    ranks: { files: ['ranks'], scope: false, gate: 'report', claims: ['^(Monday|Tuesday)$'], reachOther: { default: 'all' } },
  },
  ownership: [{ owner: 'frontend.mjs', match: '^FE_' }],
  otherFiles: [{ match: '^.+$', mode: 'content', reason: 'test' }],
  exempt: [{ match: '^OLD_', reason: 'a removed system' }],
};
const DEFS = {
  core: {
    lit: {
      DIV_COUNT: '{division:p}: $VAL|H$',
      PP_LINE: '§Y{political_power}§!: $V$',
      FACTORY_LINE: '£civ_factory {industrial_complex:p}: $N$',
      LONG_LINE: 'A rewritten sentence about the pack column and the stores that feed it',
    },
    rows: [
      { stem: '^MODIFIER_([A-Z0-9_]+?)_DESC$', frame: 'modifies', drop: ['factor'] },
      { stem: '^MODIFIER_([A-Z0-9_]+)$', frame: 'label', drop: ['factor'] },
    ],
    neutral: [{ keys: ['SAVE'], reason: 'a plain word' }],
  },
  politics: { lit: { POL_MANPOWER: '{manpower:people}: $V$', POL_NAME: 'Name of the realm' } },
  alerts: { lit: { alert_x_instant: '§HHosts lost§!', alert_x_delayed: 'Some hosts are lost: $LIST$' } },
  ranks: { lit: { Monday: '{weekday_mon}' } },
};
const REACH = () => ({ modifierIds: new Set(), guiKeys: new Set(), tokens: new Set(), vanillaTags: new Set(), liveTags: new Set(), sprites: new Set(['GFX_civ_factory']), alertIds: new Set(['alert_x', 'alert_y']) });
const LANGS = ['english', 'french'];
async function build(extra = {}) {
  const game = await fakeGame(VANILLA);
  const staged = new Staged();
  const defs = extra.defs ?? DEFS;
  for (const lang of LANGS) staged.add(`localisation/replace/zin_calendar_l_${lang}.yml`, yml({ January: 'Deepwinter' }, lang));
  const summary = await buildTextSweep(staged, { vanillaDir: path.join(game, 'localisation'), familyTable: extra.table ?? FAM, defs, languages: LANGS, glossary, frames, names: {}, ...extra.ctx });
  return { game, staged, summary, defs };
}
const scanOf = (b, ctx = {}) => runTextScan(b.staged, { vanillaDir: path.join(b.game, 'localisation'), gameDir: b.game, familyTable: FAM, familyDefs: b.defs, languages: LANGS, glossary, reach: REACH(), dataDir: path.join(b.game, 'nodata'), ...ctx });
const put = (b, rel, lang, entries) => b.staged.files.set(rel, Buffer.from(BOM + `l_${lang}:\n` + Object.entries(entries).map(([k, v]) => ` ${k}:0 "${q(v)}"`).join('\n') + '\n'));
const checks = scan => [...new Set(scan.findings.filter(f => f.severity === 'error').map(f => f.check))].sort();
const read = (b, rel) => b.staged.files.get(rel).toString('utf8');
// Adds or replaces entries of an English ZIN file while keeping its other keys.
const patch = (b, rel, entries) => { const old = Object.fromEntries(parseLocText(read(b, rel)).map(e => [e.key, e.value])); put(b, rel, 'english', { ...old, ...entries }); };

// ------------------------------------------------------------------------------------------------ loc_parse
test('loc_parse: values, escapes, header and key classes', () => {
  const text = `${BOM}l_english:\n KEY_A:0 "He said \\"go\\"\\nnow" # comment\n key_b: "plain"\n# skipped\n BAD LINE\n`;
  const e = parseLocText(text);
  assert.deepEqual(e.map(x => x.key), ['KEY_A', 'key_b']);
  assert.equal(e[0].value, 'He said "go"\nnow');
  assert.equal(headerOf(text), 'l_english');
  assert.equal(headerOf('no header'), null);
  assert(isLabelKey('TOPBAR_TITLE_2') && !isLabelKey('army_attack_factor') && !isLabelKey('Monday'));
  assert.equal(LANGUAGES.length, 10);
});

test('loc_parse: signature keeps variables, calls, colours and icons; words do not matter', () => {
  const a = signature('§YName§!: $VAL|H$ of [ROOT.GetName] £civ_factory|2 @$TAG$');
  assert.deepEqual(a.vars, ['$TAG$', '$VAL|H$']);
  assert.deepEqual(a.calls, ['[ROOT.GetName]']);
  assert.deepEqual(a.colours, ['§!', '§Y']);
  assert.deepEqual(a.icons, ['civ_factory|2']);
  assert(sameSignature('§YA§! $X$', '$X$ §Yquite different words§!'));
  assert(!sameSignature('§YA§! $X$', '§YA§! $Y$'));
  assert(!sameSignature('A $X$', 'A $X$ $X$'));
  assert.match(signatureDiff(signature('§Y$A$§!'), signature('$B$')).join(';'), /vars lost.*\$A\$/);
  assert.match(signatureDiff(signature('§Y$A$§!'), signature('$A$')).join(';'), /colours lost/);
});

test('loc_parse: displayed text, structural values, nesting and Windows-1252', () => {
  assert.equal(displayText('§Y$A$§! has £icon  [x.Get] words\nhere'), 'has words here');
  assert(isStructural('$A$: $B|H$') && isStructural('£icon') && !isStructural('x $A$'));
  const table = new Map([['A', 'a $B$'], ['B', 'b $A$'], ['C', 'c $D$'], ['D', 'd']]);
  assert.equal(expandNested('$C$ end', table), 'c d end');
  assert.equal(expandNested('$A$', table, 6), 'a b $A$', 'a cycle stops at the repeated key');
  assert.equal(expandNested('$VAL|H$ stays', table), '$VAL|H$ stays', 'a formatted engine variable is never a nested key');
  assert.deepEqual(nonCp1252('Šodolôro ō — “x” ≥'), ['ō', '≥']);
});

// ------------------------------------------------------------------------------------------------ banned words
test('banned list: 136 rules compile, matching is whole word, possessive and hyphen aware', async () => {
  const data = await loadBanned();
  assert.equal(data.rules.length, 136);
  assert(compiled.rules.length >= 136 + 8, 'the extra rules and the glossary forbid rules load too');
  const hit = t => findBanned(t, compiled).map(h => h.id);
  assert.deepEqual(hit('The division marches'), ['bw_military_modern_001', 'gl_division']);
  assert.deepEqual(hit('division'), ['bw_military_modern_001', 'gl_division']);
  assert.equal(hit('Hosts march at dawn').length, 0);
  assert(hit("the tank's crew").includes('bw_modern_industry_033'), 'a possessive does not hide a word');
  assert(hit('Anti-tank volley').includes('bw_modern_industry_033'), 'a hyphen separates words');
  assert.equal(hit('Captain-General of the Crown').length, 0, 'the lookbehind rule spares Captain-General');
  assert.equal(hit('A divisional banner').length, 0, 'only whole words match');
  assert.equal(hit('Zol\'s Mistake').length, 0);
  assert.equal(findBanned('colour of the banner', compiled).length, 0, 'British colour is not a US spelling');
  assert(findBanned('color of the banner', compiled).some(h => h.id === 'bw_us_spelling_003'));
  assert(hit('Aenorian lords').includes('bw_superseded_names_011'));
});

test('banned list: every class has a planted-word negative', () => {
  const planted = {
    modern_industry: 'the factory', units_of_measure: '10 km', modern_society: 'a democracy', military_modern: 'the division',
    real_world: 'in Germany', third_party_ip: 'Mordor', game_and_platform: 'Hearts of Iron', superseded_names: 'Einendil', us_spelling: 'armor',
  };
  for (const [cls, text] of Object.entries(planted)) assert(findBanned(text, compiled).some(h => h.class === cls), `${cls}: ${text}`);
  assert.equal(Object.keys(planted).length, 9);
});

test('banned list: glossary forbid words and allowances', () => {
  const g = glossaryRules(glossary.glossary.entries);
  assert(g.some(r => r.id === 'gl_factory') && g.every(r => r.severity === 'error'));
  assert(findBanned('two factories', compiled).length > 0 && findBanned('Both pilots flew', compiled).length > 0);
  const al = { rules: ['bw_game_and_platform_*'], keys: ['MENU_HOMEPAGE'], files: ['pdx_l_english.yml'] };
  assert(allowanceCovers(al, 'bw_game_and_platform_005', 'MENU_HOMEPAGE', 'x.yml'));
  assert(allowanceCovers(al, 'bw_game_and_platform_005', 'OTHER', 'pdx_l_english.yml'));
  assert(!allowanceCovers(al, 'bw_modern_industry_001', 'MENU_HOMEPAGE', 'x.yml'));
});

// ------------------------------------------------------------------------------------------------ glossary and engine
test('glossary: ids unique, enough entries, every term passes the banned list', () => {
  assert.throws(() => indexGlossary({ entries: [{ id: 'a' }, { id: 'a' }] }), /twice/);
  assert(glossary.glossary.entries.length >= 150, `${glossary.glossary.entries.length} entries`);
  const bad = [];
  for (const e of glossary.glossary.entries) {
    if (['forbidden'].includes(e.kind)) continue;
    for (const form of ['s', 'p', 'lc', 'lcp']) {
      let t; try { t = termForm(e, form); } catch { continue; }
      if (findBanned(t, compiled, ['error']).length && !e.forbid?.length) bad.push(`${e.id}.${form}=${t}`);
    }
  }
  assert.deepEqual(bad.filter(b => !/^(factory|diff_)/.test(b)), []);
  for (const e of glossary.glossary.entries) for (const p of Object.keys(e.people ?? {})) assert(glossary.peoples.includes(p), `${e.id}: ${p}`);
});

test('engine: slot modifiers combine left to right', () => {
  const x = (t, o) => expandSlots(t, engine, o);
  assert.equal(x('{division}'), 'Host');
  assert.equal(x('{division:p}'), 'Hosts');
  assert.equal(x('{division:lc}'), 'host');
  assert.equal(x('{division:p:lc}'), 'hosts');
  assert.equal(x('{division:lcp}'), 'hosts');
  assert.equal(x('{arms_factory:a}'), 'an armoury');
  assert.equal(x('{division:a}'), 'a host');
  assert.equal(x('{world_tension:the}'), 'the Gathering Dark', 'a proper noun keeps its capitals');
  assert.equal(x('{world_tension:the:uc1}'), 'The Gathering Dark');
  assert.equal(x('{democratic:a}'), 'Light', 'a term with no article takes none');
  assert.equal(x('{division:lc:uc1}'), 'Host');
  assert.equal(x('{loc:deliverer}'), '[zin_loc_deliverer]');
});

test('engine: slot errors name the problem', () => {
  const x = (t, o = {}) => expandSlots(t, engine, o);
  assert.throws(() => x('{no_such_term}'), /no id no_such_term/);
  assert.throws(() => x('{factory}'), /forbidden concept/);
  assert.throws(() => x('{division:weird}'), /unknown slot modifier/);
  assert.throws(() => x('{manpower:people}'), /no country in scope/);
  assert.throws(() => x('{army:people}', { scope: true }), /no people variants/);
  assert.throws(() => x('{manpower:people:uc1}', { scope: true }), /cannot combine/);
  assert.throws(() => x('{name:nobody}'), /no proper name/);
  assert.equal(x('{manpower:people}', { scope: true }), '[zin_term_manpower]');
  assert.equal(x('{manpower:p:lc:people}', { scope: true }), '[zin_term_manpower_lcp]');
});

test('engine: terms, people variants, frames and composed labels', () => {
  const man = glossary.byId.get('manpower');
  assert.equal(termForm(man, 's', 'orcs'), 'Horde');
  assert.equal(termForm(man, 'lc', 'the_dead'), 'risen');
  assert.throws(() => termForm(glossary.byId.get('factory')), /forbidden/);
  assert.equal(applyFrame('label', frames.label, { label: 'Host Attack' }), 'Host Attack');
  assert.throws(() => applyFrame('label', frames.label, {}), /needs the slot/);
  assert.throws(() => applyFrame('label', frames.label, { label: 'x', extra: 'y' }), /no slot/);
  assert.throws(() => applyFrame('nope', undefined, {}), /unknown frame/);
  assert.equal(composeLabel(['army', 'attack', 'factor'], glossary, { drop: ['factor'] }).label, 'Army Attack');
  assert.equal(composeLabel(['political', 'power', 'gain'], glossary).label, 'Authority Gain', 'a multi-token glossary id is matched as a phrase');
  assert.equal(composeLabel(['division', 'speed'], glossary).label, 'Host Speed');
  assert.deepEqual(composeLabel(['carrier', 'speed'], glossary).unresolved, ['carrier']);
  assert.equal(composeLabel(['divisions', 'speed'], glossary).label, 'Hosts Speed', 'a plural token follows its singular stem');
  assert.equal(composeLabel(['ai', 'attack'], glossary, { map: { ai: 'AI' } }).label, 'AI Attack');
});

test('engine: renderFamily rows, stems, neutral list, duplicates and problems', async () => {
  const game = await fakeGame(VANILLA);
  const { table } = await loadVanillaTable({ dir: path.join(game, 'localisation'), families: FAM.families });
  const res = renderFamily({ family: 'core', ...DEFS.core }, table, engine, { family: 'core', banned: compiled });
  assert.equal(res.problems.length, 0, JSON.stringify(res.problems));
  assert.equal(res.entries.get('MODIFIER_FACTORY_OUTPUT'), 'Workshop Output');
  assert.equal(res.entries.get('MODIFIER_FACTORY_OUTPUT_DESC'), 'Modifies workshop output.');
  assert(!res.entries.has('MODIFIER_PLAIN_THING'));
  assert(res.skipped.some(s => s.key === 'MODIFIER_PLAIN_THING' && /unchanged/.test(s.reason)), 'a plain id keeps the label the game ships');
  assert(res.neutral.has('SAVE') && !res.entries.has('SAVE'));
  const dup = renderFamily({ family: 'core', lit: { SAVE: 'Keep' }, neutral: [{ keys: ['SAVE'], reason: 'x' }] }, table, engine, { family: 'core' });
  assert(dup.problems.some(p => p.kind === 'duplicate'));
  const noReason = renderFamily({ family: 'core', neutral: [{ keys: ['SAVE'] }] }, table, engine, { family: 'core' });
  assert(noReason.problems.some(p => p.kind === 'reason'));
  const same = renderFamily({ family: 'core', lit: { SAVE: 'Keep' }, rows: [{ same: ['FE_MENU', 'SAVE'] }] }, table, engine, { family: 'core' });
  assert.equal(same.entries.get('FE_MENU'), 'Keep');
});

// ------------------------------------------------------------------------------------------------ the sweep
test('sweep: writes one replace file per family and language, same values, sorted, BOM and header', async () => {
  const b = await build();
  const en = read(b, 'localisation/replace/zin_core_l_english.yml');
  assert(b.staged.files.get('localisation/replace/zin_core_l_english.yml').subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])));
  assert.equal(headerOf(en), 'l_english');
  assert.equal(headerOf(read(b, 'localisation/replace/zin_core_l_french.yml')), 'l_french');
  const keys = parseLocText(en).map(e => e.key);
  assert.deepEqual(keys, [...keys].sort((x, y) => x.localeCompare(y, 'en')));
  const fr = parseLocText(read(b, 'localisation/replace/zin_core_l_french.yml'));
  assert.deepEqual(fr.map(e => [e.key, e.value]), parseLocText(en).map(e => [e.key, e.value]));
  const map = Object.fromEntries(parseLocText(en).map(e => [e.key, e.value]));
  assert.equal(map.DIV_COUNT, 'Hosts: $VAL|H$');
  assert.equal(map.PP_LINE, '§YAuthority§!: $V$');
  assert.equal(map.FACTORY_LINE, '£civ_factory Guild Workshops: $N$');
  assert.equal(map.MODIFIER_FACTORY_OUTPUT, 'Workshop Output');
  assert(!('SAVE' in map) && !('MODIFIER_PLAIN_THING' in map));
  assert.equal(b.summary.languages, 2);
  assert.equal(b.summary.families.core.neutral, 1);
  assert.equal(b.summary.families.core.unchanged, 1);
});

test('sweep: claims, ownership and keys other modules staged are skipped, not overwritten', async () => {
  const b = await build();
  const ranks = parseLocText(read(b, 'localisation/replace/zin_ranks_l_english.yml'));
  assert.deepEqual(ranks.map(e => [e.key, e.value]), [['Monday', 'Lampday']], 'a claimed key belongs to its claiming family');
  assert(!parseLocText(read(b, 'localisation/replace/zin_core_l_english.yml')).some(e => e.key === 'Monday'));
  assert(!('January' in Object.fromEntries(parseLocText(read(b, 'localisation/replace/zin_core_l_english.yml')).map(e => [e.key, 1]))), 'months belong to calendar.mjs');
  const game = await fakeGame(VANILLA);
  const staged = new Staged();
  staged.add('localisation/english/zin_other_l_english.yml', yml({ PP_LINE: 'Owned by another module' }));
  const s = await buildTextSweep(staged, { vanillaDir: path.join(game, 'localisation'), familyTable: FAM, defs: DEFS, languages: LANGS, glossary, frames, names: {} });
  assert.equal(s.families.core.ownedElsewhere, 1);
  assert(!parseLocText(staged.files.get('localisation/replace/zin_core_l_english.yml').toString('utf8')).some(e => e.key === 'PP_LINE'));
  const owner = claimsOf(FAM.families);
  assert.equal(owner('Monday', 'core'), 'ranks');
  assert.equal(owner('SAVE', 'core'), 'core');
});

test('sweep: people variants become scripted localisation, only where the family has a scope', async () => {
  const b = await build();
  const script = read(b, 'common/scripted_localisation/zin_terms.txt');
  assert.match(script, /name = zin_term_manpower\n\ttext = \{\n\t\ttrigger = \{ has_country_flag = zin_people_orcs \}/);
  assert.match(script, /localization_key = zin_term_division_default/);
  assert.equal(b.summary.peopleTerms, 8, 'two entries with variants, four forms each');
  const terms = Object.fromEntries(parseLocText(read(b, 'localisation/replace/zin_terms_l_english.yml')).map(e => [e.key, e.value]));
  assert.equal(terms.zin_term_manpower_orcs, 'Horde');
  assert.equal(terms.zin_term_manpower_default, 'Levies');
  assert.equal(terms.zin_term_division_lcp_the_dead, 'grave hosts');
  const pol = Object.fromEntries(parseLocText(read(b, 'localisation/replace/zin_politics_l_english.yml')).map(e => [e.key, e.value]));
  assert.equal(pol.POL_MANPOWER, '[zin_term_manpower]: $V$');
  assert.equal(peopleTerms(glossary).count, 8);
});

test('sweep: a rebuild gives identical bytes', async () => {
  const a = await build(), c = await build();
  assert.deepEqual([...a.staged.files.keys()].sort(), [...c.staged.files.keys()].sort());
  for (const [rel, bytes] of a.staged.files) assert(bytes.equals(c.staged.files.get(rel)), rel);
});

test('sweep: the stage 4 conversion is refused, an unlisted family writes nothing', async () => {
  const game = await fakeGame(VANILLA);
  await assert.rejects(buildTextSweep(new Staged(), { vanillaDir: path.join(game, 'localisation'), familyTable: FAM, defs: DEFS, stage: 4 }), /stage 4/);
  const staged = new Staged();
  const s = await buildTextSweep(staged, { vanillaDir: path.join(game, 'localisation'), familyTable: FAM, defs: { core: DEFS.core }, dataDir: path.join(game, 'nodata'), languages: ['english'], glossary, frames, names: {}, only: ['core', 'alerts'] });
  assert.equal(s.families.alerts.data, false);
  assert(staged.files.has('localisation/replace/zin_core_l_english.yml') && !staged.files.has('localisation/replace/zin_alerts_l_english.yml'));
});

// ------------------------------------------------------------------------------------------------ the sweep refuses
const refuse = async (defs, pattern) => {
  const game = await fakeGame(VANILLA);
  await assert.rejects(buildTextSweep(new Staged(), { vanillaDir: path.join(game, 'localisation'), familyTable: FAM, defs, dataDir: path.join(game, 'nodata'), languages: ['english'], glossary, frames, names: {} }), pattern);
};
test('negative sweep: a lost placeholder is refused', () => refuse({ core: { lit: { DIV_COUNT: '{division:p}: many' } } }, /placeholders\] vars lost: \$VAL\|H\$/));
test('negative sweep: a lost colour code is refused', () => refuse({ core: { lit: { PP_LINE: '{political_power}: $V$' } } }, /colours lost/));
test('negative sweep: an added placeholder is refused', () => refuse({ core: { lit: { SAVE: 'Keep $X$' } } }, /vars added/));
test('negative sweep: a banned word is refused', () => refuse({ core: { lit: { SAVE: 'Save the tank' } } }, /banned word tank/));
test('negative sweep: a glossary term that does not exist is refused', () => refuse({ core: { lit: { SAVE: 'Keep {no_such_term}' } } }, /no id no_such_term/));
test('negative sweep: a forbidden concept used as a term is refused', () => refuse({ core: { lit: { SAVE: 'Keep {factory:p}' } } }, /forbidden concept/));
test('negative sweep: a key the game does not define is refused', () => refuse({ core: { lit: { NO_SUCH_KEY: 'x' } } }, /does not define this key/));
test('negative sweep: a key of another family is refused', () => refuse({ core: { lit: { POL_NAME: 'Realm' } } }, /belongs to the politics family/));
test('negative sweep: a people term in a family without scope is refused', () => refuse({ core: { lit: { SAVE: '{manpower:people}' } } }, /no country in scope/));
test('negative sweep: a key written by two families is refused', () => refuse({ core: { lit: { SAVE: 'Keep' } }, ranks: { lit: { SAVE: 'Keep too' } } }, /not_in_family|owned_twice/));

test('negative sweep: a missing frame slot and a frame row with no target are refused', async () => {
  const game = await fakeGame(VANILLA);
  const { table } = await loadVanillaTable({ dir: path.join(game, 'localisation'), families: FAM.families });
  const res = renderFamily({ family: 'core', rows: [{ key: 'SAVE', frame: 'label', slots: {} }, { frame: 'label' }] }, table, engine, { family: 'core' });
  assert(res.problems.some(p => p.kind === 'frame' && /needs the slot/.test(p.detail)));
  assert(res.problems.some(p => p.kind === 'row'));
});

test('negative sweep: two parts that write the same key are refused', async () => {
  const dir = await tmp();
  await writeFile(path.join(dir, 'core.json'), JSON.stringify({ lit: { SAVE: 'a' } }));
  await writeFile(path.join(dir, 'core.energy.json'), JSON.stringify({ lit: { SAVE: 'b' } }));
  const { loadFamilyDef } = await import('./modules/text_sweep.mjs');
  await assert.rejects(loadFamilyDef(dir, 'core'), /written by two parts/);
  await writeFile(path.join(dir, 'core.energy.json'), JSON.stringify({ lit: { OTHER: 'b' } }));
  const merged = await loadFamilyDef(dir, 'core');
  assert.deepEqual(Object.keys(merged.lit).sort(), ['OTHER', 'SAVE']);
  assert.equal(await loadFamilyDef(dir, 'nothing'), null);
});

// ------------------------------------------------------------------------------------------------ the scan
test('scan: the clean fixture passes and reports the families', async () => {
  const b = await build();
  const scan = await scanOf(b);
  assert.equal(scan.ok, true, JSON.stringify(scan.failing));
  assert.deepEqual(checks(scan), []);
  assert.deepEqual(scan.iconsUsed, ['civ_factory'], 'the icons used in ZIN text are listed for the reskin');
  assert.equal(scan.families.core.keys, 12);
  assert.equal(scan.families.core.zin, 4 + 2 + 1, 'four literals, two composed labels and the calendar January');
});

test('scan: counts replaced, neutral, structural, exempt and unreached keys', async () => {
  const b = await build();
  const f = (await scanOf(b)).families;
  assert.equal(f.core.neutral, 1);
  assert.equal(f.core.exempt, 1, 'OLD_THING is exempt by pattern');
  assert.equal(f.core.structural, 0);
  assert.equal(f.alerts.keys, 4);
  assert.equal(f.alerts.zin, 2);
  assert.equal(f.alerts.unreached, 1, 'a lower-case key no alert and no script names');
  assert.equal(f.ranks.keys, 2, 'Monday is claimed by ranks, rank1 sits in its file');
  assert.equal(f.ranks.zin, 1);
  assert.equal(f.politics.zin, 2);
});

test('negative scan X5: a banned word in ZIN text fails the family', async () => {
  const b = await build();
  put(b, 'localisation/replace/zin_core_l_english.yml', 'english', { SAVE: 'Save the tank crew' });
  const scan = await scanOf(b);
  assert(!scan.ok);
  assert(scan.failing.some(f => f.check === 'X5' && f.family === 'core' && f.key === 'SAVE'));
  assert.throws(() => assertTextScan(scan), /text scan found/);
  assert(scan.families.core.zinBannedError >= 1);
});

test('negative scan X5: a review word is a warning and an allowance covers its rule', async () => {
  const b = await build();
  patch(b, 'localisation/replace/zin_core_l_english.yml', { SAVE: 'The first operation' });
  const scan = await scanOf(b);
  assert(scan.findings.some(f => f.check === 'X5' && f.severity === 'warning'));
  assert(!scan.failing.some(f => f.check === 'X5'), 'a review word never fails the build');
  const used = await scanOf(b, { banned: { ...(await loadBanned()), allowances: [{ id: 'al_test', rules: ['bw_military_modern_007'], keys: ['SAVE'], files: [], reason: 'test' }] } });
  assert(!used.findings.some(f => f.check === 'X5' && f.key === 'SAVE'));
  assert.equal(used.allowances.find(a => a.id === 'al_test').used, 1);
});

test('negative scan X9: a lost placeholder or colour code in a ZIN value fails', async () => {
  const b = await build();
  put(b, 'localisation/replace/zin_core_l_english.yml', 'english', { DIV_COUNT: 'Hosts: many', PP_LINE: 'Authority: $V$' });
  const scan = await scanOf(b);
  const keys = scan.findings.filter(f => f.check === 'X9').map(f => f.key).sort();
  assert.deepEqual(keys, ['DIV_COUNT', 'PP_LINE']);
  assert(!scan.ok);
  assert.match(scan.findings.find(f => f.key === 'PP_LINE' && f.check === 'X9').detail, /colours lost/);
});

test('negative scan X7: an unknown colour code, a sign at the end and an open code fail', async () => {
  const b = await build();
  put(b, 'localisation/replace/zin_core_l_english.yml', 'english', { SAVE: '§QOdd', FE_MENU: 'Ends with a sign §', NEW_KEY: '§YOpen colour' });
  const x7 = (await scanOf(b)).findings.filter(f => f.check === 'X7');
  assert.deepEqual(x7.map(f => f.key).sort(), ['FE_MENU', 'NEW_KEY', 'SAVE']);
});

test('negative scan X11: a character the game font lacks, a missing BOM and a wrong header fail', async () => {
  const b = await build();
  put(b, 'localisation/replace/zin_core_l_english.yml', 'english', { SAVE: 'Saōve' });
  b.staged.files.set('localisation/replace/zin_alerts_l_english.yml', Buffer.from('l_english:\n alert_y_instant:0 "x"\n'));
  b.staged.files.set('localisation/replace/zin_politics_l_english.yml', Buffer.from(`${BOM}l_french:\n POL_NAME:0 "x"\n`));
  const x11 = (await scanOf(b)).findings.filter(f => f.check === 'X11');
  assert(x11.some(f => /Windows-1252/.test(f.detail) && f.key === 'SAVE'));
  assert(x11.some(f => /byte order mark/.test(f.detail) && /alerts/.test(f.file)));
  assert(x11.some(f => /header must be l_english/.test(f.detail) && /politics/.test(f.file)));
});

test('negative scan X11: an empty value and a bad key fail', async () => {
  const b = await build();
  put(b, 'localisation/replace/zin_core_l_english.yml', 'english', { SAVE: '  ', 'BAD KEY!': 'x' });
  const x11 = (await scanOf(b)).findings.filter(f => f.check === 'X11');
  assert(x11.some(f => /value is empty/.test(f.detail)));
});

test('negative scan X3: an unreplaced key with a banned word fails a family at gate banned, not at gate report', async () => {
  const b = await build({ defs: { ...DEFS, core: { ...DEFS.core, lit: { DIV_COUNT: DEFS.core.lit.DIV_COUNT } } } });
  const scan = await scanOf(b, { familyDefs: b.defs });
  const x3 = scan.findings.filter(f => f.check === 'X3');
  assert(x3.some(f => f.key === 'FACTORY_LINE' && f.severity === 'error'));
  assert(!scan.ok);
  assert(scan.unreplaced.core.includes('FACTORY_LINE') && scan.unreplaced.core.includes('LONG_LINE'));
  const soft = structuredClone(FAM); soft.families.core.gate = 'report';
  const scan2 = await scanOf(b, { familyTable: soft });
  assert(!scan2.findings.some(f => f.check === 'X3'));
  assert(scan2.families.core.vanillaBanned >= 2);
  assert.equal(scan2.ok, true);
});

test('negative scan X3: gate strict also fails reachable keys that only show clean installed text', async () => {
  const b = await build();
  const strict = structuredClone(FAM); strict.families.alerts.gate = 'strict';
  const scan = await scanOf(b, { familyTable: strict });
  assert(scan.findings.some(f => f.check === 'X3' && f.family === 'alerts' && f.key === ''));
  assert(scan.families.alerts.strictMissing >= 1);
});

test('negative scan X4: an identical value and a near copy fail unless the key is neutral', async () => {
  const b = await build();
  put(b, 'localisation/replace/zin_core_l_english.yml', 'english', { FE_MENU: 'Start', LONG_LINE: 'A sentence about the tank column and its fuel supply lines in the field', SAVE: 'Save' });
  const scan = await scanOf(b);
  const x4 = scan.findings.filter(f => f.check === 'X4').map(f => f.key).sort();
  assert.deepEqual(x4, ['FE_MENU', 'LONG_LINE'], 'SAVE is on the neutral list');
});

test('negative scan X12: a key defined twice in one file or in two ZIN files fails', async () => {
  const b = await build();
  b.staged.files.set('localisation/replace/zin_extra_l_english.yml', Buffer.from(`${BOM}l_english:\n SAVE:0 "A"\n SAVE:0 "B"\n`));
  put(b, 'localisation/english/zin_more_l_english.yml', 'english', { DIV_COUNT: 'Hosts: $VAL|H$' });
  const x12 = (await scanOf(b)).findings.filter(f => f.check === 'X12');
  assert(x12.some(f => /twice in this file/.test(f.detail)));
  assert(x12.some(f => f.key === 'DIV_COUNT' && /also defined in/.test(f.detail)));
});

test('negative scan X13: a missing or differing language copy fails', async () => {
  const b = await build();
  b.staged.files.delete('localisation/replace/zin_core_l_french.yml');
  put(b, 'localisation/replace/zin_alerts_l_french.yml', 'french', { alert_x_instant: '§HDifferent§!', alert_x_delayed: 'Some hosts are lost: $LIST$' });
  const x13 = (await scanOf(b)).findings.filter(f => f.check === 'X13');
  assert(x13.some(f => f.family === 'core' && /copy is missing/.test(f.detail)));
  assert(x13.some(f => f.family === 'alerts' && f.key === 'alert_x_instant'));
});

test('negative scan X14: a family file that writes a key of another family fails', async () => {
  const b = await build();
  put(b, 'localisation/replace/zin_core_l_english.yml', 'english', { POL_NAME: 'Realm of the north' });
  const x14 = (await scanOf(b)).findings.filter(f => f.check === 'X14');
  assert(x14.some(f => f.key === 'POL_NAME' && /politics/.test(f.detail)));
});

test('negative scan X15 and X6: an undefined people term and an unexpanded slot fail', async () => {
  const b = await build();
  patch(b, 'localisation/replace/zin_core_l_english.yml', { SAVE: 'Needs [zin_term_manpower] and {division}' });
  b.staged.files.delete('common/scripted_localisation/zin_terms.txt');
  const f = (await scanOf(b)).findings;
  assert(f.some(x => x.check === 'X6' && /unexpanded template slot/.test(x.detail)));
  assert(f.some(x => x.check === 'X6' && /no country in scope/.test(x.detail)), 'core has no country in scope');
  assert(f.some(x => x.check === 'X15' && x.key === 'zin_term_manpower'));
});

test('scan X15: the generated people terms satisfy the glossary', async () => {
  const b = await build();
  const x15 = (await scanOf(b)).findings.filter(f => f.check === 'X15');
  assert.deepEqual(x15, []);
  b.staged.files.set('common/scripted_localisation/zin_terms.txt', Buffer.from('defined_text = { name = zin_term_manpower }\n'));
  assert((await scanOf(b)).findings.some(f => f.check === 'X15' && /no scripted localisation/.test(f.detail)));
});

test('negative scan X10 and X8: a nested key that does not exist, a cycle and an unknown icon fail', async () => {
  const b = await build();
  put(b, 'localisation/replace/zin_core_l_english.yml', 'english', { SAVE: 'See $zin_missing_key$ and $zin_a$', zin_a: 'back to $zin_b$', zin_b: 'again $zin_a$', FACTORY_LINE: '£no_such_icon Workshops: $N$' });
  const f = (await scanOf(b)).findings;
  assert(f.some(x => x.check === 'X10' && /names no key/.test(x.detail)));
  assert(f.some(x => x.check === 'X10' && /cycle/.test(x.detail)));
  assert(f.some(x => x.check === 'X8' && x.key === 'FACTORY_LINE'));
});

test('negative scan X1: a vanilla file with no family and no other-file row fails', async () => {
  const b = await build();
  const strict = structuredClone(FAM); strict.otherFiles = [{ match: '^nothing$', mode: 'content', reason: 'x' }];
  await writeFile(path.join(b.game, 'localisation/english/brand_new_l_english.yml'), `${BOM}l_english:\n BRAND_NEW:0 "x"\n`);
  const x1 = (await scanOf(b, { familyTable: strict })).findings.filter(f => f.check === 'X1');
  assert(x1.some(f => f.file === 'brand_new_l_english.yml'));
});

test('scan: a hit that comes only through a nested vanilla key is a warning, and is not counted as unreplaced', async () => {
  const b = await build();
  // NEST_LINE nests DIV_COUNT. Here DIV_COUNT stays vanilla (not written) so the nested text still says Divisions.
  const defs = { ...DEFS, core: { ...DEFS.core, lit: { NEST_LINE: '$DIV_COUNT$ at dusk' } } };
  const b2 = await build({ defs });
  const scan = await scanOf(b2, { familyDefs: defs });
  const nest = scan.findings.filter(f => f.key === 'NEST_LINE' && f.check === 'X5');
  assert(nest.length > 0 && nest.every(f => f.severity === 'warning' && /nested key/.test(f.detail)));
  assert(!scan.failing.some(f => f.key === 'NEST_LINE'));
  assert(b);
});

// ------------------------------------------------------------------------------------------------ the report
test('report: deterministic, quotes only ZIN text, never an installed sentence', async () => {
  const defs = { ...DEFS, core: { ...DEFS.core, lit: { DIV_COUNT: DEFS.core.lit.DIV_COUNT } } };
  const b = await build({ defs });
  const scan = await scanOf(b, { familyDefs: defs });
  const s1 = new Staged(), s2 = new Staged();
  writeScanReport(s1, scan); writeScanReport(s2, await scanOf(b, { familyDefs: defs }));
  assert(s1.files.get(SCAN_REPORT_PATH).equals(s2.files.get(SCAN_REPORT_PATH)));
  const json = s1.files.get(SCAN_REPORT_PATH).toString('utf8');
  assert(!json.includes('Zxqvanilla'), 'an installed value is never written to the report');
  const parsed = JSON.parse(json);
  assert.equal(parsed.schema, 1);
  assert(Array.isArray(parsed.iconsUsed));
  assert.deepEqual(Object.keys(parsed.families), Object.keys(FAM.families));
  assert(parsed.unreplaced.core.includes('LONG_LINE'), 'the key names are listed');
  assert.equal(SCAN_REPORT_PATH, 'docs/design/validation/text_scan_report.json');
  assert.match(summariseScan(scan), /text scan: (ok|FAILED)/);
});

test('report: findings are sorted and cut at 80 characters', async () => {
  const b = await build();
  put(b, 'localisation/replace/zin_core_l_english.yml', 'english', { SAVE: 'Save the tank crew and the tank crew and the tank crew and the tank crew and the tank crew again' });
  const scan = await scanOf(b);
  const f = scan.findings.find(x => x.check === 'X5');
  assert(f.detail.length <= 80, `${f.detail.length}`);
  const order = scan.findings.map(x => x.check);
  assert.deepEqual(order, [...order].sort((a, c) => a.localeCompare(c, 'en', { numeric: true })));
});

// ------------------------------------------------------------------------------------------------ the real data
test('data: the family table lists the 95 swept files in 23 families, each data file parses', async () => {
  const table = await loadFamilyTable();
  assert.equal(Object.keys(table.families).length, 23);
  const files = Object.values(table.families).flatMap(f => f.files);
  assert.equal(files.length, 95);
  assert.equal(new Set(files).size, 95);
  for (const [name, def] of Object.entries(table.families)) assert(['off', 'report', 'banned', 'strict'].includes(def.gate), `${name}: ${def.gate}`);
  const { loadFamilyDef } = await import('./modules/text_sweep.mjs');
  for (const name of Object.keys(table.families)) {
    const d = await loadFamilyDef(TEXT_DATA, name);
    if (table.families[name].gate !== 'off') assert(d, `${name} has gate ${table.families[name].gate} and no data`);
    if (d) assert(Object.keys(d.lit).length + d.rows.length + d.neutral.length > 0, name);
  }
  assert.equal(table.game, '1.19.3.0');
});

test('data: every glossary id the family files use exists, and the people terms compile', async () => {
  const { loadFamilyDef } = await import('./modules/text_sweep.mjs');
  const table = await loadFamilyTable();
  const used = new Set();
  const { slotIds } = await import('./lib/text_engine.mjs');
  for (const name of Object.keys(table.families)) {
    const d = await loadFamilyDef(TEXT_DATA, name);
    if (!d) continue;
    for (const v of Object.values(d.lit)) for (const id of slotIds(v)) used.add(id);
  }
  assert(used.size >= 60, `${used.size} glossary ids used`);
  for (const id of used) assert(glossary.byId.has(id), id);
  for (const id of used) assert.notEqual(glossary.byId.get(id).kind, 'forbidden', id);
  assert(peopleTerms(glossary).script.includes('defined_text'));
});

const haveGame = existsSync(`${GAME}/localisation/english/core_l_english.yml`);
test('real game: the sweep builds, the scan passes and the families in effect show no banned installed text', { skip: !haveGame }, async () => {
  const staged = new Staged();
  await buildCalendar(staged);
  const summary = await buildTextSweep(staged, {});
  assert(summary.entries > 1500, `${summary.entries} entries`);
  assert.equal(summary.languages, 10);
  const scan = await runTextScan(staged, { gameDir: GAME });
  assert.equal(scan.totals.keys, 39038, 'the swept families hold 39,038 keys');
  for (const [name, f] of Object.entries(scan.families)) if (['banned', 'strict'].includes(f.gate)) assert.equal(f.vanillaBanned, 0, `${name} shows installed banned text`);
  const mine = scan.findings.filter(f => f.severity === 'error' && ['core', 'tooltips', 'alerts', 'mapmodes', 'rules', 'difficulty', 'ranks'].includes(f.family));
  assert.deepEqual(mine.map(f => `${f.check} ${f.key}`), []);
  assert(scan.totals.zin >= 1800 && scan.totals.vanillaBanned < 2600);
  for (const e of glossary.glossary.entries) for (const k of e.engine.loc) assert(scan.totals.keys > 0 && k.length > 0);
});

test('real game: every glossary engine.loc key exists in the installed game', { skip: !haveGame }, async () => {
  const { readLocDir } = await import('./lib/loc_parse.mjs');
  const keys = new Set();
  for (const entries of (await readLocDir(`${GAME}/localisation/english`)).values()) for (const e of entries) keys.add(e.key);
  const missing = glossary.glossary.entries.flatMap(e => e.engine.loc.filter(k => !keys.has(k)).map(k => `${e.id}:${k}`));
  assert.deepEqual(missing, []);
});

test.after(async () => { await rm(path.join(os.tmpdir(), 'zin-text-never'), { recursive: true, force: true }); });
