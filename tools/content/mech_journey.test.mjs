// Tests for the journey-slice mechanic modules: Eindil's journey, Yeldenne and Glo, the Western Crossing
// (docs/specs/04_mechanics/eindil_journey.md, yeldenne_and_glo.md, western_crossing.md; note docs/design/stage2/mech_journey.md).
// They build the three modules from the roster and check the output against the installed game's documentation, the specs' acceptance
// lines that a build can decide, and negative cases. Run: node --test tools/content/mech_journey.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged, assertModifiers } from './lib/core.mjs';
import { ZIN } from './lib/paths.mjs';
import { parse } from './lib/clausewitz.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { loadVocab, lintScript, unknownKeys, dayNumber, shiftedDays, shiftDate, indentLines, Loc, eventLines, paceBranches } from './lib/mech_journey_lib.mjs';
import { buildEindilJourney } from './modules/mech_eindil.mjs';
import { buildYeldenneGlo } from './modules/mech_yeldenne.mjs';
import { buildWesternCrossing } from './modules/mech_crossing.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const readData = async n => JSON.parse(await readFile(path.join(here, 'data', n), 'utf8'));
const eindilData = await readData('mech_journey_eindil.json'), gloData = await readData('mech_journey_glo.json'), westData = await readData('mech_journey_west.json');
const clone = o => structuredClone(o);

