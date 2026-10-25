// Tests for the world layer of magic (docs/specs/03_gameplay/04_magic_and_world_systems.md): modules/world_magic.mjs, data/world_magic.json,
// data/storm_seas.json and write_storm_seas.mjs. Run: node --test tools/content/world_magic.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { Staged } from './lib/core.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { ZIN } from './lib/paths.mjs';
import { countryTable } from './lib/roster.mjs';
import { buildWorldMagic, loadMagicData, loadStormSeas } from './modules/world_magic.mjs';
import { computeStormSeas } from './write_storm_seas.mjs';

const countries = countryTable();
const D = await loadMagicData();
const staged = new Staged();
const built = await buildWorldMagic(staged, { countries });
const text = rel => { assert(staged.files.has(rel), `${rel} is staged`); return staged.files.get(rel).toString('utf8'); };
const block = (file, name) => { const t = text(file); const i = t.indexOf(`\n${name} = {`); assert(i >= 0, `${name} in ${file}`); let d = 0, j = t.indexOf('{', i); for (let k = j; k < t.length; k++) { if (t[k] === '{') d++; else if (t[k] === '}') { d--; if (!d) return t.slice(i, k + 1); } } return ''; };
const EFF = 'common/scripted_effects/zin_world_magic.txt', TRI = 'common/scripted_triggers/zin_world_magic.txt';

test('The module writes every file of the spec\'s table, and ids 30 to 69 only', () => {
  for (const rel of ['common/scripted_triggers/zin_world_magic.txt', EFF, 'common/ideas/zin_world_magic.txt', 'common/dynamic_modifiers/zin_world_magic.txt', 'common/decisions/zin_world_magic.txt',
    'common/decisions/categories/zin_world_magic.txt', 'common/on_actions/zin_world_magic.txt', 'common/ai_strategy/zin_world_magic.txt', 'events/zin_world_magic.txt',
    'common/script_constants/zin_world_magic.txt', 'interface/zz_zin_world_magic.gfx', 'localisation/english/zin_world_magic_l_english.yml']) assert(staged.files.has(rel), rel);
  const ids = [...text('events/zin_world_magic.txt').matchAll(/\bid = zin_world\.(\d+)/g)].map(m => Number(m[1]));
  assert(ids.length > 0);
  for (const n of ids) assert(n >= 30 && n <= 69, `zin_world.${n}`);
  for (const n of [30, 31, 35, 40, 45, 50, 56, 59, 60, 65]) assert(built.definitions.events.includes(`zin_world.${n}`), `zin_world.${n}`);
  assert(text('events/zin_world_magic.txt').includes('add_namespace = zin_world'));
});

test('Every generated script parses, with balanced braces, no <= or >=, and the localisation has its BOM', () => {
  for (const [rel, bytes] of staged.files) {
    if (rel.endsWith('.yml')) { assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf], rel); continue; }
    if (!rel.endsWith('.txt') && !rel.endsWith('.gfx')) continue;
    const t = bytes.toString('utf8').replace(/#.*$/gm, '').replace(/"[^"]*"/g, '""');
    assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, `${rel}: braces`);
    assert(!/<=|>=/.test(t), `${rel}: <= or >=`);
    assert.doesNotThrow(() => parse(scriptText(bytes)), rel);
  }
});

