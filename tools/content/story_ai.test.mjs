// Tests for the story AI (docs/specs/03_gameplay/06_historical_path_and_ai.md, "How the AI follows or diverges"; 05_world_tension_and_endings.md,
// "AI" and step 10 of the world tick): modules/story_ai.mjs and data/story_ai.json. Run: node --test tools/content/story_ai.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Staged } from './lib/core.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { ZIN } from './lib/paths.mjs';
import { countryTable } from './lib/roster.mjs';
import { focusId } from './lib/focus_model.mjs';
import { buildStoryAi, loadStoryAi, historicalEvaluator, historicalOrder } from './modules/story_ai.mjs';

const countries = countryTable();
const D = await loadStoryAi();
const staged = new Staged();
const built = await buildStoryAi(staged, { countries });
const text = rel => { assert(staged.files.has(rel), `${rel} is staged`); return staged.files.get(rel).toString('utf8'); };
const tree = id => JSON.parse(readFileSync(path.join(ZIN, `docs/design/focus/${id}.json`), 'utf8'));
const rules = JSON.parse(readFileSync(path.join(ZIN, 'tools/content/data/game_rules.json'), 'utf8'));
const perPower = [...rules.rules.filter(r => r.perPower).map(r => r.id), ...(rules.ownerRules ?? []).map(r => r.id)];

test('Every tier A tree has a historical plan, and a plausible plan unless its owner maps PLAUSIBLE to its free branch', () => {
  assert.equal(Object.keys(D.trees).length, 13);
  for (const [id, t] of Object.entries(D.trees)) {
    assert(text(`common/ai_strategy_plans/zin_${id}_historical.txt`).includes(`zin_${id}_historical = {`));
    if (t.rule.plausibleIsFree) assert(!staged.files.has(`common/ai_strategy_plans/zin_${id}_plausible.txt`), id);
    else { const p = text(`common/ai_strategy_plans/zin_${id}_plausible.txt`); assert(p.includes(`zin_${id}_plausible = {`) && p.includes(`zin_${id}_plausible_drift = {`)); }
  }
});

test('No plan or strategy tests a per-power rule directly; plans read the wrappers', () => {
  for (const [rel, bytes] of staged.files) for (const r of perPower) assert(!bytes.toString('utf8').includes(`rule = ${r}`), `${rel} tests ${r}`);
  const w = text('common/ai_strategy_plans/zin_worshipdom_historical.txt');
  assert(w.includes('zin_rules_ai_branch_afrit_historical = yes'));
  assert(text('common/ai_strategy_plans/zin_aenor_historical.txt').includes('zin_rules_ai_default_aenor = yes'));
  const rulesSrc = readFileSync(path.join(ZIN, 'tools/content/modules/rules.mjs'), 'utf8');
  assert(rulesSrc.includes('zin_rules_ai_default_${power}'), 'rules.mjs writes the DEFAULT wrappers');
});

test('A plan\'s focus order is the tree\'s historical branch: real focuses, prerequisites first, one side of each mutual exclusion, nothing the path rules out', () => {
  const evaluate = historicalEvaluator(D.historicalChecks);
  for (const id of Object.keys(D.trees)) {
    const t = tree(id), byKey = new Map(t.focuses.map(f => [f.key, f]));
    const { order } = historicalOrder(t, evaluate);
    const plan = text(`common/ai_strategy_plans/zin_${id}_historical.txt`);
    const listed = [...plan.matchAll(/^\t\t(zin_[a-z0-9_]+)$/gm)].map(m => m[1]);
    assert.deepEqual(listed, order.map(k => focusId(t, k)), id);
    const seen = new Set();
    for (const k of order) {
      const f = byKey.get(k);
      assert(f, `${id}: ${k}`);
      assert(evaluate(f).weight > 0, `${id}: ${k} is ruled out under HISTORICAL`);
      for (const g of f.prerequisite ?? []) assert(g.some(p => seen.has(p)), `${id}: ${k} before its prerequisite`);
      for (const o of f.mutually_exclusive ?? []) assert(!order.includes(o), `${id}: ${k} and ${o} are mutually exclusive`);
      seen.add(k);
    }
  }
});

test('The plausible plans weigh the historical focuses x3, then x1.5 once zin_path_divergence is 50', () => {
  const p = text('common/ai_strategy_plans/zin_lerendor_plausible.txt');
  const [early, late] = p.split('zin_lerendor_plausible_drift = {');
  assert(early.includes('check_variable = { global.zin_path_divergence < 50 }') && /= 3\n/.test(early));
  assert(late.includes('compare = greater_than_or_equals') && /= 1\.5\n/.test(late));
});

test('Tier 1 keeps prepare_for_war at -50 toward every realm without a cause; from tier 3 realms beside a dark power build forts', () => {
  const s = text('common/ai_strategy/zin_path.txt');
  for (const c of countries) assert(s.includes(`zin_path_peace_${c.tag.toLowerCase()} = {`), c.tag);
  assert.equal((s.match(/type = prepare_for_war\s*id = [A-Z0-9]+\s*value = -50/g) ?? []).length, countries.length);
  assert(s.includes('NOT = { has_wargoal_against = ') && s.includes('check_variable = { global.zin_gathering_dark < 25 }'));
  const forts = s.slice(s.indexOf('zin_path_dark_forts = {'));
  assert(forts.includes('type = build_building') && forts.includes('id = bunker') && forts.includes('any_neighbor_country = { zin_diplo_is_dark_power = yes }'));
  assert(s.includes('zin_path_grey_ford_gnw = {') && s.includes('type = conquer\n\t\tid = GIR\n\t\tvalue = -1000'));
});