async function buildAll(ctx = {}) {
  const staged = new Staged();
  const glo = await buildYeldenneGlo(staged, { countries, ...(ctx.glo ?? {}) });
  const eindil = await buildEindilJourney(staged, { countries, ...(ctx.eindil ?? {}) });
  const west = await buildWesternCrossing(staged, { countries, ...(ctx.west ?? {}) });
  return { staged, glo, eindil, west };
}
const { staged, glo, eindil, west } = await buildAll();
const results = { glo, eindil, west };
const text = rel => staged.files.get(rel).toString('utf8');
const vocab = await loadVocab();
const allDefs = k => new Set(Object.values(results).flatMap(r => r.definitions[k] ?? []));
const knownScripts = new Set([...allDefs('effects'), ...allDefs('triggers'), 'zin_eindil', 'zin_varner', 'zin_golbran', 'zin_horos', 'zin_alleria', 'zin_lorien', 'zin_controls_sea_central_for_foe']);
const rules = compileBanned(await loadRuleSet());
const retired = [...(await readFile(path.join(ZIN, 'docs/specs/04_mechanics/00_contract_additions.md'), 'utf8')).split('## Retired names')[1].split('## Patterns')[0].matchAll(/^\| `([^`]+)`/gm)].map(m => m[1]);

// ------------------------------------------------------------------------------------------------ shape of the output
test('Each module stages its files, none empty, and the result lists them all', () => {
  for (const [name, r] of Object.entries(results)) {
    assert(r.files.length >= 14, `${name}: ${r.files.length} files`);
    for (const f of r.files) { assert(staged.files.has(f), `${name}: ${f} staged`); assert(staged.files.get(f).length > 40, `${name}: ${f} not empty`); }
  }
  assert.equal(results.glo.files.length + results.eindil.files.length + results.west.files.length, staged.files.size, 'no file outside the three lists');
});
test('Every script file parses, balances and uses tabs and LF', () => {
  for (const [rel, bytes] of staged.files) {
    if (!/\.(txt|gfx)$/.test(rel)) continue;
    const t = bytes.toString('utf8');
    assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, `${rel}: braces`);
    assert(!t.includes('\r'), `${rel}: LF`);
    assert(!/(^|\n) +\S/.test(t.replace(/#.*$/gm, '')) || rel.endsWith('.gfx'), `${rel}: tabs`);
    parse(t);
  }
  assert.deepEqual(indentLines(['a = {', 'b = { c }', '}']), ['a = {', '\tb = { c }', '}']);
  assert.throws(() => indentLines(['a = {', 'b = yes']), /Unbalanced/);
});
test('The output is deterministic: a second build gives the same bytes', async () => {
  const again = await buildAll();
  assert.deepEqual([...again.staged.files.keys()], [...staged.files.keys()]);
  for (const [k, v] of staged.files) assert(v.equals(again.staged.files.get(k)), k);
});
test('No unsupported comparison operators and no deprecated faction effect', () => {
  for (const [rel, bytes] of staged.files) { if (!/\.txt$/.test(rel)) continue; const t = bytes.toString('utf8').replace(/#.*$/gm, ''); assert(!/<=|>=/.test(t), `${rel}: <= or >=`); assert(!/\bcreate_faction\s*=/.test(t), `${rel}: create_faction`); }
});
test('Localisation files are UTF-8 with a byte order mark and the English header', () => {
  for (const rel of ['localisation/english/zin_glo_l_english.yml', 'localisation/english/zin_eindil_mech_l_english.yml', 'localisation/english/zin_west_l_english.yml']) {
    const b = staged.files.get(rel); assert.deepEqual([...b.subarray(0, 3)], [0xef, 0xbb, 0xbf], rel); assert(b.toString('utf8').startsWith('﻿l_english:'), rel);
  }
});

// ------------------------------------------------------------------------------------------------ vocabulary
test('Every engine key in every script is in the installed game documentation or declared', () => {
  const bad = [];
  for (const [name, r] of Object.entries(results)) {
    const deps = new Set(r.dependencies.map(d => d.name));
    const known = new Set([...knownScripts, ...deps]);
    for (const s of r.scripts) for (const k of lintScript(s, parse, vocab, known)) bad.push(`${name}/${s.where}: ${k}`);
  }
  assert.deepEqual(bad, []);
});
test('The lint rejects an unknown trigger, effect and misplaced key (negative)', () => {
  const lint = (t, kind = 'decision') => [...lintScript({ text: t, kind, where: 'x' }, parse, vocab, knownScripts)];
  assert.deepEqual(lint('x = { if = { limit = { has_flag_that_is_not_real = yes } } }'), ['has_flag_that_is_not_real']);
  assert.deepEqual(lint('x = { add_stabiliti = 0.1 }'), ['add_stabiliti']);
  assert.deepEqual(lint('x = { if = { limit = { political_power > 3 } } }'), ['political_power']);
  assert.deepEqual(lint('x = { set_global_flag = ok zin_eindil_add_renown = yes }'), []);
});
test('Every modifier of every spirit, trait and dynamic modifier is in the modifier documentation', async () => {
  for (const d of [eindilData, gloData, westData]) {
    for (const s of d.spirits ?? []) await assertModifiers(s.id, s.modifier);
    for (const t of [...(d.unitLeaderTraits ?? []), ...(d.countryLeaderTraits ?? [])]) await assertModifiers(t.id, t.modifier);
    for (const m of d.dynamicModifiers ?? []) await assertModifiers(m.id, Object.fromEntries(Object.entries(m.modifier).map(([k]) => [k, 0])));
  }
  await assert.rejects(assertModifiers('x', { army_morale_factors: 1 }), /Unknown modifier/);
  assert(vocab.modifiers.has('enemy_attrition'));
});

// ------------------------------------------------------------------------------------------------ ids and references
const idsIn = t => [...t.matchAll(/\bid = (zin_[a-z]+)\.(\d+)/g)].map(m => `${m[1]}.${m[2]}`);
test('Event ids are unique and the Eindil namespace holds only its two hidden events here', () => {
  const all = Object.values(results).flatMap(r => r.definitions.events);
  assert.equal(new Set(all).size, all.length);
  assert.deepEqual(results.eindil.definitions.events, ['zin_eindil.1', 'zin_eindil.2']);
  assert(!results.glo.definitions.events.includes('zin_glo.10') && !results.glo.definitions.events.includes('zin_glo.90'), 'ids 10 and 90 are not used');
  assert.equal(results.glo.definitions.events.length, 23);
});
test('Every event fired by a script is defined here or belongs to the events track or another mechanic (listed)', () => {
  const mine = new Set(Object.values(results).flatMap(r => r.definitions.events));
  const events = new Set();
  for (const r of Object.values(results)) for (const s of r.scripts) for (const id of idsIn(s.text)) events.add(id);
  const external = [...events].filter(id => !mine.has(id));
  const ok = id => { const [ns, n] = id.split('.'); return (ns === 'zin_eindil' && ((+n >= 10 && +n <= 169))) || ['zin_afrit', 'zin_dominion', 'zin_aenor'].includes(ns); };
  assert.deepEqual(external.filter(id => !ok(id)), []);
  assert(external.includes('zin_eindil.10') && external.includes('zin_eindil.96') && external.includes('zin_eindil.130'));
  assert.deepEqual(results.eindil.firedEvents.filter(id => !ok(id) && !mine.has(id)), []);
});
test('Every scripted effect, trigger, idea, trait and opinion modifier a script uses is defined here or declared as a dependency', () => {
  const defined = new Set([...allDefs('effects'), ...allDefs('triggers'), ...allDefs('ideas'), ...allDefs('traits'), ...allDefs('opinions'), ...allDefs('dynamicModifiers'), ...allDefs('characters'), ...allDefs('decisions')]);
  const vanillaIdeas = new Set(['limited_conscription']);
  const unresolved = [];
  for (const [name, r] of Object.entries(results)) {
    const deps = new Set(r.dependencies.map(d => d.name));
    const t = r.scripts.map(s => s.text).join('\n');
    for (const m of t.matchAll(/(?:add_ideas|remove_ideas|add_timed_idea = \{ idea|add_unit_leader_trait|add_country_leader_trait|modifier|trait) = (zin_[a-z0-9_]+)/g)) if (!defined.has(m[1]) && !deps.has(m[1]) && !allExternal.has(m[1]) && !vanillaIdeas.has(m[1])) unresolved.push(`${name}: ${m[1]}`);
    for (const m of t.matchAll(/\b(zin_[a-z0-9_]+) = yes/g)) if (!defined.has(m[1]) && !deps.has(m[1]) && !allExternal.has(m[1])) unresolved.push(`${name}: ${m[1]} = yes`);
  }
  assert.deepEqual([...new Set(unresolved)], []);
});
const allExternal = new Set(['zin_eindil_regard', 'zin_footholds', 'zin_cb_broken_truce', 'zin_opinion_grey_ford_truce', 'zin_west_old_claims', 'zin_gunwaith_weary_clans', 'zin_gunwaith_war_thanes', 'zin_gunwaith_kings_peace', 'zin_gunwaith_western_garrison', 'zin_regional_yeldenne_glernaens_wards', 'zin_regional_yeldenne_glernaens_wards_2', 'zin_regional_yeldenne_seal_keepers', 'zin_cb_old_grudge', 'zin_aenor_fallback_seat']);
test('A planted unresolved reference and a planted duplicate id are caught (negative)', async () => {
  const bad = clone(gloData); bad.events['5'].t = '';
  await assert.rejects(buildYeldenneGlo(new Staged(), { countries, gloData: bad }), /Empty localisation/);
  const bad2 = clone(gloData); delete bad2.decisions.zin_glo_wave_decision;
  await assert.rejects(buildYeldenneGlo(new Staged(), { countries, gloData: bad2 }), /No text for decision/);
  const loc = new Loc('t'); loc.add('a', 'x'); assert.throws(() => loc.add('a', 'y'), /Duplicate localisation/);
  const bad3 = clone(westData); bad3.countries.gunwaith = 'Gunwaithia';
  await assert.rejects(buildWesternCrossing(new Staged(), { countries, westData: bad3 }), /not in the roster/);
  const bad4 = clone(eindilData); delete bad4.decisions.zin_eindil_swear_to_heir;
  await assert.rejects(buildEindilJourney(new Staged(), { countries, eindilData: bad4 }), /No text for decision/);
});
test('Every definition id starts with zin_ and none is a vanilla name', () => {
  for (const [name, r] of Object.entries(results)) for (const k of ['effects', 'triggers', 'ideas', 'decisions', 'categories', 'traits', 'opinions', 'dynamicModifiers']) for (const id of r.definitions[k] ?? []) assert(id.startsWith('zin_'), `${name}: ${id}`);
  const t = text('common/ideas/zin_eindil.txt'); assert(!/\binfantry_equipment\b|\bmilitary_police\b/.test(t));
});
test('No retired name of the contract register appears in any generated file or text', () => {
  const hits = [];
  for (const [rel, bytes] of staged.files) { const t = bytes.toString('utf8'); for (const r of retired) { if (r.includes(' ') || r.includes('(')) continue; const re = new RegExp(`(?<![A-Za-z0-9_.])${r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_])`); if (re.test(t)) hits.push(`${rel}: ${r}`); } }
  assert.deepEqual(hits, []);
  assert(retired.includes('zin_glo.90') && retired.includes('zin_blue_sword_broken'), 'the retired table was read');
});

// ------------------------------------------------------------------------------------------------ events: options, timeouts, ai
const eventBlocks = rel => parse(text(rel)).filter(e => e.k === 'country_event' || e.k === 'news_event');
test('Every shown event has a title, a description, a picture, timeout_days 30 and options with ai_chance; every option name is localised', () => {
  for (const [rel, loc] of [['events/zin_glo.txt', results.glo.localisation], ['events/zin_west.txt', results.west.localisation], ['events/zin_eindil_mech.txt', results.eindil.localisation]]) {
    for (const e of eventBlocks(rel)) {
      const f = k => e.v.find(x => x.k === k);
      if (f('hidden')) continue;
      assert(f('title') && f('desc') && f('picture'), `${rel}: ${f('id')?.v}`);
      assert.equal(f('timeout_days').v, '30');
      const options = e.v.filter(x => x.k === 'option'); assert(options.length >= 1);
      for (const o of options) { assert(o.v.find(x => x.k === 'ai_chance'), `${f('id').v}: ai_chance`); assert(loc[o.v.find(x => x.k === 'name').v], `${f('id').v}: option text`); }
      assert(loc[f('title').v], `${f('id').v}: title text`);
    }
  }
});
test('Every localisation key a script names exists in its text file', () => {
  for (const [rel, r] of [['common/decisions/zin_glo.txt', results.glo], ['common/decisions/zin_west.txt', results.west], ['common/decisions/zin_eindil.txt', results.eindil]]) {
    for (const m of text(rel).matchAll(/custom_(?:trigger|effect)_tooltip = (?:\{ tooltip = )?(zin_[a-z_]+)/g)) assert(r.localisation[m[1]], `${rel}: ${m[1]}`);
  }
  for (const [k, r] of Object.entries(results)) for (const id of r.definitions.decisions) { assert(r.localisation[id] && r.localisation[`${id}_desc`], `${k}: ${id}`); }
  for (const r of Object.values(results)) for (const id of r.definitions.ideas) assert(r.localisation[id] && r.localisation[`${id}_desc`], id);
});
test('The checkpoint events put the non-committal option first (Call to Cross, Keys of Parim)', () => {
  const first = id => { const e = eventBlocks('events/zin_west.txt').find(b => b.v.find(x => x.k === 'id').v === id); return e.v.find(x => x.k === 'option').v.find(x => x.k === 'name').v; };
  assert.equal(first('zin_west.31'), 'zin_west.31.a'); assert.match(results.west.localisation['zin_west.31.a'], /Refuse/);
  assert.equal(first('zin_west.55'), 'zin_west.55.a'); assert.match(results.west.localisation['zin_west.55.a'], /Fight for every street/);
});
test('A human timeout on The Keys of Parim never hands over the city', () => {
  const e = eventBlocks('events/zin_west.txt').find(b => b.v.find(x => x.k === 'id').v === 'zin_west.55');
  const [first, second] = e.v.filter(x => x.k === 'option');
  assert(!/set_state_controller_to/.test(JSON.stringify(first.v)) && /set_state_controller_to/.test(JSON.stringify(second.v)));
});

// ------------------------------------------------------------------------------------------------ text: banned words, the secret, the name
const shown = r => Object.entries(r.localisation).filter(([k]) => !/^zin_[a-z_]+$/.test(k) || /_desc$/.test(k) || /^zin_(glo|eindil|west)_(tt_|stage_)/.test(k));
test('No player text holds a banned word', () => {
  const hits = [];
  for (const r of Object.values(results)) for (const [k, v] of Object.entries(r.localisation)) for (const h of findBanned(v.replace(/\[[^\]]*\]/g, ' '), rules, ['error'])) hits.push(`${k}: ${h.word}`);
  assert.deepEqual(hits, []);
  assert(findBanned('the factory and the tank', rules, ['error']).length >= 2, 'the rule set bites');
});
test('Afrit is named only in the hub variants and the heir only through the scripted localisation before he is named', () => {
  const glo = results.glo.localisation;
  for (const [k, v] of Object.entries(glo)) if (/Afrit/.test(v)) assert(/_hub/.test(k), `Afrit in ${k}`);
  for (const r of Object.values(results)) for (const [k, v] of Object.entries(r.localisation)) { assert(!/Hidden Council/.test(v), k); assert(!/Einendil|Edvoid/.test(v), k); }
  for (const [k, v] of Object.entries(results.west.localisation)) assert(!/Eindil/.test(v) || /zin_loc_eindil/.test(v) || /Eindil's coalition/.test(v), `Eindil in ${k}`);
  assert(/\[zin_loc_eindil\]/.test(glo['zin_glo.21.d']));
  assert(!/heart/i.test(JSON.stringify([glo['zin_glo_petition_horos_desc'], glo['zin_glo_guard_the_hall_desc'], glo['zin_glo.5.d'], glo['zin_glo.11.d'], glo['zin_glo.61.d'], glo['zin_glo.60.d']])), 'Glo is not the heart before the death');
});
test('The rule texts name neither Afrit nor Eindil', () => {
  for (const [k, v] of Object.entries({ ...results.eindil.localisation, ...results.west.localisation })) if (/^ZIN_RULE_/.test(k)) assert(!/Afrit|Eindil/.test(v), k);
  assert(text('common/game_rules/zin_eindil.txt').includes('default = {')); assert(text('common/game_rules/zin_west.txt').includes('group = "RULE_GROUP_ZIN"'));
  assert(/default = \{\s+name = DEFAULT/.test(text('common/game_rules/zin_west.txt')) && /default = \{\s+name = DEFAULT/.test(text('common/game_rules/zin_eindil.txt')), 'DEFAULT first');
});

// ------------------------------------------------------------------------------------------------ Eindil: stages and floors
test('The floor trigger holds three story-pace date sets and the standard set equals the stage table', () => {
  const t = text('common/scripted_triggers/zin_eindil.txt');
  const body = t.slice(t.indexOf('zin_eindil_floor_reached = {'), t.indexOf('zin_eindil_ready_1 = {'));
  for (const s of eindilData.stages.filter(x => x.floor && x.n > 1)) {
    for (const p of [1, 1.5, 0.75]) assert(body.includes(`global.zin_eindil_age > ${shiftedDays(s.floor, p)} }`), `${s.key} at ${p}`);
    assert.equal(results.eindil.stageFloors.find(f => f.n === s.n).sets.standard, dayNumber(s.floor));
  }
  assert.equal(dayNumber('1749.2.1'), 337); assert.equal(shiftDate('1750.4.1', 1), '1750.4.1'); assert(dayNumber(shiftDate('1750.4.1', 1.5)) > dayNumber('1750.4.1'));
  assert(shiftedDays('1750.4.1', 0.75) < dayNumber('1750.4.1'));
});
test('Stage 1 floors follow the waking rule and the pace; three pace branches exist everywhere dates are tested', () => {
  const eff = text('common/scripted_effects/zin_eindil.txt');
  const setup = eff.slice(eff.indexOf('zin_eindil_setup = {'), eff.indexOf('zin_eindil_update_clock = {'));
  for (const d of ['1748.6.1', '1749.2.1', '1751.2.1']) for (const p of [1, 1.5, 0.75]) assert(setup.includes(`global.zin_eindil_wake_age = ${shiftedDays(d, p)}`), `${d} ${p}`);
  assert.match(setup, /zin_rule_eindil_waking option = EARLY/); assert.match(setup, /min = 0 max = 21/);
  assert.equal(paceBranches(() => 'x = y').length, 3);
});
test('The stage table covers 1 to 12 and the names reach the interface', () => {
  assert.deepEqual(eindilData.stages.map(s => s.n), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  for (let n = 0; n <= 12; n++) assert(results.eindil.localisation[`zin_eindil_stage_${n}`], `stage ${n}`);
  assert.equal(eindilData.stages.find(s => s.n === 10).floor, null);
  for (let n = 1; n <= 12; n++) assert(results.eindil.definitions.triggers.includes(`zin_eindil_ready_${n}`));
});
test('The journey defines every effect and trigger its spec names', () => {
  for (const n of ['zin_eindil_advance_stage', 'zin_eindil_set_host', 'zin_eindil_clear_host', 'zin_eindil_add_renown', 'zin_eindil_add_regard', 'zin_eindil_add_delay', 'zin_eindil_start_hunt', 'zin_eindil_wound', 'zin_eindil_raise_host', 'zin_eindil_join_coalition', 'zin_eindil_aid_host', 'zin_eindil_go_to_parim', 'zin_eindil_after_coronation', 'zin_eindil_fire_bearer_leaves', 'zin_eindil_bearer_effects']) assert(results.eindil.definitions.effects.includes(n), n);
  for (const n of ['zin_eindil_is_host', 'zin_eindil_has_host', 'zin_eindil_floor_reached', 'zin_eindil_friend', 'zin_eindil_resents', 'zin_eindil_historical', 'zin_eindil_can_lead', 'zin_eindil_army_near']) assert(results.eindil.definitions.triggers.includes(n), n);
});
test('Every trait and spirit of the journey spec exists with the spec\'s modifiers', () => {
  for (const id of ['zin_eindil_man_from_the_ice', 'zin_eindil_war_king', 'zin_eindil_heir_of_aen', 'zin_eindil_alone_in_the_snow', 'zin_eindil_bearer_of_glo', 'zin_eindil_struck_down', 'zin_eindil_blessed_of_the_new_gods', 'zin_eindil_grievously_wounded', 'zin_eindil_maimed_unbroken', 'zin_eindil_king_without_a_house', 'zin_eindil_rightful_king']) assert(results.eindil.definitions.traits.includes(id), id);
  assert.equal(results.eindil.definitions.ideas.length, 14);
  const ideas = text('common/ideas/zin_eindil.txt'); assert.match(ideas, /zin_eindil_host_of_the_heir[\s\S]*war_support_factor = 0\.15/);
  assert.match(text('common/unit_leader/zin_eindil.txt'), /zin_eindil_struck_down[\s\S]*army_attack_factor = -0\.5/);
});
test('Eindil is defined and recruited by nobody; names follow the naming rule', () => {
  assert.match(text('common/characters/zin_eindil.txt'), /zin_eindil = \{/);
  assert.equal(results.eindil.localisation.zin_eindil, 'The Man from the Ice'); assert.equal(results.eindil.localisation.zin_eindil_name_named, 'Eindil');
  assert(!/recruit_character = zin_eindil/.test(text('common/on_actions/zin_eindil.txt')));
  const all = [...staged.files].filter(([k]) => /history\//.test(k)); assert.equal(all.length, 0);
});
test('Guest rules: an offensive war loses the guest, a border war does not', () => {
  const trig = text('common/scripted_triggers/zin_eindil.txt');
  const off = trig.slice(trig.indexOf('zin_eindil_host_offends = {'), trig.indexOf('zin_eindil_afrit_foes_exist = {'));
  assert.match(off, /has_offensive_war = yes/); assert(!/start_border_war|has_border_war/.test(off));
  assert.match(off, /original_tag = Y0U/); assert.match(off, /original_tag = Y8D/);
});
test('Annexing the host moves Eindil to a friend of the host, never the annexer', () => {
  const eff = text('common/scripted_effects/zin_eindil.txt');
  const lost = eff.slice(eff.indexOf('zin_eindil_host_lost = {'), eff.indexOf('\n}\n', eff.indexOf('zin_eindil_host_lost = {')));
  assert.match(lost, /NOT = \{ tag = ROOT \}/); assert.match(lost, /NOT = \{ tag = FROM \}/); assert.match(lost, /zin_eindil_add_delay/);
  assert.match(text('common/on_actions/zin_eindil.txt'), /on_annex[\s\S]*zin_eindil_host_lost/);
});
test('Hindrance adds delay and never sets the heir lost before stage 9', () => {
  const eff = text('common/scripted_effects/zin_eindil.txt');
  assert(!/set_global_flag = zin_eindil_lost/.test(eff.replace(/zin_eindil_lose_heir[\s\S]*?\n\}\n/, '')), 'the lost flag has one setter');
  const dec = text('common/decisions/zin_eindil.txt'); assert.match(dec, /zin_eindil_detain_him[\s\S]*zin_arg_value = 90/);
  assert.match(eff, /zin_eindil_add_delay = \{[\s\S]*min = 0/);
});
test('The ambush formula matches N9 and the battles use the dates and conditions of the spec', () => {
  const eff = text('common/scripted_effects/zin_eindil.txt');
  const amb = eff.slice(eff.indexOf('zin_eindil_compute_ambush = {'), eff.indexOf('zin_eindil_ambush_resolved = {'));
  assert.match(amb, /eind_str = constant:zin_eindil\.ambush_base/); for (const f of ['zin_eindil_hunted', 'zin_worshipdom_ships_ready', 'zin_worshipdom_hunters', 'zin_eindil_elven_crew', 'zin_eindil_landing_guides', 'zin_yeldenne_beacon', 'zin_yeldenne_coast_watch', 'zin_yeldenne_guides', 'zin_afrit_sent_others']) assert(amb.includes(f), f);
  const dates = text('common/scripted_triggers/zin_eindil.txt');
  for (const d of ['1757_06', '1757_07', '1757_08', '1757_12']) assert(dates.includes(`zin_eindil_date_${d} = {`));
  for (const id of [96, 98, 99, 100, 102]) assert(eff.includes(`zin_eindil.${id}`), `battle ${id}`);
  assert(!eff.includes('zin_eindil.101'), 'event 101 is Zol\'s');
});
test('The coronation hands over without moving Eindil before zin_aenor.400', () => {
  const eff = text('common/scripted_effects/zin_eindil.txt');
  const go = eff.slice(eff.indexOf('zin_eindil_go_to_parim = {'), eff.indexOf('zin_eindil_after_coronation = {'));
  assert(!/recruit_character|zin_eindil_set_host|add_country_leader_role/.test(go)); assert.match(go, /zin_eindil_crowning_realm/); assert.match(go, /zin_eindil\.130/);
  assert.match(eff, /zin_eindil_after_coronation = \{[\s\S]*zin_eindil_rightful_king/);
});
test('The palace decisions need recovery and the Afrit preconditions; the twin of the rebels costs 150', () => {
  const dec = text('common/decisions/zin_eindil.txt');
  assert.match(dec, /zin_eindil_find_passages[\s\S]*cost = 50[\s\S]*days_remove = 30/); assert.match(dec, /zin_eindil_rally_rebels = [\s\S]*cost = 75[\s\S]*days_remove = 45/);
  assert.match(dec, /zin_eindil_rally_rebels_unaided[\s\S]*cost = 150/); assert.match(dec, /zin_afrit_begin_palace_battle/);
  assert.match(dec, /zin_eindil_enter_palace[\s\S]*days_remove = 7/);
});

// ------------------------------------------------------------------------------------------------ Yeldenne and Glo
test('Glo: the hall rules, the score constants and the state machine follow the spec', () => {
  const eff = text('common/scripted_effects/zin_glo.txt');
  const c = text('common/script_constants/zin_glo_constants.txt');
  for (const [k, v] of Object.entries({ wards_start: 50, hall_base: 30, hall_forewarned: 10, hall_unyielding: 10, afrit_per_artifact: 15, volgan_hunt: 40, repel_at: 50, repel_wards_cost: 20, expel_days: 28, wave_cost: 30, power_max_broken: 50, power_broken: 25 })) assert(new RegExp(`\\b${k} = ${v}\\b`).test(c), k);
  assert.match(eff, /min = -10 max = 11/); assert.match(eff, /glo_score/); assert.match(eff, /global\.zin_afrit_artifacts/);
  assert.match(eff, /zin_glo_on_sword_broken = \{[\s\S]*zin_glo_sword_handled/);
  assert.match(eff, /zin_glo_add_power = \{[\s\S]*zin_glo_power_cap/);
});
test('Glo never passes to the Worshipdom, a realm Afrit rules or Volgan (O3), and no script of the Glo module sets potent magic', () => {
  const all = ['common/scripted_effects/zin_glo.txt', 'events/zin_glo.txt', 'common/decisions/zin_glo.txt'].map(text).join('\n');
  assert(!/zin_glo_with_afrit|zin_afrit\.35/.test(all)); assert(!/zin_potent_magic/.test(all));
  const tr = text('common/scripted_effects/zin_glo.txt'); const transfer = tr.slice(tr.indexOf('zin_glo_transfer = {'), tr.indexOf('\n}\n', tr.indexOf('zin_glo_transfer = {')));
  assert(!/zin_afrit|Y8G|Y8D|zin_glo_dark_power/.test(transfer)); assert.match(transfer, /zin_arg_to/);
});
test('Glo\'s Wave only damages Zol\'s and Zol\'s subjects\' hosts and marks the state cleansed for 60 days', () => {
  const eff = text('common/scripted_effects/zin_glo.txt'); const w = eff.slice(eff.indexOf('zin_glo_wave = {'), eff.indexOf('zin_glo_wave_battlefield = {'));
  assert.match(w, /original_tag = Y0U is_subject_of = Y0U/); assert.match(w, /zin_glo_cleansed days = 60/); assert(!/zin_zol_return_the_fallen|zin_zol_/.test(w));
  const dec = text('common/decisions/zin_glo.txt'); assert.match(dec, /zin_glo_wave_decision[\s\S]*days_re_enable = 60/);
});
test('Hall outcomes: the cases A, B1, B2, C and D and the effects common to a death exist', () => {
  const eff = text('common/scripted_effects/zin_glo.txt');
  for (const c of [1, 2, 3, 4, 5]) assert(eff.includes(`zin_arg_case = ${c}`), `case ${c}`);
  const falls = eff.slice(eff.indexOf('zin_glo_horos_falls = {'), eff.indexOf('zin_glo_give_to_heir = {'));
  for (const s of ['zin_horos_dead', 'zin_yeldenne_install_warden', 'zin_yeldenne_the_empty_throne', 'zin_world_add_gathering_dark', 'news_event = { id = zin_glo.30 }']) assert(falls.includes(s), s);
  assert.match(text('common/on_actions/zin_glo.txt'), /on_declare_war[\s\S]*zin_glo_conqueror/);
});
test('Glo\'s startup and ai: wards 50, power 0, state 0, the conquer block', () => {
  const s = text('common/on_actions/zin_glo.txt'); assert.match(s, /zin_glo_state = 0/); assert.match(s, /zin_yeldenne_wards = constant:zin_glo\.wards_start/); assert.match(s, /Y8H = \{ country_event = \{ id = zin_glo\.1/);
  assert.match(text('common/ai_strategy/zin_glo.txt'), /type = conquer[\s\S]*value = -500/);
  assert.match(text('common/dynamic_modifiers/zin_glo.txt'), /zin_yeldenne_hall_wards[\s\S]*enemy_attrition = 0\.2/);
});

// ------------------------------------------------------------------------------------------------ Western Crossing
test('The west: grudge table, start values and the anchor list', () => {
  const s = text('common/on_actions/zin_west.txt');
  assert.match(s, /Y09 = \{ set_variable = \{ zin_west_grudge = 60 \}/); assert.match(s, /Y07 = \{ set_variable = \{ zin_west_grudge = 55 \}/);
  assert.match(s, /zin_west_truce = constant:zin_west\.truce_start/); assert.match(s, /zin_west_unity = constant:zin_west\.unity_start/);
  assert.equal(results.west.anchors[0], 'Y07'); assert.equal(results.west.anchors.length, 21);
  const t = text('common/scripted_triggers/zin_west.txt'); assert.match(t, /zin_west_is_anchor = \{/);
});
test('The paced dates are three branches each and equal the spec at the standard pace', () => {
  const t = text('common/scripted_triggers/zin_west.txt');
  for (const [k, d] of [['truce_break', '1750.4.1'], ['keys_of_parim', '1756.5.1'], ['shore_calls', '1756.11.1'], ['shore_calls_late', '1756.12.1']]) {
    const b = t.slice(t.indexOf(`zin_west_past_${k} = {`)); const body = b.slice(0, b.indexOf('\n}\n'));
    assert.equal((body.match(/\bdate >/g) ?? []).length, 3, k); assert(body.includes(`date > ${d}`), k);
  }
});
test('Every western war goal, border war and declaration is behind its peace gate; declare_war_on follows zin_story_war', () => {
  const all = ['common/scripted_effects/zin_west.txt'].map(text).join('\n');
  const launch = all.slice(all.indexOf('zin_west_launch_crossing = {'), all.indexOf('zin_west_sail_first = {'));
  assert(launch.indexOf('zin_story_war') < launch.indexOf('declare_war_on')); assert(launch.indexOf('create_wargoal') < launch.indexOf('declare_war_on'));
  const brk = all.slice(all.indexOf('zin_west_break_truce = {'), all.indexOf('zin_west_end_ford_war = {'));
  assert.match(brk, /NOT = \{ has_global_flag = zin_west_truce_broken \}/); assert.match(brk, /start_border_war/);
  const gate = text('common/scripted_effects/zin_west.txt'); assert.match(gate, /zin_west_add_truce = \{[\s\S]*date > 1749\.3\.1/);
  const dec = text('common/decisions/zin_west.txt'); assert.match(dec, /zin_west_end_the_truce[\s\S]*date > 1750\.3\.1/); assert.match(dec, /zin_west_convene_council[\s\S]*date > 1752\.3\.1/);
  assert(!/declare_war_on/.test(dec) && !/start_border_war/.test(dec));
});
test('The sailings: lift is fleet over three, the storm costs a quarter and ten fleet, two sailings at most, the strait never stops them', () => {
  const eff = text('common/scripted_effects/zin_west.txt'); const sail = eff.slice(eff.indexOf('zin_west_sail = {'), eff.indexOf('zin_controls_sea_central_for_foe') > 0 ? eff.indexOf('zin_west_launch_crossing = {') : undefined);
  assert.match(sail, /divide_temp_variable = \{ west_lift = constant:zin_west\.lift_divisor/); assert.match(sail, /west_loss/); assert.match(sail, /zin_arg_value = -10/);
  assert(!/zin_leren_strait_closed/.test(eff)); assert.match(text('common/decisions/zin_west.txt'), /zin_west_second_sailing[\s\S]*global\.zin_west_sailings = 1/);
  assert.match(eff, /zin_west_create_host = \{[\s\S]*prioritize_location/); assert.match(eff, /Crossing Host/);
});
test('Strain, evacuation and stranded: the strain modifier reads two variables, the mission lasts 60 days and the lift is capped at 80', () => {
  assert.match(text('common/dynamic_modifiers/zin_west.txt'), /army_morale_factor = zin_west_strain_morale/); assert.match(text('common/dynamic_modifiers/zin_west.txt'), /supply_consumption_factor = zin_west_strain_supply/);
  const dec = text('common/decisions/zin_west.txt'); assert.match(dec, /zin_west_fleet_waits[\s\S]*days_mission_timeout = 60[\s\S]*zin_west_resolve_evacuation/);
  const eff = text('common/scripted_effects/zin_west.txt'); assert.match(eff, /lift_cap/); assert.match(eff, /zin_west_stranded_host/); assert.match(eff, /zin_west_evac_state_roll/);
  assert.match(text('common/script_constants/zin_west_constants.txt'), /lift_cap = 80/);
});
test('Route changes refresh the western layouts (E4) and the monthly pulse does too; the rule keeps DEFAULT first', () => {
  const eff = text('common/scripted_effects/zin_west.txt');
  const route = eff.slice(eff.indexOf('zin_west_set_route = {'), eff.indexOf('zin_west_call_pledges = {')); assert.match(route, /mark_focus_tree_layout_dirty/);
  const monthly = eff.slice(eff.indexOf('zin_west_monthly = {')); assert.match(monthly, /mark_focus_tree_layout_dirty/);
  assert.match(text('common/game_rules/zin_west.txt'), /zin_rule_west_route[\s\S]*default = \{\s+name = DEFAULT/);
  for (const o of ['historical', 'crossing_hold', 'relief', 'divided', 'free']) assert(text('common/game_rules/zin_west.txt').includes(`name = ${o}`), o);
});
test('Gunwaith gets its start spirit from zin_west.1 and the host template is made on every western country', () => {
  const e = eventBlocks('events/zin_west.txt').find(b => b.v.find(x => x.k === 'id').v === 'zin_west.1'); const s = JSON.stringify(e.v);
  assert(s.includes('zin_gunwaith_weary_clans')); assert(s.includes('division_template')); assert(s.includes('zin_men_archers'));
  const startup = text('common/on_actions/zin_west.txt'); assert.equal((startup.match(/country_event = \{ id = zin_west\.1 days = 2 \}/g) ?? []).length, 21);
});
test('The geography file is the one the module reads: ports, shore, isle and strategic regions', async () => {
  const g = await readData('mech_journey_geography.json');
  assert.equal(g.shore.length, 5); assert.equal(g.isle.length, 1); assert(g.ports.length > 20 && g.mainland.length > 50 && g.strategicRegions.length > 5);
  assert.match(text('common/ai_areas/zin_west.txt'), /zin_area_middle_lands/);
  assert(text('common/scripted_triggers/zin_west.txt').includes(`states = { ${g.mainland[0]} `));
});

// ------------------------------------------------------------------------------------------------ cross-module
test('The three modules share no definition name, and their dependency lists name only other owners', () => {
  const seen = new Map();
  for (const [name, r] of Object.entries(results)) for (const k of ['effects', 'triggers', 'ideas', 'decisions', 'events']) for (const id of r.definitions[k]) { assert(!seen.has(`${k}:${id}`), `${id} in ${seen.get(`${k}:${id}`)} and ${name}`); seen.set(`${k}:${id}`, name); }
  for (const [name, r] of Object.entries(results)) for (const d of r.dependencies) for (const k of ['effects', 'triggers']) assert(seen.get(`${k}:${d.name}`) !== name, `${name} depends on its own ${d.name}`);
  assert(results.glo.dependencies.some(d => d.name === 'zin_afrit_wound'));
  assert(results.west.dependencies.some(d => d.name === 'zin_aenor_is_realm'));
});
test('Every picture sprite an event uses is in the event and news picture catalogue', async () => {
  const gfx = await readFile(path.join(ZIN, 'interface/zin_event_pictures.gfx'), 'utf8');
  const names = new Set([...gfx.matchAll(/name = "([^"]+)"/g)].map(m => m[1]));
  for (const rel of ['events/zin_glo.txt', 'events/zin_west.txt']) for (const m of text(rel).matchAll(/picture = (GFX_zin_\w+)/g)) assert(names.has(m[1]), `${rel}: ${m[1]}`);
});
test('Every decision and category sprite is defined in the module\'s gfx file and points at a catalogue idea texture', async () => {
  const cat = await readFile(path.join(ZIN, 'interface/zin_catalog_ideas.gfx'), 'utf8');
  for (const [gfx, dec, cats] of [['interface/zin_glo.gfx', 'common/decisions/zin_glo.txt', 'common/decisions/categories/zin_glo.txt'], ['interface/zin_eindil.gfx', 'common/decisions/zin_eindil.txt', 'common/decisions/categories/zin_eindil.txt'], ['interface/zin_west.gfx', 'common/decisions/zin_west.txt', 'common/decisions/categories/zin_west.txt']]) {
    const g = text(gfx);
    for (const m of text(dec).matchAll(/\bicon = zin_(\w+)/g)) assert(g.includes(`GFX_decision_zin_${m[1]}"`), `${dec}: ${m[1]}`);
    for (const m of text(cats).matchAll(/\bicon = zin_(\w+)/g)) assert(g.includes(`GFX_decision_category_zin_${m[1]}"`), `${cats}: ${m[1]}`);
    for (const m of g.matchAll(/ideas\/zin\/(\w+)\.dds/g)) assert(cat.includes(`ideas/zin/${m[1]}.dds`), `${gfx}: ${m[1]}`);
  }
});
test('Spirit and decision icons all exist in the catalogue', async () => {
  const cat = await readFile(path.join(ZIN, 'interface/zin_catalog_ideas.gfx'), 'utf8');
  for (const d of [eindilData, gloData, westData]) for (const s of d.spirits) assert(cat.includes(`ideas/zin/${s.icon}.dds`), s.icon);
});
test('An event written with a bad option shape is rejected by the builder (negative)', () => {
  assert.throws(() => indentLines(['option = {', 'name = x']), /Unbalanced/);
  const lines = eventLines({ ns: 'zin_x', id: 1, title: 't', desc: 'd', picture: 'GFX_zin_evt_generic_war', options: [{ name: 'o', effects: ['add_stability = 0.1'], ai: 5 }] });
  assert(lines.join('\n').includes('timeout_days = 30'));
});
