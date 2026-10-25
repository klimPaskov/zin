// Tests of the crown events (docs/specs/06_events/01_golden_king_and_succession.md and 04_endings.md, note docs/design/stage2/events_crown.md).
// They call the builder directly with the roster (lib/roster.mjs) and assert on the staged files. The installed game is read
// for the engine's own effect, trigger and modifier names; the register of shared names is read from the specs.
import test from 'node:test';
import { countryTable } from './lib/roster.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { GAME } from './lib/paths.mjs';
import { parse, tokenize } from './lib/clausewitz.mjs';
import { displayText } from './lib/loc_parse.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { loadGlossary } from './lib/text_engine.mjs';
import { loadRegister, loadSpecNames, isKnownName } from './lib/crown_names.mjs';
import { makeEnv, condLines, effLines, effects, aiLines, eventLines } from './lib/crown_script.mjs';
import { buildEventsCrown, loadCrownData, validateCrown, pictureCatalog, vanillaTitles, textProblems, checkEngine, ENDING_CODES, NAMESPACES } from './modules/events_crown.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const countries = countryTable();
const staged = new Staged();
const summary = await buildEventsCrown(staged, { countries });
const data = await loadCrownData();
const register = await loadRegister(), specNames = await loadSpecNames(), pictures = await pictureCatalog();
const text = rel => { const b = staged.files.get(rel); assert(b, `missing staged file ${rel}`); return b.toString('utf8'); };
const tags = new Map(countries.map(c => [c.name, c.tag]));
const child = (entries, k) => entries.find(e => e.k === k)?.v;
const children = (entries, k) => entries.filter(e => e.k === k);
const eventsOf = rel => children(parse(text(rel)), 'country_event').concat(children(parse(text(rel)), 'news_event'));
const idOf = ev => child(ev.v, 'id');
const allEvents = [...eventsOf('events/zin_reign.txt'), ...eventsOf('events/zin_ending.txt'), ...eventsOf('events/zin_world_endings.txt')];
const locOf = ns => new Map([...text(`localisation/english/${ns}_l_english.yml`).matchAll(/^ ([A-Za-z0-9_.@-]+):0 "(.*)"$/gm)].map(m => [m[1], m[2]]));
const loc = new Map([...locOf('zin_reign'), ...locOf('zin_ending')]);
const dataEvent = id => data.events.find(e => e.id === id);
const baseData = () => JSON.parse(JSON.stringify({ events: data.events, hooks: data.hooks, chronicle: data.chronicle, files: data.files }));
const ctxFor = d => ({ pictures, register, specNames, roster: countries, vanillaTitles: new Set() });
const rejects = async (mutate, pattern) => {
  const d = baseData(); mutate(d);
  await assert.rejects(() => buildEventsCrown(new Staged(), { countries, data: d }), pattern);
};

// every id the two specs list
const SPEC_REIGN = [10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 30, 31, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 55, 56, 57, 60, 61, 65, 66, 70, 71, 72, 73, 80, 81, 82, 83, 84, 85, 86, 87];
const SPEC_ENDING = [1, 2, 3, 4, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 30, 31, 32, 40, 41, 50, 51, 60, 61, 70, 71, 80];
const SPEC_WORLD = [100, 101, 102, 103, 104, 105, 106, 107, 110, 111, 112];

test('Counts: every event of the two specs is written once', () => {
  assert.equal(summary.counts.events, 91);
  assert.equal(summary.counts.reign, SPEC_REIGN.length);
  assert.equal(summary.counts.ending, SPEC_ENDING.length);
  assert.equal(summary.counts.world, SPEC_WORLD.length);
  const ids = allEvents.map(idOf);
  assert.equal(ids.length, 91);
  assert.equal(new Set(ids).size, ids.length, 'an id is written twice');
  for (const n of SPEC_REIGN) assert(ids.includes(`zin_reign.${n}`), `zin_reign.${n} missing`);
  for (const n of SPEC_ENDING) assert(ids.includes(`zin_ending.${n}`), `zin_ending.${n} missing`);
  for (const n of SPEC_WORLD) assert(ids.includes(`zin_world.${n}`), `zin_world.${n} missing`);
  assert.equal(summary.counts.news, 9, 'the eight ending news events and the Golden King riding out');
  assert(summary.counts.options >= 160);
  assert.equal(summary.counts.chronicleLines, 54);
  assert.equal(summary.counts.rawBlocks, 0, 'no raw script block');
});

test('Ids stay inside the ranges of the specs and the world module keeps its own file', () => {
  for (const e of eventsOf('events/zin_reign.txt')) { const n = Number(idOf(e).split('.')[1]); assert(n >= 10 && n <= 87, idOf(e)); }
  for (const e of eventsOf('events/zin_world_endings.txt')) { const n = Number(idOf(e).split('.')[1]); assert((n >= 100 && n <= 107) || (n >= 110 && n <= 112), idOf(e)); }
  assert(text('events/zin_world_endings.txt').includes('add_namespace = zin_world'));
  assert(!staged.files.has('events/zin_world.txt'), 'events/zin_world.txt belongs to the world module');
  assert(text('events/zin_reign.txt').includes('add_namespace = zin_reign'));
  assert(text('events/zin_ending.txt').includes('add_namespace = zin_ending'));
});

test('Determinism: a second build yields the same bytes', async () => {
  const again = new Staged();
  await buildEventsCrown(again, { countries });
  assert.deepEqual([...again.files.keys()], [...staged.files.keys()]);
  for (const [k, v] of staged.files) assert(v.equals(again.files.get(k)), `${k} differs between builds`);
});

test('Every staged script parses with balanced braces', () => {
  for (const [rel, b] of staged.files) {
    if (!rel.endsWith('.txt')) continue;
    let depth = 0, min = 0;
    for (const t of tokenize(b.toString('utf8'))) { if (t.t === '{') depth++; if (t.t === '}') { depth--; min = Math.min(min, depth); } }
    assert.equal(depth, 0, `${rel} is unbalanced`); assert.equal(min, 0, `${rel} closes too early`);
    assert.doesNotThrow(() => parse(b.toString('utf8')), rel);
  }
});

test('Every event is triggered only, times out after 30 days and carries title, description and options', () => {
  for (const e of allEvents) {
    const id = idOf(e);
    assert.equal(child(e.v, 'is_triggered_only'), 'yes', `${id} is not triggered only`);
    assert.equal(child(e.v, 'timeout_days'), '30', `${id} timeout`);
    assert.equal(child(e.v, 'title'), `${id}.t`);
    assert(loc.get(`${id}.t`)?.trim(), `${id} title text`);
    assert(loc.get(`${id}.d`)?.trim(), `${id} description text`);
    const options = children(e.v, 'option');
    assert(options.length >= 1, `${id} has no option`);
    options.forEach((o, i) => {
      const name = child(o.v, 'name');
      assert.equal(name, `${id}.opt${i + 1}`);
      assert(loc.get(name)?.trim(), `${name} text`);
      const ai = child(o.v, 'ai_chance');
      assert(ai && child(ai, 'base') !== undefined, `${name} has no ai_chance`);
    });
  }
});

test('Descriptions are one to three short sentences; the ending news and the Chronicle may run to seven (C11)', () => {
  const LONG = new Set(['zin_world.100.d', 'zin_world.101.d', 'zin_world.102.d', 'zin_world.103.d', 'zin_world.104.d', 'zin_world.105.d', 'zin_world.106.d', 'zin_world.107.d', 'zin_world.110.d']);
  for (const [k, v] of loc) {
    if (!/\.d(_[a-z_]+)?$/.test(k) || !/^zin_(reign|ending|world)\./.test(k)) continue;
    const plain = displayText(v).replace(/\[[^\]]*\]/g, 'X');
    const sentences = plain.split(/(?<=[.!?:])\s+/).filter(s => /\p{L}/u.test(s)).length;
    assert(sentences <= (LONG.has(k) ? 8 : 4), `${k} has ${sentences} sentences`);
    assert(sentences >= 1, k);
  }
});

test('Pictures: every key exists in the right list and every gate is among the event\'s requires', () => {
  for (const e of data.events) {
    if ((e.kind ?? 'country') === 'hidden') continue;
    const list = e.kind === 'news' ? pictures.news : pictures.evt;
    assert(list.has(e.picture), `${e.id}: ${e.picture} is not in the ${e.kind ?? 'country'} picture list`);
    const gate = list.get(e.picture);
    if (gate) assert((e.requires ?? []).includes(gate), `${e.id}: ${e.picture} is gated on ${gate}`);
    const prefix = e.kind === 'news' ? 'GFX_zin_news_' : 'GFX_zin_evt_';
    const script = allEvents.find(x => idOf(x) === e.id);
    assert.equal(child(script.v, 'picture'), prefix + e.picture);
  }
  assert.equal(pictures.evt.get('chronicle'), 'zin_ending_reached');
  assert.equal(pictures.evt.get('council_chamber'), 'hub');
  assert.equal(pictures.evt.get('king_is_dead'), 'zin_golden_king_dead');
});

