// Tests for the story framework (docs/design/alternate_history.md and .json, acceptance A-46): the design twin's schema, the checkpoint
// data generated from it, lib/story_dates.mjs, modules/world_tension.mjs, modules/historical_path.mjs and checks/story_wiring.mjs.
// Run: node --test tools/content/alternate_history.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { Staged } from './lib/core.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { ZIN } from './lib/paths.mjs';
import { countryTable } from './lib/roster.mjs';
import { paceDate, addDays, compareDates, dateTrigger, PACES } from './lib/story_dates.mjs';
import { checkpointsFromDesign, loadDesign, loadCheckpoints, rules, roles, wayCode, buildHistoricalPath, WATCHDOG_DAYS } from './modules/historical_path.mjs';
import { buildWorldTension, loadWorldData } from './modules/world_tension.mjs';
import { storyWiring } from './checks/story_wiring.mjs';

const design = await loadDesign();
const table = await loadCheckpoints();
const countries = countryTable();
const KINDS = ['early', 'late', 'different', 'never', 'opposite', 'actor_dead', 'actor_captured', 'actor_annexed', 'actor_absent'];
const cps = Array.from({ length: 26 }, (_, i) => `CP${String(i + 1).padStart(2, '0')}`);

// ------------------------------------------------------------------------------------------------ the design twin
test('The design twin has its schema: beats, divergences, soft-locks, checkpoints, roles and endings', () => {
  for (const k of ['schema', 'calendar', 'pace', 'states', 'magnitudes', 'checkpoints', 'beats', 'softlocks', 'measure', 'variety', 'systems', 'roles', 'endings', 'plan', 'counts']) assert(k in design, k);
  assert.equal(design.schema, 'zin.alternate_history/1');
  const mags = new Set(Object.values(design.magnitudes));
  let divs = 0;
  for (const b of design.beats) {
    assert.match(b.id, /^B\d\d$/);
    assert(b.cp === 'ENDING' || cps.includes(b.cp), `${b.id}: checkpoint ${b.cp}`);
    for (const k of ['name', 'canon', 'owner', 'historical', 'trigger', 'dates', 'divergences']) assert(b[k] !== undefined, `${b.id}.${k}`);
    for (const d of b.divergences) {
      divs++;
      assert(d.id.startsWith(`${b.id}.D`), d.id);
      assert(KINDS.includes(d.kind), `${d.id}: kind ${d.kind}`);
      assert(mags.has(d.magnitude), `${d.id}: magnitude ${d.magnitude}`);
    }
  }
  assert.equal(design.beats.length, design.counts.beats);
  assert.equal(divs, design.counts.divergences);
  assert.equal(design.softlocks.length, design.counts.softlocks);
  for (const [sev, n] of Object.entries(design.counts.bySeverity)) assert.equal(design.softlocks.filter(s => s.severity === sev).length, n, sev);
  assert.deepEqual(design.roles.map(r => r.id), Array.from({ length: 17 }, (_, i) => `R${String(i + 1).padStart(2, '0')}`));
  assert.deepEqual(design.endings.map(e => e.n), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('CP01 to CP26 are covered: every checkpoint once, every beat of a checkpoint listed by it', () => {
  assert.deepEqual(design.checkpoints.map(c => c.cp), cps);
  for (const c of design.checkpoints) assert.deepEqual([...c.beats].sort(), design.beats.filter(b => b.cp === c.cp).map(b => b.id).sort(), c.cp);
  for (const b of design.beats.filter(x => x.cp !== 'ENDING')) assert.equal(b.weight, design.checkpoints.find(c => c.cp === b.cp).weight, `${b.id} weighs as its checkpoint`);
});

test('The checkpoint weights sum to 93', () => {
  assert.equal(design.checkpoints.reduce((a, c) => a + c.weight, 0), 93);
  assert.equal(table.totalWeight, 93);
});

// A soft-lock's file field lists paths separated by ";", each optionally followed by a parenthesis or "section N"; a comma list continues
// in the directory of its first path; "staged:" paths name the staged tree and are not in the repository.
const dropParens = s => { let out = '', depth = 0; for (const ch of s) { if (ch === '(') depth++; else if (ch === ')') depth = Math.max(0, depth - 1); else if (!depth) out += ch; } return out; };
function softlockPaths(field) {
  const out = [];
  for (const part of dropParens(field).split(/;\s*/)) {
    const items = part.replace(/\s+section\s+\S+$/, '').split(/,\s*/).map(s => s.trim()).filter(Boolean);
    let dir = null, staged = false;
    for (const it of items) {
      if (it.startsWith('staged:')) { staged = true; continue; }
      if (!/[./]/.test(it)) { dir = null; continue; }
      if (staged && !it.includes('/')) continue;
      staged = false;
      const p = it.includes('/') ? it : dir ? `${dir}/${it}` : it;
      dir = path.posix.dirname(p);
      out.push(p.replace(/\/$/, ''));
    }
  }
  return out;
}
test('Every soft-lock names files that exist in the repository', () => {
  for (const s of design.softlocks) {
    for (const p of softlockPaths(s.file)) {
      if (p.includes('*')) {
        const re = new RegExp(`^${path.posix.basename(p).replace(/[.]/g, '\\.').replace(/\*/g, '.*')}$`);
        assert(readdirSync(path.join(ZIN, path.posix.dirname(p))).some(f => re.test(f)), `${s.id}: ${p}`);
      } else assert(existsSync(path.join(ZIN, p)), `${s.id}: ${p}`);
    }
  }
});

test('data/path_checkpoints.json equals the checkpoints generated from the design twin', () => {
  assert.deepEqual(table, checkpointsFromDesign(design));
  assert.deepEqual(table.checkpoints.map(c => ({ cp: c.cp, weight: c.weight, beats: c.beats })), design.checkpoints);
});

test('Every beat has a latest date (the start and the ending beats excepted) and every divergence a successor', () => {
  for (const b of design.beats) {
    if (b.cp !== 'CP01' && b.cp !== 'ENDING') assert(b.dates.latest, `${b.id}: latest date`);
    for (const d of b.divergences) assert(String(d.successor).trim(), `${d.id}: successor`);
  }
});

// ------------------------------------------------------------------------------------------------ story dates
test('paceDate: the start stays, the calendar has no leap day, and the pace stretches the days since the start', () => {
  for (const p of PACES) assert.equal(paceDate('1748.3.1', p), '1748.3.1');
  assert.equal(paceDate('1755.4.1', 1), '1755.4.1');
  assert.equal(paceDate('1756.3.1', 1.5), '1760.3.1', 'eight years become twelve, with no leap day');
  assert.equal(paceDate('1752.3.1', 0.75), '1751.3.1');
  assert.equal(addDays('1752.2.28', 1), '1752.3.1', 'no 29 Sulethe');
  assert.throws(() => paceDate('1752.2.29', 1));
  assert.throws(() => paceDate('1755.4.1', 2));
  assert(compareDates('1755.4.1', '1755.3.31') > 0);
  const t = dateTrigger('zin_test_date', '1755.4.1');
  assert(t.includes('date > 1755.3.31') && t.includes(`date > ${addDays(paceDate('1755.4.1', 1.5), -1)}`) && t.includes(`date > ${addDays(paceDate('1755.4.1', 0.75), -1)}`));
  assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length);
});

// ------------------------------------------------------------------------------------------------ the historical path
const T = { aenor: 'AEN', worshipdom: 'WOR', selen: 'SEL', gala: 'GAA', gunwyn: 'GNW', girdon: 'GIR', lerendor: 'LER', mirolon: 'MIR', yeldenne: 'YEL', howan: 'HWN', nara: 'NAR', verde: 'VER', volgan: 'PUV', zol: 'ZOL', parimState: 1, sonargur: 2, mirolonState: 3, yeldenneState: 4 };
const R = rules(T);
test('Every checkpoint has rules whose ways are divergences of its own beats, and a latest-date way', () => {
  for (const c of table.checkpoints) {
    const r = R[c.cp];
    assert(r, c.cp);
    assert(r.rules.some(x => x.s === 1), `${c.cp}: a historical rule`);
    for (const x of r.rules) if (x.way) assert(c.divergences[x.way], `${c.cp}: ${x.way}`);
    if (c.cp !== 'CP01') { assert(c.divergences[r.due], `${c.cp}: the latest-date way ${r.due}`); assert(c.latest, `${c.cp}: latest date`); }
    for (const x of r.rules.filter(y => y.s === 2)) assert(x.way || x.m, `${c.cp}: a diverged rule carries a magnitude`);
  }
  assert.equal(wayCode('B07.D3'), 703);
  assert.equal(wayCode(null), 0);
});

test('The rule against deadlock: predecessors come first, and none can hold a checkpoint past its watchdog', () => {
  const latest = new Map(table.checkpoints.map(c => [c.cp, c.latest]));
  for (const c of table.checkpoints) {
    const r = R[c.cp];
    for (const p of r.preds) {
      assert(Number(p.slice(2)) < c.n, `${c.cp} waits for the later ${p}`);
      // Without a relative window a predecessor must be resolved (latest + watchdog) before this checkpoint's watchdog.
      if (!(r.after ?? {})[p]) assert(compareDates(addDays(latest.get(p), WATCHDOG_DAYS), addDays(c.latest, WATCHDOG_DAYS)) <= 0, `${c.cp}: ${p} resolves after ${c.cp}'s watchdog`);
      // 06 spec build check 3: no latest date before a predecessor's target date.
      assert(compareDates(c.latest, table.checkpoints.find(x => x.cp === p).target) >= 0, `${c.cp}: latest before ${p}'s target`);
    }
    for (const p of Object.keys(r.after ?? {})) assert(r.preds.includes(p), `${c.cp}: window after a non-predecessor ${p}`);
  }
});

const pathStaged = new Staged();
const pathBuild = await buildHistoricalPath(pathStaged, { countries });
const ptext = rel => scriptText(pathStaged.files.get(rel));
test('The path module writes its files, one tick block per checkpoint, the watchdog and no Chronicle line', () => {
  for (const rel of ['common/scripted_triggers/zin_path.txt', 'common/scripted_effects/zin_path.txt', 'events/zin_path.txt', 'common/script_constants/zin_path.txt', 'localisation/english/zin_path_l_english.yml', 'common/scripted_localisation/zin_path.txt']) assert(pathStaged.files.has(rel), rel);
  const eff = ptext('common/scripted_effects/zin_path.txt');
  const tick = eff.slice(eff.indexOf('zin_path_tick = {'));
  for (const c of table.checkpoints) assert(tick.includes(`# ${c.cp} `), `${c.cp} in the tick`);
  assert.equal((tick.match(/ZIN path: checkpoint \d\d stalled/g) ?? []).length, 25, 'a watchdog for every checkpoint with a latest date');
  assert(eff.includes('set_global_flag = zin_path_stalled'));
  assert(!ptext('localisation/english/zin_path_l_english.yml').includes('zin_loc_chronicle_cp'));
  const consts = ptext('common/script_constants/zin_path.txt');
  for (const c of table.checkpoints) assert(consts.includes(`cp${String(c.n).padStart(2, '0')} = ${c.weight}`), c.cp);
  assert(consts.includes('floor_weight = 30') && consts.includes('total_weight = 93') && consts.includes('skipped = 0.5'));
  assert.equal(pathBuild.counts.roles, roles(T).length);
});

test('The measure follows section 6: floor weight, departure over the total weight, bands at 10, 30 and 60', () => {
  const eff = ptext('common/scripted_effects/zin_path.txt');
  const m = eff.slice(eff.indexOf('zin_path_measure = {'));
  for (const s of ['add_to_variable = { global.zin_path_points = zin_pr_pts }', 'constant:zin_path.floor_weight', 'divide_temp_variable = { zin_pr_dep = constant:zin_path.total_weight }', 'clamp_variable = { var = global.zin_path_divergence min = 0 max = 100 }']) assert(m.includes(s), s);
  for (const n of [10, 30, 60]) assert(m.includes(`value = ${n} compare = greater_than_or_equals`), `band at ${n}`);
});

test('The roles keep their holders, pass to successors, and tell the human players only of the public ones', () => {
  const eff = ptext('common/scripted_effects/zin_path.txt'), ev = ptext('events/zin_path.txt');
  for (const r of roles(T)) {
    assert(eff.includes(`zin_path_role_${r.key} = {`), r.key);
    if (r.news) assert(ev.includes(`id = zin_path.${10 + r.n}`), `${r.key}: news`);
  }
  assert(!/zin_path\.12\b/.test(ev), "the Deliverer's seat passes in silence");
  assert(eff.includes('global.zin_role_eastern_candidates'), 'R13 is counted');
});

// ------------------------------------------------------------------------------------------------ world tension
const W = await loadWorldData();
const worldStaged = new Staged();
await buildWorldTension(worldStaged, { countries });
const wtext = rel => scriptText(worldStaged.files.get(rel));
test('The world tick runs from one runner, in the spec order, and never from an every-country on_monthly', () => {
  const eff = wtext('common/scripted_effects/zin_world_tension.txt');
  const tick = eff.slice(eff.indexOf('zin_world_tick = {'));
  const order = ['zin_world_tension_tick = yes', 'zin_world_check_endings = yes', 'zin_path_tick = yes', 'zin_story_tick = yes', 'zin_world_schedule_tick = yes'].map(s => tick.indexOf(s));
  assert(order.every(i => i >= 0) && order.every((v, i) => !i || v > order[i - 1]), 'steps 1 to 9 in order');
  for (const rel of worldStaged.files.keys()) assert(!/on_monthly|on_weekly|on_daily/.test(scriptText(worldStaged.files.get(rel))), rel);
  assert(wtext('events/zin_world.txt').includes('zin_world_tick = yes'));
  assert(wtext('common/on_actions/zin_world.txt').includes('on_annex'), 'an annexed runner hands the chain on');
});

test('events/zin_world.txt holds ids 1 to 29 only; no zin_world script compares a raw date outside zin_world_dates.txt', () => {
  const ids = [...wtext('events/zin_world.txt').matchAll(/id = zin_world\.(\d+)/g)].map(m => Number(m[1]));
  assert(ids.length && ids.every(n => n >= 1 && n <= 29), ids.join(','));
  assert(ids.includes(20), 'zin_world.20 sets the war');
  for (const [rel, b] of worldStaged.files) if (rel.endsWith('.txt') && !rel.endsWith('zin_world_dates.txt')) assert(!/\bdate [<>]/.test(scriptText(b)), rel);
  const dates = wtext('common/scripted_triggers/zin_world_dates.txt');
  for (const k of Object.keys(W.dates)) assert(dates.includes(`zin_world_date_${k} = {`), k);
  assert(dates.includes('date > 1758.10.15'), 'the slow pace moves the war to 16 Irumas 4A 1758');
});

test('The War of the Last Crowns: HISTORICAL on its date, PLAUSIBLE by the latest date, FREE on conditions, piecemeal otherwise', () => {
  const eff = wtext('common/scripted_effects/zin_world_tension.txt');
  const w = eff.slice(eff.indexOf('zin_world_check_last_crowns = {'));
  assert(w.indexOf('zin_rules_is_historical = yes') < w.indexOf('zin_world_date_last_crowns = yes'));
  for (const s of ['zin_world_dark_war = yes', 'zin_world_date_plausible_latest = yes', 'zin_rules_is_free = no', 'set_global_flag = zin_war_piecemeal', ...W.war.fronts.map(f => `has_global_flag = ${f}`)]) assert(w.includes(s), s);
  assert(eff.includes('set_global_flag = zin_war_of_last_crowns') && eff.includes('news_event = { id = zin_world.20 }'));
});

test('Endings: one per game, canon in order, the outcomes judged once, the Age Unfinished on its date', () => {
  const eff = wtext('common/scripted_effects/zin_world_tension.txt');
  const r = eff.slice(eff.indexOf('zin_world_reach_ending = {'), eff.indexOf('zin_world_check_endings = {'));
  assert(r.indexOf('NOT = { has_global_flag = zin_ending_reached }') < r.indexOf('set_global_flag = zin_ending_reached'));
  assert(r.indexOf('zin_afrit_reveal = yes') < r.indexOf('set_global_flag = zin_ending_reached'), 'the secret is told before the Ashen Throne');
  for (const e of W.endings) assert(r.includes(`set_global_flag = ${e.flag}`) && r.includes(`id = ${e.news}`), e.key);
  assert(r.includes('zin_ending_start_epilogue = yes'));
  const c = eff.slice(eff.indexOf('zin_world_check_endings = {'));
  const at = s => c.indexOf(s);
  assert(at('has_global_flag = zin_eindil_crowned') < at('zin_volgan_children_ready = yes') && at('zin_volgan_children_ready = yes') < at('zin_afrit_ashen_throne_ready = yes') && at('zin_afrit_ashen_throne_ready = yes') < at('zin_world_judgement_open = yes'));
  assert(c.includes('set_global_flag = zin_world_judged') && c.includes('zin_world_date_unfinished = yes'));
  const tr = wtext('common/scripted_triggers/zin_world_tension.txt');
  assert(tr.includes('NOT = { has_global_flag = zin_golden_king_exiled }'), 'SL-25: a King in exile rules no court');
  assert(tr.includes('zin_world_date_judgement_deferred = yes') && tr.includes('zin_world_canon_in_reach = yes'), 'E-01 and SL-26');
});

test('The meter: start 10, gains scaled and damped, the tier news once each, every source in the constants', () => {
  assert.equal(W.start, 10);
  const consts = wtext('common/script_constants/zin_world.txt');
  for (const k of Object.keys(W.sources)) assert(new RegExp(`src_${k}`).test(consts), k);
  const add = wtext('common/scripted_effects/zin_world_tension.txt');
  const a = add.slice(add.indexOf('zin_world_add_gathering_dark = {'));
  assert(a.indexOf('global.zin_gathering_dark_rate') < a.indexOf('clamp_variable'));
  for (const t of W.tiers.filter(x => x.news)) assert(a.includes(`set_global_flag = zin_gd_tier_${t.n}_seen`) && a.includes(`id = ${t.news}`), t.name);
  assert(wtext('common/on_actions/zin_world.txt').includes('global.zin_gathering_dark = constant:zin_world.start'));
});

test('Every generated script parses, balances its braces and uses no <= or >=', () => {
  for (const st of [pathStaged, worldStaged]) for (const [rel, b] of st.files) if (rel.endsWith('.txt')) {
    const t = scriptText(b);
    assert.doesNotThrow(() => parse(t), rel);
    assert.doesNotMatch(t, /<=|>=/, rel);
    assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, rel);
  }
  for (const st of [pathStaged, worldStaged]) for (const [rel, b] of st.files) if (rel.endsWith('.yml')) assert.deepEqual([...b.subarray(0, 3)], [0xef, 0xbb, 0xbf], `${rel}: UTF-8 with BOM`);
});

// ------------------------------------------------------------------------------------------------ the wiring check
const files = entries => new Map(Object.entries(entries).map(([k, v]) => [k, Buffer.from(v)]));
const config = { enforce: ['world systems'], owners: [{ owner: 'world systems', pattern: '^events/zin_world\\.txt$' }, { owner: 'Afrit', pattern: '/zin_afrit' }], allowance: [{ flag: 'zin_later', scope: 'global', owner: 'Afrit', note: 'set later' }] };
test('Story wiring: undefined events, unset flags, scopes, triggers as flags and unwrapped rules, enforced only for the named owners', () => {
  const f = files({
    'events/zin_world.txt': 'add_namespace = zin_world\ncountry_event = { id = zin_world.1 immediate = { country_event = { id = zin_world.9 } if = { limit = { has_global_flag = zin_never zin_trig = yes has_global_flag = zin_trig } } } }',
    'events/zin_afrit.txt': 'country_event = { id = zin_afrit.1 immediate = { news_event = zin_afrit.2 set_country_flag = zin_cflag if = { limit = { has_global_flag = zin_cflag has_global_flag = zin_later has_game_rule = { rule = zin_rule_afrit option = HISTORICAL } } } } }',
    'common/scripted_triggers/zin_t.txt': 'zin_trig = { always = yes }',
    'common/scripted_triggers/zin_rules.txt': 'zin_rules_ai_branch_afrit_historical = { has_game_rule = { rule = zin_rule_afrit option = HISTORICAL } }',
    'events/zz_zin_pending_events.txt': 'country_event = { id = zin_afrit.2 hidden = yes }',
  });
  const r = storyWiring(f, { config, perPowerRules: ['zin_rule_afrit'] });
  const has = (check, id, owner) => r.findings.some(x => x.check === check && x.id === id && (!owner || x.owner === owner));
  assert(has('event_undefined', 'zin_world.9', 'world systems'));
  assert(has('event_undefined', 'zin_afrit.2', 'Afrit'), 'a stand-in does not define an event');
  assert(has('flag_never_set', 'zin_never', 'world systems'));
  assert(has('trigger_as_flag', 'zin_trig'));
  assert(has('flag_scope', 'zin_cflag', 'Afrit'));
  assert(has('flag_allowed', 'zin_later'));
  assert(has('rule_unwrapped', 'zin_rule_afrit.HISTORICAL', 'Afrit'));
  assert(!r.findings.some(x => x.file === 'common/scripted_triggers/zin_rules.txt'), 'the wrapper file may test the rule');
  assert(r.failures.length && r.failures.every(x => x.owner === 'world systems'), 'only the enforced owner fails');
  assert(storyWiring(f, { config: { ...config, enforceAll: true }, perPowerRules: ['zin_rule_afrit'] }).failures.some(x => x.owner === 'Afrit'), 'the strict switch');
  // A flag set beside a scripted trigger of the same name (the contract's pairs) is a real flag, not a trigger read as one.
  const paired = storyWiring(files({ 'common/scripted_triggers/zin_t.txt': 'zin_pair = { has_country_flag = zin_pair }', 'events/zin_afrit.txt': 'country_event = { id = zin_afrit.1 immediate = { set_country_flag = zin_pair if = { limit = { has_country_flag = zin_pair } } } }' }), { config });
  assert(!paired.findings.some(x => x.id === 'zin_pair'), 'a paired flag is not reported');
});

test('Story wiring: the shipped configuration enforces every owner', async () => {
  const shipped = JSON.parse(readFileSync(new URL('./data/story_wiring.json', import.meta.url), 'utf8'));
  assert.equal(shipped.enforceAll, true, 'every owner\'s findings stop the build (the story slices have landed)');
});