test('Potent magic: only the three named sources, and nothing here sets zin_potent_magic (rules 1 and 10)', () => {
  const b = block(TRI, 'zin_has_potent_magic');
  for (const s of ['zin_glo_is_bearer_host = yes', 'has_country_flag = zin_potent_magic', 'has_idea = zin_world_varners_wards']) assert(b.includes(s), s);
  for (const [rel, bytes] of staged.files) assert(!/set_country_flag = (\{ flag = )?zin_potent_magic\b/.test(bytes.toString('utf8')), `${rel} sets zin_potent_magic`);
  assert(!/\bzin_world_varners_shelter\b/.test(b), 'the shelter is not potent');
});

test('The interventions happen once: Varner\'s wards and the Gods\' Gift keep their own once-flags; the gift needs Glo in Eindil\'s hand', () => {
  const w = block(EFF, 'zin_world_raise_varners_wards');
  assert(w.includes('NOT = { has_global_flag = zin_varner_wards_raised }') && w.includes('set_global_flag = zin_varner_wards_raised'));
  assert(w.includes('idea = zin_world_varners_wards days = 90') && w.includes('idea = zin_world_varners_shelter days = 90') && w.includes('id = zin_world.40'));
  const g = block(EFF, 'zin_world_grant_new_gods_gift');
  assert(g.includes('NOT = { has_global_flag = zin_world_gods_gift_given }') && g.includes('check_variable = { global.zin_glo_state = 1 }'));
  assert(g.includes('idea = zin_world_new_gods_gift days = 365'));
  const ideas = text('common/ideas/zin_world_magic.txt');
  assert(/zin_world_new_gods_gift = \{[\s\S]*?targeted_modifier = \{\s*tag = PUV\s*attack_bonus_against = 0\.25/.test(ideas), 'the gift strikes harder at Volgan');
});

test('The dragon pool starts at 6, never rises and never goes below 0; every decision checks it', () => {
  assert(text('common/on_actions/zin_world_magic.txt').includes('global.zin_dragons_free = constant:zin_world_magic.pool_start'));
  assert(text('common/script_constants/zin_world_magic.txt').includes(`pool_start = ${D.pool.start}`));
  for (const [rel, bytes] of staged.files) {
    const t = bytes.toString('utf8');
    assert(!/add_to_variable = \{ global\.zin_dragons_free = [1-9]/.test(t), `${rel} raises the pool`);
    for (const m of t.matchAll(/add_to_variable = \{ global\.zin_dragons_free = -1 \}/g)) {
      const before = t.slice(Math.max(0, m.index - 200), m.index);
      assert(before.includes('check_variable = { global.zin_dragons_free > 0 }'), `${rel}: a dragon taken without checking the pool`);
    }
  }
  const dec = text('common/decisions/zin_world_magic.txt');
  assert.equal((dec.match(/global\.zin_dragons_free > 0/g) ?? []).length, 2);
});

test('Bound by Corruption calls the elves\' hook once and fires the news; the Pact counts toward the limit of three', () => {
  const dec = text('common/decisions/zin_world_magic.txt');
  const c = dec.slice(dec.indexOf('zin_world_corrupt_dragon = {'), dec.indexOf('zin_world_wall_watch = {'));
  assert.equal((c.match(/zin_elves_on_dragon_corrupted = yes/g) ?? []).length, 1);
  assert(c.includes('news_event = { id = zin_world.50 }') && c.includes('zin_world_add_gathering_dark = yes') && c.includes('add_to_variable = { zin_world_corrupted_dragons = 1 }'));
  assert(c.includes('has_global_flag = zin_afrit_revealed'));
  const p = dec.slice(dec.indexOf('zin_world_dragon_pact = {'), dec.indexOf('zin_world_corrupt_dragon = {'));
  assert(p.includes(`zin_world_dragon_pacts < ${D.pact.max}`) && p.includes('add_to_variable = { zin_world_dragon_pacts = 1 }'));
});

test('The magic tick runs on one runner country once a week, never per country', () => {
  const on = text('common/on_actions/zin_world_magic.txt');
  assert(!/on_weekly|on_daily|on_monthly/.test(on), 'no every-country on_action');
  assert(text('events/zin_world_magic.txt').includes('zin_world_magic_tick = yes'));
  const tick = block(EFF, 'zin_world_magic_tick');
  assert(tick.includes('NOT = { has_global_flag = zin_world_tick_week }') && tick.includes(`days = ${D.tickGuardDays}`) && tick.includes('zin_world_schedule_magic_tick = yes'));
  assert(block(EFF, 'zin_world_schedule_magic_tick').includes(`country_event = { id = zin_world.30 days = ${D.tickDays} }`));
  assert(on.includes('FROM = { has_country_flag = zin_world_magic_runner }') && on.includes('id = zin_world.31'));
  assert(block(EFF, 'zin_world_magic_month').includes('zin_story_ai_month = yes'));
});

test('The storm belt from the map equals data/storm_seas.json, and the pulse and the AI cover exactly those seas', async () => {
  const snap = await loadStormSeas();
  const fresh = await computeStormSeas();
  assert.deepEqual(fresh.seas, snap.seas, 'the map moved the storm belt: run node tools/content/write_storm_seas.mjs and review');
  const pulse = block(EFF, 'zin_world_storm_pulse');
  for (const id of snap.seas) assert.equal((pulse.match(new RegExp(`region = ${id}\\b`, 'g')) ?? []).length, 2, `sea ${id}: full and rigged pulses`);
  assert(pulse.includes('has_tech = zin_tech_storm_rigging') && pulse.includes('NOT = { zin_world_storm_spared = yes }'));
  const ai = text('common/ai_strategy/zin_world_magic.txt');
  for (const id of snap.seas) assert(new RegExp(`type = naval_avoid_region\\s*id = ${id}\\b`).test(ai), `sea ${id} avoided`);
});

test('Storm-Girt Coasts and the heat go to the Ember Lands; the Nether and the Abyss carry the deep heat', () => {
  const on = text('common/on_actions/zin_world_magic.txt');
  const ember = countries.filter(c => c.region === 'ember_lands');
  for (const c of ember) assert(on.includes(`${c.tag} = { add_ideas = zin_world_storm_coasts }`), c.tag);
  const nether = countries.find(c => c.name === D.netherRealm);
  for (const id of nether.stateIds) assert(on.includes(`${id} = { add_dynamic_modifier = { modifier = zin_world_deep_heat } }`), `Nether state ${id}`);
  assert(/zin_world_ember_lands_heat/.test(on));
  for (const m of on.matchAll(/(\d+) = \{ add_dynamic_modifier = \{ modifier = zin_world_deep_heat/g)) assert(!on.includes(`${m[1]} = { add_dynamic_modifier = { modifier = zin_world_ember_lands_heat`), `state ${m[1]} has one heat`);
});

test('Dragon Mountain is the capital state of Yavieth; the Keeper owns it and the roosts freeze under a realm that is not elven', () => {
  const yav = countries.find(c => c.name === D.dragonMountainRealm);
  assert(block(TRI, 'zin_world_is_dragon_keeper').includes(`owns_state = ${yav.capitalState}`));
  assert(block(TRI, 'zin_world_roosts_free').includes('has_country_flag = zin_people_elves'));
  assert(block(EFF, 'zin_world_mountain_pulse').includes(`state = ${yav.capitalState}`));
});

test('No public text names a secret, and the Gods\' Gift never names a god', () => {
  const loc = text('localisation/english/zin_world_magic_l_english.yml');
  assert(!/\bAfrit\b|\bEindil\b|\bZol\b|\bKusven\b|Hidden Council|\bGlernaen\b/.test(loc));
  assert(/zin_world\.45\.t:0 "The Gods' Gift"/.test(loc));
});

test('The interim Gods\' Gift is gone from the war events, and nothing else defines zin_world.45', () => {
  assert(!existsSync(path.join(ZIN, 'tools/content/data/events_mech_world.json')));
  const war = readFileSync(path.join(ZIN, 'tools/content/modules/events_mech_war.mjs'), 'utf8');
  assert(!/events_mech_world\.json'/.test(war));
});