test('The paced story mean time and the path shares (HISTORICAL 100/0, PLAUSIBLE 75/25 then 60/40, FREE 50/50)', () => {
  const m = text('common/mtth/zin_mtth.txt');
  for (const n of ['zin_story_mean_time', 'zin_story_ai_hist_share', 'zin_story_ai_alt_share', 'zin_story_ai_focus_favour']) assert(m.includes(`${n} = {`), n);
  assert(m.includes('factor = 1.5') && m.includes('factor = 0.75'));
  const sh = D.shares;
  assert.equal(sh.free + (sh.historical - sh.free), 100);
  assert.equal(sh.free + (sh.plausible - sh.free) + (sh.plausibleDrift - sh.plausible), 60);
});

test('Step 10: zin_ui_refresh recomputes only panels that are staged, raises the dirty tick, and is pure formatting', () => {
  const u = text('common/scripted_effects/zin_ui.txt');
  assert(u.includes('zin_ui_refresh = {') && u.includes('add_to_variable = { zin_ui_tick = 1 }'));
  assert(!/add_to_variable = \{ (?!zin_ui_tick|global\.zin_ui_tick)/.test(u), 'changes no mechanic variable');
  assert.equal(built.counts.uiRefreshPanels, 0, 'no panel effect is staged in this test build');
});

test('The peace after the false god falls is a white peace from the AI realms, once', () => {
  const e = text('common/scripted_effects/zin_story_ai.txt');
  assert(e.includes('has_global_flag = zin_afrit_dead') && e.includes('set_global_flag = zin_story_ai_afrit_peace') && e.includes('limit = { is_ai = yes }') && e.includes('white_peace = { tag = PREV }'));
});

test('The world tension widget is relabelled in ten languages, each value keeping its vanilla placeholders, colours and icons', async () => {
  const { signature, sigText, LANGUAGES } = await import('./lib/loc_parse.mjs');
  const { GAME } = await import('./lib/paths.mjs');
  const { readdirSync } = await import('node:fs');
  const dir = path.join(GAME, 'localisation/english'), vanilla = {};
  for (const f of readdirSync(dir).filter(n => n.endsWith('.yml'))) for (const m of readFileSync(path.join(dir, f), 'utf8').matchAll(/^ ([A-Z_0-9]+):\d* "(.*)"\s*$/gm)) vanilla[m[1]] ??= m[2].replace(/\\n/g, '\n');
  const labels = D.widget.labels;
  assert.equal(labels.THREAT_WINDOW_NAME, 'The Gathering Dark');
  for (const [k, v] of Object.entries(labels)) { assert(k in vanilla, `${k} is a vanilla key`); assert.equal(sigText(signature(v)), sigText(signature(vanilla[k])), k); assert.notEqual(v, vanilla[k], k); }
  for (const lang of LANGUAGES) { const t = text(`localisation/replace/zin_gathering_dark_l_${lang}.yml`); assert(t.startsWith('﻿') && t.includes(`l_${lang}:`), lang); }
});

test('Every generated script parses with balanced braces and no <= or >=', () => {
  for (const [rel, bytes] of staged.files) {
    if (!rel.endsWith('.txt')) continue;
    const t = bytes.toString('utf8').replace(/#.*$/gm, '').replace(/"[^"]*"/g, '""');
    assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, rel);
    assert(!/<=|>=/.test(t), rel);
    assert.doesNotThrow(() => parse(scriptText(bytes)), rel);
  }
});

test('Q-95 (K59): the Worshipdom and Coldor lean to history under PLAUSIBLE like every other tier A power', () => {
  for (const [id, power] of [['worshipdom', 'afrit'], ['coldor', 'cold']]) {
    assert(!D.trees[id].rule.plausibleIsFree, id);
    const p = text(`common/ai_strategy_plans/zin_${id}_plausible.txt`);
    assert(p.includes(`zin_${id}_plausible = {`) && p.includes(`zin_rules_ai_default_${power} = yes`), id);
    assert(/focus_factors = \{[\s\S]*= 3\b/.test(p), `${id}: the historical focuses weigh x3`);
  }
  // the event weights lean too: the Afrit chain's historical options and Coldor's march war
  const afrit = readFileSync(path.join(ZIN, 'tools/content/data/events_mech_afrit.json'), 'utf8');
  assert(afrit.includes('zin_rules_ai_plausible_afrit = yes'));
  assert(readFileSync(path.join(ZIN, 'tools/content/modules/mech_cold.mjs'), 'utf8').includes('zin_rules_ai_plausible_cold = yes'));
  assert(readFileSync(path.join(ZIN, 'tools/content/modules/rules.mjs'), 'utf8').includes('zin_rules_ai_plausible_${power}'));
});
