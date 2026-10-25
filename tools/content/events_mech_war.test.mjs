// Tests of the war-side story fixes (docs/design/alternate_history.md, soft-locks SL-12 to SL-17, SL-19, SL-22, SL-27, SL-34, SL-36 and
// B34.D2; handoff docs/plans/story/war_side_handoff.md): Kusven in Zol's stead, the narrative events of zin_mistake, zin_dominion, zin_leren
// and zin_sun (modules/events_mech_war.mjs), the Volgan catch-up and the realm conquered with the body unbroken, the West's readings of the
// treaty, the Western Crown in Parim and the pass accord. They build the slices directly with the roster; nothing needs a prior build.
// Run: node --test tools/content/events_mech_war.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { countryTable } from './lib/roster.mjs';
import { ZIN } from './lib/paths.mjs';
import { loadCountryTable } from './modules/countries.mjs';
import { buildZol } from './modules/mech_zol.mjs';
import { buildVolgan } from './modules/mech_volgan.mjs';
import { buildLerendor } from './modules/mech_lerendor.mjs';
import { buildMechSun } from './modules/mech_sun.mjs';
import { buildWesternCrossing } from './modules/mech_crossing.mjs';
import { buildEventsMechWar, loadWarEvents } from './modules/events_mech_war.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const json = async f => JSON.parse(await readFile(path.join(here, 'data', f), 'utf8'));
const countries = countryTable();
const table = await loadCountryTable(countries, `${ZIN}/docs/design/countries.csv`);
const assignment = new Map([...table].map(([tag, t]) => [tag, t.people]));
const tagOf = n => countries.find(c => c.name === n).tag;
const ZOL = tagOf("Zol's Mistake"), VOL = tagOf('Puvulan');

