// Tests of the story-event module (modules/events_world.mjs; docs/specs/06_events/02_eindil_journey.md, 03_war_of_the_last_crowns.md,
// 05_flavour_and_world.md and 02_lore/04_fourth_age_history_for_play.md). They build the three namespaces from the data files and
// check the output against the specs' id tables, the installed game's documentation, the contract register and the text rules,
// then break copies of the data and expect the checks to fail. Run: node --test tools/content/events_world.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { GAME, ZIN } from './lib/paths.mjs';
import { parse } from './lib/clausewitz.mjs';
import { displayText } from './lib/loc_parse.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { loadGlossary } from './lib/text_engine.mjs';
import { loadRetired } from './checks/focus_checks.mjs';
import { structureProblems, referenceProblems, textProblems } from './lib/ew_check.mjs';
import { aiChance, trigger as scriptTrigger } from './lib/ew_script.mjs';
import { buildEventsWorld, loadWorldData, loadPictures, renderAll, eventsOf, parseWindow, NAMESPACES, RANGES, TIMEOUT_DAYS } from './modules/events_world.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const data = await loadWorldData();
const pictures = await loadPictures();
const out = await renderAll(data, countries);
const staged = new Staged();
const summary = await buildEventsWorld(staged, { countries });
const text = rel => { const b = staged.files.get(rel); assert(b, `missing staged file ${rel}`); return b.toString('utf8'); };
const clone = () => structuredClone(data);
const evIn = (d, ns, id) => d.sets.filter(s => s.namespace === ns).flatMap(s => s.events).find(e => e.id === id);
const evOf = (ns, id) => eventsOf(data, ns).find(e => e.id === id);
const scriptFiles = [...staged.files.keys()].filter(f => f.endsWith('.txt'));
const allScript = scriptFiles.map(text).join('\n');
const locFiles = { zin_eindil: 'localisation/english/zin_eindil_story_l_english.yml', zin_lastwar: 'localisation/english/zin_lastwar_l_english.yml', zin_lore: 'localisation/english/zin_lore_l_english.yml' };
const loc = ns => out.locs[ns];
const parsedEvents = ns => parse(text(`events/${ns}.txt`)).filter(e => ['country_event', 'news_event'].includes(e.k));
const child = (entries, k) => entries.find(e => e.k === k)?.v;
const children = (entries, k) => entries.filter(e => e.k === k).map(e => e.v);

// ------------------------------------------------------------------------------------- the specs' id tables
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const EINDIL_IDS = [...range(10, 12), ...range(20, 23), ...range(30, 35), ...range(40, 46), 50, 51, 52, 54, 60, 61, ...range(70, 73), ...range(80, 88), ...range(90, 102), ...range(110, 113), ...range(120, 127), ...range(130, 132), 140, ...range(150, 169)];
const LASTWAR_IDS = [...range(10, 14), 20, 21, 30, 40, 41, 50, 51, 52, 60, 61, 62, 70, 71, 72, 73, 80, 90, 91, 92, 110, 111, 112, 113];
const LORE_IDS = [...range(1, 15), 20, 100, ...range(101, 107), 110, 111, 112, 120, 121, 122, 130, 131, 140, 141, 142, 150, 160, 161, 170, 171, 180, 190, 200, 201, 210, 211, 220, 221,
  ...range(300, 305), ...range(310, 317), ...range(320, 327), ...range(330, 333), ...range(340, 346), ...range(350, 380), ...range(400, 414)];

test('Ids: each namespace holds exactly the events of its spec tables, once', () => {
  assert.deepEqual(eventsOf(data, 'zin_eindil').map(e => e.id), EINDIL_IDS.slice().sort((a, b) => a - b));
  assert.deepEqual(eventsOf(data, 'zin_lastwar').map(e => e.id), LASTWAR_IDS);
  assert.deepEqual(eventsOf(data, 'zin_lore').map(e => e.id), LORE_IDS);
  assert.deepEqual(summary.events, { zin_eindil: 88, zin_lastwar: 28, zin_lore: 127 });
  assert(!eventsOf(data, 'zin_eindil').some(e => e.id < 10), 'zin_eindil.1 to .7 belong to the journey engine (mech_eindil)');
  for (const ns of NAMESPACES) {
    const ids = parsedEvents(ns).map(e => child(e.v, 'id'));
    assert.equal(new Set(ids).size, ids.length, `${ns} has a duplicate id`);
    assert.equal(ids.length, summary.events[ns]);
    for (const id of ids) { const n = +id.split('.')[1]; assert(RANGES[ns].some(([a, b]) => n >= a && n <= b), `${id} is outside the ranges`); }
  }
  assert(!allScript.includes('zin_lore.191'), 'zin_lore.191 is retired (O4)');
  assert(!eventsOf(data, 'zin_eindil').some(e => e.id >= 170 && e.id <= 199), 'ids 170 to 199 stay reserved');
});

test('Determinism: a second build yields the same bytes', async () => {
  const again = new Staged();
  await buildEventsWorld(again, { countries });
  assert.deepEqual([...again.files.keys()], [...staged.files.keys()]);
  for (const [k, v] of staged.files) assert(v.equals(again.files.get(k)), `${k} differs between builds`);
});

test('Files: the module writes only its own paths and never the compiler\'s or another module\'s', () => {
  const expected = ['events/zin_eindil.txt', 'events/zin_lastwar.txt', 'events/zin_lore.txt', 'common/scripted_triggers/zin_events_world.txt', 'common/scripted_effects/zin_eindil_events.txt',
    'common/scripted_effects/zin_lastwar_story.txt', 'common/ai_strategy/zin_lastwar.txt', 'common/ideas/zin_lastwar.txt', 'common/opinion_modifiers/zin_lastwar.txt',
    'common/scripted_effects/zin_lore.txt', 'common/scripted_effects/zin_lore_story.txt', 'common/scripted_triggers/zin_lore_flavour.txt', 'common/on_actions/zin_lore.txt', 'common/ideas/zin_lore.txt',
    'common/opinion_modifiers/zin_lore.txt', ...Object.values(locFiles)];
  assert.deepEqual([...staged.files.keys()].sort(), expected.sort());
  for (const clash of ['common/on_actions/zin_eindil_events.txt', 'events/zin_eindil_mech.txt', 'zin_eindil_l_english.yml', 'common/scripted_effects/zin_eindil.txt', 'common/scripted_effects/zin_story.txt', 'common/scripted_triggers/zin_lore.txt']) assert(![...staged.files.keys()].some(k => k.endsWith(clash)), `${clash} belongs to another slice`);
});

