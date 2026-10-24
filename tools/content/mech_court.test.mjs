// Tests for the three court mechanics: Aenor's Golden Court and succession, Afrit and the Hidden Council, Zol's Mistake
// (docs/specs/04_mechanics/aenor_court_and_succession.md, afrit_hidden_council.md, zols_mistake.md). They build the modules into a
// Staged and check the output against the installed game's documentation, the specs' numbers and the specs' secrecy rules.
// Run: node --test tools/content/mech_court.test.mjs
import test from 'node:test';
import { countryTable } from './lib/roster.mjs';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { ZIN } from './lib/paths.mjs';
import { parse } from './lib/clausewitz.mjs';
import { buildAenor, resolveTags } from './modules/mech_aenor.mjs';
import { buildAfrit, startFootholds } from './modules/mech_afrit.mjs';
import { buildZol } from './modules/mech_zol.mjs';
import { loadJson, paceDate, dateTrigger, secrecyLeaks, wordProblems, unknownCommands, format, dedent, call, takeArgs, Sprites, writeEvent, writeDecision, Loc } from './lib/mech_court_lib.mjs';
import { Panel } from './lib/mech_court_gui.mjs';
import { stanceCode, STANCES } from './lib/mech_aenor_script.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const countries = countryTable();
const ZOL_TAG = countries.find(c => c.key === 'zols_mistake').tag;
const build = async () => {
  const staged = new Staged();
  const aenor = await buildAenor(staged, { countries });
  const afrit = await buildAfrit(staged, { countries });
  const zol = await buildZol(staged, { countries });
  return { staged, aenor, afrit, zol };
};
const { staged, aenor, afrit, zol } = await build();
const text = rel => staged.files.get(rel).toString('utf8');
const files = [...staged.files.keys()];
const scriptFiles = files.filter(f => /\.(txt|gui|gfx)$/.test(f));
const strip = t => t.replace(/#.*$/gm, '');
const allScript = scriptFiles.map(f => strip(text(f))).join('\n');
const locOf = rel => {
  const out = new Map();
  for (const line of text(rel).replace(/^﻿/, '').split('\n').slice(1)) { const m = line.match(/^ ([A-Za-z0-9_.\-']+):0 "(.*)"$/); if (m) out.set(m[1], m[2]); }
  return out;
};
const loc = new Map([...locOf('localisation/english/zin_aenor_court_l_english.yml'), ...locOf('localisation/english/zin_afrit_l_english.yml'), ...locOf('localisation/english/zin_mistake_l_english.yml')]);
const A = await loadJson('mech_aenor.json'), F = await loadJson('mech_afrit.json'), Z = await loadJson('mech_zol.json'), FT = await loadJson('mech_afrit_focus_text.json');

// ------------------------------------------------------------------------------------------------ shape
test('Each module writes its files, and every script file parses with balanced braces, tabs and no unsupported operators', () => {
  for (const f of ['common/scripted_triggers/zin_aenor_court.txt', 'common/scripted_effects/zin_aenor_court.txt', 'common/dynamic_modifiers/zin_aenor_court.txt', 'common/ideas/zin_aenor_court.txt', 'common/decisions/zin_aenor_court.txt', 'common/decisions/categories/zin_aenor_court.txt', 'events/zin_aenor_mechanic.txt', 'common/on_actions/zin_aenor_court.txt', 'common/characters/zin_aenor_court.txt', 'interface/zin_aenor_court.gui', 'common/scripted_guis/zin_aenor_court.txt',
    'common/scripted_triggers/zin_afrit.txt', 'common/scripted_effects/zin_afrit.txt', 'common/scripted_localisation/zin_afrit.txt', 'common/decisions/zin_afrit.txt', 'common/dynamic_modifiers/zin_afrit.txt', 'common/ideas/zin_afrit.txt', 'common/country_leader/zin_afrit_traits.txt', 'common/characters/zin_afrit_council.txt', 'events/zin_afrit_mechanic.txt', 'common/map_modes/zin_footholds.txt', 'interface/zin_afrit_council.gui',
    'common/scripted_triggers/zin_mistake.txt', 'common/scripted_effects/zin_mistake.txt', 'common/ideas/zin_mistake.txt', 'common/dynamic_modifiers/zin_mistake.txt', 'common/decisions/zin_mistake.txt', 'events/zin_mistake_mechanic.txt', 'common/on_actions/zin_mistake.txt', 'common/ai_strategy/zin_mistake.txt', 'interface/zin_zol_presence.gui']) assert(staged.files.has(f), `missing ${f}`);
  for (const f of scriptFiles) {
    const t = strip(text(f));
    assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, `${f}: braces balance`);
    assert(!/^ +\S/m.test(t.replace(/"[^"\n]*"/g, '')), `${f}: tabs, not spaces`);
    assert(!t.includes('\r'), `${f}: LF endings`);
    assert(!/[<>]=|[≥≤]/.test(t.replace(/"[^"\n]*"/g, '')), `${f}: no <= or >=`);
    parse(text(f));
  }
});

test('The output is deterministic: a second build gives the same bytes', async () => {
  const again = await build();
  assert.deepEqual([...again.staged.files.keys()], files);
  for (const [k, v] of staged.files) assert(v.equals(again.staged.files.get(k)), k);
});

test('Counts: what the three modules define', () => {
  assert.equal(aenor.counts.categories, 5);
  assert.equal(aenor.counts.dynamicModifiers, 3);
  assert(aenor.counts.effects >= 50 && aenor.counts.triggers >= 25);
  assert(afrit.counts.effects >= 40 && afrit.counts.twoFace === 62 && afrit.counts.characters === 5);
  assert(zol.counts.effects >= 35 && zol.counts.missions === 1);
});

// ------------------------------------------------------------------------------------------------ vocabulary and references
test('Every effect, trigger and modifier key is in the installed documentation, a control word or an id of this slice', async () => {
  const mine = new Set([...allScript.matchAll(/^\t*([A-Za-z0-9_]+) = \{/gm)].map(m => m[1]));
  const structural = new Set(['alpha', 'blue', 'green', 'red', 'highlighted', 'large', 'expire', 'cost', 'priority', 'rule', 'x', 'y', 'C', 'D', 'F', 'N', 'P', 'S', 'T', 'removal_cost', 'days_remove', 'days_re_enable', 'fire_only_once', 'integer', 'num_owned_states', 'idea_token', 'division_names_group', 'army_intel', 'civilian_intel', 'bonus', 'category', 'uses', 'state_trigger', 'selectable_mission', 'is_good', 'days_mission_timeout', 'can_create_factions', 'can_join_factions', 'can_not_declare_war', 'can_puppet', 'can_send_volunteers', 'can_guarantee_other_ideologies', 'add_namespace', 'hidden', 'is_triggered_only', 'major', 'timeout_days', 'localization_key', 'context_type', 'dirty', 'window_name', 'change_scope', 'entry_container', 'decay']);
  for (const f of scriptFiles.filter(f => f.endsWith('.txt') && !f.startsWith('interface'))) {
    const unknown = (await unknownCommands(text(f), mine)).filter(k => !structural.has(k));
    assert.deepEqual(unknown, [], `${f}: unknown keys`);
  }
});

test('Every scripted effect and trigger called is defined here or listed as another slice\'s (and each external name is written down)', () => {
  const defined = new Set([...aenor.definitions.effects, ...aenor.definitions.triggers, ...afrit.definitions.effects, ...afrit.definitions.triggers, ...zol.definitions.effects, ...zol.definitions.triggers]);
  const external = new Set([...A.external.effects, ...A.external.triggers, ...F.external.effects, ...F.external.triggers, ...Z.external.effects, ...Z.external.triggers]);
  const engineOk = new Set(['zin_rules_is_historical', 'zin_rules_is_free', 'zin_diplo_is_dark_power', 'zin_ui_refresh']);
  const unresolved = new Set();
  for (const m of allScript.matchAll(/\b(zin_[a-z0-9_]+) = (?:yes|no)\b/g)) if (!defined.has(m[1]) && !external.has(m[1]) && !engineOk.has(m[1])) unresolved.add(m[1]);
  assert.deepEqual([...unresolved].sort(), [], 'unresolved scripted names');
});

test('Negative: a call to an unknown scripted effect would be found by the same scan', () => {
  const defined = new Set(aenor.definitions.effects);
  const probe = 'zin_aenor_not_a_real_effect = yes';
  assert(![...probe.matchAll(/\b(zin_[a-z0-9_]+) = yes\b/g)].every(m => defined.has(m[1])));
});

test('Every event id fired or named is one of this slice\'s or one the events specs carry', async () => {
  const mine = new Set([...aenor.definitions.events, ...afrit.definitions.events, ...zol.definitions.events]);
  const others = new Set([...F.external.events, ...A.external.events, ...Z.external.events]);
  const specs = (await Promise.all((await readdir(`${ZIN}/docs/specs/06_events`)).filter(f => f.endsWith('.md')).map(f => readFile(`${ZIN}/docs/specs/06_events/${f}`, 'utf8')))).join('\n') + (await readFile(`${ZIN}/docs/specs/04_mechanics/afrit_hidden_council.md`, 'utf8'));
  const refs = new Set([...allScript.matchAll(/\bid = (zin_(?:aenor|afrit|mistake|reign|eindil|dominion)\.\d+)/g)].map(m => m[1]));
  for (const id of refs) assert(mine.has(id) || others.has(id) || id.startsWith('zin_afrit.') && specs.includes(id.replace('zin_afrit.', '.')) || specs.includes(id), `${id} is neither defined nor listed`);
});

// R5 (one namespace, one builder module) and 06_events/01 ("the texts of the owners' events (zin_aenor.*, zin_afrit.*) go into the owners' modules"):
// the Aenor mechanic writes every zin_aenor event the events specs carry, in its story part (lib/mech_aenor_story.mjs, events/zin_aenor_story.txt).
test('The Aenor mechanic owns the zin_aenor events of 06_events: its story part writes each of them, and nothing else does', async () => {
  const story = new Set(aenor.definitions.storyEvents);
  for (const n of A.storyEvents) assert(story.has(`zin_aenor.${n}`), `zin_aenor.${n} is not written by the story part`);
  const carried = (await Promise.all((await readdir(`${ZIN}/docs/specs/06_events`)).filter(f => f.endsWith('.md')).map(f => readFile(`${ZIN}/docs/specs/06_events/${f}`, 'utf8')))).join('\n');
  const retired = new Set(['zin_aenor.310']);
  for (const [, n] of carried.matchAll(/`zin_aenor\.(\d+)`/g)) if (!retired.has(`zin_aenor.${n}`)) assert(A.storyEvents.includes(Number(n)), `zin_aenor.${n} is carried by 06_events but not in the story list of data/mech_aenor.json`);
  assert.equal(strip(text('events/zin_aenor_story.txt')).match(/^(country|news)_event = \{/gm).length, A.storyEvents.length, 'one event per story id');
  for (const id of story) assert(!afrit.definitions.events.includes(id) && !zol.definitions.events.includes(id));
});

test('Negative: without its story part the Aenor mechanic defines none of the 06_events ids', async () => {
  const bare = await buildAenor(new Staged(), { countries, story: false });
  for (const n of A.storyEvents) assert(!bare.definitions.events.includes(`zin_aenor.${n}`), `zin_aenor.${n}`);
  assert(bare.definitions.events.includes('zin_aenor.1'), 'the mechanic events stay');
});

// The Afrit and Zol story parts (the ids their specs and 06_events carry) are not written yet; they are open items of the integration
// (docs/design/stage2/integration_r3.md, data/pending_names.json). None of them is defined here by accident.
test('The Afrit and Zol story ids of 06_events are not yet defined by these mechanics', () => {
  const mine = new Set([...aenor.definitions.events, ...afrit.definitions.events, ...zol.definitions.events]);
  for (const n of [10, 11, 12, 14, 15, 16, 17, 20, 21, 22, 23, 30, 31, 32, 33, 34, 40, 43, 45, 50, 51, 52, 53, 60, 61, 62, 70, 71, 72, 73, 74, 75, 76, 80]) assert(!mine.has(`zin_afrit.${n}`), `zin_afrit.${n}`);
  for (const n of [2, 10, 11, 12, 16, 17, 20, 21, 22, 23, 24, 25]) assert(!mine.has(`zin_mistake.${n}`), `zin_mistake.${n}`);
  assert(!mine.has('zin_aenor.310') && !mine.has('zin_mistake.15'), 'retired ids');
});

test('Retired names of the contract register appear in no generated file', async () => {
  const reg = await readFile(`${ZIN}/docs/specs/04_mechanics/00_contract_additions.md`, 'utf8');
  const table = reg.slice(reg.indexOf('## Retired names'), reg.indexOf('## Patterns'));
  const retired = [...table.matchAll(/^\| `([a-z0-9_.]+)` \|/gm)].map(m => m[1]);
  assert(retired.length > 30);
  for (const name of retired) {
    const re = new RegExp(`(?<![A-Za-z0-9_.])${name.replace(/\./g, '\\.')}(?![A-Za-z0-9_])`);
    if (name === 'zin_zol' || name.startsWith('zin_regional')) continue;
    assert(!re.test(allScript), `${name} is retired`);
  }
  assert(!/\bcreate_faction = /.test(allScript), 'create_faction is deprecated (E3)');
});

// ------------------------------------------------------------------------------------------------ localisation
test('Every localisation key a script, window or definition names exists, and the file is UTF-8 with BOM in the game\'s shape', () => {
  assert.equal(staged.files.get('localisation/english/zin_aenor_court_l_english.yml')[0], 0xef);
  const missing = new Set();
  const need = k => { if (!loc.has(k)) missing.add(k); };
  // text a window shows, button labels, tooltips, defined_text branches, tooltips of effects and costs
  for (const f of scriptFiles) {
    const t = strip(text(f));
    for (const m of t.matchAll(/\b(?:text|buttonText|pdx_tooltip) = "([A-Za-z0-9_.]+)"/g)) need(m[1]);
    for (const m of t.matchAll(/\b(?:localization_key|custom_cost_text|custom_effect_tooltip) = ([A-Za-z0-9_.]+)/g)) need(m[1]);
    for (const m of t.matchAll(/\b(?:title|desc|name) = (zin_(?:aenor|afrit|mistake)\.\d+\.[a-z0-9]+)\b/g)) need(m[1]);
  }
  // every id defined by a definition file has a name, and an idea, decision, mission or dynamic modifier a description
  for (const d of [aenor.definitions, afrit.definitions, zol.definitions]) {
    for (const id of [...d.ideas, ...d.decisions, ...(d.missions ?? []), ...d.dynamicModifiers, ...d.categories]) { need(id); need(`${id}_desc`); }
    for (const id of d.characters ?? []) need(id);
    for (const t of d.traits ?? []) { need(t); need(`${t}_desc`); }
  }
  assert.deepEqual([...missing].sort(), []);
  for (const [k, v] of loc) assert(!/ō/.test(v), `${k}: ō (S11)`);
});

test('Banned words: every shipped text passes the sweep\'s error rules (the word "Chancellor" is not used)', async () => {
  assert.deepEqual(await wordProblems(Object.fromEntries(loc)), []);
  assert((await wordProblems({ x: 'The tank rolled out of the factory.' })).length >= 2, 'negative: modern words are found');
});

test('The secret: no public key names Afrit, the Hidden Council or the plot; the true faces and hub-private keys may', () => {
  const priv = k => /(_hub|_true|_revealed|_private)(_long)?$/.test(k) || /^zin_name_afrit/.test(k) || /^zin_afrit\.(7|41|42|44|54|91|92)\./.test(k);
  assert.deepEqual(secrecyLeaks(Object.fromEntries(loc), priv), []);
  assert(secrecyLeaks({ 'zin_x.public': 'Afrit rules the court.' }, priv).length === 1, 'negative: a planted leak is found');
  assert(secrecyLeaks({ 'zin_x.public': 'The Hidden Council meets.' }, priv).length === 1);
  assert(secrecyLeaks({ 'zin_x_hub': 'The Hidden Council meets.' }, priv).length === 0);
});

test('Zol: no text names Afrit, the Deliverer or Eindil, a servant, a keeper of Furviatlon or what feeding is', () => {
  for (const [k, v] of locOf('localisation/english/zin_mistake_l_english.yml')) {
    assert(!/Afrit|Deliverer|Eindil|Einendil/.test(v), `${k}: ${v}`);
    assert(!/\b(keeper|administrator|steward) of Furviatlon\b/i.test(v), k);
    assert(!/\b(souls?|worship|sacrifice|blood|prayer)s?\b/i.test(v), `${k}: feeding is never explained`);
    assert(!/ō/.test(v), k);
  }
  assert(![...locOf('localisation/english/zin_mistake_l_english.yml').values()].some(v => /Kusven|Rush /.test(v)));
});

test('The two-face texts: 62 focuses, public faces mask-safe, each description present in both faces', () => {
  assert.equal(afrit.twoFace.length, 62);
  assert.deepEqual(afrit.twoFace.map(f => f.key).sort(), FT.focuses.map(f => f.key).sort(), 'both tables name the same focuses');
  for (const f of afrit.twoFace) {
    for (const part of [f.public, f.publicDesc]) assert(!/Afrit|Hidden Council|demon|murder|poison|plot|Chancellor/i.test(part), `${f.key}: ${part}`);
    assert(f.true && f.trueDesc && f.publicDesc, f.key);
    for (const suffix of ['name_public', 'name_true', 'desc_public', 'desc_true']) assert(loc.has(`zin_wsd_${f.key}_${suffix}`), `${f.key} ${suffix}`);
  }
  assert(/defined_text = \{\s*name = zin_wsd_seat_of_seals_name/.test(text('common/scripted_localisation/zin_afrit.txt')));
  assert(/name = zin_loc_deliverer/.test(text('common/scripted_localisation/zin_afrit.txt')));
  assert.equal(loc.get('zin_loc_deliverer_public'), 'Aurevan the Deliverer');
  assert.equal(loc.get('zin_loc_deliverer_true'), 'Afrit');
});

// ------------------------------------------------------------------------------------------------ Aenor: the numbers
test('Aenor: the 13 chartered dominions (26 seats, K35/K36) resolve to subjects of Aenor, with the loyalty and charter of the spec, and the start values', () => {
  assert.equal(aenor.tags.dominions.length, 13);
  assert.equal(A.dominions.reduce((n, d) => n + d.seats, 0), 26);
  assert.deepEqual(aenor.tags.dominions.map(d => d.tag).sort(), countries.filter(c => c.overlordKey === 'aenor' && c.subjectType === 'chartered dominion').map(c => c.tag).sort());
  const setup = text('events/zin_aenor_mechanic.txt');
  for (const d of aenor.tags.dominions) assert(new RegExp(`${d.tag} = \\{\\s*set_variable = \\{ zin_concord_loyalty = ${d.loyalty} \\}\\s*add_ideas = zin_concord_charter_${d.charter}`).test(setup), d.name);
  assert.deepEqual(A.dominions.filter(d => d.charter === 'golden').map(d => d.name), ['Freshon', 'Pazoma']);
  assert.deepEqual(A.dominions.filter(d => d.charter === 'wall').map(d => d.name), ['Kingson']);
  for (const d of A.dominions) assert(countries.find(c => c.name === d.name)?.states > 0, `${d.name} holds land`);
  for (const [v, n] of [['zin_court_corruption', 70], ['zin_council_influence', 65], ['zin_aenor_lost_cause', 20]]) assert(setup.includes(`set_variable = { ${v} = ${n} }`), v);
  assert(!/zin_lost_cause_member/.test(setup), 'no honorary member at the start (O8)');
  assert(setup.includes('zin_aenor_first_province'), 'first provinces of the Aenor states are stored');
  assert.equal(aenor.provinces, countries.find(c => c.key === 'aenor').states, 'one first province per state of Aenor');
});

test('Aenor: negative - a dominion missing from the roster, or not a subject of Aenor, fails the build', () => {
  const D = structuredClone(A);
  D.dominions.push({ name: 'Nowhere', states: 1, people: 'men', ideology: 'Wild', loyalty: 50, charter: 'old' });
  assert.throws(() => resolveTags(D, countries), /Nowhere is not in the roster/);
  const roster = countries.map(c => c.name === 'Selen' ? { ...c, overlord: null } : c);
  assert.throws(() => resolveTags(A, roster), /Selen is not a subject of Aenor/);
});

test('Aenor: the five charters, the thresholds and the pulse follow the spec', () => {
  const idea = text('common/ideas/zin_aenor_court.txt');
  for (const c of A.charters) assert(idea.includes(`zin_concord_charter_${c.key} = {`), c.key);
  assert(/zin_concord_charter_golden = \{[\s\S]*?cic_to_overlord_factor = 0.1[\s\S]*?political_power_gain = 0.2[\s\S]*?stability_factor = -0.05/.test(idea));
  assert(/zin_aenor_seventeen_centuries = \{[\s\S]*?stability_factor = 0.1[\s\S]*?production_speed_buildings_factor = 0.1/.test(idea));
  const trig = text('common/scripted_triggers/zin_aenor_court.txt');
  assert(/zin_aenor_council_dominant = \{\s*check_variable = \{ var = zin_council_influence value = 70 compare = greater_than_or_equals \}/.test(trig));
  assert(/zin_aenor_court_gilded = \{\s*check_variable = \{ var = zin_court_corruption value = 80 compare = greater_than_or_equals \}/.test(trig));
  assert(/zin_aenor_dominion_defiant = \{\s*check_variable = \{ zin_concord_loyalty < 25 \}/.test(trig));
  const eff = text('common/scripted_effects/zin_aenor_court.txt');
  assert(eff.includes('add_to_variable = { zin_court_corruption = 0.5 }'), 'monthly drift');
  assert(eff.includes('clamp_variable = { var = zin_court_corruption min = 25 max = 100 }'), 'floor while the King lives');
  assert(/zin_aenor_dm_court_pp = 0.01|multiply_variable = \{ zin_aenor_dm_court_pp = 0.01 \}/.test(eff));
  assert(/multiply_variable = \{ zin_aenor_clock_pace = 1.25 \}/.test(eff) && /multiply_variable = \{ zin_aenor_clock_pace = 0.6 \}/.test(eff) && /multiply_variable = \{ zin_aenor_clock_pace = 0.5 \}/.test(eff));
  assert(eff.includes('zin_aenor_start_clock') && /min = 0\s+max = 21/.test(eff));
  assert(eff.includes('country_event = { id = zin_reign.19 days = zin_feast_days }') && eff.includes('news_event = { id = zin_aenor.200 days = zin_death_days }'), 'the feast falls one day before the death');
  assert(!/\bcreate_faction\b/.test(eff) && eff.includes('create_faction_from_template = zin_faction_free_dominions'));
  assert(eff.includes('remove_ideas = {') && eff.includes('zin_shared_concord_dominions_charter_loyalists'), 'a seceding dominion loses the Concord tree spirit');
});

test('Aenor: the death clock is read through the story pace (1.5 times as far when slow)', () => {
  const trig = text('common/scripted_triggers/zin_aenor_court.txt');
  assert(trig.includes('date > 1749.4.30') && trig.includes('date > 1749.11.29') && trig.includes('date > 1749.1.14'), 'death floor at the three paces');
  assert.equal(paceDate('1750.11.1', 1.5), '1752.3.4');
  assert.equal(paceDate('1755.5.1', 1), '1755.5.1');
  assert.equal(paceDate('1748.3.1', 1.5), '1748.3.1');
  assert(dateTrigger('zin_x', '1760.3.1').includes('global.zin_story_pace > 1.25'));
  const eff = text('common/scripted_effects/zin_aenor_court.txt');
  assert(eff.includes('multiply_variable = { zin_aenor_king_clock = zin_pace }') && eff.includes('set_temp_variable_to_random'));
});

test('Aenor: no Aenor civil war may skip the camps rules - risings, limits, silence, the Host gate', () => {
  const eff = text('common/scripted_effects/zin_aenor_court.txt');
  assert(eff.includes('check_variable = { zin_rb < 3 }'), 'at most three breakaways');
  assert(eff.includes('has_capitulated = no'), 'no rising while Aenor is capitulating');
  assert(/zin_aenor_host_available = yes\s*\}\s*set_temp_variable = \{ zin_sz = zin_aenor_camp_host \}/.test(eff), 'the Host rises only when available');
  assert(eff.includes('start_civil_war = {') && eff.includes('keep_unit_leaders_trigger'));
  assert(/ruling_party = (democratic|fascism|communism|neutrality)/.test(eff));
  assert(eff.includes('NOT = { zin_is_site_parim = yes }'), 'Parim never leaves the ruling camp');
  assert(eff.includes('set_popularities'), 'popularities follow the camps');
  assert(eff.includes('remove_ideas = zin_aenor_seventeen_centuries'));
  assert(eff.includes('zin_aenor_crown_eindil') && eff.includes('zin_world_check_endings = yes'));
  const dec = text('common/decisions/zin_aenor_court.txt');
  assert(dec.includes('zin_aenor_silence_dissenters') && dec.includes('fire_only_once = yes'));
  assert(dec.includes('has_completed_focus = zin_aenor_the_kings_tasters') || text('common/decisions/categories/zin_aenor_court.txt').includes('has_completed_focus = zin_aenor_the_kings_tasters'));
});

test('Aenor: the collective leaders invent no relatives; the party names switch on the reveal', () => {
  const chars = text('common/characters/zin_aenor_court.txt');
  for (const id of ['zin_aenor_golden_regency', 'zin_aenor_concord_speaker', 'zin_aenor_captains_regency']) assert(chars.includes(`${id} = {`), id);
  assert.equal(loc.get('zin_aenor_party_faithful'), 'The Deliverer\'s Faithful');
  assert.equal(loc.get('zin_aenor_party_faithful_revealed'), 'Afrit\'s Supporters');
  const eff = text('common/scripted_effects/zin_aenor_court.txt');
  assert(/limit = \{ has_global_flag = zin_afrit_revealed \}\s*set_party_name = \{\s*ideology = communism/.test(eff));
});

// ------------------------------------------------------------------------------------------------ Afrit
test('Afrit: footholds at the start (R4)', async () => {
  const { loadCountryTable } = await import('./modules/countries.mjs');
  const table = await loadCountryTable(countries, `${ZIN}/docs/design/countries.csv`);
  const economy = JSON.parse(readFileSync(path.join(here, 'data/economy.json'), 'utf8'));
  const f = n => { const c = countries.find(x => x.name === n); return startFootholds(F, c, table.get(c.tag).people, economy.regionByRoster[c.scan]); };
  assert.equal(f('Aenor'), 5);
  assert.equal(f('Selen'), 1);
  assert.equal(f('Konori'), 2);
  assert.equal(f('Kilinti'), 1);
  assert.equal(f('Hirolon'), 0, 'Hirolon is sovereign (K35), so the row of the non-human dominions does not reach it');
  assert.equal(f('Fotan'), 1);
  assert.equal(f('Cursed Lands'), 0);
  assert.equal(f('Bloody Forest'), 0);
  for (const n of ['Alerhia', 'Erco', 'Plutondo', 'Miaed', 'Noris', 'Stabilo']) assert.equal(f(n), 3, n);
  assert.equal(f('Lerendor'), 2);
  assert.equal(f('Dondor'), 2);
  assert.equal(f('Mirolon'), 1);
  // Puvulan holds Volgan's seat, Khorvrath the Demon realm's, Zol's Mistake Zol's, Gala the Gala Elves' (roster of 24 October 2026).
  for (const n of ['Puvulan', 'Khorvrath', 'Dolon', 'Nezer', "Zol's Mistake", 'Yeldenne']) assert.equal(f(n), 0, n);
  assert.equal(f('Gala'), 1);
  assert.equal(f('Goldoroth'), 0, 'orc realms of the Dark Lands start at 0');
  assert(afrit.footholds > 100, 'the start table gives many countries a House');
});

test('Afrit: start values, seats, the Veil and the artifacts', () => {
  const eff = text('common/scripted_effects/zin_afrit.txt');
  for (const line of ['set_variable = { global.zin_afrit_veil = 80 }', 'set_variable = { global.zin_afrit_regicide_plot = 20 }', 'set_variable = { global.zin_afrit_artifacts = 4 }', 'set_variable = { global.zin_afrit_seat_seals = 3 }', 'set_variable = { global.zin_afrit_seat_censers = 2 }', 'set_variable = { global.zin_afrit_seat_whispers = 1 }', 'set_variable = { global.zin_afrit_seat_relics = 2 }']) assert(eff.includes(line), line);
  const ev = text('events/zin_afrit_mechanic.txt');
  assert(ev.includes('add_ideas = zin_worshipdom_temple_state') && ev.includes('"Hermitage Guard"') && ev.includes('recruit_character = zin_ilvane'));
  assert(!ev.includes('recruit_character = zin_sevrin'), 'Sevrin is hidden at the start');
});

test('Afrit: every effect hides its work and shows one mask-safe tooltip; the secret gates the Veil', () => {
  const eff = parse(text('common/scripted_effects/zin_afrit.txt'));
  const mustHide = ['zin_afrit_add_footholds', 'zin_afrit_spread_footholds', 'zin_afrit_raise_seat', 'zin_afrit_attune_artifact', 'zin_afrit_ready_regicide', 'zin_afrit_plot_exposed', 'zin_afrit_crown_aurevan', 'zin_afrit_wound', 'zin_afrit_reveal', 'zin_afrit_flee_east', 'zin_afrit_die', 'zin_afrit_purge_houses', 'zin_afrit_return', 'zin_afrit_lose_artifact'];
  for (const n of mustHide) {
    const body = eff.find(e => e.k === n)?.v;
    assert(body, n);
    assert(body.some(e => e.k === 'hidden_effect') || n === 'zin_afrit_reveal', `${n} hides its work`);
    assert(JSON.stringify(body).includes('custom_effect_tooltip'), `${n} shows a tooltip`);
  }
  const t = text('common/scripted_effects/zin_afrit.txt');
  assert(t.includes('limit = { zin_afrit_secret_kept = yes }'), 'the Veil moves only while secret');
  assert(t.includes('zin_afrit_reveal = yes'));
  for (const [k, v] of locOf('localisation/english/zin_afrit_l_english.yml')) if (/^zin_afrit_tt_/.test(k)) assert(!/Afrit|Council|plot|demon/i.test(v), k);
});

test('Afrit: the reveal runs once and the first draft\'s names are gone (N3, N12, N16)', () => {
  const t = text('common/scripted_effects/zin_afrit.txt');
  const reveal = t.slice(t.indexOf('zin_afrit_reveal = {'), t.indexOf('zin_afrit_reveal = {') + 400);
  assert(reveal.includes('limit = { zin_afrit_secret_kept = yes }'), 'once');
  assert(!/zin_afrit_regicide_exposed|zin_afrit_is_secret|zin_afrit_name\b/.test(allScript));
  assert(/zin_afrit_is_hub = \{\s*original_tag = /.test(text('common/scripted_triggers/zin_afrit.txt')));
  assert(/zin_afrit_rules_here = \{\s*has_country_leader = \{ character = zin_aurevan \}/.test(text('common/scripted_triggers/zin_afrit.txt')), 'the stand-in triggers are defined for real');
});

test('Afrit: the palace rolls follow the table and the death is called once', () => {
  const t = text('common/scripted_effects/zin_afrit.txt');
  for (const s of F.palace) assert(t.includes(`set_temp_variable = { zin_pc = ${s.base} }`), `stage ${s.stage}`);
  assert(t.includes('clamp_temp_variable = { var = zin_pc min = 5 max = 95 }'));
  assert(t.includes('zin_eindil.124') === false, 'the journey narrates the death through zin_afrit.75, which is not defined here');
  assert.equal((t.match(/zin_afrit_die = yes/g) ?? []).length, 0, 'zin_afrit_die is called by zin_afrit.75 only (O2)');
  assert(t.includes('news_event = { id = zin_afrit.75 }'));
  assert(t.includes('country_event = { id = zin_eindil.120 }') && t.includes('country_event = { id = zin_eindil.121 }') && t.includes('country_event = { id = zin_eindil.123 }'));
});

test('Afrit: the Houses decision is open to every court; the Council category only to the hub', () => {
  const cats = text('common/decisions/categories/zin_afrit.txt');
  assert(/zin_afrit_council = \{[\s\S]*?original_tag = /.test(cats) && /zin_afrit_is_hub = yes/.test(cats));
  assert(/zin_afrit_cat_houses = \{[\s\S]*?zin_footholds > 0/.test(cats));
  const dec = text('common/decisions/zin_afrit.txt');
  for (const id of ['zin_afrit_open_house', 'zin_afrit_hear_confession', 'zin_afrit_call_debt', 'zin_afrit_silence_dissenter', 'zin_afrit_steer_the_court', 'zin_afrit_edict_of_arms', 'zin_afrit_edict_of_the_faithful', 'zin_afrit_edict_of_the_temple_treasury', 'zin_afrit_edict_of_summons', 'zin_afrit_open_famine_stores', 'zin_afrit_draw_on_necklace', 'zin_afrit_send_the_thief', 'zin_afrit_raise_the_faithful', 'zin_afrit_close_houses']) assert(dec.includes(`${id} = {`), id);
  assert(afrit.loc['zin_afrit_council'] === '[ROOT.zin_afrit_council_name]');
});

test('Afrit: the Council\'s people and traits (N10, N13)', () => {
  const chars = text('common/characters/zin_afrit_council.txt');
  for (const id of ['zin_ilvane', 'zin_corvel', 'zin_sevrin', 'zin_kessarion', 'zin_ossar']) assert(chars.includes(`${id} = {`), id);
  assert(!chars.includes('zin_hierarch') && !chars.includes('Aubren'));
  assert(/zin_sevrin = \{[\s\S]*?visible = \{ has_country_flag = zin_afrit_sevrin_guest \}/.test(chars));
  const tr = text('common/country_leader/zin_afrit_traits.txt');
  assert(/zin_trait_deliverer = \{[\s\S]*?political_power_gain = 0.25[\s\S]*?stability_factor = 0.05/.test(tr));
  assert(/zin_trait_high_confessor = \{[\s\S]*?party_popularity_stability_factor = 0.1/.test(tr));
});

// ------------------------------------------------------------------------------------------------ Zol
test('Zol: start values, the three bonds, rules and no division, no character file', () => {
  const eff = text('common/scripted_effects/zin_mistake.txt');
  for (const line of ['set_variable = { zin_mistake_power = 35 }', 'set_variable = { zin_zol_bond_great = 1 }', 'set_variable = { zin_zol_bond_lesser = 2 }', 'set_variable = { zin_zol_bond_divine = 1 }', 'set_variable = { zin_zol_fading_pressure = 0.15 }', 'set_variable = { zin_zol_return_rate = 0.6 }']) assert(eff.includes(line), line);
  assert(eff.includes('can_not_declare_war = yes') && eff.includes('can_create_factions = no') && eff.includes('delete_unit = { division_template = "Infantry Division" }'));
  assert(!files.some(f => f.startsWith('common/characters/') && /mistake|zol/.test(f)), 'S4: no character stands for Zol');
  assert(!/zin_zol_host_\d/.test(allScript));
});

test('Zol: the power formula, the lapse, the bane and the return of the fallen follow the spec', () => {
  const eff = text('common/scripted_effects/zin_mistake.txt');
  assert(eff.includes('set_temp_variable = { zin_ch = 0.1 }') && eff.includes('multiply_temp_variable = { zin_t = 0.04 }') && eff.includes('multiply_temp_variable = { zin_t = 0.02 }') && eff.includes('multiply_temp_variable = { zin_t = 0.06 }'));
  assert(eff.includes('multiply_temp_variable = { zin_press = 2 }'), 'weak bonds double the Fading');
  assert(eff.includes('zin_zol_lapse = yes') && eff.includes('zin_zol_unlapse = yes') && /ge|value = 10 compare = greater_than_or_equals/.test(eff));
  assert(eff.includes('casualties_inflicted_by') && eff.includes('thousands > [T]') && eff.includes('zin_has_potent_magic = no'));
  assert(eff.includes('multiply_temp_variable = { zin_gain_m = 50 }') && eff.includes('multiply_temp_variable = { zin_gain_b = 5 }'));
  assert(eff.includes('zin_war_feed_deathless = yes'));
  const ideas = text('common/ideas/zin_mistake.txt');
  assert(/zin_zol_bane = \{[\s\S]*?targeted_modifier = \{[\s\S]*?attack_bonus_against = 0.3[\s\S]*?defense_bonus_against = 0.2/.test(ideas));
  assert(/zin_zol_bane_known = \{[\s\S]*?attack_bonus_against = 0.2/.test(ideas));
  assert(/zin_zol_forewarned = \{[\s\S]*?defense_bonus_against = 0.1/.test(ideas));
});

test('Zol: the rising, the manifestation and the withdrawal', () => {
  const eff = text('common/scripted_effects/zin_mistake.txt');
  assert(eff.includes('set_global_flag = zin_zol_rising') && eff.includes('country_event = { id = zin_mistake.10 }') && eff.includes('news_event = { id = zin_mistake.11 }'));
  assert(eff.includes('set_global_flag = zin_zol_manifested') && eff.includes('add_ideas = zin_zol_form_taken') && eff.includes('activate_mission = zin_zol_the_form_endures') && eff.includes('news_event = { id = zin_mistake.20 }'));
  assert(eff.includes('set_global_flag = zin_zol_withdrawn') && eff.includes('delete_unit = { division_template = "The Presence" }') && eff.includes('white_peace = PREV'));
  assert(!/set_global_flag = zin_horos_sword_broken/.test(allScript), 'only zin_mistake.21 sets the blade flag');
  assert(!/annex_country|\bpuppet = /.test(eff), 'Zol is never annexed or puppeted');
  const trig = text('common/scripted_triggers/zin_mistake.txt');
  for (const n of ['appointed_hour', 'hastened_hour', 'forced_rising', 'forced_rising_early', 'late_manifest', 'greater_hour', 'second_stirring']) assert(trig.includes(`zin_zol_after_${n} = {`), n);
  assert(trig.includes('date > 1755.4.30'), 'the appointed hour at the standard pace');
  const oa = text('common/on_actions/zin_mistake.txt');
  assert(new RegExp(`on_monthly_${ZOL_TAG}`).test(oa) && new RegExp(`on_weekly_${ZOL_TAG}`).test(oa) && oa.includes('on_capitulation_immediate'));
  assert(/zin_mistake_presence = \{[\s\S]*zin_zol_the_form_endures = \{[\s\S]*days_mission_timeout = 63/.test(text('common/decisions/zin_mistake.txt')));
});

test('Zol: the host templates use the warfare slice\'s deathless battalions and its names group', () => {
  const eff = text('common/scripted_effects/zin_mistake.txt');
  assert(eff.includes('name = "The Deathless Host"') && eff.includes('name = "The Presence"') && eff.includes('zin_zol_manifestation'));
  assert(eff.includes('division_names_group = ZIN_HOSTS_ZOL'));
  assert(eff.includes('zin_deathless_equipment') && eff.includes('amount = 1000') && eff.includes('add_manpower = 200'));
  assert(!files.some(f => f.includes('names_divisions')), 'the warfare slice owns the division names');
  assert.equal(zol.provinces > 104, true, 'the first provinces of Zol\'s states and of the Middle Lands states are stored');
});

// ------------------------------------------------------------------------------------------------ interface
test('Panels: three windows inside 620 x 500, each with a close button on Escape, tabs, a launcher and no vanilla layout override', () => {
  for (const [rel, win, flag] of [['interface/zin_aenor_court.gui', 'zin_court_window', 'zin_ui_court_open'], ['interface/zin_afrit_council.gui', 'zin_council_window', 'zin_ui_council_open'], ['interface/zin_zol_presence.gui', 'zin_mistake_window', 'zin_ui_mistake_open']]) {
    const g = text(rel);
    assert(g.includes(`name = "${win}"`) && g.includes('size = { width = 620 height = 500 }'), win);
    assert(g.includes('quadTextureSprite = "GFX_closebutton"') && g.includes('shortcut = "ESCAPE"'), `${win}: close button`);
    assert(g.includes('spriteType = "GFX_zin_frame"'));
    assert(/_button_window"/.test(g));
    for (const m of g.matchAll(/(?:spriteType|quadTextureSprite) = "(GFX_[A-Za-z0-9_]+)"/g)) assert(/^GFX_(zin_frame|zin_button|zin_rule|closebutton|zin_(court|council|mistake)_[a-z_]+)$/.test(m[1]), m[1]);
  }
  assert(!files.some(f => /^interface\/(topbar|countrydecisionview)/.test(f)));
  const sg = text('common/scripted_guis/zin_afrit_council.txt');
  assert(sg.includes('zin_afrit_is_hub = yes') && sg.includes('has_country_flag = zin_ui_council_open') && sg.includes('ai_enabled = { always = no }'), 'the Council window opens for the hub only');
  assert(!/Afrit|Hidden Council/.test(text('common/scripted_guis/zin_afrit_council.txt')));
  assert.equal(loc.get('ZIN_COUNCIL_BUTTON'), 'The Hermitage', 'the launcher wears the public face');
});

test('Panels: every sprite a window or script names is defined in a gfx file of this slice or is a ZIN base sprite', () => {
  const gfx = ['interface/zz_zin_aenor_court.gfx', 'interface/zz_zin_afrit.gfx', 'interface/zz_zin_zol.gfx'].map(f => text(f)).join('\n');
  const defined = new Set([...gfx.matchAll(/name = "(GFX_[A-Za-z0-9_]+)"/g)].map(m => m[1]));
  const base = new Set(['GFX_zin_frame', 'GFX_zin_button', 'GFX_zin_rule', 'GFX_closebutton']);
  const used = new Set([...allScript.matchAll(/\bGFX_[A-Za-z0-9_]+/g)].map(m => m[0]));
  const missing = [...used].filter(s => !defined.has(s) && !base.has(s) && !/^GFX_zin_(evt|news|portrait)_/.test(s));
  assert.deepEqual(missing, []);
  for (const m of gfx.matchAll(/texturefile = "gfx\/interface\/ideas\/zin\/([a-z_0-9]+)\.dds"/g)) assert(m[1].length > 2);
});

test('Panels: every button has a click effect and every gated element a visibility trigger', () => {
  for (const [rel, sgf] of [['interface/zin_aenor_court.gui', 'common/scripted_guis/zin_aenor_court.txt'], ['interface/zin_afrit_council.gui', 'common/scripted_guis/zin_afrit_council.txt'], ['interface/zin_zol_presence.gui', 'common/scripted_guis/zin_zol_presence.txt']]) {
    const g = text(rel), s = text(sgf);
    for (const m of g.matchAll(/buttonType = \{\s*name = "([a-z_0-9]+)"/g)) assert(s.includes(`${m[1]}_click = {`), `${m[1]} has no click effect`);
    for (const m of s.matchAll(/^\t\t([a-z_0-9]+)_visible = \{/gm)) assert(g.includes(`name = "${m[1]}"`), `${m[1]}_visible names no element`);
  }
});

test('Panels: a window cannot be made without a close button (builder check), and a gauge needs its marker sprite', () => {
  const p = new Panel({ prefix: 'zin_x', gui: 'zin_x', window: 'zin_x_window', flag: 'zin_ui_x_open', title: 'X', titleKey: 'ZIN_X_T', launcher: 'X', launcherKey: 'ZIN_X_B', launcherTip: 'x', visible: 'always = yes', launcherVisible: 'always = yes', refresh: 'zin_x_ui_refresh', w: 620, h: 500, tabs: [{ key: 'ZIN_X_TAB', label: 'X' }] });
  p.markerSprite = 'GFX_zin_x_marker';
  p.gauge('g', 1, 100, 'zin_ui_g_x');
  const r = p.render();
  assert(r.gui.includes('shortcut = "ESCAPE"') && r.gui.includes('GFX_zin_x_marker'));
  assert(r.scripted.includes('zin_ui_g_x'), 'the marker slides by its variable');
});

// ------------------------------------------------------------------------------------------------ helpers (negative)
test('Helpers: arguments travel as temporary variables (E1) and stances have numeric codes', () => {
  assert.equal(call('zin_x', { value: 5, camp: 2 }), 'set_temp_variable = { zin_arg_value = 5 }\nset_temp_variable = { zin_arg_camp = 2 }\nzin_x = yes');
  assert(takeArgs('value').includes('clear_variable = zin_arg_value'));
  assert.equal(stanceCode(STANCES[0]), 1);
  assert.throws(() => stanceCode('zin_made_up'), /Unknown stance/);
});

test('Helpers: duplicate localisation, an unknown catalog icon and a non-hidden event with no picture are refused', () => {
  const l = new Loc(); l.set('a', 'One');
  assert.throws(() => l.set('a', 'Two'), /defined twice/);
  assert.throws(() => l.set('b', ''), /Empty/);
  const s = new Sprites(['crown_gold']);
  assert.throws(() => s.use('GFX_x', 'not_in_catalog'), /not in the icon catalog/);
  s.use('GFX_x', 'crown_gold');
  assert.throws(() => s.use('GFX_x', 'crown_gold') && s.use('GFX_x', 'sceptre'), /not in the icon catalog|two pictures/);
  const ev = writeEvent('zin_t', { id: 1, kind: 'country', title: 'T', picture: 'generic_court', desc: 'D', options: [{ key: 'a', text: 'A' }] }, new Loc());
  assert(ev.text.includes('timeout_days = 30') && ev.text.includes('picture = GFX_zin_evt_generic_court') && ev.text.includes('is_triggered_only = yes'));
  const dec = writeDecision({ id: 'zin_t_dec', icon: 'crown_gold', title: 'T', desc: 'D', cost: 5 }, new Loc(), new Sprites(['crown_gold']));
  assert(dec.includes('ai_will_do'), 'every decision carries ai_will_do');
});

test('Helpers: the dedent and format helpers re-indent a script from its braces', () => {
  assert.equal(format(dedent(`
      a = {
        b = { c = 1 }
      d = yes
      }
  `)), 'a = {\n\tb = { c = 1 }\n\td = yes\n}');
});

test('Decisions and events: every decision has ai_will_do; every non-hidden event has a picture, a timeout and options', () => {
  for (const f of ['common/decisions/zin_aenor_court.txt', 'common/decisions/zin_afrit.txt', 'common/decisions/zin_mistake.txt']) {
    const top = parse(text(f));
    for (const cat of top) for (const d of cat.v) if (d.k && Array.isArray(d.v) && !/^zin_zol_the_form_endures$/.test(d.k)) assert(d.v.some(e => e.k === 'ai_will_do'), `${d.k} has ai_will_do`);
  }
  for (const f of ['events/zin_aenor_mechanic.txt', 'events/zin_afrit_mechanic.txt', 'events/zin_mistake_mechanic.txt']) {
    for (const e of parse(text(f)).filter(x => x.k?.endsWith('_event'))) {
      const keys = e.v.map(x => x.k), hidden = keys.includes('hidden');
      assert(keys.includes('option'), 'options');
      if (!hidden) assert(keys.includes('picture') && keys.includes('timeout_days') && keys.includes('title') && keys.includes('desc'), e.v.find(x => x.k === 'id')?.v);
    }
  }
});

test('Pictures: a gated event picture is used only by an event that requires the gate (rule 4 of the icon catalog)', async () => {
  const cells = JSON.parse(readFileSync(path.join(here, 'data/presentation-cells.json'), 'utf8'));
  const gate = new Map(cells.events.filter(e => e.gate && /^zin_/.test(e.gate)).map(e => [e.key, e.gate]));
  const metas = [...aenor.eventMeta, ...afrit.eventMeta, ...zol.eventMeta];
  for (const m of metas) {
    const g = gate.get(m.picture);
    if (g) assert((m.requires ?? []).includes(g), `${m.full} uses ${m.picture}, gated by ${g}`);
    if (m.picture) assert(cells.events.some(e => e.key === m.picture), `${m.full}: ${m.picture}`);
  }
});