const staged = new Staged();
const zol = await buildZol(staged, { countries });
const volgan = await buildVolgan(staged, { countries });
const leren = await buildLerendor(staged, { countries });
const sun = await buildMechSun(staged, { countries, assignment });
const west = await buildWesternCrossing(staged, { countries });
const war = await buildEventsMechWar(staged, { countries });
const text = rel => { const b = staged.files.get(rel); assert(b, `missing staged file ${rel}`); return b.toString('utf8'); };
const strip = s => s.replace(/#[^\n]*/g, '');
const scripts = [...staged.files].filter(([k]) => /\.txt$/.test(k)).map(([k, v]) => [k, strip(v.toString('utf8'))]);
const all = scripts.map(([, v]) => v).join('\n');
const loc = Object.fromEntries([...text('localisation/english/zin_events_mech_war_l_english.yml').matchAll(/^ ([^:\s]+):0 "(.*)"$/gm)].map(m => [m[1], m[2]]));
// One event block of the staged war events, by id.
const block = id => {
  const t = all, start = t.search(new RegExp(`\\bid = ${id.replace('.', '\\.')}\\n`));
  assert(start > 0, `${id} is not defined`);
  const open = t.lastIndexOf('_event = {', start);
  let depth = 0, i = t.indexOf('{', open);
  for (; i < t.length; i++) { if (t[i] === '{') depth++; else if (t[i] === '}' && --depth === 0) break; }
  return t.slice(open, i + 1);
};
const SETS = await loadWarEvents();

test('SL-28 (war side): every zin_mistake, zin_dominion, zin_leren and zin_sun event the slices fire is defined', () => {
  const defined = new Set([...all.matchAll(/^\s*(?:country|news)_event = \{\s*id = ((?:zin_mistake|zin_dominion|zin_leren|zin_sun)\.\d+)/gm)].map(m => m[1]));
  const fired = new Set([...all.matchAll(/(?:country|news)_event = \{ id = ((?:zin_mistake|zin_dominion|zin_leren|zin_sun)\.\d+)/g)].map(m => m[1]));
  const missing = [...fired].filter(id => !defined.has(id)).sort();
  assert.deepEqual(missing, []);
  for (const id of ['zin_mistake.2', 'zin_mistake.10', 'zin_mistake.11', 'zin_mistake.20', 'zin_mistake.21', 'zin_mistake.22', 'zin_mistake.24', 'zin_mistake.25', 'zin_dominion.13', 'zin_dominion.14', 'zin_dominion.19', 'zin_leren.30', 'zin_leren.35', 'zin_leren.36', 'zin_sun.40', 'zin_sun.42']) assert(fired.has(id), `${id} is fired by its slice`);
  assert.equal(war.counts.events, 51);
  assert.deepEqual(new Set(war.definitions.events).size, war.definitions.events.length, 'no id twice');
});

test('SL-14: Kusven, not Zol, comes forth; the contract flag is kept for its readers; Zol never takes the field', () => {
  const eff = text('common/scripted_effects/zin_mistake.txt');
  const send = eff.slice(eff.indexOf('zin_zol_send_kusven = {'));
  assert(!/zin_zol_manifested|zin_zol_withdrawn/.test(all), 'the retired Zol flags are neither set nor read');
  for (const s of ['set_global_flag = zin_kusven_forth', 'recruit_character = zin_kusven', 'character = zin_kusven', 'zin_trait_kusven_grave_wind', 'division_template = \\"Kusven\'s Host\\"', 'news_event = { id = zin_mistake.20 }']) assert(send.includes(s), s);
  assert(/zin_kusven_can_come_forth = \{[\s\S]*?NOT = \{ has_global_flag = zin_kusven_forth \}/.test(text('common/scripted_triggers/zin_mistake.txt')), 'once in the age');
  const decisions = text('common/decisions/zin_mistake.txt');
  assert(decisions.includes('zin_zol_send_kusven_decision = {') && !decisions.includes('zin_zol_come_forth'));
  assert(text('common/ideas/zin_mistake.txt').includes('zin_zol_kusven_in_field = {') && text('common/ideas/zin_mistake.txt').includes('zin_zol_kusven_wounded = {'));
  assert(text('common/unit_leader/zin_kusven_traits.txt').includes('zin_trait_kusven_grave_wind = {'));
  // Every text of the mechanic and its events that once had Zol in person now has his servant.
  for (const [k, v] of Object.entries({ ...zol.loc, ...war.loc })) assert(!/Old God (?:comes|came) forth|Zol (?:walks|appears|manifests|comes forth|takes the field)|\bform taken\b|Zol Made Flesh/i.test(v), `${k}: Zol in person`);
  assert(loc['zin_mistake.20.t'] === 'Kusven Comes Forth' && /Zol's most loyal servant/.test(loc['zin_mistake.20.desc']));
});

test('Kusven is named only in text that waits for him to come forth (nothing before his appearance)', () => {
  for (const set of SETS) for (const e of set.events) {
    const shown = JSON.stringify([e.title, Array.isArray(e.desc) ? e.desc.filter(d => !d.trigger?.includes('zin_kusven_forth')).map(d => d.text) : e.desc, (e.options ?? []).map(o => [o.text, o.tip])]);
    if (/\bKusven\b/.test(shown)) assert((e.requires ?? []).includes('zin_kusven_forth'), `${set.namespace}.${e.id}`);
  }
  assert(!/Kusven/.test(zol.loc.zin_zol_send_kusven_decision + zol.loc.zin_zol_send_kusven_decision_desc), 'the decision is shown before he comes forth');
});

test('Negative: an event that names Kusven without waiting for him is refused', async () => {
  const sets = structuredClone(SETS);
  sets.find(s => s.namespace === 'zin_mistake').events.find(e => e.id === 11).desc = 'Kusven was seen on the roads.';
  await assert.rejects(buildEventsMechWar(new Staged(), { countries, sets }), /names Kusven but is not gated/);
  const bad = structuredClone(SETS);
  bad.find(s => s.namespace === 'zin_dominion').events.find(e => e.id === 17).desc = 'Edvoid laughed.';
  await assert.rejects(buildEventsMechWar(new Staged(), { countries, sets: bad }), /Edvoid/);
});

test('SL-13: the blue sword breaks in zin_mistake.21, the only setter of zin_horos_sword_broken, and the shard wounds Kusven', () => {
  const b = block('zin_mistake.21');
  assert(/trigger = \{\s*zin_kusven_is_forth = yes\s*\}/.test(b) && /immediate = \{\s*zin_kusven_break_the_sword = yes\s*\}/.test(b));
  assert.equal((all.match(/set_global_flag = zin_horos_sword_broken/g) ?? []).length, 1);
  assert.equal((all.match(/zin_kusven_break_the_sword = yes/g) ?? []).length, 1, 'only .21 calls it');
  const brk = text('common/scripted_effects/zin_mistake.txt').match(/zin_kusven_break_the_sword = \{[\s\S]*?\n\}/)[0];
  for (const s of ['set_global_flag = zin_kusven_wounded', 'set_global_flag = zin_zol_one_finger_done', 'add_days_mission_timeout', 'id = zin_eindil.101']) assert(brk.includes(s), s);
  const send = text('common/scripted_effects/zin_mistake.txt').match(/zin_zol_send_kusven = \{[\s\S]*?\n\}/)[0];
  assert(/has_global_flag = zin_glo_with_eindil\s*\}\s*country_event = \{ id = zin_mistake\.21 days = 7 \}\s*var:global\.zin_eindil_host = \{ country_event = \{ id = zin_mistake\.21 days = 7 \} \}/.test(send), 'Zol and the Host get .21 seven days later with Glo');
  assert(/else_if = \{[\s\S]*?zin_eindil\.101 days = 7/.test(send), 'without Glo the heir is struck down and nothing breaks');
});

test('SL-12: Lorien rides and dies forcing Kusven back; the withdrawal takes cause 0', () => {
  const ride = block('zin_mistake.22');
  const opts = [...ride.matchAll(/option = \{\s*name = (zin_mistake\.22\.[ab])/g)].map(m => m[1]);
  assert.deepEqual(opts, ['zin_mistake.22.b', 'zin_mistake.22.a'], 'the non-committal option first (C9)');
  for (const s of ['zin_sun_lorien_rides = yes', 'zin_diplo_lift_refusal = yes', 'flag = zin_potent_magic days = 30', 'country_event = { id = zin_mistake.26 days = 14 }']) assert(ride.includes(s), s);
  const stand = block('zin_mistake.26');
  assert(/hidden = yes/.test(stand) && /news_event = \{ id = zin_mistake\.23 \}\s*zin_sun_lorien_falls = yes\s*set_temp_variable = \{ zin_arg_cause = 0 \}\s*zin_kusven_withdraw = yes/.test(stand));
  assert(/country_exists = GAA[\s\S]*?country_event = \{ id = zin_mistake\.22 days = 1 \}/.test(text('common/scripted_effects/zin_mistake.txt')), 'Gala is asked when Kusven comes forth');
  assert(/zin_gala_steward_chosen/.test(block('zin_sun.42')) && (block('zin_sun.42').match(/set_country_flag = zin_gala_steward_chosen/g) ?? []).length === 3);
});

test('The withdrawal: Kusven leaves the field wounded, not destroyed; every other end is the spent strength', () => {
  const eff = text('common/scripted_effects/zin_mistake.txt');
  const w = eff.match(/zin_kusven_withdraw = \{[\s\S]*?\n\}/)[0];
  for (const s of ['set_global_flag = zin_kusven_withdrawn', 'remove_unit_leader_role = { character = zin_kusven }', 'idea = zin_zol_kusven_wounded', 'news_event = { id = zin_mistake.24 }', 'news_event = { id = zin_mistake.25 }']) assert(w.includes(s), s);
  assert(!/kill_[a-z_]+ = \{[^}]*zin_kusven|retire_character = zin_kusven/.test(all), 'he is never destroyed');
  assert(/timeout_effect = \{\s*set_temp_variable = \{ zin_arg_cause = 1 \}\s*zin_kusven_withdraw = yes/.test(text('common/decisions/zin_mistake.txt')), 'the mission ends by time (.25)');
  assert(/num_equipment_in_armies@zin_great_spirit_equipment < 1/.test(eff), 'his host destroyed ends it');
  assert(/has_global_flag = zin_kusven_forth/.test(block('zin_mistake.25')), 'one text for each end');
});

test('SL-15 and SL-16: the Black Compact is offered once and answered; Volgan\'s options call the mechanic\'s effects', () => {
  assert(/hidden = yes[\s\S]*?NOT = \{ has_global_flag = zin_black_compact \}[\s\S]*?country_event = \{ id = zin_mistake\.16 \}/.test(block('zin_dominion.14')));
  const accord = block('zin_mistake.16');
  for (const s of ['white_peace = PUV', 'give_military_access = PUV', 'PUV = { give_military_access = ZOL }', 'set_global_flag = zin_black_compact', 'id = zin_dominion.15']) assert(accord.includes(s), s);
  assert.equal((all.match(/set_global_flag = zin_black_compact\n/g) ?? []).length, 1, 'only the accept sets the compact');
  for (const [id, s] of [['zin_dominion.13', 'zin_volgan_strike_zol = yes'], ['zin_dominion.16', 'zin_dominion_champion_falls = yes'], ['zin_dominion.18', 'zin_dominion_member_breaks_free = yes'], ['zin_dominion.19', 'zin_dominion_let_mirolon_go = yes'], ['zin_dominion.19', 'zin_dominion_hold_mirolon = yes']]) assert(block(id).includes(s), `${id}: ${s}`);
});

test('SL-34: under the historical branch an AI Volgan marches 30 days after Mirolon falls', () => {
  const pulse = text('common/scripted_effects/zin_dominion_pulse.txt');
  assert(/is_ai = yes\s*zin_rules_is_historical = yes\s*has_game_rule = \{ rule = zin_rule_dark_powers option = HISTORICAL \}\s*has_global_flag = \{ flag = zin_mirolon_fallen days > 29 \}\s*NOT = \{ has_global_flag = zin_volgan_marches \}[\s\S]*?zin_volgan_begin_march = yes/.test(pulse));
});

test('B34.D2: a realm annexed with the body unbroken withdraws south; the Children of Volgan close', () => {
  const oa = text('common/on_actions/zin_dominion.txt');
  assert(new RegExp(`on_annex = \\{[\\s\\S]*?FROM = \\{ tag = ${VOL} \\}[\\s\\S]*?zin_volgan_withdraws_south = yes`).test(oa));
  assert(/FROM\.FROM = \{[\s\S]*?zin_dominion_state_changed = yes/.test(oa), 'the state hook runs in the state\'s scope');
  const eff = text('common/scripted_effects/zin_dominion.txt');
  assert(/zin_volgan_withdraws_south = \{[\s\S]*?set_global_flag = zin_volgan_withdrawn_south[\s\S]*?zin_dominion_end_compact = yes[\s\S]*?news_event = \{ id = zin_dominion\.29 \}/.test(eff));
  assert(/zin_volgan_children_ready = \{[\s\S]*?NOT = \{ has_global_flag = zin_volgan_withdrawn_south \}/.test(text('common/scripted_triggers/zin_dominion.txt')));
});

test('SL-17: Lerendor decides; the West reads the treaty Lerendor actually keeps', () => {
  assert(/zin_leren_withdraw = yes/.test(block('zin_leren.35')) && /less_than_or_equals/.test(block('zin_leren.35')));
  const ask = block('zin_leren.36');
  assert.deepEqual([...ask.matchAll(/name = (zin_leren\.36\.[abc])/g)].map(m => m[1]), ['zin_leren.36.a', 'zin_leren.36.b', 'zin_leren.36.c']);
  assert(ask.includes('zin_leren_join_aenor_defence = yes') && ask.includes('zin_leren_withdraw = yes'));
  const westScript = [...staged.files].filter(([k]) => /zin_west/.test(k)).map(([, v]) => v.toString('utf8')).join('\n');
  assert(!/has_global_flag = zin_leren_(?:honours_treaty|treaty_in_force)/.test(westScript), 'no flag that Lerendor never sets');
  assert(/has_global_flag = zin_leren_treaty_honoured\s*zin_leren_treaty_in_force = yes/.test(westScript));
});

test('SL-19 and SL-22: the Western Crown in Parim is a trigger; the pass accord is in force and breaks when a pass is taken', () => {
  const trig = text('common/scripted_triggers/zin_west.txt');
  assert(/zin_west_holds_parim = \{[\s\S]*?zin_is_site_parim = yes[\s\S]*?zin_west_throne_claimed/.test(trig));
  const oa = text('common/on_actions/zin_west.txt');
  assert(/on_startup = \{[\s\S]*?set_global_flag = zin_wall_accord\b/.test(oa));
  assert(/on_state_control_changed = \{[\s\S]*?has_war_with = FROM[\s\S]*?FROM\.FROM = \{ zin_is_site_great_wall = yes \}[\s\S]*?set_global_flag = zin_wall_accord_broken/.test(oa));
});

test('SL-27: Zol is Zol by original tag', () => {
  assert(text('common/scripted_triggers/zin_mistake.txt').includes(`zin_is_zol = {\n\toriginal_tag = ${ZOL}\n}`));
});

test('SL-36: the superseded name is Edvoid, not Kusven, and no text speaks of an Old God\'s victory', async () => {
  const banned = (await json('banned_words.json')).rules.find(r => r.id === 'bw_superseded_names_002');
  assert.equal(banned.pattern, "edvoid(?:'s)?");
  assert.equal(banned.replace, 'Kusven');
  const reserved = await json('world/reserved_names.json');
  assert(reserved.superseded.some(s => s.name === 'Edvoid' && s.current === 'Kusven') && !reserved.superseded.some(s => s.name === 'Kusven'));
  for (const f of ['events_world_lastwar.json', 'mech_regions_sun.json', 'mech_zol.json']) assert(!/Old God's victory/.test(await readFile(path.join(here, 'data', f), 'utf8')), f);
  assert(/Zol's victory/.test((await json('mech_regions_sun.json')).text?.zin_sun_old_powers_stand_3_desc ?? JSON.stringify(await json('mech_regions_sun.json'))));
  const zolRow = (await json('world/roster.json')).countries?.find?.(c => c.key === 'zols_mistake');
  if (zolRow) assert(!zolRow.formerLabels.includes("Kusven's Mistake") && zolRow.formerLabels.includes("Edvoid's Mistake"));
});

test('Every picture of the war events is a catalog picture with the right crop and gate', async () => {
  const cells = await json('presentation-cells.json');
  const pics = new Map(cells.events.map(e => [e.key, e]));
  for (const set of SETS) for (const e of set.events) if (e.kind !== 'hidden') {
    const p = pics.get(e.picture);
    assert(p, `${set.namespace}.${e.id}: ${e.picture}`);
    if (e.kind === 'news') assert(['both', 'news'].includes(p.crop), `${set.namespace}.${e.id}`);
  }
});

// The story events the other slices fire and left to the events engineers (SL-28, the story wiring check): the elves, the eastern kings,
// the Dark Lands, the Lost Cause and the Refusal, and the Gods' Gift (data/events_mech_elves.json, _east, _dark, _diplo, _world).
test('SL-28 (other slices): every zin_elves, zin_east, zin_dark and zin_diplo event the elves, eastern and Dark Lands slices fire is defined', async () => {
  const { buildElves } = await import('./modules/mech_elves.mjs');
  const { buildMechEast } = await import('./modules/mech_east.mjs');
  const { buildMechDark } = await import('./modules/mech_dark.mjs');
  const s2 = new Staged();
  await buildElves(s2, { countries, table });
  await buildMechEast(s2, { countries });
  await buildMechDark(s2, { countries, assignment });
  const theirs = [...s2.files].filter(([k]) => /\.txt$/.test(k)).map(([, v]) => strip(v.toString('utf8'))).join('\n');
  const fired = new Set([...theirs.matchAll(/(?:country|news)_event = \{ id = ((?:zin_elves|zin_east|zin_dark|zin_diplo)\.\d+)/g)].map(m => m[1]));
  const definedThere = new Set([...theirs.matchAll(/^\s*(?:country|news)_event = \{[ \t]*\n\s*id = ((?:zin_elves|zin_east|zin_dark|zin_diplo)\.\d+)/gm)].map(m => m[1]));
  const here = new Set(war.definitions.events);
  const missing = [...fired].filter(id => !definedThere.has(id) && !here.has(id)).sort();
  assert.deepEqual(missing, []);
  const ids = ['zin_elves.9', 'zin_elves.51', 'zin_elves.70', 'zin_elves.71', 'zin_east.41', 'zin_east.42', 'zin_east.43', 'zin_east.44', 'zin_east.45', 'zin_east.46', 'zin_east.50', 'zin_east.51', 'zin_east.52', 'zin_east.60', 'zin_dark.80', 'zin_dark.82', 'zin_diplo.23', 'zin_diplo.31'];
  for (const id of ids) { assert(here.has(id), `${id} is written here`); assert(!definedThere.has(id), `${id} is not defined twice`); }
  // The options call the slices' own effects.
  assert(block('zin_east.41').includes('zin_east_form_coalition = yes'));
  for (const [id, effs] of [['zin_east.42', ['zin_east_join_coalition', 'zin_east_stay_out']], ['zin_east.45', ['zin_east_make_coalition_peace']], ['zin_east.46', ['zin_east_serve_stranger', 'zin_east_order_home']], ['zin_east.50', ['zin_east_gifts_to_king', 'zin_east_refuse_king']], ['zin_east.52', ['zin_east_send_levies', 'zin_east_send_gold', 'zin_east_delay_host']]]) for (const e of effs) assert(block(id).includes(`${e} = yes`), `${id}: ${e}`);
  assert(block('zin_dark.80').includes('idea = zin_dark_watch_the_shore'));
  assert(block('zin_diplo.23').includes('set_country_flag = zin_lost_cause_member') && block('zin_diplo.31').includes('leave_faction = yes'));
  assert(block('zin_elves.71').includes('set_global_flag = zin_elves_companies_offered') && block('zin_elves.71').includes('zin_elves.72'), 'the offer reaches the Magical Forest once');
  // The news of the crossing and of the turn west are sent once (a major news event reaches every country from one firing).
  assert(!/every_country = \{ news_event = \{ id = zin_east\.4[34] \} \}/.test(theirs) && theirs.includes('news_event = { id = zin_east.43 }'));
  // The AI's two answers to the coalition and to the honorary crown always add up to 100.
  for (const [id, a, b] of [['zin_east.42', 'zin_east.42.a', 'zin_east.42.b'], ['zin_diplo.23', 'zin_diplo.23.a', 'zin_diplo.23.b']]) {
    const t = block(id), base = k => Number(t.slice(t.indexOf(`name = ${k}`)).match(/base = (-?\d+)/)[1]);
    assert.equal(base(a) + base(b), 100, id);
  }
  // No text of these events names Afrit, the Deliverer, Kusven or a bare Eindil.
  for (const [k, v] of Object.entries(loc)) if (/^zin_(elves|east|dark|diplo|world)\./.test(k)) assert(!/\bAfrit\b|\bDeliverer\b|\bKusven\b|\bEindil\b/.test(v.replace(/\[[^\]]*\]/g, ' ')), k);
});