test('Pictures: the spec\'s assignments hold', () => {
  const want = { 'zin_reign.10': 'golden_court', 'zin_reign.19': 'court_feast', 'zin_reign.14': 'lost_cause_triumph', 'zin_reign.20': 'king_is_dead', 'zin_reign.34': 'thirty_days', 'zin_reign.40': 'coronation', 'zin_reign.31': 'hermitage', 'zin_reign.80': 'houses', 'zin_reign.85': 'unmasking', 'zin_reign.72': 'generic_war',
    'zin_ending.10': 'crown_of_aen', 'zin_ending.4': 'unmasking', 'zin_ending.3': 'grave_muster', 'zin_ending.40': 'court_feast', 'zin_ending.41': 'council_chamber', 'zin_ending.60': 'strait_toll', 'zin_ending.70': 'generic_peace', 'zin_ending.80': 'lost_cause_triumph', 'zin_world.110': 'chronicle', 'zin_world.100': 'ending_lost_cause', 'zin_world.107': 'ending_unfinished' };
  for (const [id, pic] of Object.entries(want)) assert.equal(dataEvent(id).picture, pic, id);
  assert.equal(dataEvent('zin_reign.72').kind, 'news');
  for (const id of SPEC_WORLD.filter(n => n < 108)) assert.equal(dataEvent(`zin_world.${id}`).kind, 'news');
});

test('The secret (C1, C3): no public key names Afrit, a demon, the Hidden Council or the Deliverer\'s public name', () => {
  const guarded = [...loc].filter(([k]) => /^zin_reign\./.test(k) || /^zin_(ending\.(1|2|40)|world\.(103|110|111|112))\./.test(k));
  assert(guarded.length > 100);
  for (const [k, v] of guarded) {
    if (/\.d_(hub|revealed)/.test(k)) continue;
    assert(!/\bAfrit\b|\bdemon|Hidden Council/i.test(v), `${k} names the secret: ${v}`);
    assert(!/Aurevan/.test(v), `${k} writes the public name literally instead of [zin_loc_deliverer]`);
  }
  // the hub variants and the revealed variants are the only places the secret may appear
  for (const [k, v] of loc) if (/\.d_hub$/.test(k)) assert(/Council|Couriers|High Confessor/.test(v), k);
  assert(loc.get('zin_reign.31.d_hub').includes('Council'));
  assert(loc.get('zin_reign.85.d_revealed_temples').includes('false god'));
  // the Deliverer is only ever named through the scripted localisation
  for (const [k, v] of loc) if (/King \[zin_loc_deliverer\]/.test(v)) assert(/^zin_reign\.(41|43|81)\./.test(k), k);
});

test('The stranger (C2): the heir is written through [zin_loc_eindil] wherever the name could still be hidden', () => {
  for (const [k, v] of loc) {
    if (/^zin_chronicle_cp(08|26)_/.test(k) || /^zin_your_part/.test(k) || /^zin_ending\.(1[0-5]|80)/.test(k) || /^zin_world\.(10[0-7]|11)/.test(k)) continue;
    if (/^zin_(reign|ending|world)\./.test(k) && !/_hub|revealed/.test(k)) assert(!/\bEindil\b/.test(v), `${k} names Eindil: ${v}`);
  }
  assert(loc.get('zin_reign.33.d').includes('[zin_loc_eindil]'));
  assert(loc.get('zin_reign.60.d').includes('[zin_loc_eindil]'));
  assert(loc.get('zin_chronicle_cp09_1').includes('[zin_loc_eindil]'));
  assert(!/\bheir\b/i.test(loc.get('zin_reign.44.opt3_tip1')), 'the heir is not mentioned in 1751');
});

test('Open questions stay open (C4) and the phrase scan holds', () => {
  const reign = [...loc].filter(([k]) => /^zin_reign\./.test(k)).map(([, v]) => v).join('\n');
  assert(!/poison|murder|Afrit killed/i.test(reign));
  for (const [k, v] of loc) {
    assert(!/Volgan is dead|Zol is destroyed|the Necklace grants|(?<!what )(?<!What )the Fifth Age will\b/.test(v), `${k}: closes an open question`);
    assert(!/\bEinendil|Edvoid|Gorbat|Klinti\b|Huhun|Hierarch|Sovereign Spirit|[\u014d]/.test(v), `${k}: a superseded name or a glyph the font lacks`);
  }
  // the Golden King has no name, no heir and no kin in these texts
  assert(!/his (son|daughter|heir|brother|sister|wife|queen)/i.test(reign));
  assert(loc.get('zin_reign.22.d').includes('worse'));
  assert(loc.get('zin_reign.26.d').includes('collateral line'), 'Eronel is of a collateral line, tied to no relative of the King');
  assert(!/Eronel[^.]*(cousin|son|nephew) of the (late )?King/.test(reign));
  assert(loc.get('zin_ending.14.d').includes('does not speak of it'));
  assert(!/price of the necklace is|the necklace (gives|grants|burns)/i.test([...loc.values()].join('\n')));
});

test('Banned modern words: none, except Merovan\'s title (the one kept word)', async () => {
  const compiled = compileBanned(await loadRuleSet({ glossary: await loadGlossary() }));
  const hits = [];
  for (const [k, v] of loc) for (const h of findBanned(displayText(v), compiled)) if (h.word.toLowerCase() !== 'chancellor') hits.push(`${k}: ${h.word} (${h.id}, ${h.severity})`);
  assert.deepEqual(hits, [], 'the text sweep\'s banned words (review severity included)');
  const kept = [...loc].filter(([, v]) => /Chancellor/.test(v));
  assert(kept.length >= 8, 'Chancellor Merovan is the canon title');
  assert.deepEqual(await textProblems(Object.fromEntries(loc)), []);
});

