// Tests for the mechanic story events (modules/events_mech.mjs) and the soft-lock fixes of the Afrit, Aenor and Eindil slices
// (docs/design/alternate_history.md: SL-04 to SL-11, SL-18, SL-20, SL-21, SL-25, SL-28, SL-30 to SL-33, SL-35, SL-37). They build the
// court mechanics, the journey and the story events into one Staged and read the generated script.
// Run: node --test tools/content/events_mech.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { countryTable } from './lib/roster.mjs';
import { parse } from './lib/clausewitz.mjs';
import { buildAenor } from './modules/mech_aenor.mjs';
import { buildAfrit } from './modules/mech_afrit.mjs';
import { buildZol } from './modules/mech_zol.mjs';
import { buildYeldenneGlo } from './modules/mech_yeldenne.mjs';
import { buildEindilJourney } from './modules/mech_eindil.mjs';
import { buildEventsMech, loadMechEvents, renderMechEvents, structureProblems, textProblems, aiFromVariable, definedEventIds } from './modules/events_mech.mjs';
import { loadPictures, loadWorldData, eventsOf } from './modules/events_world.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ZIN = path.resolve(here, '../..');
const countries = countryTable();
const tagOf = key => countries.find(c => c.key === key).tag;
const HUB = tagOf('worshipdom');
const staged = new Staged();
const aenor = await buildAenor(staged, { countries });
const afrit = await buildAfrit(staged, { countries });
await buildZol(staged, { countries });
await buildYeldenneGlo(staged, { countries });
await buildEindilJourney(staged, { countries, eindil: { hostFlag: false } });
const story = await buildEventsMech(staged, { countries });
const text = rel => staged.files.get(rel).toString('utf8');
const strip = t => t.replace(/#.*$/gm, '');
const all = [...staged.files].filter(([k]) => /\.(txt)$/.test(k)).map(([, v]) => strip(v.toString('utf8'))).join('\n');
const block = (t, name) => { const i = t.indexOf(`${name} = {`); assert(i >= 0, `${name} is defined`); let d = 0, j = t.indexOf('{', i); for (; j < t.length; j++) { if (t[j] === '{') d++; else if (t[j] === '}' && --d === 0) break; } return t.slice(i, j + 1); };
const effects = strip(text('common/scripted_effects/zin_afrit.txt')), triggers = strip(text('common/scripted_triggers/zin_afrit.txt'));
const aenorFx = strip(text('common/scripted_effects/zin_aenor_court.txt'));
const eindilTr = strip(text('common/scripted_triggers/zin_eindil.txt')), eindilFx = strip(text('common/scripted_effects/zin_eindil.txt'));
const sets = await loadMechEvents();
const pictures = await loadPictures();

// ------------------------------------------------------------------------------------------------ the story events
test('The story events: written once, each with a picture, a timeout and options, in files that parse', () => {
  assert.equal(story.counts.files, 2);
  for (const rel of ['events/zin_afrit_story.txt', 'events/zin_aenor_successors.txt']) {
    const evs = parse(text(rel)).filter(x => x.k?.endsWith('_event'));
    assert(evs.length > 0, rel);
    for (const e of evs) {
      const keys = e.v.map(x => x.k);
      for (const k of ['id', 'title', 'desc', 'picture', 'timeout_days', 'option']) assert(keys.includes(k), `${rel}: ${k}`);
    }
    assert(!/<=|>=/.test(text(rel)), 'no unsupported operators');
  }
  const b = text('localisation/english/zin_events_mech_l_english.yml');
  assert(b.startsWith('﻿l_english:'), 'UTF-8 with BOM');
});

test('SL-28: every zin_afrit and zin_aenor event the court slices, the journey and the trees fire is defined', () => {
  const defined = new Set([...staged.files].filter(([k]) => k.startsWith('events/')).flatMap(([, v]) => definedEventIds(v.toString('utf8'))).filter(id => /^zin_(afrit|aenor)\./.test(id)));
  assert.deepEqual(definedEventIds('country_event = {\n\tid = zin_x.1\n\toption = { country_event = {\n\t\tid = zin_x.2\n\t} }\n}'), ['zin_x.1'], 'a fired id is no definition');
  const fired = new Set([...all.matchAll(/\b(?:country_event|news_event) = (?:\{\s*id = )?((?:zin_afrit|zin_aenor)\.\d+)/g)].map(m => m[1]));
  for (const tree of ['worshipdom', 'noris', 'stabilo', 'aenor']) {
    const t = readFileSync(path.join(ZIN, 'docs/design/focus', `${tree}.json`), 'utf8');
    for (const m of t.matchAll(/id = ((?:zin_afrit|zin_aenor)\.\d+)/g)) fired.add(m[1]);
  }
  const missing = [...fired].filter(id => !defined.has(id)).sort();
  assert.deepEqual(missing, []);
  for (const n of [20, 31, 32, 60, 61, 62, 70, 71, 72, 73, 74, 75, 76, 77]) assert(defined.has(`zin_afrit.${n}`), `zin_afrit.${n}`);
});

test('SL-28: the pending list no longer carries the Afrit story events', () => {
  const pending = JSON.parse(readFileSync(path.join(here, 'data/pending_names.json'), 'utf8'));
  assert(!pending.owners.some(o => o.id === 'events_afrit'), 'the events_afrit owner is gone');
  assert(!JSON.stringify(pending).includes('"zin_afrit.'), 'no zin_afrit id is pending');
});

test('Checkpoint events list their non-committal option first and carry a historical option (E2, C9)', () => {
  for (const s of sets) for (const e of s.events.filter(x => x.checkpoint !== undefined)) {
    assert(!e.options[0].hist, `${s.namespace}.${e.id}`);
    assert(e.options.some(o => o.hist), `${s.namespace}.${e.id}`);
  }
  const cps = sets.flatMap(s => s.events.filter(e => e.checkpoint !== undefined).map(e => e.id));
  assert.deepEqual(cps.sort((a, b) => a - b), [15, 20, 31, 33, 51]);
});

test('Negative: the checks catch a historical first option, a gated picture, a hub picture on a public event and the secret in public text', async () => {
  const bad = [{ namespace: 'zin_afrit', events: [
    { id: 900, kind: 'country', checkpoint: 1, title: 'T', desc: 'D', picture: 'unmasking', fired_by: 'x', options: [{ text: 'A', hist: true, ai: 1 }, { text: 'B', ai: 1 }] },
    { id: 901, kind: 'news', title: 'T', desc: 'D', picture: 'council_chamber', fired_by: 'x', options: [{ text: 'A', ai: 1 }] },
    { id: 902, kind: 'news', title: 'Afrit Is Here', desc: 'Eindil came, and Kusven.', picture: 'generic_court', fired_by: 'x', options: [{ text: 'A', ai: 1 }] },
  ] }];
  const s = structureProblems(bad, pictures).join('\n');
  assert.match(s, /zin_afrit.900: a checkpoint event lists its non-committal option first/);
  assert.match(s, /zin_afrit.900: picture unmasking is gated on zin_afrit_revealed/);
  assert.match(s, /zin_afrit.901: picture council_chamber is for the hub's private events/);
  const t = (await textProblems(bad)).join('\n');
  assert.match(t, /zin_afrit.902.t: names the secret/);
  assert.match(t, /zin_afrit.902.desc: names the heir before zin_eindil_named/);
  assert.match(t, /zin_afrit.902.desc: a sealed or superseded name \(Kusven\)/);
  assert.deepEqual(structureProblems(sets, pictures), []);
  assert.deepEqual(await textProblems(sets), []);
});

test('The AI weight read from the kneeling chance gives 5 to 95 and its counterpart the rest of a hundred', () => {
  const k = aiFromVariable({ name: 'v' }), r = aiFromVariable({ name: 'v', inverse: true });
  assert.match(k, /^base = 5/); assert.match(r, /^base = 95/);
  assert.equal((k.match(/add = 10/g) ?? []).length, 9); assert.equal((r.match(/add = -10/g) ?? []).length, 9);
});

test('The output is deterministic', async () => {
  const a = await renderMechEvents(sets), b = await renderMechEvents(await loadMechEvents());
  assert.deepEqual([...a.files], [...b.files]);
  assert.deepEqual(a.loc.entries(), b.loc.entries());
});

// ------------------------------------------------------------------------------------------------ the soft-lock fixes
test('SL-04: the crowning event offers the crown, the heir and the wait, and the Council\'s month crowns an AI seat after 30 days', () => {
  const t = strip(text('events/zin_afrit_story.txt'));
  assert(t.includes('zin_afrit_crown_aurevan = yes') && t.includes('zin_afrit_raise_pliant_heir = yes') && t.includes('change_tag_from = ROOT'));
  const fb = block(effects, 'zin_afrit_historical_fallbacks');
  assert.match(fb, /has_country_flag = \{ flag = zin_aenor_faithful_rule days > 30 \}/);
  assert.match(fb, /zin_afrit_crown_aurevan = yes/);
  assert(t.includes('zin_afrit_crown_eronel = yes') && t.includes('zin_afrit_eronel_crowned'), 'the pliant heir is crowned once by the news');
});

test('SL-05, O2: zin_afrit_die is called exactly once, by the news zin_afrit.75, and the palace stages 1 to 4 have defences', () => {
  assert.equal((all.match(/zin_afrit_die = yes/g) ?? []).length, 1);
  const t = strip(text('events/zin_afrit_story.txt'));
  const i = t.indexOf('id = zin_afrit.75');
  assert(i > 0 && t.indexOf('zin_afrit_die = yes') > i && t.indexOf('zin_afrit_die = yes') < t.indexOf('id = zin_afrit.76'));
  for (const n of [1, 2, 3, 4]) assert(t.includes(`set_temp_variable = { zin_arg_stage = ${n} }`), `stage ${n}`);
  assert(t.includes('country_event = { id = zin_eindil.124 }') && t.includes('country_event = { id = zin_eindil.127 }'));
});

test('SL-06: the palace gate reads the Afrit trigger, never a flag of its name', () => {
  assert.match(block(eindilTr, 'zin_eindil_ready_11'), /zin_afrit_holds_parim = yes/);
  assert(!/has_global_flag = zin_afrit_holds_parim/.test(all));
});

test('SL-07, SL-21: the word of the heir reaches the seat after its delay, the voyage has a historical fallback, and Afrit learns of his brother', () => {
  const w = block(effects, 'zin_afrit_word_of_the_heir');
  assert.match(w, /country_event = \{ id = zin_afrit.31 days = zin_wd \}/);
  assert.match(w, /clamp_temp_variable = \{ var = zin_wd min = 10 \}/);
  const fb = block(effects, 'zin_afrit_historical_fallbacks');
  assert.match(fb, /check_variable = \{ global.zin_eindil_stage = 6 \}[\s\S]*zin_afrit_northern_voyage = yes/);
  for (const name of ['zin_afrit_northern_voyage', 'zin_afrit_wound']) assert.match(block(effects, name), /set_global_flag = zin_afrit_knows_brother/);
  assert.match(strip(text('events/zin_afrit_story.txt')), /set_global_flag = zin_afrit_knows_brother/);
});

test('SL-08, SL-30: the per-power rules of Afrit and the Aenor succession are read only through the branch wrappers', () => {
  for (const f of ['common/scripted_effects/zin_afrit.txt', 'common/scripted_triggers/zin_afrit.txt', 'common/decisions/zin_afrit.txt', 'common/scripted_effects/zin_aenor_court.txt', 'events/zin_afrit_story.txt']) {
    assert(!/rule = zin_rule_afrit\b|rule = zin_rule_ai_aenor_succession\b/.test(strip(text(f))), f);
  }
  const tree = readFileSync(path.join(ZIN, 'docs/design/focus/worshipdom.json'), 'utf8');
  assert(!tree.includes('"name":"zin_rule_afrit"'), 'the Worshipdom tree uses the wrappers');
  assert(tree.includes('zin_rules_ai_branch_afrit_historical'));
  assert.match(aenorFx, /zin_rules_ai_branch_aenor_golden_court = yes[\s\S]*zin_rules_ai_branch_aenor_free_dominions = yes[\s\S]*zin_rules_ai_random_aenor = yes/);
});

test('SL-09: the return and Parim dates are read, and stage 12 opens when Afrit is dead, gone or reduced', () => {
  const fb = block(effects, 'zin_afrit_historical_fallbacks');
  for (const d of ['zin_afrit_date_return = yes', 'zin_afrit_date_return_open = yes', 'zin_afrit_date_parim = yes']) assert(fb.includes(d), d);
  assert.match(fb, /zin_afrit_return = yes/); assert.match(fb, /zin_afrit\.61/); assert.match(fb, /zin_afrit\.62/);
  const r = block(triggers, 'zin_afrit_reduced');
  assert.match(r, /flag = zin_afrit_hidden days > 365/); assert.match(r, /global.zin_path_cp24 > 1/); assert.match(r, /zin_afrit_date_reduced = yes/);
  assert.match(block(eindilTr, 'zin_eindil_ready_12'), /zin_afrit_reduced = yes/);
  assert.match(block(aenorFx, 'zin_aenor_crown_eindil'), /set_global_flag = zin_afrit_beyond_the_rift/);
});

test('SL-10: the fall of Afrit\'s realm sends him to a refuge or into hiding, from three hooks', () => {
  const oa = strip(text('common/on_actions/zin_afrit.txt'));
  assert.match(oa, /on_capitulation = \{[\s\S]*zin_afrit_lose_realm = yes/); assert.match(oa, /on_annex = \{[\s\S]*zin_afrit_lose_realm = yes/);
  assert.match(block(effects, 'zin_afrit_monthly'), /NOT = \{ any_country = \{ has_character = zin_aurevan \} \}[\s\S]*zin_afrit_lose_realm = yes/);
  const l = block(effects, 'zin_afrit_lose_realm');
  assert.match(l, /set_global_flag = zin_afrit_hidden/); assert.match(l, /news_event = \{ id = zin_afrit.77 \}/); assert.match(l, /zin_afrit_flee_east = yes/);
});

test('SL-11: no Afrit effect acts on the Worshipdom\'s tag directly; the seat resolves to the hub, his employer or the strongest client', () => {
  for (const name of ['zin_afrit_kneel', 'zin_afrit_return', 'zin_afrit_plot_exposed', 'zin_afrit_begin_palace_battle', 'zin_afrit_palace_roll', 'zin_afrit_wound', 'zin_afrit_claim_middle_lands']) {
    assert(!new RegExp(`\\b${HUB} = \\{ (country_event|news_event|declare_war_on|puppet|give_military_access)`).test(block(effects, name)), name);
  }
  const s = block(effects, 'zin_afrit_resolve_seat');
  assert.match(s, new RegExp(`country_exists = ${HUB}`)); assert.match(s, /has_character = zin_aurevan/); assert.match(s, /zin_afrit_eastern_client/);
  assert.match(block(aenorFx, 'zin_aenor_give_seals'), /event_target:zin_afrit_seat = \{ country_event = \{ id = zin_afrit.20 \} \}/);
  assert.match(block(effects, 'zin_afrit_flee_east'), new RegExp(`release = ${HUB}`));
  assert.match(strip(text('common/on_actions/zin_afrit.txt')), /zin_afrit_pulse_here = yes/);
});

test('SL-18: the denunciation sets the global flag as well as the realm\'s own', async () => {
  const data = await loadWorldData();
  const e82 = eventsOf(data, 'zin_eindil').find(e => e.id === 82);
  assert(e82.options.some(o => o.effects?.includes('@gflag zin_aenor_eindil_denounced') && o.effects.includes('@flag zin_aenor_eindil_denounced')));
  assert(readFileSync(path.join(ZIN, 'docs/design/focus/aenor.json'), 'utf8').includes('{"global_flag":"zin_aenor_eindil_denounced"}'));
});

test('SL-20: the focus flags are read as country flags of any country', () => {
  for (const f of ['zin_gala_great_ship', 'zin_worshipdom_ships_ready', 'zin_worshipdom_hunters']) {
    assert(!all.includes(`has_global_flag = ${f}`), f);
    assert(all.includes(`any_country = { has_country_flag = ${f} }`), f);
  }
});

test('SL-25: the Golden King goes into exile when Aenor falls with him alive; a King without the Council dies naturally', () => {
  assert.match(block(aenorFx, 'zin_aenor_exile_king'), /set_global_flag = zin_golden_king_exiled[\s\S]*news_event = \{ id = zin_aenor.470 \}/);
  const oa = strip(text('common/on_actions/zin_aenor_court.txt'));
  assert.match(oa, /on_capitulation[\s\S]*zin_aenor_exile_king = yes/); assert.match(oa, /on_annex[\s\S]*zin_aenor_exile_king = yes/);
  assert.match(block(aenorFx, 'zin_aenor_tick_death_clock'), /set_global_flag = zin_golden_king_natural/);
  assert(strip(text('events/zin_aenor_successors.txt')).includes('id = zin_aenor.470'));
  const chron = readFileSync(path.join(here, 'data/events_crown_chronicle.json'), 'utf8');
  assert(chron.includes('"!gflag:zin_golden_king_dead", "!gflag:zin_golden_king_exiled"'), 'the Golden Court outcome needs a King who was not exiled');
});

test('SL-31, SL-32: the plot is closed once the King survives, and the flight and the stand in Parim exclude each other', () => {
  assert.match(block(effects, 'zin_afrit_add_plot'), /NOT = \{ has_global_flag = zin_golden_king_survives \}/);
  assert.match(block(effects, 'zin_afrit_flee_east'), /NOT = \{ has_global_flag = zin_afrit_stand_in_parim \}/);
  const tree = readFileSync(path.join(ZIN, 'docs/design/focus/worshipdom.json'), 'utf8');
  const i = tree.indexOf('"key":"parim_shall_not_fall"');
  assert(tree.slice(i, i + 700).includes('{"not":[{"global_flag":"zin_afrit_abandoned_aenor"}]}'));
});

test('SL-33, SL-35, SL-37: the battles have a deadline, the naming without Lorien is told, and the lost heir reaches the league', async () => {
  assert.match(block(eindilFx, 'zin_eindil_battles'), /set_global_flag = zin_eindil_south_unfought/);
  assert.match(block(eindilFx, 'zin_eindil_stage_runner'), /zin_eindil_name_him = yes[\s\S]*news_event = \{ id = zin_eindil.170 \}/);
  assert.match(block(eindilFx, 'zin_eindil_lose_heir'), /zin_ending_heir_lost = yes/);
  const data = await loadWorldData();
  const e170 = eventsOf(data, 'zin_eindil').find(e => e.id === 170);
  assert(e170 && e170.news && e170.named, 'zin_eindil.170 is the world news of the naming');
  assert(!eventsOf(data, 'zin_eindil').find(e => e.id === 140).immediate, 'the league event is left to zin_ending_heir_lost');
  assert.equal(eventsOf(data, 'zin_eindil').find(e => e.id === 101).title, 'The Heir Struck Down');
});

test('The definitions are reported and the module is wired into the build', () => {
  assert.equal(story.definitions.events.length, story.counts.events);
  assert(readFileSync(path.join(here, 'build.mjs'), 'utf8').includes("import('./modules/events_mech.mjs')"));
  assert(afrit.definitions.events.every(id => !story.definitions.events.includes(id)) && aenor.definitions.events.every(id => !story.definitions.events.includes(id)));
});
