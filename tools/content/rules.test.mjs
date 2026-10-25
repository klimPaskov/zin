// Tests for the foundation's game rules (modules/rules.mjs, data/game_rules.json; docs/specs/00_foundation/05_defines_and_rules.md section 2).
// Run: node --test tools/content/rules.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { Staged } from './lib/core.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { buildRules, loadRules, checkRules } from './modules/rules.mjs';

// The three owners' rule files the branch triggers read, in the owners' option order (mech_lerendor, mech_crossing, mech_eindil).
const OWNER_RULES = { zin_rule_leren_route: ['DEFAULT', 'historical', 'honour', 'supremacy', 'free'], zin_rule_west_route: ['DEFAULT', 'historical', 'crossing_hold', 'relief', 'divided', 'free'], zin_rule_eindil_journey: ['DEFAULT', 'HISTORICAL', 'FREE'] };
const ownerFile = rules => Object.entries(rules).map(([id, opts]) => `${id} = {\n\tgroup = RULE_GROUP_ZIN\n${opts.map((o, i) => `\t${i ? 'option' : 'default'} = { name = ${o} }`).join('\n')}\n}`).join('\n');
const build = async (data, owners = OWNER_RULES) => {
  const staged = new Staged();
  staged.text('common/game_rules/zin_owners_test.txt', ownerFile(owners));
  const r = await buildRules(staged, data ? { data } : {});
  return { staged, r, text: rel => staged.files.get(rel).toString('utf8') };
};
const DATA = await loadRules();
const clone = () => structuredClone(DATA);
const { staged, text } = await build();
const rulesFile = parse(text('common/game_rules/zin_game_rules.txt'));
const triggers = new Map(parse(text('common/scripted_triggers/zin_rules.txt')).filter(e => e.k).map(e => [e.k, e.v]));
const loc = text('localisation/english/zin_game_rules_l_english.yml');
const locKeys = new Set([...loc.matchAll(/^ ([A-Z0-9_]+):0 "(.+)"$/gm)].map(m => m[1]));
const flat = v => JSON.stringify(v);

test('Every rule of the data is written once, in the ZIN group, with its options in order and every text key', () => {
  assert.deepEqual(rulesFile.map(e => e.k), DATA.rules.map(r => r.id));
  for (const [e, r] of rulesFile.map((e, i) => [e, DATA.rules[i]])) {
    assert.equal(e.v.find(x => x.k === 'group').v, 'RULE_GROUP_ZIN', r.id);
    const opts = e.v.filter(x => x.k === 'option' || x.k === 'default');
    assert.equal(opts[0].k, 'default', `${r.id}: the first option is the default`);
    assert.deepEqual(opts.map(o => o.v.find(x => x.k === 'name').v), r.options.map(o => o.key));
    // No rule-level desc: the game reads desc only inside an option (r3b log, "Unexpected token: desc").
    assert.equal(e.v.find(x => x.k === 'desc'), undefined, `${r.id}: no rule-level desc`);
    for (const k of [e.v.find(x => x.k === 'name').v, ...opts.flatMap(o => [o.v.find(x => x.k === 'text').v, o.v.find(x => x.k === 'desc').v])]) assert(locKeys.has(k), `${r.id}: text key ${k}`);
  }
  assert(loc.startsWith('﻿l_english:'), 'UTF-8 with BOM');
});

test('The register of 05_defines_and_rules.md: the rules the slices read exist, the per-power ones open with DEFAULT', () => {
  const ids = new Set(DATA.rules.map(r => r.id));
  for (const id of ['zin_rule_historical_path', 'zin_rule_story_pace', 'zin_rule_eindil_waking', 'zin_rule_dark_powers', 'zin_rule_ai_aenor_succession', 'zin_rule_ai_east', 'zin_rule_ai_elves', 'zin_rule_ai_goldoroth', 'zin_rule_golden_king_death', 'zin_rule_afrit', 'zin_rule_cold_isengard', 'zin_rule_debug_checks']) assert(ids.has(id), id);
  for (const r of DATA.rules.filter(x => x.perPower)) assert.equal(r.options[0].key, 'DEFAULT', r.id);
  const opts = id => DATA.rules.find(r => r.id === id).options.map(o => o.key);
  assert.deepEqual(opts('zin_rule_golden_king_death'), ['DYNAMIC', 'HISTORICAL', 'DELAYED', 'NO_AI_PLOT'], 'N15');
  assert.deepEqual(opts('zin_rule_afrit'), ['DEFAULT', 'HISTORICAL', 'FREE', 'ASHEN', 'DORMANT']);
  assert.deepEqual(opts('zin_rule_cold_isengard'), ['DEFAULT', 'HISTORICAL', 'OPEN_HAND', 'CONQUEST', 'FREE']);
  assert.deepEqual(opts('zin_rule_debug_checks'), ['OFF', 'ON']);
  assert.deepEqual(opts('zin_rule_eindil_waking'), ['HISTORICAL', 'EARLY', 'LATE'], 'the journey reads EARLY and LATE');
  assert(!ids.has('zin_rule_golden_king') && !ids.has('zin_rule_ai_lerendor') && !ids.has('zin_rule_ai_west') && !ids.has('zin_rule_zol_behaviour'), 'retired rules (R1, N4)');
});

test('Rule texts name neither Afrit, Eindil nor the Hidden Council; the waking rule is "The Man from the Ice"', () => {
  for (const [, v] of loc.matchAll(/:0 "(.+)"$/gm)) assert.doesNotMatch(v, /Afrit|Eindil|Hidden Council|Erdae|Arda\b/);
  assert.match(loc, /ZIN_RULE_EINDIL_WAKING:0 "The Man from the Ice"/);
  assert.match(loc, /ZIN_RULE_AFRIT:0 "The Deliverer's Path"/);
  assert.match(loc, /ZIN_RULE_AI_EAST_REFUSE_AFRIT:0 "Refuse the Deliverer"/);
});