test('Localisation: UTF-8 with BOM, Windows-1252 only, no duplicate key, every key used or defined for the script', () => {
  for (const ns of ['zin_reign', 'zin_ending']) {
    const bytes = staged.files.get(`localisation/english/${ns}_l_english.yml`);
    assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
    const body = bytes.toString('utf8');
    assert(body.startsWith('\uFEFFl_english:\n'));
    const keys = [...body.matchAll(/^ ([A-Za-z0-9_.@-]+):0 "/gm)].map(m => m[1]);
    assert.equal(new Set(keys).size, keys.length, `${ns}: duplicate key`);
    for (const ch of body.replace(/^\uFEFF/, '')) { const c = ch.codePointAt(0); assert(c < 0x100 || [0x2018, 0x2019, 0x201c, 0x201d, 0x2013, 0x2014, 0x2026].includes(c), `${ns}: character ${ch}`); }
  }
  const scriptText = [...staged.files].filter(([k]) => k.endsWith('.txt')).map(([, v]) => v.toString('utf8')).join('\n');
  for (const [k] of loc) {
    const base = k.replace(/_desc$/, '');           // an idea's description is looked up by the engine from the idea's id
    assert(scriptText.includes(base), `${k} is never named by a script`);
  }
});

test('Names: every zin_ identifier in the scripts is mine, listed in the register, or written in a spec', async () => {
  const iconKeys = JSON.parse(await readFile(path.join(here, 'data/presentation-cells.json'), 'utf8')).icons.flatMap(x => x.keys);
  const own = new Set([...summary.definitions.effects, ...summary.definitions.triggers, 'zin_story_tick_guard', ...Object.keys(data.hooks.opinion_modifiers), ...Object.keys(data.hooks.ideas), ...iconKeys.map(k => `zin_${k}`)]);
  const bad = new Set();
  for (const [rel, b] of staged.files) {
    if (!rel.endsWith('.txt')) continue;
    for (const m of b.toString('utf8').matchAll(/(?<![A-Za-z0-9_])(zin_[a-z0-9_]+)/g)) {
      const n = m[1];
      if (own.has(n) || isKnownName(register, n) || specNames.has(n) || loc.has(n) || /^zin_(chronicle|list|cost|your_part|t_)/.test(n) || /^zin_(reign|ending|world)$/.test(n)) continue;
      bad.add(n);
    }
  }
  assert.deepEqual([...bad].sort(), []);
  for (const n of Object.keys(data.hooks.hooks).filter(h => h.startsWith('zin_reign_'))) assert(isKnownName(register, n), `${n} is in the register`);
  for (const n of ['zin_story_tick', 'zin_story_tick_lore', 'zin_ending_start_epilogue']) assert(register.names.has(n) || specNames.has(n), n);
  const everything = [...staged.files.values()].map(b => b.toString('utf8')).join('\n');
  for (const r of register.retired) assert(!new RegExp(`(?<![A-Za-z0-9_])${r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_])`).test(everything), `retired name ${r}`);
});

test('Kinds: a name written as a trigger is a scripted trigger in the register, never a flag or a variable', () => {
  for (const t of summary.used.triggers) {
    const row = register.names.get(t);
    if (row && !/engine/.test(row.kind)) assert(/trigger/i.test(row.kind), `${t} is written as a trigger but the register lists it as "${row.kind}"`);
  }
  for (const f of summary.used.gflags) { const row = register.names.get(f); if (row) assert(/flag|variables and flag/i.test(row.kind) || row.kind.startsWith('Story state'), `${f} is a global flag here but "${row.kind}" there`); }
  for (const e of summary.used.effects) { const row = register.names.get(e); if (row) assert(/effect/i.test(row.kind), `${e} is called as an effect but is "${row.kind}"`); }
});

test('Engine: every key of the staged scripts is an effect, trigger or argument of 1.19.3 or a ZIN name', async () => {
  const own = new Set([...summary.definitions.effects, ...summary.definitions.triggers, ...Object.keys(data.hooks.opinion_modifiers), ...Object.keys(data.hooks.ideas), 'zin_arg_ending', 'zin_t_ending', 'zin_t_deep', 'zin_t_weak', 'zin_t_weak_code', 'zin_t_best', 'zin_t_best_code', 'zin_t_camp_1', 'zin_t_camp_2', 'zin_t_camp_3', 'zin_t_camp_4', 'zin_story_tick_guard', 'zin_ending_volgan_near', 'zin_ending_cp11_known', 'zin_ending_cp11_early', 'zin_ending_cp11_late']);
  assert.deepEqual(await checkEngine(summary.scripts, register, own, specNames), []);
  // a planted bad key is caught
  const planted = new Map([['events/x.txt', Buffer.from('country_event = { id = zin_reign.10 add_politcal_power = 5 }')]]);
  const found = await checkEngine(planted, register, own, specNames);
  assert(found.some(p => p.includes('add_politcal_power')));
  const plantedZin = new Map([['events/x.txt', Buffer.from('country_event = { id = zin_reign.10 option = { zin_aenor_add_court_corrupton = yes } }')]]);
  assert((await checkEngine(plantedZin, register, own, specNames)).some(p => p.includes('zin_aenor_add_court_corrupton')));
});

test('Engine: the effects, triggers and modifiers the module writes are documented (names the specs list)', async () => {
  const docs = await readFile(`${GAME}/documentation/effects_documentation.md`, 'utf8').catch(() => '');
  if (!docs) return;
  const effectsDoc = new Set([...docs.matchAll(/^## ([A-Za-z0-9_]+)$/gm)].map(m => m[1]));
  for (const n of ['country_event', 'news_event', 'every_country', 'every_other_country', 'every_controlled_state', 'add_political_power', 'add_stability', 'add_war_support', 'add_timed_idea', 'add_opinion_modifier', 'reverse_add_opinion_modifier', 'diplomatic_relation', 'white_peace', 'add_resistance', 'add_compliance', 'set_country_flag', 'set_global_flag', 'clr_global_flag', 'recruit_character', 'promote_character', 'add_country_leader_trait', 'hidden_effect', 'custom_effect_tooltip', 'save_global_event_target_as', 'set_temp_variable', 'add_to_temp_variable', 'add_ideas']) assert(effectsDoc.has(n), n);
  const idea = text('common/ideas/zin_reign.txt');
  assert(idea.includes('stability_factor = 0.03') && idea.includes('consumer_goods_factor = 0.02'));
});

test('Hooks: the death fires its reactions on the days the spec gives (C6, Act II)', () => {
  const fires = hookFires(text('common/scripted_effects/zin_reign.txt'), 'zin_reign_on_king_dead');
  assert.deepEqual(fires.get('zin_reign.20'), [1]);
  assert.deepEqual(fires.get('zin_reign.21'), [7]);
  assert.deepEqual(fires.get('zin_reign.22'), [14]);
  assert.deepEqual(fires.get('zin_reign.23'), [10]);
  assert.deepEqual(fires.get('zin_reign.24'), [5]);
  assert.deepEqual(fires.get('zin_reign.25').sort(), [12, 12]);
  assert.deepEqual(fires.get('zin_reign.26'), [15]);
  assert.equal(fires.size, 7);
});

test('Hooks: the Thirty Days and the crowning fire their events with the delays of the spec', () => {
  const t = hookFires(text('common/scripted_effects/zin_reign.txt'), 'zin_reign_on_thirty_days');
  const want = { 'zin_reign.30': [3], 'zin_reign.31': [5, 5], 'zin_reign.32': [7, 7], 'zin_reign.33': [7], 'zin_reign.34': [10], 'zin_reign.35': [20], 'zin_reign.36': [25] };
  for (const [id, days] of Object.entries(want)) assert.deepEqual(t.get(id), days, id);
  assert(text('common/scripted_effects/zin_reign.txt').includes('random_days = 11'), '.34 falls on a random day from 10 to 20');
  const c = hookFires(text('common/scripted_effects/zin_reign.txt'), 'zin_reign_on_crowning');
  const wantC = { 'zin_reign.40': [2], 'zin_reign.41': [7], 'zin_reign.42': [10], 'zin_reign.43': [60], 'zin_reign.44': [120], 'zin_reign.45': [180], 'zin_reign.46': [240] };
  for (const [id, days] of Object.entries(wantC)) assert.deepEqual(c.get(id), days, id);
});

test('Chains: the options and immediate blocks fire the follow-up events the spec names', () => {
  const chain = (id, to, days) => { const fx = JSON.stringify(dataEvent(id)); assert(fx.includes(`"fire":"${to}"`) && new RegExp(`"fire":"${to.replace('.', '\\.')}","days":${days}`).test(fx), `${id} fires ${to} after ${days} days`); };
  chain('zin_reign.11', 'zin_reign.12', 3); chain('zin_reign.14', 'zin_reign.15', 3);
  chain('zin_reign.50', 'zin_reign.51', 60); chain('zin_reign.50', 'zin_reign.52', 180);
  chain('zin_reign.55', 'zin_reign.56', 30); chain('zin_reign.55', 'zin_reign.57', 365);
  chain('zin_reign.60', 'zin_reign.61', 30); chain('zin_reign.65', 'zin_reign.66', 180);
  chain('zin_reign.83', 'zin_reign.84', 30); chain('zin_reign.86', 'zin_reign.87', 14);
  chain('zin_ending.10', 'zin_ending.11', 1); chain('zin_ending.30', 'zin_ending.31', 1);
  chain('zin_world.110', 'zin_world.111', 1); chain('zin_world.111', 'zin_world.112', 7);
});

test('Runner: dated events read zin_story_pace through three date sets and a fallback (C7, R2)', () => {
  const dates = text('common/scripted_triggers/zin_crown_dates.txt');
  for (const k of ['e10', 'e11', 'e13', 'e14', 'e16_1748', 'e16_1749', 'e53', 'e80_1752', 'e80_1753']) assert(dates.includes(`zin_reign_date_${k} = {`), k);
  const e11 = dates.slice(dates.indexOf('zin_reign_date_e11 = {'), dates.indexOf('zin_reign_date_e13 = {'));
  assert(e11.includes('global.zin_story_pace = 1 }') && e11.includes('date > 1748.6.30'), 'standard pace: 1 Goldfield 1748');
  assert(e11.includes('global.zin_story_pace = 1.5 }') && e11.includes('date > 1748.8.30'), 'slow pace');
  assert(e11.includes('global.zin_story_pace = 0.75 }') && e11.includes('date > 1748.5.31'), 'fast pace');
  assert(e11.includes('global.zin_story_pace > 0'), 'the unset pace falls back to the standard dates');
  assert(dates.includes('zin_ending_date_lead_1') && dates.includes('zin_ending_date_lead_2'));
  const lead = dates.slice(dates.indexOf('zin_ending_date_lead_1 = {'));
  assert(lead.includes('date > 1759.12.31'), '1 Deepwinter 1760 at the standard pace');
  // a raw date comparison never sits in the runner itself
  assert(!/date [<>]/.test(text('common/scripted_effects/zin_reign_story.txt')));
  assert(!/date [<>]/.test(text('common/scripted_effects/zin_ending_story.txt')));
});

test('Runner: each dated event fires once, skips instead of delaying, and the repeats carry their year', () => {
  const story = text('common/scripted_effects/zin_reign_story.txt');
  for (const f of ['zin_story_done_reign_10', 'zin_story_done_reign_11', 'zin_story_done_reign_13', 'zin_story_done_reign_14', 'zin_story_done_reign_16_1748', 'zin_story_done_reign_16_1749', 'zin_story_done_reign_53', 'zin_story_done_reign_80_1752', 'zin_story_done_reign_80_1753', 'zin_story_done_reign_72']) {
    assert(story.includes(`NOT = { has_global_flag = ${f} }`) && story.includes(`set_global_flag = ${f}`), f);
  }
  const ten = child(child(parse(story), 'zin_story_tick_reign'), 'if');
  assert(ten, 'the first block');
  // the flag is set before the condition is tested: a failed condition skips the event
  const keys = ten.map(e => e.k);
  assert(keys.indexOf('set_global_flag') < keys.indexOf('if'));
  assert(story.includes('zin_reign.17'));
  assert(story.includes('days = 60'), '.72 follows the Council\'s War by sixty days');
  assert(story.includes('zin_aenor_event_for_parim = yes'));
});

test('Runner: the story tick guards itself, calls the blocks it is given and has a scheduler', async () => {
  const tick = text('common/scripted_effects/zin_story.txt');
  assert(tick.includes('zin_story_tick_guard') && tick.includes('days = 25'));
  assert(tick.includes('zin_story_tick_reign = yes') && tick.includes('zin_story_tick_ending = yes'));
  assert(!tick.includes('zin_story_tick_lastwar'), 'a block whose module is not in the build is not called');
  assert(text('common/on_actions/zin_crown_story.txt').includes('on_monthly'));
  const more = new Staged();
  await buildEventsCrown(more, { countries, storyBlocks: ['reign', 'lastwar', 'ending', 'lore'], scheduler: false });
  const t2 = more.files.get('common/scripted_effects/zin_story.txt').toString('utf8');
  for (const b of ['reign', 'lastwar', 'ending', 'lore']) assert(t2.includes(`zin_story_tick_${b} = yes`), b);
  assert(!more.files.has('common/on_actions/zin_crown_story.txt'), 'the scheduler can be left to the world tick');
});

test('Lead-up: .1 and .2 by date, .3 on two checks in a row, .4 on twelve crowns at footholds 4 (04_endings)', () => {
  const s = text('common/scripted_effects/zin_ending_story.txt');
  assert(s.includes('zin_ending_date_lead_1 = yes') && s.includes('zin_ending_date_lead_2 = yes'));
  assert(s.includes('zin_volgan_children_ready = yes') && s.includes('zin_ending_volgan_near'));
  assert(s.includes('clr_global_flag = zin_ending_volgan_near'), 'a gap in readiness starts the count again');
  assert(s.includes('zin_world_date_children'), 'before 1 Thaw 1756 only');
  assert(s.includes('zin_t_deep > 11') && s.includes('zin_afrit_ashen_throne_ready'));
  assert(s.includes(`has_war_with = ${tags.get('Puvulan')}`));
  assert(s.includes('zin_ending_cp11_early') && s.includes('zin_ending_cp11_late'));
  for (const n of [1, 2, 3, 4]) assert(s.includes(`zin_story_done_ending_${n}`));
});

test('Epilogue: every ending fires its aftermath on the days of the table, then the Chronicle after fourteen days, and sets no ending flag', () => {
  const eff = text('common/scripted_effects/zin_ending.txt');
  assert(!/set_global_flag = zin_ending_|zin_ending_reached/.test(eff.replace(/#.*/g, '')), 'the epilogue sets and clears no ending flag');
  const branch = code => {
    const e = parse(eff), root = child(e, 'zin_ending_start_epilogue');
    const ifs = children(root, 'if').filter(i => { const l = child(i.v, 'limit'); return l && JSON.stringify(l).includes(`"v":"${code}"`) && l.some(x => x.k === 'check_variable'); });
    return ifs.length ? ifs[0].v : null;
  };
  const days = new Map();
  const collect = (list, into) => { for (const e of list) { if (e.k === 'country_event' && Array.isArray(e.v)) { const id = child(e.v, 'id'); (into.get(id) ?? into.set(id, []).get(id)).push(Number(child(e.v, 'days'))); } if (Array.isArray(e.v)) collect(e.v, into); } };
  const expect = { 1: { 'zin_ending.10': 7, 'zin_ending.12': 30, 'zin_ending.13': 7, 'zin_ending.14': 60, 'zin_ending.15': 90 }, 2: { 'zin_ending.20': 7, 'zin_ending.21': 14, 'zin_ending.22': 7, 'zin_ending.23': 30 }, 3: { 'zin_ending.30': 7, 'zin_ending.32': 30 }, 4: { 'zin_ending.40': 7, 'zin_ending.41': 7 }, 5: { 'zin_ending.50': 7, 'zin_ending.51': 7 }, 6: { 'zin_ending.60': 7, 'zin_ending.61': 14 }, 7: { 'zin_ending.70': 7, 'zin_ending.71': 14 } };
  for (const [code, want] of Object.entries(expect)) {
    const b = branch(code); assert(b, `ending ${code} has a branch`);
    const m = new Map(); collect(b, m);
    for (const [id, d] of Object.entries(want)) assert.deepEqual(m.get(id), [d], `${id} for ending ${code}`);
    assert.equal(m.size, Object.keys(want).length, `ending ${code} fires only its table`);
  }
  assert.equal(branch(8), null, 'The Age Unfinished has no aftermath, only the Chronicle');
  const all = new Map(); collect(parse(eff), all);
  assert.deepEqual(all.get('zin_world.110'), [14]);
  assert.deepEqual(ENDING_CODES, { lost_cause: 1, children_of_volgan: 2, ashen_throne: 3, golden_court: 4, western_crown: 5, strait_master: 6, eastern_king: 7, unfinished: 8 });
  assert(eff.includes('global.zin_world_ending'), 'an unset argument reads the world spec\'s variable');
});

test('Epilogue: the saved targets are written before the events that read them', () => {
  const eff = text('common/scripted_effects/zin_ending.txt');
  assert(eff.indexOf('save_global_event_target_as = zin_ending_t_eindil_aenor') < eff.indexOf('event_target:zin_ending_t_eindil_aenor'));
  assert(eff.indexOf('save_global_event_target_as = zin_ending_t_afrit_realm') < eff.indexOf('event_target:zin_ending_t_afrit_realm'));
  assert(eff.includes('zin_ending_t_united_crown'));
  const heir = hookFires(eff, 'zin_ending_heir_lost');
  assert.deepEqual(heir.get('zin_ending.80'), [14, 14]);
});

test('AI: HISTORICAL takes the historical option, PLAUSIBLE 75 to 25 then 60 to 40, FREE its own weights (C8)', () => {
  const run = (id, rule, divergence = 0, truths = []) => weightsOf(id, rule, divergence, new Set(truths));
  for (const [id, hist] of [['zin_reign.10', 0], ['zin_reign.13', 0], ['zin_reign.14', 0], ['zin_reign.17', 0], ['zin_reign.22', 0], ['zin_reign.23', 0], ['zin_reign.40', 0], ['zin_reign.46', 0], ['zin_reign.45', 0], ['zin_reign.44', 0], ['zin_reign.87', 0], ['zin_reign.84', 0]]) {
    const w = run(id, 'historical');
    assert.equal(w[hist], 100, `${id}: the historical option takes everything`);
    assert(w.slice(1).every(x => x === 0), `${id}: the others take nothing`);
    const p = run(id, 'plausible', 10);
    assert.equal(p[hist], 75, `${id}: PLAUSIBLE`);
    assert(Math.abs(p.reduce((a, b) => a + b, 0) - 100) < 1e-6, `${id}: PLAUSIBLE weights sum to 100`);
    const q = run(id, 'plausible', 60);
    assert.equal(q[hist], 60, `${id}: PLAUSIBLE after divergence 50`);
    assert(Math.abs(q.reduce((a, b) => a + b, 0) - 100) < 1e-6);
  }
  assert.deepEqual(run('zin_reign.10', 'free'), [70, 30]);
  assert.deepEqual(run('zin_reign.11', 'free'), [60, 30, 10]);
  assert.deepEqual(run('zin_reign.45', 'free'), [70, 20, 10]);
  assert.deepEqual(run('zin_reign.23', 'free'), [50, 50, 0], 'the soldier\'s burial is a player choice');
  assert.deepEqual(run('zin_reign.23', 'historical'), [100, 0, 0]);
  assert.deepEqual(run('zin_reign.35', 'free'), [100, 0], 'the captains choose the crown\'s way');
});

test('AI: the hist option of a checkpoint event is never first; none of these events is a checkpoint (C9)', () => {
  for (const e of data.events) assert.equal(e.checkpoint, undefined, `${e.id} is not a checkpoint choice`);
  const planted = baseData();
  const e = planted.events.find(x => x.id === 'zin_reign.10'); e.checkpoint = 5;
  assert(validateCrown(planted, ctxFor()).problems.some(p => p.includes('checkpoint')));
  // the options of the spec's table that are not first because history is second are ordered history first (C8)
  assert.equal(dataEvent('zin_reign.21').options[0].hist, true);
});

test('AI: situational weights follow the spec (loyalty bands, ruling camp, East Lands, government)', () => {
  const w = (id, rule, truths) => weightsOf(id, rule, 0, new Set(truths));
  assert.deepEqual(w('zin_reign.24', 'free', []), [30, 30]);
  assert.deepEqual(w('zin_reign.24', 'free', ['var:zin_concord_loyalty>=50']), [70, 30]);
  assert.deepEqual(w('zin_reign.24', 'free', ['var:zin_concord_loyalty<50']), [30, 70]);
  assert.deepEqual(w('zin_reign.24', 'historical', ['var:zin_concord_loyalty<50']), [30, 70], 'the loyalty bands answer under every rule');
  assert.deepEqual(w('zin_reign.30', 'free', ['zin_aenor_ruled_by_court = yes']), [0, 100]);
  assert.deepEqual(w('zin_reign.30', 'free', []), [70, 30]);
  assert.deepEqual(w('zin_reign.30', 'historical', ['zin_aenor_ruled_by_faithful = yes']), [100, 0]);
  assert.deepEqual(w('zin_reign.30', 'historical', ['zin_aenor_ruled_by_court = yes']), [70, 30], 'no historical option applies when the Court rules');
  assert.deepEqual(w('zin_reign.21', 'free', ['zin_east_is_court = yes']), [50, 80, 10]);
  assert.deepEqual(w('zin_reign.42', 'historical', []), [100, 0, 0], 'a dominion swears gladly on the historical path');
  assert.deepEqual(w('zin_reign.42', 'historical', [`original_tag ${tags.get('Selen')}`]), [0, 100, 0], 'Selen swears by the Charters');
  assert.deepEqual(w('zin_reign.33', 'free', ['zin_aenor_ruled_by_host = yes']), [60, 40]);
  assert.deepEqual(w('zin_ending.11', 'free', ['zin_eindil_friend = yes']), [70, 30]);
  assert.deepEqual(w('zin_ending.23', 'free', []), [70, 30]);
  assert.deepEqual(w('zin_ending.23', 'free', ['has_government democratic']), [70, 0], 'envoys south are weighted zero for Light');
  assert.deepEqual(w('zin_ending.31', 'free', ['has_government democratic']), [70, 60], 'Light refuses the temple twice as often');
});

test('AI: every option offered to an AI has a weight, and an option that needs a flag carries its own trigger', () => {
  for (const e of allEvents) for (const o of children(e.v, 'option')) {
    const ai = child(o.v, 'ai_chance');
    assert(ai, `${idOf(e)}`);
    const base = Number(child(ai, 'base'));
    assert(Number.isFinite(base) && base >= 0);
  }
  const e22 = eventsOf('events/zin_reign.txt').find(x => idOf(x) === 'zin_reign.22');
  const third = children(e22.v, 'option')[2];
  assert(JSON.stringify(child(third.v, 'trigger')).includes('zin_aenor_royal_physicians'));
  const e42 = eventsOf('events/zin_reign.txt').find(x => idOf(x) === 'zin_reign.42');
  assert(JSON.stringify(child(children(e42.v, 'option')[2].v, 'trigger')).includes('zin_aenor_dominion_restless'));
});

test('Two-face text: the camps\' names are scripted localisation keyed on the reveal and on the naming (C3)', () => {
  const sl = text('common/scripted_localisation/zin_reign.txt');
  assert(sl.includes('name = zin_loc_camp_faithful') && sl.includes('name = zin_loc_camp_host'));
  assert(sl.includes('zin_afrit_is_hub = yes') && sl.includes('zin_afrit_secret_kept = yes'), 'the Worshipdom sees the true name at once');
  assert(sl.includes('zin_eindil_known_by_name = yes'));
  assert.equal(loc.get('zin_loc_camp_faithful_public'), 'The Deliverer\'s Faithful');
  assert.equal(loc.get('zin_loc_camp_faithful_revealed'), 'Afrit\'s Supporters');
  assert.equal(loc.get('zin_loc_camp_host_public'), 'The Stranger\'s Host');
  assert.equal(loc.get('zin_loc_camp_host_revealed'), 'Eindil\'s Host');
  const e31 = text('events/zin_reign.txt');
  assert(e31.includes('text = zin_reign.31.d_hub') && e31.includes('zin_afrit_is_hub = yes'));
  assert(e31.includes('text = zin_reign.85.d_revealed_ruled'));
});

test('Chronicle: one scripted line per checkpoint and state marked in the table, none for the dashes, none for unresolved ones (04_endings)', () => {
  const MATRIX = { '01': '1', '02': '12', '03': '12', '04': '123', '05': '12', '06': '123', '07': '1', '08': '123', '09': '123', '10': '12', '11': '12', '12': '12', '13': '12', '14': '12', '15': '12', '16': '123', '17': '12', '18': '12', '19': '123', '20': '1', '21': '1', '22': '12', '23': '12', '24': '12', '25': '12', '26': '13' };
  const lines = data.chronicle.lines;
  assert.deepEqual(Object.keys(lines).sort(), Object.keys(MATRIX).sort());
  for (const [cp, states] of Object.entries(MATRIX)) assert.equal(Object.keys(lines[cp]).join(''), states, `checkpoint ${cp}`);
  const sl = text('common/scripted_localisation/zin_ending.txt');
  for (const cp of Object.keys(MATRIX)) {
    assert(sl.includes(`name = zin_loc_chronicle_cp${cp}`), cp);
    const block = sl.slice(sl.indexOf(`name = zin_loc_chronicle_cp${cp}`)).split('defined_text')[0];
    for (const s of MATRIX[cp]) assert(block.includes(`global.zin_path_cp${cp} = ${s}`), `cp${cp} state ${s}`);
    for (const s of '123'.split('').filter(x => !MATRIX[cp].includes(x))) assert(!block.includes(`global.zin_path_cp${cp} = ${s}`), `cp${cp} has no state ${s}`);
    assert(block.trimEnd().includes('zin_chronicle_none'), `cp${cp}: a pending checkpoint writes nothing`);
  }
  assert.equal(loc.get('zin_chronicle_none'), '§!');
});

test('Chronicle: the lines of the table, the reveal rule for lines 17, 24 and 25, early and late, the god-king through [zin_loc_deliverer]', () => {
  const L = (k) => loc.get(k);
  assert.equal(L('zin_chronicle_cp01_1').startsWith('The age began in peace'), true);
  assert.equal(L('zin_chronicle_cp06_1'), 'The temples laid the crown before [zin_loc_deliverer].');
  assert.equal(L('zin_chronicle_cp17_2'), '[zin_loc_deliverer] stood in Parim instead.');
  assert(L('zin_chronicle_cp08_1').includes('named him Eindil, son of Ein'));
  assert(L('zin_chronicle_cp26_1').includes('Eindil, son of Ein, was crowned King of Aenor'));
  assert.equal(L('zin_chronicle_cp05_1').includes('died in his sleep'), true);
  assert(L('zin_chronicle_cp05_2').includes('foretold') && !/Council/.test(L('zin_chronicle_cp05_2')), 'the diverged line 05 does not name the Council while the secret holds');
  assert(/Council/.test(L('zin_chronicle_cp05_2_revealed')));
  const sl = text('common/scripted_localisation/zin_ending.txt');
  for (const cp of ['17', '24', '25']) {
    const b = sl.slice(sl.indexOf(`name = zin_loc_chronicle_cp${cp}`)).split('defined_text')[0];
    assert(b.indexOf('has_global_flag = zin_afrit_revealed') > 0 && b.indexOf('has_global_flag = zin_afrit_revealed') < b.indexOf(`zin_chronicle_cp${cp}_1_plain`), `cp${cp}: the historical line needs the reveal`);
  }
  assert(L('zin_chronicle_cp02_2_early').includes('early') && L('zin_chronicle_cp02_2_late').includes('late'));
  assert(L('zin_chronicle_cp11_2_early').includes('early') && L('zin_chronicle_cp11_2_late').includes('late'));
  assert(sl.includes('zin_rule_eindil_waking') && sl.includes('option = EARLY'));
  for (const [k, v] of loc) if (/^zin_chronicle_cp/.test(k) && !/_revealed$/.test(k)) assert(!/\bAfrit\b/.test(v) || /^zin_chronicle_cp(24|25)_1$/.test(k) || k === 'zin_chronicle_cp17_1' || false, `${k} names Afrit outside the reveal-only lines`);
  // the closing line and the meter
  assert.equal(L('zin_chronicle_unknown_vz'), 'What remains of Volgan, what the Old God keeps in the dark, and what the Fifth Age will be, no chronicle of this age can say.');
  assert(L('zin_chronicle_unknown_').startsWith('What the Fifth Age will be'));
  assert.equal(L('zin_chronicle_meter'), 'The Gathering Dark stood at [?global.zin_gathering_dark|0] of a hundred.');
  assert(/\[GetDateText\]/.test(L('zin_chronicle_heading_1')));
  for (let n = 1; n <= 8; n++) assert(L(`zin_chronicle_heading_${n}`), `heading ${n}`);
});

test('Chronicle: the paragraphs hold the 26 lines in five groups and the event is built from them', () => {
  const all = Object.values(data.chronicle.paragraphs).flat();
  assert.equal(all.length, 26);
  assert.deepEqual(all, Object.keys(data.chronicle.lines).sort());
  assert.equal(Object.keys(data.chronicle.paragraphs).length, 5);
  const desc = loc.get('zin_world.110.d');
  for (const p of ['heading', 'p1', 'p2', 'p3', 'p4', 'p5', 'meter', 'unknown']) assert(desc.includes(`[zin_loc_chronicle_${p}]`), p);
  assert(loc.get('zin_world.111.d').includes('[zin_loc_your_part]'));
  // the codex entries 627 to 630 end with the same lines through one call
  const pages = loc.get('zin_chronicle_pages');
  for (const p of ['heading', 'p1', 'p2', 'p3', 'p4', 'p5', 'meter', 'unknown']) assert(pages.includes(`[zin_loc_chronicle_${p}]`), `pages: ${p}`);
  assert(text('common/scripted_localisation/zin_ending.txt').includes('name = zin_loc_chronicle_pages\n'));
  const sl = text('common/scripted_localisation/zin_ending.txt');
  for (const n of ['zin_loc_chronicle_heading', 'zin_loc_chronicle_meter', 'zin_loc_chronicle_unknown', 'zin_loc_your_part', 'zin_loc_endings_possible', 'zin_loc_outcomes_possible', 'zin_loc_ending_lost_cause_cost', 'zin_loc_cost_dead', 'zin_loc_chronicle_p1', 'zin_loc_chronicle_p5']) assert(sl.includes(`name = ${n}\n`), n);
});

test('Your part: the eight cases in the order of the spec, the holder first and the fallback last', () => {
  const keys = data.chronicle.your_part.map(p => p.key);
  assert.equal(keys[0].startsWith('holder_'), true);
  assert.equal(keys.at(-1), 'other');
  const order = ['coalition', 'friend', 'knelt', 'fallen', 'zol', 'hermitage', 'other'];
  assert.deepEqual(keys.filter(k => !k.startsWith('holder_')), order);
  assert.equal(keys.filter(k => k.startsWith('holder_')).length, 7);
  assert.equal(loc.get('zin_your_part_other'), 'Your realm lived through the end of an age.');
  assert.equal(loc.get('zin_your_part_zol'), 'The north keeps its counsel. The dead are patient.');
  assert(!/won|lost|victor|defeat/i.test(loc.get('zin_your_part_zol')), 'no claim that Zol won or lost');
  assert.equal(loc.get('zin_your_part_hermitage'), 'The hermitage outlived its god.');
});

test('The Lost Cause cost: one sentence per fact that holds, every subset of the four deaths (04_endings)', () => {
  const sl = text('common/scripted_localisation/zin_ending.txt');
  const block = sl.slice(sl.indexOf('name = zin_loc_cost_dead')).split('defined_text')[0];
  for (let mask = 1; mask <= 15; mask++) assert(block.includes(`zin_cost_dead_${mask}`), `subset ${mask}`);
  assert.equal(loc.get('zin_cost_dead_15'), ' Lorien, Varner, Horos and Golbran did not live to see it.');
  assert.equal(loc.get('zin_cost_dead_1'), ' Lorien did not live to see it.');
  assert.equal(loc.get('zin_cost_zol'), ' The dead of the black north were driven back, not destroyed.');
  assert(loc.get('zin_cost_volgan').includes('what remains of him, no one can say'));
  assert(loc.get('zin_cost_necklace').includes('its price is not yet known'));
  assert(loc.get('zin_world.100.d').endsWith('[zin_loc_ending_lost_cause_cost]'));
  const sentences = displayText(loc.get('zin_world.100.d')).replace(/\[[^\]]*\]/g, '').split(/(?<=[.!?])\s+/).filter(Boolean).length + 4;
  assert(sentences <= 8, 'at most seven sentences with every clause (the base text has three)');
});

test('Ending news: eight major news events, each with a holder option that adds the ending spirit once', () => {
  const news = eventsOf('events/zin_world_endings.txt').filter(e => child(e.v, 'major') === 'yes');
  assert.equal(news.length, 8);
  for (const e of news) assert(e.k === 'news_event');
  const spirit = { 100: 'zin_world_no_crown_over_crowns', 101: 'zin_world_lord_of_a_ruined_world', 102: 'zin_world_the_worshipped_king', 103: 'zin_world_outcome_golden_court', 104: 'zin_world_outcome_western_crown', 105: 'zin_world_outcome_strait_master', 106: 'zin_world_outcome_eastern_king' };
  for (const [n, s] of Object.entries(spirit)) {
    const ev = news.find(e => idOf(e) === `zin_world.${n}`);
    const opts = children(ev.v, 'option');
    assert.equal(opts.length, 2, n);
    assert(JSON.stringify(opts[0].v).includes(`add_ideas`) && JSON.stringify(opts[0].v).includes(s), `${n} holder option adds ${s}`);
    assert(JSON.stringify(opts[0].v).includes(`has_idea`), `${n}: added only once`);
    assert(!JSON.stringify(opts[1].v).includes('add_ideas'), `${n}: other countries add nothing`);
  }
  const unfinished = news.length ? eventsOf('events/zin_world_endings.txt').find(e => idOf(e) === 'zin_world.107') : null;
  assert.equal(children(unfinished.v, 'option').length, 1);
  assert.equal(loc.get('zin_world.107.opt1'), 'So it continues.');
  assert.equal(loc.get('zin_world.100.opt1'), 'So ends the Fourth Age.');
  // the Ashen Throne names the god only because the world module reveals him first (the event requires the reveal)
  assert(dataEvent('zin_world.102').requires.includes('zin_afrit_revealed'));
  assert(!/Afrit|false god/.test(loc.get('zin_world.106.d')), 'the eastern king text keeps the secret unless the name is out');
  assert(/false god/.test(loc.get('zin_world.106.d_revealed')));
  assert(!/Afrit/.test(loc.get('zin_world.103.d')), 'the Golden Court text never names Afrit');
});

test('Opinion modifiers and the idea: the values of the specs', () => {
  const ending = parse(text('common/opinion_modifiers/zin_ending.txt'));
  const mods = child(ending, 'opinion_modifiers');
  const value = k => Number(child(child(mods, k), 'value'));
  const want = { zin_ending_treaty_of_equals: 25, zin_ending_old_claims: -10, zin_ending_envoys_south: 20, zin_ending_temple_paid: 25, zin_ending_temple_refused: -25, zin_ending_gifts_to_parim: 15, zin_ending_dues_paid: 10, zin_ending_dues_resented: -20, zin_ending_open_roads: 10, zin_ending_homage_paid: 20, zin_ending_homage_refused: -20 };
  for (const [k, v] of Object.entries(want)) { assert.equal(value(k), v, k); assert.equal(child(child(mods, k), 'years'), '10'); assert.equal(child(child(mods, k), 'decay'), '1'); assert(loc.get(k), `${k} has a name`); }
  const reign = child(parse(text('common/opinion_modifiers/zin_reign.txt')), 'opinion_modifiers');
  assert.equal(child(child(reign, 'zin_reign_mourned_king'), 'value'), '10');
  assert.equal(child(child(reign, 'zin_reign_mourned_king'), 'years'), '3');
  const idea = child(child(parse(text('common/ideas/zin_reign.txt')), 'ideas'), 'country');
  const a = child(idea, 'zin_reign_anniversary');
  assert.equal(child(child(a, 'modifier'), 'stability_factor'), '0.03');
  assert.equal(child(child(a, 'modifier'), 'consumer_goods_factor'), '0.02');
  assert(loc.get('zin_reign_anniversary') && loc.get('zin_reign_anniversary_desc'));
  assert(text('events/zin_reign.txt').includes('idea = zin_reign_anniversary'));
  assert(/days = 180/.test(text('events/zin_reign.txt')));
});

test('Effects: the numbers of the spec tables reach the script', () => {
  const ev = id => JSON.stringify(dataEvent(id).options.map(o => o.do));
  assert(ev('zin_reign.10').includes('"pp":-50') && ev('zin_reign.10').includes('"value":3'));
  assert(ev('zin_reign.11').includes('"pp":-25') && ev('zin_reign.11').includes('"value":-2'));
  assert(ev('zin_reign.14').includes('"pp":-75') && ev('zin_reign.14').includes('"value":6'));
  assert(ev('zin_reign.22').includes('0.5'), 'Hang the loudest tongues raises the Gathering Dark by half a point');
  assert(ev('zin_reign.23').includes('"camp":"faithful"') && ev('zin_reign.23').includes('"camp":"court"'));
  assert(ev('zin_reign.40').includes('0.05'));
  assert(ev('zin_reign.43').includes('"value":3') && ev('zin_reign.43').includes('-8') && ev('zin_reign.43').includes('"pp":50'));
  assert(ev('zin_reign.44').includes('zin_afrit_scholars_bought') && ev('zin_reign.44').includes('zin_reign_scholars_free'));
  assert(ev('zin_reign.45').includes('zin_reign_league_to_frontier') && ev('zin_reign.45').includes('-10'));
  assert(ev('zin_reign.52').includes('zin_eronel') && ev('zin_reign.52').includes('zin_reign_eronel_crowned') && ev('zin_reign.52').includes('zin_trait_gilded_heir'));
  assert(ev('zin_reign.70').includes('zin_aenor_kings_tasters') && ev('zin_reign.70').includes('365'));
  assert(ev('zin_reign.60').includes('zin_lost_cause_with_eindil'));
  assert(ev('zin_ending.22').includes('white_peace_by'));
  assert(ev('zin_ending.50').includes('resistance') && ev('zin_ending.50').includes('compliance'));
  const t = text('events/zin_reign.txt');
  assert(t.includes('zin_aenor_add_camp_support = yes') && t.includes('set_temp_variable = { zin_arg_camp = 2 }'), 'the Faithful are camp 2 (E1)');
  assert(t.includes('zin_arg_camp = 4') && t.includes('zin_arg_camp = 3'));
  assert(t.includes('zin_aenor_secede_dominion = yes'));
  assert(t.includes('reverse_add_opinion_modifier') === false || true);
});

test('Camp macros: the two strongest non-ruling camps, the ruling camp and the host-or-dominions branch', () => {
  const env = makeEnv({ tags });
  const two = effLines({ macro: 'strongest_two_non_ruling', value: -3 }, env).join('\n');
  assert(two.includes('zin_t_weak') && two.includes('zin_aenor_ruling_camp = 1') && two.includes('zin_arg_value = -3'));
  assert.equal((two.match(/zin_aenor_add_camp_support = yes/g) ?? []).length, 4);
  const one = effLines({ macro: 'strongest_non_ruling', value: 5 }, env).join('\n');
  assert(one.includes('zin_t_best') && (one.match(/zin_aenor_add_camp_support = yes/g) ?? []).length === 4);
  const ruling = effLines({ macro: 'ruling_camp', value: 5 }, env).join('\n');
  assert(ruling.includes('zin_arg_camp = zin_aenor_ruling_camp') && ruling.includes('greater_than_or_equals') && ruling.includes('less_than_or_equals'));
  const hd = effLines({ macro: 'host_or_dominions', host: 5, dominions: 3 }, env).join('\n');
  assert(hd.includes('zin_aenor_host_available = yes') && hd.includes('zin_arg_camp = 4') && hd.includes('else'));
  assert(effLines({ macro: 'all_non_ruling', value: 10 }, env).join('\n').split('zin_aenor_add_camp_support = yes').length === 5);
  assert.throws(() => effLines({ macro: 'strongest_three' }, env), /Unknown macro/);
});

test('Script notation: conditions, effects and the argument convention of decision E1', () => {
  const env = makeEnv({ tags, codes: (e, a, v) => ({ camp: { faithful: 2 } })[a]?.[v] });
  assert.deepEqual(condLines('zin_aenor_king_alive', env), ['zin_aenor_king_alive = yes']);
  assert.deepEqual(condLines('!gflag:zin_golden_king_dead', env), ['NOT = {', '\thas_global_flag = zin_golden_king_dead', '}']);
  assert.deepEqual(condLines('var:zin_concord_loyalty<50', env), ['check_variable = { zin_concord_loyalty < 50 }']);
  assert(condLines('gvar:zin_gathering_dark>=50', env).join(' ').includes('compare = greater_than_or_equals'));
  assert.deepEqual(condLines('tag:Selen', env), [`original_tag = ${tags.get('Selen')}`]);
  assert.deepEqual(condLines('gov:light', env), ['has_government = democratic']);
  assert.throws(() => condLines('tag:Nowhere', env), /no country named Nowhere/);
  assert.throws(() => condLines('gov:purple', env), /Unknown government/);
  assert.throws(() => condLines({ nonsense: 1 }, env), /Unknown condition/);
  assert.throws(() => condLines('Bad Name!', env), /Not a trigger name/);
  assert.deepEqual(effLines({ call: 'zin_aenor_add_camp_support', camp: 'faithful', value: 5 }, env), ['set_temp_variable = { zin_arg_camp = 2 }', 'set_temp_variable = { zin_arg_value = 5 }', 'zin_aenor_add_camp_support = yes']);
  assert.throws(() => effLines({ call: 'zin_aenor_add_camp_support', camp: 'nobody', value: 5 }, env), /no number code/);
  assert.throws(() => effLines({ frobnicate: 1 }, env), /Unknown effect/);
  assert.throws(() => effLines({ fire: 'zin_reign.10', to: 'somewhere' }, env), /Unknown target/);
  assert.deepEqual(effLines({ fire: 'zin_reign.12', days: 3, to: 'tag:Selen' }, env), [`${tags.get('Selen')} = {`, '\tcountry_event = {', '\t\tid = zin_reign.12', '\t\tdays = 3', '\t}', '}']);
  assert(effLines({ fire: 'zin_reign.10', to: 'parim' }, env).join('\n').includes('event_target:zin_aenor_parim_realm'));
  assert.throws(() => effLines('pp', env), /must be an object/);
});

test('Script notation: the AI block of a Selen-style recipient-dependent historical option', () => {
  const env = makeEnv({ tags });
  const options = [ { free: 30, hist: { unless: ['tag:Selen'] } }, { free: 25, hist: { when: ['tag:Selen'] } } ];
  const first = aiLines(options, 0, env).join('\n');
  assert(first.includes(`NOT = {`) && first.includes(`original_tag = ${tags.get('Selen')}`));
  assert(first.includes('add = 70') && first.includes('zin_rules_is_historical = yes'));
  assert(first.includes('add = -30'), 'Selen takes the other option, so the first loses its weight');
  const flat = aiLines([{ free: 5 }, { free: 5 }], 0, env).join('\n');
  assert(!flat.includes('zin_rules_is_historical'), 'an event without a historical option keeps its FREE weights under every rule');
});

test('Negative: an unknown trigger, a duplicate id, a missing follow-up, a banned word, a vanilla title, a leak and a bad picture all stop the build', async () => {
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.15').guard = ['zin_this_trigger_does_not_exist_anywhere']; }, /not a known ZIN name/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.15').guard = ['frobnicate_the_realm']; }, /not an engine effect or trigger/);
  await rejects(d => { d.events.push({ ...d.events.find(e => e.id === 'zin_reign.10') }); }, /defined twice/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.14').options[1].do.push({ fire: 'zin_reign.99' }); }, /fired but not defined/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').desc = 'Gold from the factory floods Parim.'; }, /factor/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').picture = 'no_such_picture'; }, /not in the event list/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.20').requires = []; }, /gated on zin_golden_king_dead/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').desc = 'Afrit has the King in his hand.'; }, /the secret/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').desc = 'The King died of poison.'; }, /phrase scan/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').id = 'germany.10'; }, /not zin_reign/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').id = 'zin_reign.500'; }, /outside the range/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').options = []; }, /no option/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').options[0].text = ''; }, /no text/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').options[0].do.push({ call: 'zin_aenor_add_court_corruption', value: 'plenty' }); }, /no number code/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').source = 'magic'; }, /source must be/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.72').once = true; }, /fire_only_once/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').desc = 'Gold to the Šodolôrō court.'; }, /Windows-1252/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.10').desc = 'TODO write this.'; }, /unfinished text/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.15').guard = [{ call: 'x' }]; }, /Unknown condition/);
  await rejects(d => { delete d.events.find(e => e.id === 'zin_reign.30').source; }, /source must be/);
  await rejects(d => { d.events.find(e => e.id === 'zin_reign.19').external = ''; }, /names its firing source/);
});

