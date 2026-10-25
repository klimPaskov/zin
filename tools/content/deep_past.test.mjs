// Tests for the deep past (owner decision K64; modules/deep_past.mjs, lib/deep_past_script.mjs, data/deep_past.json; spec
// docs/specs/04_mechanics/deep_past.md): the six fallen realms' loops, relics, restorations, sites, audiences, achievements, the elder
// technologies, the histories and the loading tips. They build the module (and the technology slice) into one Staged and read the output.
// Run: node --test tools/content/deep_past.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { countryTable } from './lib/roster.mjs';
import { parse } from './lib/clausewitz.mjs';
import { validateHistory, BEFORE_AEN_TEXT } from './lib/history_schema.mjs';
import { buildDeepPast, loadDeepPast, deepPlan, gatedNameProblems, preAenProblems, FILES, SITE_ROWS } from './modules/deep_past.mjs';
import { deepScripts, deepEvents } from './lib/deep_past_script.mjs';
import { buildTechnologies, prepareModel, loadRaw } from './modules/technologies.mjs';
import { checkTips, forbiddenIn } from './modules/presentation.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ZIN = path.resolve(here, '../..');
const countries = countryTable();
const tagOf = name => countries.find(c => c.name === name).tag;
const D = await loadDeepPast();
const staged = new Staged();
const result = await buildDeepPast(staged, { countries });
const text = rel => staged.files.get(rel).toString('utf8');
const strip = t => t.replace(/#.*$/gm, '');
const block = (t, name) => { const i = t.indexOf(`${name} = {`); assert(i >= 0, `${name} is defined`); let d = 0, j = t.indexOf('{', i); for (; j < t.length; j++) { if (t[j] === '{') d++; else if (t[j] === '}' && --d === 0) break; } return t.slice(i, j + 1); };
const scripts = Object.values(FILES).filter(f => f.endsWith('.txt'));
const loc = () => { const out = new Map(); for (const line of text(`localisation/english/zin_deep_past_l_english.yml`).split('\n')) { const m = line.match(/^ ([A-Za-z0-9_.\-]+):\d+ "(.*)"$/); if (m) out.set(m[1], m[2]); } return out; };

test('Every script file parses, balances its braces, uses no <= or >= and every localisation has its BOM', () => {
  for (const rel of scripts) {
    const t = text(rel);
    assert.doesNotThrow(() => parse(t), rel);
    assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, `${rel} braces`);
    assert(!/<=|>=/.test(strip(t)), `${rel} uses an unsupported operator`);
  }
  const b = staged.files.get('localisation/english/zin_deep_past_l_english.yml');
  assert.deepEqual([...b.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
});

test('The module defines the six categories, the restorations, the nine achievements and one event file of its own namespace', () => {
  assert.deepEqual(result.definitions.categories.sort(), ['zin_deep_ice', 'zin_deep_kalioth', 'zin_deep_low_country', 'zin_deep_sea_doors', 'zin_deep_sea_roads', 'zin_deep_two_shores']);
  assert.equal(result.definitions.achievements.length, 9);
  assert.equal(result.definitions.cosmeticTags.length, 6);
  for (const id of ['zin_deep_moot_of_mothers_cur', 'zin_deep_bridge_kingdom', 'zin_deep_kalioth_crown', 'zin_deep_the_sea_roads_ade', 'zin_deep_the_sea_roads_nnd', 'zin_deep_the_sun_crown_cld']) assert(result.definitions.decisions.includes(id), id);
  const ev = text(FILES.events);
  assert.match(ev, /^add_namespace = zin_deep$/m);
  assert(result.definitions.events.length >= 90, `${result.definitions.events.length} events`);
});

test('Every event the module fires is written, and every event has its text', () => {
  const all = [...scripts.map(text), text(FILES.events)].join('\n');
  const defined = new Set(result.definitions.events);
  for (const m of all.matchAll(/zin_deep\.(\d+)/g)) assert(defined.has(`zin_deep.${m[1]}`), `zin_deep.${m[1]}`);
  const L = loc();
  for (const id of defined) { assert(L.has(`${id}.t`), `${id} title`); assert(L.has(`${id}.desc`), `${id} desc`); assert(L.has(`${id}.a`), `${id} first option`); }
});

test('K61: nothing is world news; audiences are the realms involved and their neighbours', () => {
  const all = [...scripts.map(text), text(FILES.events)].map(strip).join('\n');
  assert(!/news_event/.test(all), 'no news event');
  assert(!/major = yes/.test(all), 'no major event');
  // every_country is used only to clear the road's spirits, never to send an event
  for (const m of all.matchAll(/every_country = \{([\s\S]*?)\n\t*\}/g)) assert(!/country_event/.test(m[1]), 'every_country never sends an event');
  assert(/every_neighbor_country = \{\s*country_event = \{ id = zin_deep\.\d+ \}/.test(all), 'neighbours hear by a minor report');
});

test('No whole-world schedule: the on_actions file holds only on_startup, and the monthly block is the story runner\'s', () => {
  const on = strip(text(FILES.onActions));
  const keys = [...on.matchAll(/^\t(on_[a-z_]+) = \{/gm)].map(m => m[1]);
  assert.deepEqual(keys, ['on_startup']);
  assert.match(text(FILES.effects), /^zin_story_tick_deep = \{/m);
  const build = readFileSync(path.join(here, 'build.mjs'), 'utf8');
  assert.match(build, /storyBlocks: \[[^\]]*'deep'\]/, 'zin_story_tick calls the deep block');
});

test('Sites are resolved by rules at the start, never by a state number (the map import renumbers the states)', () => {
  for (const rel of scripts) {
    const t = strip(text(rel));
    assert(!/\bstate = \d+/.test(t), `${rel}: a state number`);
    // a number as a key is a weight of a random list, never a state scope
    const walk = (list, parent) => { for (const e of list) { if (e.k && /^\d+$/.test(e.k)) assert.equal(parent, 'random_list', `${rel}: a numeric state scope ${e.k}`); if (Array.isArray(e.v)) walk(e.v, e.k); } };
    walk(parse(t), null);
  }
  const on = text(FILES.onActions);
  for (const r of SITE_ROWS) assert(on.includes(`zin_deep_site_${r.key}`), `site ${r.key} is resolved at the start`);
  const spec = readFileSync(path.join(ZIN, 'docs/specs/01_map/02_key_sites.md'), 'utf8');
  for (const r of SITE_ROWS) assert(spec.includes(`zin_deep_site_${r.key}`), `site ${r.key} is in the key-sites table`);
});

test('The tags of the plan come from the roster by name; no new tag and six cosmetic identities with their names', () => {
  const P = deepPlan(countries, D);
  for (const [code, name] of Object.entries(D.realms)) assert.equal(P.t[code], tagOf(name), name);
  assert(![...staged.files.keys()].some(k => k.startsWith('common/country_tags/') || k.startsWith('common/countries/')), 'no country file');
  const L = loc();
  for (const k of Object.keys(D.cosmetic)) for (const s of ['', '_DEF', '_ADJ']) assert(L.has(`${k}${s}`), `${k}${s}`);
  const eff = text(FILES.effects) + text(FILES.decisions);
  for (const k of Object.keys(D.cosmetic)) assert(eff.includes(`set_cosmetic_tag = ${k}`), `${k} is set by its ambition`);
});

test('The fallen realms\' own names appear only behind their gates, and no text counts years before Aen', () => {
  const L = Object.fromEntries(loc());
  assert.deepEqual(preAenProblems(L), []);
  // the module's own gate check, run again on the shipped text
  const gated = new Set(deepEvents(D, deepPlan(countries, D)).filter(e => e.gate).map(e => `zin_deep.${e.id}`));
  const allowed = k => /_named$/.test(k) || /^zin_cosmetic_/.test(k) || [...gated].some(id => k.startsWith(`${id}.`)) || /^zin_deep_(moot_of_mothers|bridge_kingdom|kalioth_crown|the_sea_roads)/.test(k);
  assert.deepEqual(gatedNameProblems(L, allowed, D.gatedNames), []);
  // a planted name is caught
  assert.equal(gatedNameProblems({ zin_deep_x: 'The ruins of Muzerar.' }, () => false, D.gatedNames).length, 1);
  // category names: the heir's own word until the gate
  const sloc = text(FILES.sloc);
  for (const n of ['GetDeepLowCountryTitle', 'GetDeepTwoShoresTitle', 'GetDeepKaliothTitle', 'GetDeepSeaDoorsTitle', 'GetDeepSeaRoadsTitle', 'GetDeepIceTitle']) assert(sloc.includes(`name = ${n}`), n);
});

test('Decisions: every AI weight ends with its guards, every cost has a tooltip and the dive opens only in the great tides', () => {
  const dec = strip(text(FILES.decisions));
  for (const id of result.definitions.decisions) {
    const b = block(dec, id), ai = block(b, 'ai_will_do');
    const mods = [...ai.matchAll(/modifier = \{\s*(add|factor) = ([\d.\-]+)/g)].map(m => [m[1], Number(m[2])]);
    const lastAdd = mods.map(([k]) => k).lastIndexOf('add'), firstGuard = mods.findIndex(([k, v]) => k === 'factor' && v === 0);
    if (firstGuard >= 0 && lastAdd >= 0) assert(firstGuard > lastAdd, `${id}: a factor of 0 comes after the additions`);
    if (/complete_effect/.test(b) && /add_equipment_to_stockpile|navy_experience = -|army_experience = -|add_manpower = -|add_fuel = -/.test(b)) assert(/custom_effect_tooltip = /.test(b), `${id} states its costs`);
  }
  const trig = strip(text(FILES.triggers));
  const window = block(trig, 'zin_deep_tide_window');
  assert(window.includes(`[Y].${D.constants.dive_month_a}.1`) && window.includes(`[Y].${D.constants.dive_month_b}.1`), 'the months of the great tides');
  assert(block(dec, 'zin_deep_dive_mothers_mound').includes('zin_deep_tide_window = yes'));
  assert(block(dec, 'zin_deep_ask_cairn_keepers').includes(`has_military_access_to = ${tagOf('Hirolon')}`), 'no army inside the ring');
});

test('The tuning lives in one constants file and the scripts use its numbers', () => {
  const c = text(FILES.constants);
  for (const [k, v] of Object.entries(D.constants)) assert.match(c, new RegExp(`^\\t${k} = ${String(v).replace('.', '\\.')}$`, 'm'), k);
  const dec = strip(text(FILES.decisions));
  assert(block(dec, 'zin_deep_ask_cord_mothers').includes(`cost = ${D.constants.ask_pp}`));
  assert(block(dec, 'zin_deep_open_the_sea_door').includes(`days_remove = ${D.constants.door_days}`));
  assert(block(strip(text(FILES.effects)), 'zin_deep_coalition_weight').includes(`zin_e_w = ${D.constants.coalition_treaty}`));
});

test('The eastern coalition and the Western Crossing call the deep past\'s hooks', () => {
  assert.match(readFileSync(path.join(here, 'modules/mech_east.mjs'), 'utf8'), /zin_deep_coalition_weight = yes\nset_variable = \{ zin_east_coalition_weight = zin_e_w \}/);
  assert.match(readFileSync(path.join(here, 'modules/mech_crossing.mjs'), 'utf8'), /'zin_deep_crossing_banks = yes'/);
  const eff = strip(text(FILES.effects));
  assert(block(eff, 'zin_deep_crossing_banks').includes('zin_deep_two_counts_done = yes'));
});

test('Achievements: nine, possible only from the start, each with its name and description', () => {
  const a = strip(text(FILES.achievements));
  assert.match(a, new RegExp(`^unique_id = ${D.achievementsId}$`, 'm'));
  const L = loc();
  for (const id of Object.keys(D.achievements)) {
    const b = block(a, id);
    assert(b.includes('possible = {') && b.includes('happened = {'), id);
    assert(L.has(`${id}_NAME`) && L.has(`${id}_DESC`), id);
  }
});

test('Elder technologies: six recovered rows, each opened only by its discovery flag and never starting knowledge', async () => {
  const model = await prepareModel({ countries });
  const elder = model.techs.filter(t => t.recovered);
  assert.deepEqual(elder.map(t => t.short).sort(), ['cord_reckoning', 'deep_road_shoring', 'dike_craft', 'kalioth_forge', 'stair_builders_measure', 'sunfields_hull_craft']);
  const sets = new Set(Object.values(text(FILES.effects).match(/zin_deep_recovered_[a-z_]+/g) ?? []).concat(text(FILES.events).match(/zin_deep_recovered_[a-z_]+/g) ?? []));
  for (const t of elder) {
    assert(!t.lost && t.year >= model.costRule.campaignFrom, `${t.short} sits in the campaign years`);
    assert(sets.has(t.recovered.flag), `${t.short}: the deep past sets ${t.recovered.flag}`);
  }
  const st = new Staged();
  await buildTechnologies(st, { countries });
  const files = [...st.files].filter(([k]) => k.startsWith('common/technologies/')).map(([, v]) => v.toString('utf8')).join('\n');
  for (const t of elder) assert(block(files, t.key).includes(`has_country_flag = ${t.recovered.flag}`), `${t.short} allow`);
  const packages = JSON.parse(st.files.get('docs/design/technology/start_packages.json').toString('utf8'));
  const granted = JSON.stringify(packages);
  for (const t of elder) assert(!granted.includes(`"${t.short}"`), `${t.short} is never starting knowledge`);
  // a recovered row outside the campaign years is refused
  const raw = await loadRaw();
  raw.civil.technologies.find(t => t.key === 'cord_reckoning').year = 1700;
  await assert.rejects(prepareModel({ countries }, raw), /elder knowledge sits in the campaign years/);
});

test('Histories: every regional file passes its schema; dates before Aen carry beforeAen and are written only as "long before Aen"', () => {
  const dir = path.join(here, 'data/world/history');
  let before = 0;
  for (const f of readdirSync(dir).filter(n => n.endsWith('.json'))) {
    const h = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
    assert.deepEqual(validateHistory(h), [], f);
    for (const c of h.countries) for (const e of c.events) if (e.beforeAen) { before++; assert.equal(e.year, 0); if ('date' in e) assert.equal(e.date, BEFORE_AEN_TEXT); }
  }
  assert(before >= 10, `${before} entries before Aen`);
  const bad = { version: 1, region: 'x', overview: 'x'.repeat(400), ages: [], countries: [{ name: 'X', canon: 'proposed', founding: { year: 1, story: 'y'.repeat(160) }, dynasties: [{ name: 'D', from: 1, notable: 'n' }], events: [{ name: 'E', year: 5, beforeAen: 300, summary: 'z'.repeat(60), date: '1A 5' }], rivalries: [], capitalReason: 'r', today: 't'.repeat(120), divergence: [] }], cities: [], figures: [], addedCultures: [], addedFaiths: [], lawsAndCustoms: [] };
  const problems = validateHistory(bad).join('\n');
  assert.match(problems, /carries year 0/);
  assert.match(problems, /long before Aen/);
});

test('Loading tips: twelve quotes of the fallen realms after the gameplay tips, none naming a fallen realm', () => {
  const tips = JSON.parse(readFileSync(path.join(here, 'data/loading_tips.json'), 'utf8')).tips;
  assert.equal(tips.length, 202);
  assert.deepEqual(checkTips(tips), []);
  for (const r of tips.slice(190)) { assert.equal(r.kind, 'quote', r.key); assert.match(r.basis, /K64/, r.key); }
  assert.deepEqual(forbiddenIn('The halls of Margorodai'), ['gated: a fallen realm\'s own name']);
});

test('Negative: the module refuses an event fired but not written, and a text that names a fallen realm before its gate', async () => {
  const d1 = structuredClone(D); delete d1.events['36'];
  await assert.rejects(buildDeepPast(new Staged(), { countries, data: d1 }), /zin_deep\.36/);
  const d2 = structuredClone(D); d2.events['1'].d = 'The nets brought up stones from the fields of Muzerar.';
  await assert.rejects(buildDeepPast(new Staged(), { countries, data: d2 }), /names Muzerar before its gate/);
  const d3 = structuredClone(D); d3.events['252'].d = 'The walkers say the hall stood 2,500 years before Aen.';
  await assert.rejects(buildDeepPast(new Staged(), { countries, data: d3 }), /years before Aen/);
});

test('The triggers and effects the trees call are all defined by the module', () => {
  const S = deepScripts(D, deepPlan(countries, D));
  const reg = JSON.parse(readFileSync(path.join(here, 'data/focus_registry.json'), 'utf8'));
  for (const e of reg.scripted_effects.filter(n => n.startsWith('zin_deep_'))) assert(S.E[e], e);
  for (const t of reg.scripted_triggers.filter(n => n.startsWith('zin_deep_'))) assert(S.T[t], t);
  for (const f of readdirSync(path.join(ZIN, 'docs/design/focus')).filter(n => n.endsWith('.json'))) {
    const s = readFileSync(path.join(ZIN, 'docs/design/focus', f), 'utf8');
    for (const m of s.matchAll(/"(?:call|check)":"(zin_deep_[a-z_]+)"/g)) assert(S.E[m[1]] || S.T[m[1]], `${f}: ${m[1]}`);
  }
});