test('The path wrappers: historical and free read the path rule; PLAUSIBLE is neither', () => {
  assert.match(flat(triggers.get('zin_rules_is_historical')), /zin_rule_historical_path.*HISTORICAL/);
  assert.match(flat(triggers.get('zin_rules_is_free')), /zin_rule_historical_path.*FREE/);
  for (const k of ['zin_rules_is_historical', 'zin_rules_is_free']) assert.doesNotMatch(flat(triggers.get(k)), /PLAUSIBLE/, k);
});

test('Branch triggers: a forced option, or DEFAULT where the path leads there; RANDOM makes every branch false', () => {
  const gold = flat(triggers.get('zin_rules_ai_branch_goldoroth_independent'));
  assert.match(gold, /zin_rule_ai_goldoroth.*INDEPENDENT/); assert.match(gold, /DEFAULT/); assert.match(gold, /HISTORICAL/); assert.match(gold, /PLAUSIBLE/); assert.doesNotMatch(gold, /"FREE"/);
  const sworn = flat(triggers.get('zin_rules_ai_branch_goldoroth_sworn_to_volgan'));
  assert.doesNotMatch(sworn, /DEFAULT/, 'DEFAULT never leads to the southern bargain');
  assert.doesNotMatch(flat(triggers.get('zin_rules_ai_branch_elves_march')), /DEFAULT/, 'the elves march only when forced');
  for (const o of ['refuse_afrit', 'unite_without_afrit']) assert.doesNotMatch(flat(triggers.get(`zin_rules_ai_branch_east_${o}`)), /DEFAULT/);
  const leren = flat(triggers.get('zin_rules_ai_branch_leren_historical'));
  assert.match(leren, /zin_rule_leren_route.*historical/); assert.match(leren, /DEFAULT/); assert.doesNotMatch(leren, /PLAUSIBLE/, 'PLAUSIBLE leaves Lerendor to its weights');
  assert.match(flat(triggers.get('zin_rules_ai_branch_afrit_free')), /PLAUSIBLE/, 'the Afrit DEFAULT is FREE off the historical path');
  for (const p of ['aenor', 'east', 'elves', 'goldoroth']) assert.match(flat(triggers.get(`zin_rules_ai_random_${p}`)), /RANDOM/, p);
  assert(!triggers.has('zin_rules_ai_random_afrit'), 'only the four RANDOM rules have a random trigger');
  for (const [k] of triggers) assert(!/_default$|_random$/.test(k) || k.startsWith('zin_rules_ai_random_'), `${k}: no branch for DEFAULT or RANDOM`);
});

test('The story pace is set once, for the whole world, from the rule', () => {
  const on = text('common/on_actions/zin_rules.txt');
  assert.match(on, /on_startup/); assert.doesNotMatch(on, /on_(daily|weekly|monthly)/);
  for (const [o, v] of [['SLOW', 1.5], ['FAST', 0.75]]) assert.match(on, new RegExp(`option = ${o} \\}\\s*\\}\\s*set_variable = \\{ global\\.zin_story_pace = ${v} \\}`));
  assert.match(on, /else = \{\s*set_variable = \{ global\.zin_story_pace = 1 \}/);
});

test('Every staged script parses with balanced braces and no unsupported operator', () => {
  for (const [rel, b] of staged.files) if (rel.endsWith('.txt')) { const t = scriptText(b); assert.doesNotThrow(() => parse(t), rel); assert.doesNotMatch(t, /<=|>=/, rel); assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, rel); }
});

test('Negative: the data checks refuse a per-power rule without DEFAULT first, a secret in the text, a branch to no option and a duplicate', () => {
  const d1 = clone(); d1.rules.find(r => r.id === 'zin_rule_afrit').options.reverse();
  assert(checkRules(d1).some(p => /DEFAULT/.test(p)));
  const d2 = clone(); d2.rules.find(r => r.id === 'zin_rule_afrit').desc = 'How Afrit acts.';
  assert(checkRules(d2).some(p => /secret/.test(p)));
  const d3 = clone(); d3.rules.find(r => r.id === 'zin_rule_ai_goldoroth').branch.HISTORICAL = 'NOBODY';
  assert(checkRules(d3).some(p => /not an option/.test(p)));
  const d4 = clone(); d4.rules.push(structuredClone(d4.rules[0]));
  assert(checkRules(d4).some(p => /twice/.test(p)));
  const d5 = clone(); d5.rules[0].options[0].desc = '';
  assert(checkRules(d5).some(p => /missing text/.test(p)));
});

test('Negative: the build refuses a missing owner rule, an owner option that is gone, and a rule an owner already defines', async () => {
  const { zin_rule_leren_route: _, ...noLeren } = OWNER_RULES;
  await assert.rejects(build(undefined, noLeren), /zin_rule_leren_route: the owner's rule file is not staged/);
  await assert.rejects(build(undefined, { ...OWNER_RULES, zin_rule_west_route: ['DEFAULT', 'free'] }), /branch option historical is not one of the owner's options/);
  await assert.rejects(build(undefined, { ...OWNER_RULES, zin_rule_afrit: ['DEFAULT'] }), /zin_rule_afrit: already defined/);
  await assert.rejects(build(undefined, { ...OWNER_RULES, zin_rule_eindil_journey: ['HISTORICAL', 'DEFAULT', 'FREE'] }), /opens with DEFAULT/);
});

test('Determinism: a second build gives the same bytes', async () => {
  const again = await build();
  for (const [rel, b] of staged.files) assert(again.staged.files.get(rel).equals(b), rel);
});