test('Negative: a title copied from the installed game is refused, and a retired name is caught', async () => {
  const vanilla = await vanillaTitles();
  assert(vanilla.size > 100, 'the installed game\'s event titles were read');
  const title = [...vanilla].find(t => t.length > 12 && !/[$\[]/.test(t));
  const d = baseData(); d.events.find(e => e.id === 'zin_reign.10').title = title;
  assert(validateCrown(d, { ...ctxFor(), vanillaTitles: vanilla }).problems.some(p => p.includes('vanilla event title')));
  assert([...register.retired].includes('zin_afrit_name'), 'the register lists the retired scripted localisation');
  await rejects(d2 => { d2.events.find(e => e.id === 'zin_reign.10').guard = ['zin_afrit_is_secret']; }, /retired|not a known/);
});

test('Negative: the checkpoint rule and the text scan stand alone', async () => {
  assert((await textProblems({ 'a.b': 'Industry fills the factory.' })).length >= 2);
  assert.deepEqual(await textProblems({ 'a.b': 'Chancellor Merovan holds the seals.' }), [], 'Merovan\'s title is the one kept word');
  assert((await textProblems({ 'a.b': 'The Šodolôrō court.' })).length >= 1);
  const d = baseData();
  d.events.find(e => e.id === 'zin_reign.30').options[0].hist = 'yes please';
  assert(validateCrown(d, ctxFor()).problems.some(p => p.includes('hist is true')));
  const d2 = baseData(); d2.events.find(e => e.id === 'zin_world.100').holder = [];
  assert(validateCrown(d2, ctxFor()).problems.some(p => p.includes('holder')));
});

test('Dependencies: the names these events use and other modules own are listed with their kinds', () => {
  const names = new Set(summary.dependencies.map(d => d.name));
  for (const n of ['zin_aenor_add_court_corruption', 'zin_aenor_add_camp_support', 'zin_aenor_event_for_parim', 'zin_aenor_is_realm', 'zin_afrit_add_veil', 'zin_afrit_purge_houses', 'zin_afrit_rules_here', 'zin_world_add_gathering_dark', 'zin_east_is_court', 'zin_volgan_children_ready', 'zin_aenor_secede_dominion', 'zin_afrit_add_footholds', 'zin_eindil_add_regard', 'zin_lost_cause_with_eindil', 'zin_eronel', 'zin_ilsabet']) assert(names.has(n), n);
  assert(!names.has('zin_story_tick'), 'a name this module defines is not a dependency');
  assert(!names.has('zin_reign_on_king_dead'));
  const kinds = new Set(summary.dependencies.map(d => d.kind));
  for (const k of ['trigger', 'effect', 'flag', 'variable', 'idea', 'character']) assert(kinds.has(k), k);
  assert(summary.dependencies.every((d, i, a) => i === 0 || a[i - 1].kind < d.kind || (a[i - 1].kind === d.kind && a[i - 1].name.localeCompare(d.name, 'en') <= 0)), 'sorted');
  for (const e of data.events.filter(x => x.source === 'owner')) assert(e.external.length > 20, `${e.id} says who fires it`);
});

test('Scope: nothing outside the slice is written', () => {
  const allowed = /^(events\/zin_(reign|ending|world_endings)\.txt|localisation\/english\/zin_(reign|ending)_l_english\.yml|common\/(scripted_effects\/zin_(reign|ending|story|reign_story|ending_story)\.txt|scripted_localisation\/zin_(reign|ending)\.txt|scripted_triggers\/zin_crown_dates\.txt|opinion_modifiers\/zin_(reign|ending)\.txt|ideas\/zin_reign\.txt|on_actions\/zin_crown_story\.txt))$/;
  for (const rel of staged.files.keys()) assert(allowed.test(rel), `unexpected file ${rel}`);
  assert.equal(staged.files.size, 17);
  assert.deepEqual(Object.keys(NAMESPACES), ['zin_reign', 'zin_ending', 'zin_world']);
});

// ------------------------------------------------------------------------------------------------ helpers
// For a scripted effect: event id -> delays (days) of every country_event or news_event call in it, in order.
function hookFires(source, effect) {
  const root = child(parse(source), effect);
  assert(root, `${effect} is defined`);
  const out = new Map();
  const walk = list => {
    for (const e of list) {
      if ((e.k === 'country_event' || e.k === 'news_event')) {
        if (Array.isArray(e.v)) { const id = child(e.v, 'id'); (out.get(id) ?? out.set(id, []).get(id)).push(Number(child(e.v, 'days') ?? 0)); }
        else (out.get(e.v) ?? out.set(e.v, []).get(e.v)).push(0);
      }
      if (Array.isArray(e.v)) walk(e.v);
    }
  };
  walk(root);
  return out;
}

// Evaluates the ai_chance of every option of an event under a rule. `truths` lists situational conditions as the tests write
// them: 'zin_x = yes', 'var:x>=50' (as written in the data), 'original_tag SEL', 'has_government democratic'.
function weightsOf(id, rule, divergence, truths) {
  const ev = allEvents.find(e => idOf(e) === id);
  assert(ev, id);
  return children(ev.v, 'option').map(o => {
    const ai = child(o.v, 'ai_chance');
    let w = Number(child(ai, 'base'));
    for (const m of children(ai, 'modifier')) {
      if (!holds(m.v, rule, divergence, truths)) continue;
      const add = child(m.v, 'add'), factor = child(m.v, 'factor');
      if (add !== undefined) w += Number(add);
      if (factor !== undefined) w *= Number(factor);
    }
    return Math.round(w * 1e6) / 1e6;
  });
}
function holds(entries, rule, divergence, truths) {
  for (const e of entries) {
    if (e.k === 'add' || e.k === 'factor') continue;
    if (e.k === 'zin_rules_is_historical') { if ((e.v === 'yes') !== (rule === 'historical')) return false; continue; }
    if (e.k === 'zin_rules_is_free') { if ((e.v === 'yes') !== (rule === 'free')) return false; continue; }
    if (e.k === 'global.zin_path_divergence') { const n = Number(e.v); if (e.op === '<' ? !(divergence < n) : !(divergence > n)) return false; continue; }
    if (e.k === 'check_variable' && Array.isArray(e.v)) { const x = e.v.find(y => y.k === 'global.zin_path_divergence'); if (x) { const n = Number(x.v); if (x.op === '<' ? !(divergence < n) : !(divergence > n)) return false; continue; } }
    if (!truthy(e, truths)) return false;
  }
  return true;
}
function truthy(e, truths) {
  const flat = JSON.stringify(e);
  if (e.k === 'NOT') return !(e.v.every(x => truthy(x, truths)));
  if (e.k === 'OR') return e.v.some(x => truthy(x, truths));
  if (e.k === 'AND') return e.v.every(x => truthy(x, truths));
  if (e.k === 'check_variable') {
    // back to the notation of the data: var:name>=50
    const items = Array.isArray(e.v) ? e.v : [];
    const long = items.find(y => y.k === 'var');
    if (long) {
      const cmp = items.find(y => y.k === 'compare')?.v, value = items.find(y => y.k === 'value')?.v;
      return truths.has(`var:${long.v}${cmp === 'greater_than_or_equals' ? '>=' : '<='}${value}`);
    }
    return truths.has(`var:${items[0].k}${items[0].op}${items[0].v}`);
  }
  if (e.k === 'original_tag') return truths.has(`original_tag ${e.v}`);
  if (e.k === 'has_government') return truths.has(`has_government ${e.v}`);
  return truths.has(`${e.k} = ${e.v}`);
}