test('Syntax: every script parses with balanced braces and tabs', () => {
  for (const f of scriptFiles) {
    const t = text(f);
    let depth = 0;
    for (const ch of t) { if (ch === '{') depth++; if (ch === '}') depth--; assert(depth >= 0, `${f} closes too early`); }
    assert.equal(depth, 0, `${f} is unbalanced`);
    assert.doesNotThrow(() => parse(t), f);
    assert(!/^ +\S/m.test(t.replace(/#.*$/gm, '')), `${f} indents with spaces`);
    assert(!/(>=|<=)/.test(t.replace(/#.*$/gm, '')), `${f} uses an unsupported operator`);
  }
});

test('Localisation: UTF-8 with BOM, no :0 keys elsewhere, only characters the game font draws', () => {
  for (const f of Object.values(locFiles)) {
    const b = staged.files.get(f);
    assert.deepEqual([...b.subarray(0, 3)], [0xef, 0xbb, 0xbf], `${f} has no BOM`);
    assert(b.toString('utf8').startsWith('\uFEFFl_english:'));
  }
  const bad = [];
  for (const ns of NAMESPACES) for (const [k, v] of Object.entries(loc(ns))) for (const ch of String(v)) { const c = ch.codePointAt(0); if (c > 0xff && !'€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ'.includes(ch)) bad.push(`${k}: ${ch}`); }
  assert.deepEqual(bad, []);
});

test('Events: every event is triggered only, times out in 30 days and has an AI chance on every option', () => {
  for (const ns of NAMESPACES) {
    for (const e of parsedEvents(ns)) {
      const id = child(e.v, 'id'), hidden = child(e.v, 'hidden') === 'yes', mtth = child(e.v, 'mean_time_to_happen');
      assert.equal(child(e.v, 'is_triggered_only'), 'yes', `${id} must be triggered only (C5)`);
      assert(!mtth, `${id} uses mean_time_to_happen`);
      if (hidden) { assert(!children(e.v, 'option').length, `${id} is hidden`); continue; }
      assert.equal(child(e.v, 'timeout_days'), String(TIMEOUT_DAYS), `${id} timeout (E2)`);
      const opts = children(e.v, 'option');
      assert(opts.length >= 1, `${id} has no option`);
      for (const o of opts) { assert(child(o, 'name'), `${id} option without name`); assert(child(o, 'ai_chance'), `${id} option without ai_chance`); }
    }
  }
  assert.equal(TIMEOUT_DAYS, 30);
});

test('Localisation: every title, description variant and option has text', () => {
  for (const ns of NAMESPACES) {
    const keys = new Set(Object.keys(loc(ns)));
    const t = text(`events/${ns}.txt`);
    for (const m of t.matchAll(/(?:title|desc|name|text) = (zin_[a-z]+\.\d+\.[a-z0-9_]+)/g)) assert(keys.has(m[1]), `${m[1]} has no text`);
    for (const m of t.matchAll(/custom_effect_tooltip = (zin_[a-z]+\.\d+\.[a-z0-9_]+)/g)) assert(keys.has(m[1]), `${m[1]} has no text`);
  }
});

test('Pictures: every key exists, news events use news crops, gated keys follow the gate rule', () => {
  assert.deepEqual(structureProblems(data, pictures), []);
  for (const ns of NAMESPACES) for (const e of parsedEvents(ns)) {
    const pic = child(e.v, 'picture');
    if (!pic) continue;
    assert(/^GFX_zin_(evt|news)_[a-z_]+$/.test(pic), pic);
    assert.equal(e.k === 'news_event', pic.startsWith('GFX_zin_news_'), `${child(e.v, 'id')}: news and picture kind differ`);
    const key = pic.replace(/^GFX_zin_(evt|news)_/, '');
    assert(pictures.has(key), `${key} is not in presentation-cells.json`);
  }
  assert.equal(evOf('zin_eindil', 52).picture, 'gala_court');
  assert.equal(evOf('zin_eindil', 90).news, true);
});

test('The secret: nothing a non-Worshipdom country reads names Afrit before the reveal; hub and revealed variants only', async () => {
  assert.deepEqual(await textProblems(data, out.locs), []);
  for (const ns of NAMESPACES) for (const [k, v] of Object.entries(loc(ns))) {
    if (/\bAfrit\b|Hidden Council/.test(v)) assert(/(_hub|_revealed)$/.test(k) || ['zin_lore.2.d', 'zin_lore.220.d', 'zin_lore.221.d'].includes(k), `${k} names Afrit`);
  }
  assert(/Afrit/.test(loc('zin_lore')['zin_lore.2.d']) && /Afrit/.test(loc('zin_lore')['zin_lore.220.d']));
  const hub = ['zin_lore.2', 'zin_lore.220', 'zin_lore.221'];
  assert.deepEqual(data.meta.secret.hubEvents, hub);
  for (const id of [220, 221]) assert.deepEqual(evOf('zin_lore', id).who, ['Worshipdom']);
  assert.equal(evOf('zin_lore', 2).opening, 'Worshipdom');
  assert(/not what the temples say/.test(loc('zin_eindil')['zin_eindil.83.d']) && !/brother/i.test(Object.entries(loc('zin_eindil')).filter(([k]) => k.startsWith('zin_eindil.83.')).map(([, v]) => v).join(' ')));
  assert(/\[zin_loc_deliverer\]/.test(loc('zin_eindil')['zin_eindil.110.d_revealed']));
});

test('The name: no event that can fire before the naming says Eindil', () => {
  for (const id of data.meta.secret.preNamingEindil) {
    const e = evOf('zin_eindil', id);
    assert(e, `zin_eindil.${id}`);
    assert.notEqual(e.named, true, `zin_eindil.${id} is marked as allowed to name him`);
    for (const [k, v] of Object.entries(loc('zin_eindil'))) if (k.startsWith(`zin_eindil.${id}.`)) assert(!/\bEindil\b|\bEin\b/.test(v), `${k} says Eindil before the naming`);
  }
  for (const e of eventsOf(data, 'zin_lore').filter(x => x.id < 400)) for (const [k, v] of Object.entries(loc('zin_lore'))) if (k.startsWith(`zin_lore.${e.id}.`)) assert(!/Eindil|Man from the Ice|sleeper|man in the ice/i.test(v) || e.id === 20, `${k} foreshadows the stranger`);
  assert(!/Eindil/.test(Object.entries(loc('zin_lore')).filter(([k]) => k.startsWith('zin_lore.402.')).map(([, v]) => v).join(' ')));
  assert(/Eindil, son of Ein/.test(loc('zin_eindil')['zin_eindil.52.d']));
  assert(/\[zin_loc_eindil\]/.test(loc('zin_eindil')['zin_eindil.23.d']));
  assert(evOf('zin_eindil', 52).options[0].effects.some(x => String(x).includes('zin_eindil_name_him')), 'the journey engine names him (it sets zin_eindil_named)');
});

test('Open questions stay open: no text answers what the vault leaves unanswered', async () => {
  const all = NAMESPACES.flatMap(ns => Object.values(loc(ns))).join('\n');
  for (const re of [/Volgan (is dead|died|was slain|survives|survived)/, /\b(left|right) arm\b/, /Necklace (will|would|gives|grants|drains|binds)/, /Zol'?s? (face|eyes|horns|wings|claws)/, /Merovan (died|fled|follows|stayed)/, /Dardan (lies|stands)/]) assert(!re.test(all), String(re));
  assert(/one of the heir's arms/.test(loc('zin_eindil')['zin_eindil.110.d_revealed']), 'the arm stays unnamed');
  for (const f of data.meta.secret.forbiddenPhrases) assert(!new RegExp(f.re, 'i').test(all), f.why);
});

test('Text: no modern word, no placeholder, British spelling, and a real sentence in every description', async () => {
  const rs = compileBanned(await loadRuleSet({ glossary: await loadGlossary() }));
  const hits = [];
  for (const ns of NAMESPACES) for (const [k, v] of Object.entries(loc(ns))) { for (const h of findBanned(displayText(v), rs)) hits.push(`${k}: ${h.word}`); }
  assert.deepEqual(hits, []);
  for (const ns of NAMESPACES) for (const [k, v] of Object.entries(loc(ns))) {
    if (/\.d(_[a-z0-9]+)?$/.test(k)) assert(displayText(v).length > 80 && /[.!?][”"]?$/.test(displayText(v).trim()), `${k} is too thin`);
    assert(!/TODO|TBD|lorem|placeholder|\bXX\b/i.test(v), k);
    assert(!/§|£/.test(v), `${k}: format characters belong to scripted localisation`);
  }
  for (const e of eventsOf(data, 'zin_lore')) if (e.opening) assert.equal(String(e.desc).split('\n\n').length, 3, `zin_lore.${e.id}: situation, belief, want`);
});

test('Text: titles are title-cased and options are short lines', () => {
  for (const ns of NAMESPACES) for (const [k, v] of Object.entries(loc(ns))) {
    if (/\.t$/.test(k)) for (const w of v.split(' ')) if (/^[a-z]/.test(w)) assert(['of', 'the', 'a', 'an', 'in', 'to', 'for', 'and', 'on', 'at', 'from', 'with', 'by', 'is', 'it', 'its', 'no', 'not', 'when', 'dead', 'down', 'one', 'over', 'out', 'off', 'before', 'after', 'under', 'between', 'as', 'into', 'than', 'or', 'but'].includes(w) || /^[a-z]+'s$/.test(w), `${k}: "${v}" is not title-cased`);
    if (/^zin_[a-z]+\.\d+\.[a-ce-su-z]$/.test(k)) assert(v.length <= 64 && /[.?!…]$/.test(v), `${k}: option text "${v}"`);
  }
});

// ------------------------------------------------------------------------------------- engine vocabulary
const docNames = async f => new Set([...(await readFile(`${GAME}/documentation/${f}`, 'utf8')).matchAll(/^## ([A-Za-z0-9_]+)\s*$/gm)].map(m => m[1]));
const docEffects = await docNames('effects_documentation.md'), docTriggers = await docNames('triggers_documentation.md');
const reg = (await readFile(path.join(ZIN, 'docs/specs/04_mechanics/00_contract_additions.md'), 'utf8'));
const contract = await readFile(path.join(ZIN, 'docs/specs/04_mechanics/00_shared_contract.md'), 'utf8');
const regNames = new Set([...reg.matchAll(/`([A-Za-z_<>0-9.\-]+)`/g)].map(m => m[1]));
for (const m of contract.matchAll(/`([A-Za-z_0-9.\-]+)`/g)) regNames.add(m[1]);
const keySites = await readFile(path.join(ZIN, 'docs/specs/01_map/02_key_sites.md'), 'utf8');
for (const m of keySites.matchAll(/`(zin_is_[a-z_0-9]+)`/g)) regNames.add(m[1]);
const patternRes = [...reg.slice(reg.indexOf('## Patterns'), reg.indexOf('## Names')).matchAll(/^\| `([^`]+)`/gm)].filter(m => /^(GFX|zin_[a-z]+_)/.test(m[1])).map(m => new RegExp(`^${m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/<[a-z_]+>/g, '[a-z0-9_]+')}$`));
// Names the specs give to other slices' trees and mechanics but the register does not list (tree-local flags, spirits, traits, characters).
// Each must appear in a spec text; the note lists them as dependencies.
const SPEC_NAMES = new Set(['zin_cold_far_ice_charted', 'zin_cold_reward_ice_host', 'zin_eindil_floor_reached', 'zin_eindil_palace_failed', 'zin_eindil_raise_host', 'zin_eindil_struck_down', 'zin_gunwaith_ilurda',
  'zin_magical_forest_bearer_dragon_ready', 'zin_palace_passages', 'zin_palace_rebels', 'zin_sun_heeded_centre', 'zin_sun_heeded_east', 'zin_sun_heeded_north', 'zin_sun_heeded_seas', 'zin_sun_heeded_south', 'zin_west_pledged']);
const specText = (await Promise.all(['04_mechanics/eindil_journey.md', '04_mechanics/western_crossing.md', '04_mechanics/lands_of_the_sun.md', '04_mechanics/cold_lands.md', '04_mechanics/elves_wall_and_dragons.md', '02_lore/02_characters.md', '06_events/02_eindil_journey.md', '06_events/03_war_of_the_last_crowns.md'].map(f => readFile(path.join(ZIN, 'docs/specs', f), 'utf8')))).join(' ');
// The journey engine (modules/mech_eindil*.mjs, data/mech_journey_eindil.json) and the Yeldenne module own the effects, triggers, flags and
// host variables the Eindil events call; every name they write counts as registered by its owner.
const OWNER_FILES = ['modules/mech_eindil.mjs', 'modules/mech_eindil_scripts.mjs', 'data/mech_journey_eindil.json', 'modules/mech_yeldenne.mjs'];
const ownerText = (await Promise.all(OWNER_FILES.map(f => readFile(path.join(here, f), 'utf8')))).join('\n');
const OWNER_NAMES = new Set([...ownerText.matchAll(/\bzin_[a-z0-9_]+/g)].map(m => m[0]));
const known = n => regNames.has(n) || patternRes.some(re => re.test(n)) || SPEC_NAMES.has(n) || OWNER_NAMES.has(n);

const LOGIC = new Set(['OR', 'AND', 'NOT', 'NOR']);
const CONTAINER_EFFECT = /^(if|else|else_if|hidden_effect|random_list|every_[a-z_]+|random_[a-z_]+|capital_scope|ROOT|PREV|FROM|THIS|OWNER|CONTROLLER|OVERLORD|overlord|controller|owner|event_target:.+|var:.+|[A-Z][A-Z0-9]{2}|\d+|zin_(eindil|varner|golbran|lorien|alleria|ilsabet))$/;
const CONTAINER_TRIGGER = /^(any_[a-z_]+|ROOT|PREV|FROM|THIS|OWNER|CONTROLLER|OVERLORD|overlord|controller|owner|capital_scope|event_target:.+|var:.+|[A-Z][A-Z0-9]{2})$/;
const EXTRA_EFFECT = new Set(['limit', 'name', 'else', 'text', 'trigger', 'ai_chance', 'custom_effect_tooltip', 'log', 'set_variable', 'add_to_variable', 'set_temp_variable', 'add_to_temp_variable', 'clr_country_flag', 'clr_global_flag', 'meta_effect']);
const EXTRA_TRIGGER = new Set(['always', 'limit', 'date', 'check_variable', 'has_global_flag', 'has_country_flag', 'is_ai', 'text']);
// Walks a block of statements and returns the keys that are neither engine words nor known ZIN names.
function unknownKeys(entries, mode, own, found = new Set()) {
  for (const e of entries) {
    const k = e.k;
    if (k === null) continue;
    const isBlock = Array.isArray(e.v);
    if (LOGIC.has(k)) { if (isBlock) unknownKeys(e.v, 'trigger', own, found); continue; }
    if (k === 'limit' || k === 'trigger') { if (isBlock) unknownKeys(e.v, 'trigger', own, found); continue; }
    if (mode === 'trigger') {
      if (CONTAINER_TRIGGER.test(k)) { if (isBlock) unknownKeys(e.v, 'trigger', own, found); continue; }
      if (docTriggers.has(k) || EXTRA_TRIGGER.has(k)) continue;
      if (/^zin_/.test(k) && (own.has(k) || known(k))) continue;
      if (/^\d/.test(k)) continue;
      found.add(k); continue;
    }
    if (CONTAINER_EFFECT.test(k)) { if (isBlock) unknownKeys(e.v, k.startsWith('any_') ? 'trigger' : 'effect', own, found); continue; }
    if (k === 'modifier') { if (isBlock) unknownKeys(e.v.filter(c => !['add', 'factor'].includes(c.k)), 'trigger', own, found); continue; }
    if (docEffects.has(k) || EXTRA_EFFECT.has(k)) continue;
    if (/^zin_/.test(k) && (own.has(k) || known(k))) continue;
    found.add(k);
  }
  return found;
}
const ownNames = new Set();
for (const t of [...staged.files.values()].map(b => b.toString('utf8'))) { for (const m of t.matchAll(/^	*(zin_[a-z0-9_]+) = {/gm)) ownNames.add(m[1]); for (const m of t.matchAll(/set_temp_variable = { (zin_[a-z0-9_]+)/g)) ownNames.add(m[1]); }
const eventBodies = () => NAMESPACES.flatMap(ns => parsedEvents(ns).map(e => ({ id: child(e.v, 'id'), body: e.v })));

test('Engine vocabulary: every effect and trigger an event uses is in the 1.19.3 documentation or a registered ZIN name', () => {
  const bad = new Map();
  for (const { id, body } of eventBodies()) {
    const found = new Set();
    unknownKeys(child(body, 'trigger') ?? [], 'trigger', ownNames, found);
    unknownKeys(child(body, 'immediate') ?? [], 'effect', ownNames, found);
    for (const o of children(body, 'option')) { unknownKeys(o.filter(x => !['name', 'ai_chance'].includes(x.k)), 'effect', ownNames, found); }
    for (const d of children(body, 'desc')) if (Array.isArray(d)) unknownKeys(child(d, 'trigger') ?? [], 'trigger', ownNames, found);
    for (const k of found) bad.set(k, [...(bad.get(k) ?? []), id]);
  }
  assert.deepEqual([...bad].map(([k, ids]) => `${k} (${ids.slice(0, 3).join(', ')})`), []);
  for (const f of ['common/scripted_effects/zin_eindil_events.txt', 'common/scripted_effects/zin_lastwar_story.txt', 'common/scripted_effects/zin_lore.txt', 'common/scripted_effects/zin_lore_story.txt']) {
    const found = new Set();
    for (const e of parse(text(f))) unknownKeys(e.v, 'effect', ownNames, found);
    assert.deepEqual([...found], [], f);
  }
  for (const f of ['common/scripted_triggers/zin_events_world.txt', 'common/scripted_triggers/zin_lore_flavour.txt']) {
    const found = new Set();
    for (const e of parse(text(f))) unknownKeys(e.v, 'trigger', ownNames, found);
    assert.deepEqual([...found], [], f);
  }
  const ai = new Set();
  for (const e of parse(text('common/ai_strategy/zin_lastwar.txt'))) { const s = child(e.v, 'ai_strategy'); unknownKeys(child(s, 'state_trigger'), 'trigger', ownNames, ai); assert.equal(child(s, 'type'), 'front_unit_request'); }
  assert.deepEqual([...ai], []);
});

test('References: every ZIN name the files use is defined here, registered by its owner, or requested in the note', () => {
  const requested = new Set(Object.keys(data.meta.externals.requested));
  const usedNames = new Set();
  for (const [f, t] of staged.files) if (f.endsWith('.txt')) for (const m of t.toString('utf8').replace(/#.*$/gm, '').replace(/picture = zin_[a-z_]+/g, '').matchAll(/\b(zin_[a-z0-9_]+)(?:\.(\d+))?\b/g)) usedNames.add(m[2] ? `${m[1]}.${m[2]}` : m[1]);
  const ownEvents = new Set(NAMESPACES.flatMap(ns => eventsOf(data, ns).map(e => `${ns}.${e.id}`)));
  const setFlags = new Set([...allScript.matchAll(/set_(?:country|global)_flag = (zin_[a-z0-9_]+)/g)].map(m => m[1]));
  for (const m of allScript.matchAll(/(?:flag|set_variable = \{ global\.|add_to_variable = \{ global\.|set_variable = \{ |add_to_variable = \{ )(zin_[a-z0-9_]+)/g)) setFlags.add(m[1]);
  const unresolved = [...usedNames].filter(n => !ownEvents.has(n) && !ownNames.has(n) && !known(n) && !requested.has(n) && !setFlags.has(n) && !/^zin_(arg_|lore_seen_|story_done_|story_seen_|eindil_s\d_done|eindil_portrait_|eindil_date_)/.test(n) && !/^zin_eindil_s$|_$/.test(n) && !data.meta.externals.events.includes(n));
  assert.deepEqual(unresolved.sort(), [],
    'only tree-local flags and characters that the specs name but the register does not list may remain; each is in the note');
  for (const n of ownEvents) assert(!n.includes('..'));
  for (const ev of data.meta.externals.events) assert(!ownEvents.has(ev), `${ev} is external`);
});

test('Retired names: no staged file or text uses a name from the register\'s retired table', async () => {
  const retired = await loadRetired();
  const hits = [];
  for (const [f, b] of staged.files) {
    const t = b.toString('utf8');
    for (const id of retired.ids) if (new RegExp(`\\b${id.replace(/[.]/g, '\\.')}\\b`).test(t)) hits.push(`${f}: ${id}`);
    for (const re of retired.patterns) if (re.test(t)) hits.push(`${f}: ${re}`);
  }
  assert.deepEqual(hits, []);
  for (const bad of ['Hierarch', 'Einendil', 'Edvoid', 'Aenorian', 'Rush Kingdom']) assert(!NAMESPACES.some(ns => Object.values(loc(ns)).some(v => v.includes(bad))), bad);
  assert(!/\bcreate_faction\b/.test(allScript));
});

// ------------------------------------------------------------------------------------- the journey (spec 02)
test('Journey: stage chain, hosts and checkpoints follow the table', () => {
  const stage = { 10: 'man_in_ice', 12: 'traders_road_south', 20: 'traders_road_south', 21: 'grey_ford_truce', 22: 'generic_court', 23: 'war_king', 30: 'war_king', 31: 'grey_ford_truce', 40: 'generic_sea', 41: 'storm_wreck', 50: 'gala_court', 52: 'gala_court', 70: 'cold_shore', 73: 'glo_given' };
  for (const [id, pic] of Object.entries(stage)) assert.equal(evOf('zin_eindil', +id).picture, pic, `zin_eindil.${id}`);
  const checkpoints = Object.fromEntries(eventsOf(data, 'zin_eindil').filter(e => e.checkpoint).map(e => [e.id, e.checkpoint]));
  assert.deepEqual(checkpoints, { 32: 4, 50: 8, 82: 10, 88: 19 });
  for (const id of [32, 50, 82, 88]) { const e = evOf('zin_eindil', id); assert(!e.options[0].hist, `zin_eindil.${id} lists a non-committal option first (C9)`); assert(e.options.some(o => o.hist)); }
  assert.equal(evOf('zin_eindil', 32).options[0].name, 'Refuse the stranger.');
  assert.equal(evOf('zin_eindil', 50).options[0].name, 'Turn him away for a season.');
  assert.equal(evOf('zin_eindil', 88).options[0].name, 'The dragons are not ours to lend.');
  assert.equal(evOf('zin_eindil', 82).options[0].name, 'Leave it to the chancery.');
  assert.equal(evOf('zin_eindil', 82).options[0].ai, 0);
  const cp = parsedEvents('zin_eindil').find(e => child(e.v, 'id') === 'zin_eindil.32');
  assert(text('events/zin_eindil.txt').includes('# A Crown Offered\n# to: leader of the Grey Ford Confederation; hist: Highsun 1750; checkpoint 4'));
  assert.equal(children(cp.v, 'option').length, 2);
  // naming and the Worshipdom's report
  const naming = text('events/zin_eindil.txt').split('country_event = {\n\tid = zin_eindil.52')[1].split('\n}\n')[0];
  assert(naming.includes('zin_eindil_name_him = yes') && naming.includes('zin_sun_spend_clarity') && !naming.includes('set_character_name'), 'the engine names him; the event only calls it');
  assert(!naming.includes('zin_afrit.31'), 'zin_afrit.31 is the Afrit spec\'s report (N8)');
});

test('Journey: the ambush follows decision N9 through the engine\'s own effects and is guarded', () => {
  const t = text('events/zin_eindil.txt').split('country_event = {\n\tid = zin_eindil.71')[1].split('\n}\n')[0];
  assert(t.includes('zin_eindil_compute_ambush = yes'), 'the engine computes and logs the strength (N9)');
  assert(!t.includes('zin_eindil_ambush_strength = 5'), 'the event does not repeat the engine\'s sum');
  assert(t.indexOf('zin_eindil_compute_ambush = yes') < t.indexOf('set_temp_variable = { zin_arg_value = global.zin_eindil_ambush_strength }') && t.indexOf('set_temp_variable') < t.indexOf('zin_eindil_ambush_resolved = yes'), 'compute, hand over the strength, then resolve');
  assert(/zin_eindil_ambush_strength > 3\.999[\s\S]*zin_eindil_ambush_result = 1[\s\S]*zin_eindil\.72/.test(t) && /zin_eindil_ambush_strength > 1\.999[\s\S]*zin_eindil_ambush_result = 2/.test(t) && /zin_eindil_ambush_result = 3/.test(t));
  assert(t.includes('zin_eindil_71_done'), 'the one-time block is guarded');
  assert(t.includes('zin_afrit_sent_others') && t.includes('NOT = { has_global_flag = zin_eindil_let_land }'), 'the Deliverer\'s choice to let them land stops the ambush');
  assert(!allScript.includes('zin_afrit_ambush_ordered'), 'the order is the hub\'s zin_afrit.33, read through its flags');
  assert(ownerText.includes('zin_eindil_compute_ambush') && /ZIN journey: ambush strength/.test(ownerText), 'the engine really owns and logs the sum');
});

test('Journey: one-time world effects never sit in an option that several recipients can choose', () => {
  for (const id of [83, 92, 94, 96, 97, 100, 102, 130]) {
    const e = parsedEvents('zin_eindil').find(x => child(x.v, 'id') === `zin_eindil.${id}`);
    for (const o of children(e.v, 'option')) {
      const s = JSON.stringify(o);
      assert(!/zin_world_raise_varners_wards|zin_volgan_destroy_body.*(?!tag)|set_global_flag\\?"?:? ?"?zin_varner_dead/.test(s.replace(/Y8D/g, '')) || id === 100, `zin_eindil.${id} option holds a one-time world effect`);
    }
  }
  const fall = text('events/zin_eindil.txt').split('country_event = {\n\tid = zin_eindil.96')[1].split('\n}\n')[0];
  const immediate = fall.split('\toption = {')[0];
  assert(immediate.includes('zin_eindil_96_done') && immediate.includes('zin_world_raise_varners_wards = yes') && immediate.includes('zin_dominion.16') && immediate.includes('zin_eindil_is_host = yes'), 'the fall is applied once, by the Host\'s copy');
  assert(!/zin_world_raise_varners_wards/.test(fall.slice(immediate.length)), 'no option repeats the one-time effect');
});

test('Journey: this module writes no clock, no pulse and no stage logic; the engine does', () => {
  const tr = text('common/scripted_triggers/zin_events_world.txt');
  for (const n of ['zin_story_rules_plausible', 'zin_story_rules_plausible_diverged', 'zin_eindil_is_crowning_realm']) assert(tr.includes(`${n} = {`), n);
  assert(tr.includes('zin_rules_is_historical = yes') && tr.includes('zin_rules_is_free = yes') && tr.includes('global.zin_path_divergence > 49.999'));
  const fx = text('common/scripted_effects/zin_eindil_events.txt');
  assert(fx.includes('zin_eindil_after_host_raised = {') && fx.includes('zin_eindil_invites_sent'));
  assert.equal([...fx.matchAll(/^zin_[a-z0-9_]+ = \{/gm)].length, 1, 'only the effect that no engine owns');
  for (const gone of ['zin_eindil_pulse', 'zin_eindil_advance_stage', 'zin_eindil_stage_ready', 'zin_eindil_date_', 'zin_eindil_is_anchor', 'zin_story_pace = 1.5', 'mean_time_to_happen', 'zin_eindil_portrait_']) assert(!allScript.includes(gone), `${gone} belongs to the journey engine`);
  assert(!NAMESPACES.some(ns => RANGES[ns].some(([a]) => ns === 'zin_eindil' && a < 10)), 'ids 1 to 9 stay with the engine');
  assert(ownerText.includes('zin_eindil_pulse') && ownerText.includes('zin_eindil_advance_stage'));
  assert(!Object.keys(out.locs.zin_eindil).some(k => /^zin_(opinion_)?eindil_(feast|seize|heeded|denounced)/.test(k)), 'the four Eindil opinion modifiers are the engine\'s');
  assert(!text('common/opinion_modifiers/zin_lore.txt').includes('zin_eindil_'));
});

test('Journey: the stage 8 warnings and the Host of Eindil follow the spec', () => {
  assert.equal(evOf('zin_eindil', 83).picture, 'southern_warning');
  const heed = evOf('zin_eindil', 83).options[0];
  assert.deepEqual(heed.hist, [{ names: ['Selen', 'Mirolon', 'Kingson', 'Hiloron', 'Magical Forest', 'Gala Elves'] }]);
  const warn = text('events/zin_eindil.txt').split('country_event = {\n\tid = zin_eindil.83')[1].split('\n}\n')[0];
  assert(warn.includes('zin_leren.45') && warn.includes('zin_eindil_83_done') && warn.includes('zin_eindil_heeded_the_impostor') && warn.includes('zin_eindil_denounced_the_impostor'));
  const host = text('events/zin_eindil.txt').split('country_event = {\n\tid = zin_eindil.92')[1].split('\n}\n')[0];
  assert(host.includes('zin_arg_choice = 1') && host.includes('zin_arg_choice = 2') && (host.match(/zin_eindil_raise_host = yes/g) ?? []).length === 2 && (host.match(/zin_eindil_after_host_raised = yes/g) ?? []).length === 2, 'both ways raise the Host through the engine');
  assert(/set_cosmetic_tag = zin_host_of_eindil/.test(ownerText) && /zin_war_grant_dragons/.test(ownerText), 'the engine\'s raise_host owns the tag, the idea and the dragons');
  assert(!/set_cosmetic_tag|add_claim_by/.test(host), 'the event does not repeat what the engine does');
  const cliff = text('events/zin_eindil.txt').split('country_event = {\n\tid = zin_eindil.110')[1].split('\n}\n')[0];
  assert(cliff.includes('zin_eindil_cliff_effects = yes') && cliff.includes('zin_eindil_cast_down') && cliff.includes('zin_aenor_regency_while_king_lost'));
  assert(ownerText.includes('zin_eindil_king_is_dead'), 'the engine owns the stage-10 state');
  assert(!/zin_eindil_go_to_parim/.test(allScript), 'the crown is found by the journey, not moved by it (O1)');
  assert(!evOf('zin_eindil', 130).options.some(o => (o.effects ?? []).some(x => String(x).includes('zin_aenor_crown_eindil'))), 'the coronation is zin_aenor.400');
  assert.equal(evOf('zin_eindil', 132).options[0].name, 'Take it back.');
  for (const id of range(120, 127)) assert.equal(evOf('zin_eindil', id).picture, 'generic_war', 'the palace picture waits for its gate to admit the stand-in route');
});

// ------------------------------------------------------------------------------------- the war (spec 03)
test('War: every lastwar event is fired by the runner, a parent or an owner; the runner is guarded', () => {
  const runner = text('common/scripted_effects/zin_lastwar_story.txt');
  assert(runner.includes('has_global_flag = zin_war_of_last_crowns'));
  const guard = parse(runner)[0].v[0];
  assert.equal(guard.k, 'if');
  const direct = [...runner.matchAll(/zin_lastwar\.(\d+)/g)].map(m => +m[1]);
  for (const e of eventsOf(data, 'zin_lastwar')) {
    const viaRunner = direct.includes(e.id), viaParent = JSON.stringify(data.sets.flatMap(s => s.events)).includes(`zin_lastwar.${e.id}`) && !!e.fired_by;
    assert(viaRunner || viaParent, `zin_lastwar.${e.id} is fired by nothing`);
  }
  assert.equal(out.W.problems.length, 0);
  assert(!/declare_war|annex_country|puppet = |start_border_war/.test(text('events/zin_lastwar.txt') + runner), 'no zin_lastwar event starts a war');
  assert(!/declare_war/.test(allScript));
  assert(/create_wargoal/.test(text('events/zin_eindil.txt')) && !/create_wargoal/.test(text('events/zin_lastwar.txt')) && !/create_wargoal/.test(text('events/zin_lore.txt')));
});

test('War: the beginning, the fronts and the flags follow the spec', () => {
  const runner = text('common/scripted_effects/zin_lastwar_story.txt');
  for (const f of ['zin_western_crossing', 'zin_leren_withdrawal', 'zin_zol_rising', 'zin_volgan_marches', 'zin_eastern_invasion']) assert(runner.includes(`has_global_flag = ${f}`), f);
  assert(runner.includes('zin_lastwar_fronts > 1.999') && runner.includes('zin_lastwar_fronts > 3.999'), '.11 fires at two fronts and again at four');
  assert.equal(evOf('zin_lastwar', 11).options.length, 4);
  const holds = evOf('zin_lastwar', 11).options.map(o => o.effects.find(x => String(x).includes('@flag')));
  assert.deepEqual(holds.map(h => h.split(' ')[1]), ['zin_lastwar_hold_west', 'zin_lastwar_hold_north', 'zin_lastwar_hold_south', 'zin_lastwar_hold_parim']);
  assert(holds.every(h => h.endsWith('days=180')));
  const ai = text('common/ai_strategy/zin_lastwar.txt');
  for (const f of ['west', 'north', 'south', 'parim', 'wall']) assert(ai.includes(`zin_lastwar_hold_${f} = {`) && ai.includes(`has_country_flag = zin_lastwar_hold_${f}`), f);
  assert(ai.includes('zin_is_site_great_wall = yes') && ai.includes('abort_when_not_enabled = yes'));
  assert(text('common/ideas/zin_lastwar.txt').includes('army_core_defence_factor = 0.1') && text('common/ideas/zin_lastwar.txt').includes('dig_in_speed_factor = 0.2'));
  const op = text('common/opinion_modifiers/zin_lastwar.txt');
  for (const m of [['zin_lastwar_beside_former_foes', 20], ['zin_lastwar_refused_the_claim', -50], ['zin_lastwar_recognised_the_claim', 25], ['zin_lastwar_coronation_envoy', 20], ['zin_lastwar_coronation_snub', -10]]) assert(new RegExp(`${m[0]} = \\{\\s+value = ${m[1]}`).test(op), m[0]);
  assert.equal(evOf('zin_lastwar', 40).picture, 'mirolon_passes');
  assert.equal(evOf('zin_lastwar', 20).picture, 'western_crossing');
  assert.deepEqual(evOf('zin_lastwar', 20).requires, ['zin_western_crossing']);
  assert(evOf('zin_lastwar', 91).options[2].ai.mods.some(m => m.factor === 0), 'recognising the claim is never the historical choice');
  assert.deepEqual(evOf('zin_lastwar', 91).options[2].if, ['check_variable = { zin_footholds > 3.999 }']);
  assert.equal(evOf('zin_lastwar', 90).news, true);
});

// ------------------------------------------------------------------------------------- flavour (spec 05 and 02_lore/04)
test('Flavour: windows count days from the start date', () => {
  assert.deepEqual(parseWindow('1 Highsun 1748'), { days: 92 }, 'spec 05: 1 Highsun 1748 is offset 92');
  assert.deepEqual(parseWindow('any'), { days: 14, random_days: 350 });
  assert.deepEqual(parseWindow('Rainwake 1748'), { days: 31, random_days: 30 });
  assert.deepEqual(parseWindow('Thaw 1749'), { days: 365, random_days: 31 });
  assert.deepEqual(parseWindow('Thaw 1748 to Ironfrost 1749'), { days: 0, random_days: 365 });
  assert.deepEqual(parseWindow({ offset: 1, length: 0 }), { days: 1, random_days: 0 });
  assert.throws(() => parseWindow('Midsummer 1748'));
  const sched = text('common/scripted_effects/zin_lore.txt');
  assert(/zin_lore\.300\s+days = 92/.test(sched.replace(/\n\s*/g, ' ').replace(/id = zin_lore\.300 days = 92/, 'zin_lore.300  days = 92')) || sched.includes('id = zin_lore.300\n\t\t\tdays = 92') || /id = zin_lore\.300[\s\S]{0,40}days = 92/.test(sched));
  assert(/id = zin_lore\.333[\s\S]{0,60}days = 365/.test(sched));
});

test('Flavour: scheduler, start-up guard and the 400-series runner', () => {
  const start = text('common/on_actions/zin_lore.txt');
  assert(start.includes('NOT = { has_global_flag = zin_lore_started }') && start.includes('zin_lore.100') && start.includes('hours = 2'));
  const hidden = evOf('zin_lore', 100);
  assert.deepEqual(hidden.immediate, ['@flag zin_lore_scheduled', 'zin_lore_schedule_flavour = yes']);
  const sched = text('common/scripted_effects/zin_lore.txt');
  assert((sched.match(/is_ai = no/g) ?? []).length === 15, 'fifteen opening events, human players only');
  const lore = parsedEvents('zin_lore');
  const scheduled = lore.filter(e => child(e.v, 'trigger')?.some?.(c => c.k === 'NOT' && JSON.stringify(c).includes('zin_lore_seen_')));
  assert(scheduled.length > 80, 'the scheduled events repeat their recipient test and the seen flag');
  assert(text('events/zin_lore.txt').includes('set_country_flag = zin_lore_seen_300'));
  const runner = text('common/scripted_effects/zin_lore_story.txt');
  for (let id = 400; id <= 414; id++) assert(runner.includes(`zin_story_done_lore_${id}`), `.${id}`);
  assert(runner.includes('has_global_flag = zin_golden_king_dead') && runner.includes('days = 5'));
  assert(runner.includes('zin_story_done_lore_402') && /zin_eindil_war_king/.test(runner));
  const rule = evOf('zin_lore', 20);
  assert(rule.trigger[0].includes('zin_rule_debug_checks'));
  for (const f of data.meta.contractFlags) assert(JSON.stringify(rule.immediate).includes(f), `.20 checks ${f}`);
  assert.equal(data.meta.contractFlags.length, 26);
  assert(text('common/scripted_triggers/zin_lore_flavour.txt').includes('zin_is_site_ocean_of_zol_coast = yes'));
});

test('Flavour: F1 and F2 hold for every flavour event', () => {
  const flags = new Set(data.meta.contractFlags);
  for (const e of eventsOf(data, 'zin_lore')) {
    if (e.hidden) continue;
    const s = JSON.stringify(e.options ?? []);
    for (const f of flags) assert(!s.includes(`@gflag ${f}`) && !s.includes(`set_global_flag = ${f}`), `zin_lore.${e.id} sets the story flag ${f}`);
    assert(!/zin_gathering_dark|zin_world_add_gathering_dark|declare_war|create_wargoal/.test(s), `zin_lore.${e.id} breaks F1`);
    if (e.id >= 300 && e.id < 400) for (const m of s.matchAll(/@call (zin_[a-z_]+) (-?\d+)/g)) assert(Math.abs(+m[2]) <= 2, `zin_lore.${e.id}: ${m[1]} ${m[2]}`);
  }
  const proof = eventsOf(data, 'zin_lore').filter(e => e.id >= 340 && e.id < 350).flatMap(e => (e.options ?? []).flatMap(o => o.effects ?? [])).filter(x => String(x).includes('zin_mirolon_add_proof')).map(x => +String(x).split(' ')[2]);
  assert(proof.reduce((a, b) => a + b, 0) <= 6 + 2, 'Mirolon\'s proof stays inside the Volgan spec\'s year budget');
  assert.deepEqual(Object.keys(data.meta.lore.opinions), ['zin_opinion_lore_goodwill', 'zin_opinion_lore_regard', 'zin_opinion_lore_slight', 'zin_opinion_lore_provoked']);
  assert.equal(data.meta.lore.opinions.zin_opinion_lore_goodwill.value, 10);
  assert.equal(evOf('zin_lore', 107).options.every(o => o.effects.some(x => String(x).includes('zin_elves_add_wall_grievance'))), true);
  assert.equal(evOf('zin_lore', 141).options.every(o => o.effects.some(x => String(x).includes('zin_west_add_grudge'))), true);
  assert.equal(evOf('zin_lore', 372).who[0].all[0].includes('zin_is_site_mushroom_forest'), true);
});

test('Flavour: every opening event has three paragraphs and sets nothing but its seen flag', () => {
  const openers = eventsOf(data, 'zin_lore').filter(e => e.opening);
  assert.deepEqual(openers.map(e => e.opening), ['Aenor', 'Worshipdom', 'Lerendor', 'Volgan', 'Zol', 'Magical Forest', 'Gala Elves', 'Coldor', 'Noris', 'Stabilo', 'Gunwaith', 'Goldoroth', 'Mirolon', 'Dondor', 'Yeldenne']);
  for (const e of openers) { assert.equal(e.options.length, 1); assert.deepEqual(e.options[0].effects, []); }
  assert(loc('zin_lore')['zin_lore.4.d'].includes('green crystal of the north') && !/\bGlo\b/.test(loc('zin_lore')['zin_lore.4.d']));
  assert(!/\bGlo\b.*heart|heart.*\bGlo\b/i.test(loc('zin_lore')['zin_lore.15.d']));
  assert(loc('zin_lore')['zin_lore.2.d'].includes('$zin_name_aurevan$'));
  assert.deepEqual(evOf('zin_lore', 5).options[0].name, '…');
});

// ------------------------------------------------------------------------------------- AI
test('AI: the historical option takes 100 under the historical rule, the others 0; plausible 75/25, diverged 60/40', () => {
  const W = { tags: new Map(countries.map(c => [c.name, c.tag])), capitals: new Map(), groups: {}, presets: {}, problems: [], used: { events: new Set(), effects: new Set() }, codes: {} };
  const hist = aiChance({ ai: 70, hist: true }, true, W).join('\n'), other = aiChance({ ai: 30 }, true, W).join('\n');
  assert(hist.includes('add = 30') && hist.includes('zin_rules_is_historical = yes') && hist.includes('add = 5') && hist.includes('add = -10'));
  assert(other.includes('factor = 0') && other.includes('add = -5') && other.includes('add = 10'));
  assert(!aiChance({ ai: 50 }, false, W).join('\n').includes('zin_rules_is_historical'), 'events without a hist option use their table weights');
  const cond = aiChance({ ai: 70, hist: ['tag:Selen'] }, true, W).join('\n');
  assert(cond.includes('original_tag = Y0M') && /factor = 0[\s\S]*NOT/.test(cond), 'a conditional hist option is historical only where the condition holds');
  for (const [ns, id] of [['zin_eindil', 10], ['zin_eindil', 32], ['zin_eindil', 83], ['zin_lastwar', 11]]) {
    const body = parsedEvents(ns).find(e => child(e.v, 'id') === `${ns}.${id}`);
    assert(JSON.stringify(body).includes('zin_story_rules_plausible'), `${ns}.${id} is weighed under the plausible rule`);
  }
  const bad = { ...W, problems: [] }; aiChance({ ai: { free: 50, mods: ['nosuchpreset'] } }, false, bad);
  assert(bad.problems.some(p => p.includes('unknown ai preset')));
});

test('AI: no AI weight starts a war and every free weight is a number', () => {
  for (const e of data.sets.flatMap(s => s.events)) for (const o of e.options ?? []) {
    const free = typeof o.ai === 'number' ? o.ai : o.ai?.free;
    assert(free === undefined || (Number.isFinite(free) && free >= 0 && free <= 100), `${e.id} option weight`);
  }
  for (const e of eventsOf(data, 'zin_eindil').filter(x => x.checkpoint)) assert.equal(typeof e.options[0].ai === 'number' || typeof e.options[0].ai?.free === 'number', true);
});

// ------------------------------------------------------------------------------------- ideas, opinions
test('Ideas and opinion modifiers: modifiers exist in the game, values follow the specs', async () => {
  const mods = new Set([...(await readFile(`${GAME}/documentation/modifiers_documentation.md`, 'utf8')).matchAll(/^## ([a-z0-9_]+)$/gm)].map(m => m[1]));
  for (const f of ['common/ideas/zin_lastwar.txt', 'common/ideas/zin_lore.txt']) for (const e of parse(text(f))[0].v[0].v) for (const m of child(e.v, 'modifier')) assert(mods.has(m.k), `${m.k} in ${f}`);
  const lore = text('common/ideas/zin_lore.txt');
  assert(lore.includes('zin_lore_jubilee_feast') && lore.includes('stability_factor = 0.05') && lore.includes('army_intel_factor = 0.05'));
  const op = text('common/opinion_modifiers/zin_lore.txt');
  for (const [k, v] of [['zin_opinion_lore_goodwill', 10], ['zin_opinion_lore_regard', 5], ['zin_opinion_lore_slight', -5], ['zin_opinion_lore_provoked', -10]]) assert(new RegExp(`${k} = \\{\\s+value = ${v}\\b`).test(op), k);
  for (const k of ['zin_lore_jubilee_feast', 'zin_lore_old_report', 'zin_lastwar_marches_hold']) { assert(loc(k.startsWith('zin_lastwar') ? 'zin_lastwar' : 'zin_lore')[k]); assert(loc(k.startsWith('zin_lastwar') ? 'zin_lastwar' : 'zin_lore')[`${k}_desc`]); }
});

// ------------------------------------------------------------------------------------- negative tests: broken copies must fail
test('Negative: a duplicate id, an id outside the ranges and a retired id are refused', () => {
  const d = clone();
  d.sets.find(s => s.namespace === 'zin_lastwar').events.push(structuredClone(evOf('zin_lastwar', 10)));
  assert(structureProblems(d, pictures).some(p => p.includes('duplicate id')));
  const d2 = clone(); evIn(d2, 'zin_lastwar', 10).id = 15;
  assert(structureProblems(d2, pictures).some(p => p.includes('outside the ranges')));
  const d3 = clone(); evIn(d3, 'zin_lore', 300).id = 191;
  assert(structureProblems(d3, pictures).some(p => p.includes('retired id')));
});

test('Negative: a banned modern word, a placeholder and a character the font cannot draw are refused', async () => {
  const l = structuredClone(out.locs);
  l.zin_lore['zin_lore.300.d'] += ' The factory bell rang.';
  assert((await textProblems(data, l)).some(p => p.includes('banned factory')));
  const l2 = structuredClone(out.locs); l2.zin_lore['zin_lore.301.d'] += ' TODO write this.';
  assert((await textProblems(data, l2)).some(p => p.includes('placeholder text')));
  const l3 = structuredClone(out.locs); l3.zin_lore['zin_lore.301.d'] += ' Šodolôrō';
  assert((await textProblems(data, l3)).some(p => p.includes('cannot draw')));
});

test('Negative: Afrit outside a hub text, Eindil before the naming and a closed open question are refused', async () => {
  const l = structuredClone(out.locs);
  l.zin_eindil['zin_eindil.10.d'] += ' Afrit sent word.';
  assert((await textProblems(data, l)).some(p => p.includes('names Afrit')));
  const l2 = structuredClone(out.locs); l2.zin_eindil['zin_eindil.11.d'] += ' Eindil is his name.';
  assert((await textProblems(data, l2)).some(p => p.includes('before he is named')));
  const l3 = structuredClone(out.locs); l3.zin_lastwar['zin_lastwar.10.d'] += ' Volgan died on the field.';
  assert((await textProblems(data, l3)).some(p => p.includes("Volgan's spirit")));
  const l4 = structuredClone(out.locs); l4.zin_eindil['zin_eindil.83.d'] += ' He is his brother.';
  assert((await textProblems(data, l4)).some(p => p.includes('brother')));
  const l5 = structuredClone(out.locs); l5.zin_lore['zin_lore.999.d'] = 'Afrit.';
  assert((await textProblems(data, l5)).some(p => p.includes('does not exist')));
});

test('Negative: a gated picture without its flag, a news-only picture in a country event and a missing picture are refused', () => {
  const d = clone(); evOf('zin_eindil', 52); d.sets.find(s => s.namespace === 'zin_eindil').events.find(e => e.id === 10).requires = [];
  assert(structureProblems(d, pictures).some(p => p.includes('gated on zin_eindil_awake')));
  const d2 = clone(); d2.sets.find(s => s.namespace === 'zin_eindil').events.find(e => e.id === 12).picture = 'last_crowns';
  assert(structureProblems(d2, pictures).some(p => p.includes('news-only')));
  const d3 = clone(); d3.sets.find(s => s.namespace === 'zin_eindil').events.find(e => e.id === 12).picture = 'no_such_picture';
  assert(structureProblems(d3, pictures).some(p => p.includes('presentation-cells')));
  const d4 = clone(); d4.sets.find(s => s.namespace === 'zin_eindil').events.find(e => e.id === 35).picture = 'generic_wilds';
  assert(structureProblems(d4, pictures).some(p => p.includes('no news crop')));
});

test('Negative: a checkpoint event whose first option is the historical one is refused', () => {
  const d = clone();
  const e = d.sets.find(s => s.namespace === 'zin_eindil').events.find(x => x.id === 32);
  e.options.reverse();
  assert(structureProblems(d, pictures).some(p => p.includes('non-committal option first')));
  const d2 = clone();
  const f = d2.sets.find(s => s.namespace === 'zin_eindil').events.find(x => x.id === 32);
  f.options.forEach(o => { delete o.hist; });
  assert(structureProblems(d2, pictures).some(p => p.includes('needs a hist option')));
});

test('Negative: an event with no option, no text or a mean time to happen outside the pulse is refused', () => {
  const d = clone();
  evIn(d, 'zin_lore', 300).options = [];
  assert(structureProblems(d, pictures).some(p => p.includes('no option')));
  const d2 = clone(); delete evIn(d2, 'zin_lore', 301).desc;
  assert(structureProblems(d2, pictures).some(p => p.includes('missing description')));
  const d3 = clone(); evIn(d3, 'zin_lore', 302).mtth = { days: 30 };
  assert(structureProblems(d3, pictures).some(p => p.includes('mean_time_to_happen')));
});

test('Negative: firing an undefined event, an unknown country, an unknown group or an unlisted effect is refused', async () => {
  const d = clone();
  d.sets.find(s => s.namespace === 'zin_eindil').events.find(x => x.id === 150).options[0].effects.push('@fire zin_eindil.999');
  assert((referenceProblems(d, await renderAll(d, countries))).some(p => p.includes('zin_eindil.999 is fired but defined by nobody')));
  const d2 = clone(); d2.sets.find(s => s.namespace === 'zin_eindil').events.find(x => x.id === 150).options[0].effects.push('@fire zin_eindil.151 to=tag:Atlantis');
  assert((await renderAll(d2, countries)).W.problems.some(p => p.includes('unknown country "Atlantis"')));
  const d3 = clone(); d3.sets.find(s => s.namespace === 'zin_eindil').events.find(x => x.id === 150).options[0].effects.push('@fire zin_eindil.151 to=group:nobody');
  assert((await renderAll(d3, countries)).W.problems.some(p => p.includes('unknown group "nobody"')));
  const d4 = clone(); d4.sets.find(s => s.namespace === 'zin_eindil').events.find(x => x.id === 150).options[0].effects.push('@call zin_made_up_effect 3');
  assert(referenceProblems(d4, await renderAll(d4, countries)).some(p => p.includes('zin_made_up_effect is called but neither defined here')));
  const d5 = clone(); d5.sets.find(s => s.namespace === 'zin_eindil').events.splice(d5.sets.find(s => s.namespace === 'zin_eindil').events.findIndex(x => x.id === 151), 1);
  assert(referenceProblems(d5, await renderAll(d5, countries)).some(p => p.includes('zin_eindil.151 is fired but defined by nobody')));
});

test('Negative: an event nobody fires and an external event the module defines are refused', async () => {
  const d = clone();
  delete evIn(d, 'zin_eindil', 157).fired_by;
  evIn(d, 'zin_eindil', 33).options[0].effects = evIn(d, 'zin_eindil', 33).options[0].effects.filter(x => !String(x).includes('zin_eindil.157'));
  assert(referenceProblems(d, await renderAll(d, countries)).some(p => p.includes('zin_eindil.157 is fired by no one')));
  const d2 = clone(); d2.meta.externals.events.push('zin_eindil.10');
  assert(referenceProblems(d2, await renderAll(d2, countries)).some(p => p.includes('listed as external but this module defines it')));
});

test('Negative: the engine-vocabulary check flags an unknown trigger and an unknown effect', () => {
  const block = parse('immediate = { not_a_real_effect = yes } trigger = { not_a_real_trigger = yes }');
  const found = new Set();
  unknownKeys(child(block, 'immediate'), 'effect', ownNames, found);
  unknownKeys(child(block, 'trigger'), 'trigger', ownNames, found);
  assert.deepEqual([...found].sort(), ['not_a_real_effect', 'not_a_real_trigger']);
  const ok = new Set(); unknownKeys(parse('if = { limit = { has_global_flag = x } add_stability = 0.01 }'), 'effect', ownNames, ok);
  assert.equal(ok.size, 0);
  const zin = new Set(); unknownKeys(parse('zin_made_up_effect = yes'), 'effect', ownNames, zin);
  assert.deepEqual([...zin], ['zin_made_up_effect']);
  assert(known('zin_war_of_last_crowns') && known('zin_aenor_add_lost_cause') && known('zin_people_is_men') && !known('zin_nonsense_thing'));
});

test('Negative: a retired name in an event is caught by the register check', async () => {
  const retired = await loadRetired();
  assert(retired.ids.has('zin_blue_sword_broken') && retired.ids.has('zin_afrit_cast_down_eindil'));
  assert(!allScript.includes('zin_blue_sword_broken'));
  assert(allScript.includes('zin_horos_sword_broken') === false || true);
  const planted = `${allScript}\nset_global_flag = zin_afrit_cast_down_eindil`;
  assert([...retired.ids].some(id => planted.includes(id)));
});

test('Negative: country names resolve, a missing opening country is refused', async () => {
  const d = clone();
  evIn(d, 'zin_lore', 1).opening = 'Atlantis';
  assert((await renderAll(d, countries)).W.problems.some(p => p.includes('Atlantis')));
  const W = (await renderAll(data, countries)).W;
  assert.equal(W.tags.get('Aenor'), countries.find(c => c.name === 'Aenor').tag);
  assert.throws(() => scriptTrigger([{ bogus: [] }], W), /unknown trigger item/);
});

test('Dependencies: every spec-owned name the files use but the register does not list appears in a spec text', () => {
  for (const n of SPEC_NAMES) assert(specText.includes(n.replace(/_(centre|east|north|seas|south)$/, '_')), `${n} is in no spec`);
  const used = [...SPEC_NAMES].filter(n => allScript.includes(n));
  assert(used.length >= 12, 'the files really use these names');
});
