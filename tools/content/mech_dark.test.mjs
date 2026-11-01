// Tests of the Dark Lands mechanic (docs/specs/04_mechanics/dark_lands.md; integration note docs/design/stage2/mech_dark.md). They build
// tools/content/modules/mech_dark.mjs into a fresh Staged with the roster (lib/roster.mjs) and the people assignment of the country
// table, and assert on the staged files; nothing needs a prior build. The installed game is read for engine vocabulary (effects,
// triggers, modifiers). Every rule has at least one negative test: mutated data or mutated output that the module or the check refuses.
// Run: cd tools && node --test content/mech_dark.test.mjs
import test from 'node:test';
import { countryTable } from './lib/roster.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { parse, tokenize } from './lib/clausewitz.mjs';
import { checkCommands } from './lib/mp_check.mjs';
import { paceDate, PACES } from './lib/mech_kit.mjs';
import { isPanelChrome, onGrid } from './lib/mech_court_gui.mjs';
import { readable, notCp1252, checkMods } from './lib/inst_util.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { loadGlossary } from './lib/text_engine.mjs';
import { ZIN } from './lib/paths.mjs';
import { loadCountryTable } from './modules/countries.mjs';
import { buildMechDark, loadDarkData, BLOCS, DARK_DEPENDENCIES, FORBIDDEN_TEXT, stanceCode } from './modules/mech_dark.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const json = async f => JSON.parse(await readFile(path.join(here, 'data', f), 'utf8'));
const countries = countryTable();
const cells = await json('presentation-cells.json');
const table = await loadCountryTable(countries, `${ZIN}/docs/design/countries.csv`);
const assignment = new Map([...table].map(([tag, t]) => [tag, t.people]));
const D = await loadDarkData();
const staged = new Staged();
const dark = await buildMechDark(staged, { countries, assignment });
const tagOf = n => countries.find(c => c.name === n).tag;
// The holds are the orc and troll realms of the Dark Lands but Goldoroth (and Dondor); the sway table adds the other Dark Lands realms (Blackton).
const DARK = countries.filter(c => c.scan === 'Dark Lands');
const HOLDS = DARK.filter(c => !['Goldoroth', 'Dondor'].includes(c.name) && ['orcs', 'trolls'].includes(assignment.get(c.tag)));
const SWAY = DARK.filter(c => !['Goldoroth', 'Dondor'].includes(c.name));
const { GOL, DON, BLK, LER, AEN, VOL, ZOL, TRF } = dark.tags;

const text = (rel, s = staged) => { const b = s.files.get(rel); assert(b, `missing staged file ${rel}`); return b.toString('utf8'); };
const scriptsOf = s => new Map([...s.files].filter(([k]) => /\.(txt|gui)$/.test(k)).map(([k, v]) => [k, v.toString('utf8')]));
const scriptFiles = scriptsOf(staged);
const txtFiles = new Map([...scriptFiles].filter(([k]) => k.endsWith('.txt')));
const allScript = [...scriptFiles.values()].join('\n');
const locOf = s => Object.fromEntries([...text('localisation/english/zin_dark_l_english.yml', s).matchAll(/^ ([A-Za-z0-9_.@-]+):0 "(.*)"$/gm)].map(m => [m[1], m[2].replace(/\\"/g, '"')]));
const loc = locOf(staged);
const EF = text('common/scripted_effects/zin_dark.txt'), TR = text('common/scripted_triggers/zin_dark.txt'), DEC = text('common/decisions/zin_dark.txt'), EV = text('events/zin_dark.txt');
const defined = new Set([...dark.definitions.effects, ...dark.definitions.triggers]);
const externals = new Set([...DARK_DEPENDENCIES.effects, ...DARK_DEPENDENCIES.triggers]);
/** One event block of events/zin_dark.txt, found by its id line. */
const eventOf = (id, t = EV) => t.split(/\n(?=(?:country|news)_event = \{)/).find(b => b.includes(`\tid = ${id}\n`)) ?? '';
const buildWith = async (mutate, extra = {}) => { const d = structuredClone(D); mutate(d); const s = new Staged(); const r = await buildMechDark(s, { countries, assignment, data: d, ...extra }); return { s, r }; };

// ------------------------------------------------------------------------------------------------ check helpers (each has a negative test)
/** The balanced block that opens with `name = {` at the start of a line (top-level definitions), or null. */
function bodyOf(t, name) {
  const m = new RegExp(`^\\t*${name.replace(/[.]/g, '\\.')} = \\{`, 'm').exec(t);
  if (!m) return null;
  let depth = 0;
  for (let i = m.index + m[0].length - 1; i < t.length; i++) { if (t[i] === '{') depth++; if (t[i] === '}' && --depth === 0) return t.slice(m.index, i + 1); }
  return null;
}
/** Every `name = { ... }` block anywhere in a text, as [start, end] spans. */
function spans(t, name) {
  const out = [], re = new RegExp(`\\b${name} = \\{`, 'g');
  for (let m; (m = re.exec(t));) { let depth = 0; for (let i = m.index + m[0].length - 1; i < t.length; i++) { if (t[i] === '{') depth++; if (t[i] === '}' && --depth === 0) { out.push([m.index, i + 1]); break; } } }
  return out;
}
function braceProblems(files) {
  const out = [];
  for (const [f, t] of files) {
    let depth = 0, min = 0;
    for (const tk of tokenize(t)) { if (tk.t === '{') depth++; if (tk.t === '}') { depth--; min = Math.min(min, depth); } }
    if (depth !== 0 || min !== 0) out.push(`${f}: unbalanced`);
    try { parse(t); } catch (e) { out.push(`${f}: ${e.message}`); }
  }
  return out;
}
const operatorProblems = files => [...files].filter(([, t]) => /<=|>=/.test(t.replace(/#.*$/gm, ''))).map(([f]) => f);
// Parameter blocks the shared vocabulary walk would read as commands: collapsed after their keys are checked here.
const PARAM_KEYS = {
  start_border_war: ['change_state_after_war', 'combat_width', 'minimum_duration_in_days', 'attacker', 'defender'],
  set_politics: ['ruling_party', 'elections_allowed'], annex_country: ['target', 'transfer_troops'], remove_opinion_modifier: ['target', 'modifier'],
  any_province_building_level: ['province', 'building', 'level'], has_dynamic_modifier: ['modifier', 'scope'],
};
const SIDE_KEYS = ['state', 'num_provinces', 'on_win', 'on_lose', 'on_cancel'];
/** Prepares script for checkCommands: tooltipped triggers and meta effects are opened so their commands are checked too. */
function forVocabulary(t) {
  const problems = [];
  for (const [name, keys] of Object.entries(PARAM_KEYS)) {
    for (const [a, b] of spans(t, name).reverse()) {
      const inner = parse(t.slice(a, b))[0].v;
      for (const e of inner) {
        if (!keys.includes(e.k)) problems.push(`${name}: unknown parameter ${e.k}`);
        if ((e.k === 'attacker' || e.k === 'defender') && Array.isArray(e.v)) for (const x of e.v) if (!SIDE_KEYS.includes(x.k)) problems.push(`${name}.${e.k}: unknown parameter ${x.k}`);
      }
      t = `${t.slice(0, a)}${name} = yes${t.slice(b)}`;
    }
  }
  for (const [a, b] of spans(t, 'meta_effect').reverse()) {
    const block = t.slice(a, b), [ta, tb] = spans(block, 'text')[0];
    t = `${t.slice(0, a)}hidden_effect = ${block.slice(ta + 'text = '.length, tb)}${t.slice(b)}`;
  }
  t = t.replace(/\bcustom_trigger_tooltip = \{\s*\n\s*tooltip = [A-Za-z0-9_.]+\s*\n/g, 'AND = {\n');
  return { text: t, problems };
}
async function vocabularyProblems(files, known) {
  const prepared = new Map(), problems = [];
  for (const [f, t] of files) { const p = forVocabulary(t); prepared.set(f, p.text); problems.push(...p.problems.map(x => `${f}: ${x}`)); }
  return [...problems, ...await checkCommands(prepared, known)];
}
const compiledBanned = compileBanned(await loadRuleSet({ glossary: await loadGlossary() }));
const bannedHits = entries => Object.entries(entries).flatMap(([k, v]) => findBanned(readable(v), compiledBanned, ['error']).map(h => `${k}: ${h.word} (${h.id})`));
const holdNames = D.roster.other_holds.concat([D.roster.dulundur, D.roster.bordon, D.roster.dreson, D.roster.dun, D.roster.belonton]);
function secretHits(entries) {
  const out = [];
  for (const [k, v] of Object.entries(entries)) {
    if (FORBIDDEN_TEXT.test(v)) out.push(`${k}: names ${v.match(FORBIDDEN_TEXT)[0]}`);
    if (/\b\d[\d,]*\b[^.]*\b(host|hosts|legions|dead)\b/i.test(v) && /Volgan|Nafeher|the south/i.test(v)) out.push(`${k}: a size of Volgan's hosts`);
    if (/fire[^.]*\b(ends?|destroys?|kills?)\b[^.]*\bdead\b/i.test(v)) out.push(`${k}: fire ends the dead`);
    if (/goblin/i.test(v) && holdNames.some(n => v.includes(n))) out.push(`${k}: names a goblin hold`);
  }
  return out;
}
function missingLoc(files, entries) {
  const need = new Set();
  for (const [f, t] of files) {
    if (f.includes('scripted_localisation')) continue;
    for (const m of t.matchAll(/\b(?:title|desc|name|text|localization_key|tooltip|custom_effect_tooltip) = ([A-Za-z0-9_.]+)/g)) if (/^zin_/.test(m[1])) need.add(m[1]);
    for (const m of t.matchAll(/\b(?:text|buttonText|pdx_tooltip) = "([A-Za-z0-9_.]+)"/g)) need.add(m[1]);
  }
  return [...need].filter(k => !(k in entries));
}
const hasBom = buf => buf.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]));
const pictures = new Map(cells.events.map(e => [e.key, e]));
function eventProblems(t) {
  const out = [];
  for (const ev of parse(t).filter(e => /^(country|news)_event$/.test(e.k))) {
    const get = k => ev.v.find(x => x.k === k)?.v, id = get('id');
    if (get('hidden') === 'yes') { if (!ev.v.some(x => x.k === 'immediate')) out.push(`${id}: hidden without effects`); continue; }
    if (get('timeout_days') !== '30') out.push(`${id}: timeout`);
    const m = /^GFX_zin_(evt|news)_(.+)$/.exec(get('picture') ?? '');
    if (!m || !pictures.has(m[2])) { out.push(`${id}: picture ${get('picture')} is not in the catalog`); continue; }
    if (ev.k === 'news_event' && !['both', 'news'].includes(pictures.get(m[2]).crop)) out.push(`${id}: ${m[2]} has no news crop`);
    if (!ev.v.some(x => x.k === 'option')) out.push(`${id}: no option`);
  }
  return out;
}
/** The engine dates a story-pace trigger is written with. */
const paceDates = body => [...new Set([...body.matchAll(/date > (\d+\.\d+\.\d+)/g)].map(m => m[1]))];
const ruleReadProblems = files => [...files].filter(([, t]) => /has_game_rule/.test(t)).map(([f]) => `${f} reads a game rule directly`);
const periodicProblems = files => [...files].flatMap(([f, t]) => [...t.matchAll(/^\s*(on_(?:daily|weekly|monthly)) = \{/gm)].map(m => `${f}: every-country ${m[1]}`));
function windowProblems(gui, sg) {
  const out = [], names = new Set([...gui.matchAll(/name = "([a-z0-9_]+)"/g)].map(m => m[1]));
  for (const m of sg.matchAll(/window_name = "([a-z0-9_]+)"/g)) if (!names.has(m[1])) out.push(`window ${m[1]}`);
  for (const m of sg.matchAll(/^\t+([a-z0-9_]+)_(click|visible) = \{/gm)) if (!names.has(m[1])) out.push(`element ${m[1]}`);
  for (const m of sg.matchAll(/entry_container = "([a-z0-9_]+)"/g)) if (!names.has(m[1])) out.push(`entry ${m[1]}`);
  const lists = parse(sg)[0].v.flatMap(g => g.v.filter(x => x.k === 'dynamic_lists').flatMap(x => x.v.map(l => l.k)));
  for (const l of lists) if (!names.has(l)) out.push(`list ${l}`);
  for (const s of gui.matchAll(/(?:spriteType|quadTextureSprite) = "(GFX_[A-Za-z_]+)"/g)) if (!isPanelChrome(s[1])) out.push(`sprite ${s[1]}`);
  return out;
}
// Section 2 to 9 decision tables: [cost, cooldown] (null: none). Variants carry the tree flag's numbers.
const SPEC_DECISIONS = {
  zin_dark_raid_marches: [25, 90], zin_dark_raid_marches_swift: [25, 60], zin_dark_raid_hold: [15, 90], zin_dark_corsair_raid: [25, 120], zin_dark_clash_on_the_march: [50, 365],
  zin_dark_great_moot: [75, 365], zin_dark_great_moot_central: [75, 180], zin_dark_feast_the_clans: [50, 180], zin_dark_blood_contest: [25, 120], zin_dark_blood_contest_cheap: [15, 120],
  zin_dark_send_gifts: [25, 120], zin_dark_send_gifts_cheap: [15, 120], zin_dark_bind_by_marriage: [50, null], zin_dark_show_the_host: [25, 180], zin_dark_offer_iron_yoke: [50, 365], zin_dark_offer_iron_yoke_cheap: [50, 365],
  zin_dark_one_fire: [100, null], zin_dark_one_fire_hard: [100, null], zin_dark_hunt_envoys: [50, 180],
  zin_dark_light_beacons: [25, 180], zin_dark_light_beacons_chain: [25, 120], zin_dark_pay_blood_price: [40, 365], zin_dark_invite_to_accord: [25, 180], zin_dark_muster_brutes: [50, 365], zin_dark_muster_brutes_drill: [50, 240],
  zin_dark_petition_parim: [25, null], zin_dark_call_on_the_north: [25, 365], zin_dark_call_free_moot: [50, null], zin_dark_leave_free_moot: [null, null], zin_dark_hire_troll_kin: [75, 365],
  zin_dark_levy_shore_tolls: [null, 180], zin_dark_close_strait: [50, 180],
};
const decisionsOf = t => new Map(parse(t).flatMap(cat => cat.v.map(d => [d.k, { cat: cat.k, get: k => d.v.find(x => x.k === k)?.v, has: k => d.v.some(x => x.k === k) }])));
function decisionProblems(t) {
  const out = [], ds = decisionsOf(t);
  for (const [id, [cost, cd]] of Object.entries(SPEC_DECISIONS)) {
    const d = ds.get(id);
    if (!d) { out.push(`${id} missing`); continue; }
    if (String(d.get('cost') ?? null) !== String(cost)) out.push(`${id}: cost ${d.get('cost')} (spec ${cost})`);
    if (String(d.get('days_re_enable') ?? null) !== String(cd)) out.push(`${id}: cooldown ${d.get('days_re_enable')} (spec ${cd})`);
  }
  for (const id of ds.keys()) if (!(id in SPEC_DECISIONS)) out.push(`${id} is not in the spec`);
  return out;
}
// The start values of Acceptance 1 and the region table.
const SPEC_SWAY = { Dondor: 0, Belonton: 5, Blackton: 0, Dulundur: 15, Bordon: 25, Dreson: 25, 'Troll Forest': 10, Dun: 10 };
function startProblems(ef) {
  const st = bodyOf(ef, 'zin_dark_startup'), out = [];
  if (!st) return ['no startup effect'];
  for (const s of ['global.zin_dark_border_tension = 35', 'global.zin_dark_accord_resolve = 40', 'zin_goldoroth_temper = 55', 'zin_goldoroth_favour_volcano = 55', 'zin_goldoroth_favour_iron = 50', 'zin_goldoroth_favour_war = 60', 'zin_goldoroth_favour_warrens = 35', 'global.zin_dark_states_total = 47', 'global.zin_dark_raid_dark_added = 0']) if (!st.includes(`set_variable = { ${s} }`)) out.push(s);
  for (const c of countries.filter(x => x.scan === 'Dark Lands' && x.name !== 'Goldoroth')) {
    const block = bodyOf(st.replace(/^\t/gm, ''), c.tag) ?? '';
    const v = SPEC_SWAY[c.name] ?? 20;
    if (!block.includes(`set_variable = { zin_goldoroth_sway = ${v} }`)) out.push(`${c.name} sway ${v}`);
    const bonus = block.includes(`is_neighbor_of = ${GOL}`) && block.includes('add_to_variable = { zin_goldoroth_sway = 10 }');
    if (bonus === ['Dondor', 'Blackton'].includes(c.name)) out.push(`${c.name} border bonus`);
  }
  if (!st.includes('add_ideas = zin_goldoroth_quarrelsome_clans') || !st.includes(`${TRF} = { add_ideas = zin_dark_forest_nobody_enters }`)) out.push('start spirits');
  return out;
}
// The thresholds of sections 3 to 5 and 8, as the effects and triggers carry them.
function thresholdProblems(ef, tr) {
  const out = [], body = n => bodyOf(ef, n) ?? bodyOf(tr, n) ?? '';
  const need = (n, ...ss) => { for (const s of ss) if (!body(n).includes(s)) out.push(`${n}: ${s}`); };
  need('zin_goldoroth_refresh_temper', 'zin_goldoroth_temper > 69.99', 'zin_goldoroth_temper < 60', 'zin_goldoroth_temper > 89.99', 'zin_goldoroth_temper < 80', 'zin_goldoroth_temper < 25.01', 'zin_goldoroth_temper > 35', 'id = zin_dark.43', 'id = zin_dark.42', 'NOT = { has_country_flag = zin_goldoroth_temper_70 }', 'clr_country_flag = zin_goldoroth_temper_90');
  for (const b of BLOCS) need('zin_goldoroth_refresh_favours', `${b.variable} > 74.99`, `${b.variable} < 65`, `${b.variable} < 25.01`, `${b.variable} > 35`, `add_ideas = ${b.boon}`, `add_ideas = ${b.sulk}`);
  need('zin_goldoroth_apply_sway', 'multiply_temp_variable = { zin_dark_gain = 0.5 }', 'set_variable = { zin_goldoroth_sway = 30 }', 'set_variable = { zin_goldoroth_sway = 20 }', 'set_variable = { zin_goldoroth_sway = 40 }', 'set_variable = { zin_goldoroth_sway = 0 }');
  need('zin_goldoroth_yoke_check', 'zin_goldoroth_sway > 49.99', 'zin_goldoroth_sway > 39.99', 'zin_dark_date_yoke = yes', 'zin_dark_is_free_hold = yes');
  need('zin_dark_refresh_shield', 'multiply_variable = { zin_dark_shield_def = 0.001 }', 'multiply_variable = { zin_dark_shield_core = 0.001 }', 'multiply_variable = { zin_dark_shield_ws = 0.0005 }');
  need('zin_dark_pulse', 'global.zin_dark_accord_resolve > 59.99', 'global.zin_dark_accord_resolve < 20', 'id = zin_dark.22', 'zin_dark_sea_bases > 3.99', 'multiply_variable = { zin_dark_sea_bases_scaled = 1.5 }', `add_to_variable = { zin_goldoroth_sway = -0.25 }`, 'add_to_variable = { zin_goldoroth_sway = 0.5 }', 'add_to_variable = { zin_goldoroth_sway = 0.25 }', 'subtract_from_temp_variable = { zin_dark_floor = 10 }', 'clamp_temp_variable = { var = zin_dark_members min = 0 max = 3 }', 'multiply_temp_variable = { zin_dark_members = 0.2 }', 'zin_dark_lowest < 10.01', 'add_to_temp_variable = { zin_dark_temper_delta = 0.6 }', 'add_to_temp_variable = { zin_dark_temper_delta = -1.5 }', 'add_to_variable = { zin_goldoroth_favour_warrens = -0.3 }');
  need('zin_goldoroth_refresh_unity', 'multiply_temp_variable = { zin_dark_held = 100 }', 'divide_temp_variable = { zin_dark_held = global.zin_dark_states_total }', 'zin_goldoroth_unity > 49.99', 'NOT = { has_country_flag = zin_goldoroth_unity_50 }', 'id = zin_dark.60', 'set_temp_variable = { zin_arg_value = 10 }');
  return out;
}

// ------------------------------------------------------------------------------------------------ tests
test('Counts: a data change that adds a date or a hold shows in the counts (negative of the count checks)', async () => {
  const more = await buildWith(d => { d.numbers.dates.extra_floor = [1751, 1, 1]; });
  assert.notEqual(more.r.counts.dateTriggers, dark.counts.dateTriggers);
  const fewer = new Map(assignment); fewer.set(tagOf('Dun'), 'men');
  const s = new Staged(), r = await buildMechDark(s, { countries, assignment: fewer });
  assert.notEqual(r.holdTags.length, HOLDS.length);
});

test('Counts: what the module writes matches the spec', () => {
  assert.equal(dark.counts.events, 34, '31 shown events, the hidden start and the three hidden clash callbacks; .80 and .82 are the events slice\'s');
  assert.equal(dark.counts.decisions, 32, 'the 24 decisions of the spec and 8 tree-flag variants');
  assert.equal(dark.counts.categories, 6); assert.equal(dark.counts.ideas, 18); assert.equal(dark.counts.opinions, 14);
  assert.equal(dark.counts.dynamicModifiers, 3, 'the shield, the troll woods and the defiance cause');
  assert.equal(dark.counts.characters, 6); assert.equal(dark.counts.traits, 2); assert.equal(dark.counts.dateTriggers, 4); assert.equal(dark.counts.windows, 2);
  assert.deepEqual([...dark.holdTags].sort(), HOLDS.map(c => c.tag).sort(), 'every orc and troll realm but Goldoroth'); assert(HOLDS.length > 5);
  assert.deepEqual([...dark.swayTags].sort(), SWAY.map(c => c.tag).sort(), 'the holds and Blackton'); assert(SWAY.includes(countries.find(c => c.name === 'Blackton')));
  for (const c of ['zin_dark_raids', 'zin_dark_horde', 'zin_dark_sway', 'zin_dark_accord', 'zin_dark_free_holds', 'zin_dark_straits']) assert(dark.definitions.categories.includes(c), c);
  for (const e of ['zin_dark_add_border_tension', 'zin_dark_add_accord_resolve', 'zin_goldoroth_add_temper', 'zin_goldoroth_add_favour', 'zin_goldoroth_add_sway', 'zin_goldoroth_yoke_check', 'zin_goldoroth_take_tributary', 'zin_goldoroth_tribute_on_capitulation', 'zin_goldoroth_refresh_unity', 'zin_goldoroth_crown_heir', 'zin_goldoroth_kneel', 'zin_goldoroth_proclaim_one_kingdom', 'zin_goldoroth_core_dark_lands', 'zin_goldoroth_claim_strait_shores', 'zin_goldoroth_wargoal_defiant', 'zin_goldoroth_wargoal_sworn', 'zin_goldoroth_wargoal_strait_south', 'zin_goldoroth_rally_free_dark', 'zin_goldoroth_offer_access_against_dead', 'zin_goldoroth_warking_takes_field', 'zin_dark_add_volgan_pact', 'zin_dark_start_border_clash', 'zin_dark_resolve_raid', 'zin_dark_found_free_moot', 'zin_dark_join_free_moot']) assert(dark.definitions.effects.includes(e), `the spec's effect ${e}`);
  for (const t of ['zin_goldoroth_war_open', 'zin_goldoroth_may_war_dondor', 'zin_goldoroth_refuses_masters', 'zin_goldoroth_seeks_the_south', 'zin_dark_hold_under_cocanoor', 'zin_dark_hold_in_moot', 'zin_dark_hold_fears_cocanoor', 'zin_dark_took_southern_gifts', 'zin_dark_hold_at_war_with_goldoroth', 'zin_dark_is_hold', 'zin_dark_is_free_hold', 'zin_dark_is_tributary', 'zin_dark_is_accord_member', 'zin_dark_is_sea_master', 'zin_dark_holds_strait_shore', 'zin_dark_shore_barred', 'zin_dark_tension_band_quiet', 'zin_dark_tension_band_uneasy', 'zin_dark_tension_band_bloody', 'zin_dark_tension_band_brink', 'zin_goldoroth_unity_at_least', 'zin_dark_rule_independent', 'zin_dark_rule_sworn', 'zin_dark_date_yoke', 'zin_dark_date_war_floor', 'zin_dark_date_defiance_cb', 'zin_dark_date_clash_historical']) assert(dark.definitions.triggers.includes(t), `the spec's trigger ${t}`);
});

test('Determinism: a second build yields the same bytes', async () => {
  const again = new Staged();
  await buildMechDark(again, { countries, assignment });
  const diff = (a, b) => [...new Set([...a.files.keys(), ...b.files.keys()])].filter(k => !a.files.get(k)?.equals(b.files.get(k) ?? Buffer.alloc(0)));
  assert.deepEqual(diff(staged, again), []);
  const tampered = new Staged(); for (const [k, v] of again.files) tampered.files.set(k, Buffer.from(v));
  tampered.files.set('events/zin_dark.txt', Buffer.concat([tampered.files.get('events/zin_dark.txt'), Buffer.from('#')]));
  assert.deepEqual(diff(staged, tampered), ['events/zin_dark.txt'], 'negative: a changed byte is found');
});

test('Parse: every staged script parses with balanced braces, and the check refuses a broken one', () => {
  assert.deepEqual(braceProblems(scriptFiles), []);
  assert.equal(braceProblems(new Map([['x.txt', 'a = {\n\tb = { c = 1 }\n']])).length, 1, 'negative: an open block');
  assert.equal(braceProblems(new Map([['y.txt', 'a = 1 }\nb = {']])).length, 1, 'negative: a block closed too early');
});

test('Operators: no <= or >= in any script', () => {
  assert.deepEqual(operatorProblems(scriptFiles), []);
  assert.deepEqual(operatorProblems(new Map([['x.txt', 'check_variable = { a >= 3 }']])), ['x.txt'], 'negative');
});

const FILE_TABLE = ['common/scripted_effects/zin_dark.txt', 'common/scripted_triggers/zin_dark.txt', 'common/decisions/zin_dark.txt', 'common/decisions/categories/zin_dark.txt', 'common/dynamic_modifiers/zin_dark.txt', 'common/ideas/zin_dark.txt', 'common/opinion_modifiers/zin_dark.txt', 'common/characters/zin_dark.txt', 'common/unit_leader/zin_dark_traits.txt', 'common/country_leader/zin_dark_traits.txt', 'common/on_actions/zin_dark.txt', 'common/ai_strategy/zin_dark.txt', 'events/zin_dark.txt', 'localisation/english/zin_dark_l_english.yml', 'interface/zin_dark_panels.gui', 'common/scripted_guis/zin_dark_panels.txt', 'common/scripted_localisation/zin_dark.txt'];
function fileProblems(files) {
  const out = FILE_TABLE.filter(rel => !files.has(rel)).map(rel => `${rel} missing`);
  for (const [k, v] of files) {
    if (/zin_sites|autonomous_states|game_rules|scripted_triggers\/zin_rules/.test(k)) out.push(`${k} belongs to another owner`);
    if (v.includes('\r')) out.push(`${k} has a carriage return`);
  }
  return out;
}

test('Files: the spec\'s file table is staged, LF only; the site, autonomy and rule files stay their owners\'', () => {
  assert.deepEqual(fileProblems(staged.files), []);
  assert.deepEqual(dark.files, [...staged.files.keys()].sort());
  const bad = new Map(staged.files); bad.delete('events/zin_dark.txt'); bad.set('common/scripted_triggers/zin_sites.txt', Buffer.from('x = {\r\n}\r\n'));
  assert.deepEqual(fileProblems(bad).sort(), ['common/scripted_triggers/zin_sites.txt belongs to another owner', 'common/scripted_triggers/zin_sites.txt has a carriage return', 'events/zin_dark.txt missing'], 'negative');
});

test('Localisation: UTF-8 with BOM, every key the scripts name exists, nothing is empty, only Windows-1252', () => {
  assert(hasBom(staged.files.get('localisation/english/zin_dark_l_english.yml')));
  assert(!hasBom(Buffer.from('l_english:\n')), 'negative: a file without the mark is refused');
  assert.deepEqual(missingLoc(scriptFiles, loc), []);
  const ds = decisionsOf(DEC);
  for (const id of ds.keys()) assert(id in loc && `${id}_desc` in loc, `${id} text`);
  for (const id of [...dark.definitions.categories, ...dark.definitions.ideas, ...dark.definitions.opinions, ...dark.definitions.characters, ...dark.definitions.traits, 'zin_dark_accord_shield', 'zin_dark_troll_woods']) assert(id in loc, `${id} text`);
  for (const id of [...dark.definitions.categories, ...dark.definitions.ideas, ...dark.definitions.traits]) assert(`${id}_desc` in loc, `${id}_desc`);
  for (const [k, v] of Object.entries(loc)) assert(v.trim().length > 0, `${k} is empty`);
  assert.deepEqual(notCp1252(loc), []);
  const scripted = text('common/scripted_localisation/zin_dark.txt');
  const names = new Set([...scripted.matchAll(/name = ([a-z0-9_]+)/g)].map(m => m[1]));
  for (const v of Object.values(loc)) for (const m of v.matchAll(/\[(?:ROOT|This)\.(zin_[a-z0-9_]+)\]/g)) assert(names.has(m[1]), `${m[1]} is no scripted localisation`);
  assert.deepEqual(missingLoc(new Map([['x.txt', 'title = zin_dark_no_such_title\ncustom_effect_tooltip = zin_dark_no_such_tip']]), loc), ['zin_dark_no_such_title', 'zin_dark_no_such_tip'], 'negative');
});

test('Words: no banned or modern word in the text; the module refuses data with one', async () => {
  assert.deepEqual(bannedHits(loc), []);
  const hits = bannedHits({ a: 'The tank division moves with its manpower', b: 'Forty kilometres of road', c: 'An envoy of the nations' });
  assert(hits.length >= 3, hits.join('; '));
  await assert.rejects(buildWith(d => { d.text.zin_dark_raid_marches_desc = 'The tank division moves with its manpower across forty kilometres of road.'; }), /text problems/);
});

test('Secrets: no Erdae or Arda, no Afrit, the Hidden Council or Eindil, no size of Volgan\'s hosts, no fire that ends the dead, no goblin hold', async () => {
  assert.deepEqual(secretHits(loc), []);
  for (const v of Object.values(loc)) assert(!/Erdae|Arda\b/.test(v));
  assert.equal(secretHits({ a: 'The Hidden Council watches.', b: 'Volgan marches with 40,000 dead.', c: 'Fire ends the dead.', d: 'The goblins of Bordon.', e: 'Erdae.' }).length, 5, 'negative: the check finds each');
  for (const word of ['Erdae', 'Arda', 'Afrit', 'Eindil', 'Hidden Council']) await assert.rejects(buildWith(d => { d.text['zin_dark.10.d'] = `The raiders speak of ${word} at the fires.`; }), /no Dark Lands text may name/, `negative: ${word}`);
});

test('Engine vocabulary: every command is an engine effect or trigger, a defined helper or a declared dependency', async () => {
  const known = new Set([...defined, ...externals]);
  assert.deepEqual(await vocabularyProblems(txtFiles, known), []);
  const bad = new Map([['common/scripted_triggers/zin_x.txt', 'zin_x_t = {\n\tthis_trigger_does_not_exist = yes\n\tcustom_trigger_tooltip = {\n\t\ttooltip = zin_x\n\t\thidden_unknown_trigger = yes\n\t}\n}\n'], ['common/scripted_effects/zin_x.txt', 'zin_x_e = {\n\tadd_political_powerr = 5\n\tstart_border_war = { combat_widht = 4 }\n\tmeta_effect = {\n\t\ttext = { not_an_effect = yes }\n\t\tX = "1"\n\t}\n\tzin_x_helper_that_nobody_wrote = yes\n}\n']]);
  const problems = await vocabularyProblems(bad, new Set(['zin_x_t', 'zin_x_e']));
  for (const w of ['this_trigger_does_not_exist', 'hidden_unknown_trigger', 'add_political_powerr', 'combat_widht', 'not_an_effect', 'zin_x_helper_that_nobody_wrote']) assert(problems.some(p => p.includes(w)), `negative: ${w}`);
});

function referenceProblems(script) {
  const out = [], uniq = re => [...new Set([...script.matchAll(re)].map(m => m[1]))];
  const own = new Set(dark.definitions.events), ext = new Set([...DARK_DEPENDENCIES.events, ...DARK_DEPENDENCIES.externalEventRefs]);
  for (const c of uniq(/\b(zin_[a-z0-9_]+) = (?:yes|no)\b/g)) if (!defined.has(c) && !externals.has(c)) out.push(`call ${c}`);
  for (const e of uniq(/\bid = (zin_[a-z]+\.\d+)/g)) if (!own.has(e) && !ext.has(e)) out.push(`event ${e}`);
  for (const i of uniq(/\b(?:add_ideas|remove_ideas|has_idea|idea) = (zin_[a-z0-9_]+)/g)) if (!dark.definitions.ideas.includes(i) && !DARK_DEPENDENCIES.ideas.includes(i)) out.push(`idea ${i}`);
  for (const o of uniq(/\bmodifier = (zin_[a-z0-9_]+)/g)) if (!dark.definitions.opinions.includes(o) && !dark.definitions.dynamicModifiers.includes(o) && !DARK_DEPENDENCIES.dynamicModifiers.includes(o)) out.push(`modifier ${o}`);
  for (const c of uniq(/\b(?:recruit_character|character) = (zin_[a-z0-9_]+)/g)) if (!dark.definitions.characters.includes(c)) out.push(`character ${c}`);
  return out;
}

test('References: every call, event, idea, opinion and character resolves here or is a declared dependency', () => {
  assert.deepEqual(referenceProblems(allScript), []);
  for (const e of DARK_DEPENDENCIES.events) assert(!dark.definitions.events.includes(e) && !eventOf(e), `${e} is the events slice's`);
  for (const s of ['zin_autonomy_tributary_hold', 'zin_autonomy_sworn_realm']) assert(allScript.includes(s));
  assert(!/^zin_autonomy_tributary_hold = \{/m.test(allScript), 'the tributary autonomy state is written by the diplomacy module');
  assert.deepEqual(referenceProblems('zin_dark_unwritten = yes\ncountry_event = { id = zin_dark.99 }\nadd_ideas = zin_dark_no_idea\nmodifier = zin_dark_no_opinion\nrecruit_character = zin_goldoroth_nobody'), ['call zin_dark_unwritten', 'event zin_dark.99', 'idea zin_dark_no_idea', 'modifier zin_dark_no_opinion', 'character zin_goldoroth_nobody'], 'negative');
});

test('Dependencies: every declared dependency is really used, so the list stays honest', () => {
  const unused = list => list.filter(n => !allScript.includes(n));
  for (const [kind, list] of Object.entries(DARK_DEPENDENCIES)) if (kind !== 'gameRules') assert.deepEqual(unused(list), [], kind);
  // The rules are read only through the rules module's wrappers and the story pace it sets.
  const readers = { zin_rule_ai_goldoroth: 'zin_rules_ai_branch_goldoroth_independent', zin_rule_historical_path: 'zin_rules_is_historical', zin_rule_story_pace: 'global.zin_story_pace' };
  assert.deepEqual(DARK_DEPENDENCIES.gameRules.filter(r => !allScript.includes(readers[r] ?? r)), []);
  assert.deepEqual(unused(['zin_dependency_nobody_uses']), ['zin_dependency_nobody_uses'], 'negative');
});

test('Modifiers: every spirit, dynamic modifier and trait key is in the installed modifier documentation', async () => {
  for (const f of ['common/ideas/zin_dark.txt', 'common/dynamic_modifiers/zin_dark.txt']) {
    const mods = {};
    const walkMods = entries => { for (const e of entries) { if (e.k === 'modifier' && Array.isArray(e.v)) for (const x of e.v) mods[x.k] = 1; else if (Array.isArray(e.v)) walkMods(e.v); } };
    walkMods(parse(text(f)));
    for (const top of parse(text(f))) if (Array.isArray(top.v)) for (const x of top.v) if (!Array.isArray(x.v) && !/^(enable|icon)$/.test(x.k)) mods[x.k] = 1;
    await checkMods(f, Object.fromEntries(Object.keys(mods).filter(k => !/^production_speed_[a-z_]+_factor$/.test(k)).map(k => [k, 1])));
  }
  await checkMods('trait', { army_attack_factor: 0.05, army_morale_factor: 0.05 });
  await assert.rejects(() => checkMods('bad', { army_attack_factorr: 0.1 }), /Unknown modifier/, 'negative');
});

test('Start values: tension, resolve, temper, favours, sway with the border bonus, states total and the start spirits', async () => {
  assert.deepEqual(startProblems(EF), []);
  assert.equal(dark.counts.dateTriggers, 4);
  const mut = await buildWith(d => { d.numbers.tension_start = 36; d.roster.sway.Bordon = 30; });
  assert.deepEqual(startProblems(text('common/scripted_effects/zin_dark.txt', mut.s)).sort(), ['Bordon sway 25', 'global.zin_dark_border_tension = 35'].sort(), 'negative: drifted start values are found');
});

test('Roster: the module refuses a missing or misplaced country and a wrong state count (Acceptance 15)', async () => {
  await assert.rejects(buildWith(d => { d.roster.other_holds.push('Nowhere Hold'); }), /not in the roster/);
  await assert.rejects(buildWith(d => { d.roster.other_holds.push('Lerendor'); }), /the roster puts it in/);
  await assert.rejects(buildWith(d => { d.roster.expectedStates = 48; }), /hold 47 states, the data expects 48/);
  await assert.rejects(buildWith(d => { d.roster.other_holds = d.roster.other_holds.filter(n => n !== 'Skragdurg'); }), /missing from the data: Skragdurg/);
  await assert.rejects(buildWith(d => { d.text.zin_dark_unused_line = 'A line nobody reads.'; }), /holds text nothing uses/);
});

test('Assignment: the holds come from the people of the country table', async () => {
  assert(dark.holdTags.includes(tagOf('Troll Forest')) && dark.holdTags.includes(tagOf('Belonton')) && !dark.holdTags.includes(BLK) && !dark.holdTags.includes(DON) && !dark.holdTags.includes(GOL));
  const raidTargets = bodyOf(DEC.replace(/^\t/gm, ''), 'zin_dark_raid_hold');
  assert(raidTargets.includes(tagOf('Bordon')));
  const men = new Map(assignment); men.set(tagOf('Bordon'), 'men');
  const s = new Staged(), r = await buildMechDark(s, { countries, assignment: men });
  assert(!r.holdTags.includes(tagOf('Bordon')), 'negative: a hold of men is no hold');
  assert(!bodyOf(text('common/decisions/zin_dark.txt', s).replace(/^\t/gm, ''), 'zin_dark_raid_hold').includes(tagOf('Bordon')));
});

test('The horde: four blocs with their chiefs and spirits; temper, favour and sway thresholds; the challenge', async () => {
  assert.deepEqual(thresholdProblems(EF, TR), []);
  assert.deepEqual(BLOCS.map(b => [b.key, b.code, b.chief]), [['volcano', 1, 'zin_goldoroth_sungor'], ['iron', 2, 'zin_goldoroth_bord'], ['war', 3, 'zin_goldoroth_britag'], ['warrens', 4, 'zin_goldoroth_snikkit']]);
  const pulse = bodyOf(EF, 'zin_dark_pulse');
  assert(pulse.includes('zin_dark_date_war_floor = yes') && pulse.includes('NOT = { has_country_flag = zin_goldoroth_master_of_clans }') && pulse.includes('has_war = no'), 'a challenge needs the war floor, peace and no master');
  const ev44 = eventOf('zin_dark.44');
  assert(ev44.includes('divide_temp_variable = { zin_dark_win = 4 }') && ev44.includes('add_to_temp_variable = { zin_dark_win = 50 }') && ev44.includes('max = 75') && ev44.includes('zin_goldoroth_crown_heir = yes') && ev44.includes('news_event = { id = zin_dark.45 }'));
  const heir = bodyOf(EF, 'zin_goldoroth_crown_heir');
  assert(heir.includes('kill_country_leader = yes') && heir.includes('ideology = zin_dom_conquest') && heir.includes('add_stability = -0.15') && heir.includes('zin_arg_value = 25') && heir.includes('zin_arg_value = -10') && heir.includes('global.zin_dark_challenger'));
  const chars = text('common/characters/zin_dark.txt');
  assert(chars.includes('traits = { zin_trait_forge_mistress }') && chars.includes('traits = { trickster }') && /zin_goldoroth_rask[\s\S]*navy_leader/.test(chars));
  assert(!bodyOf(EF, 'zin_dark_startup').includes('zin_goldoroth_rask'), 'Rask stays hidden until the tree recruits him');
  const mut = await buildWith(d => { d.numbers.temper_restless = 71; d.numbers.cap_blackton = 45; });
  const p = thresholdProblems(text('common/scripted_effects/zin_dark.txt', mut.s), text('common/scripted_triggers/zin_dark.txt', mut.s));
  assert(p.some(x => x.includes('zin_goldoroth_temper > 69.99')) && p.some(x => x.includes('zin_goldoroth_sway = 40')), 'negative: drifted thresholds are found');
});

test('Decisions: the spec\'s ids, costs and cooldowns; every decision has allowed, an icon and AI; targeted ones are pre-checked', async () => {
  assert.deepEqual(decisionProblems(DEC), []);
  const icons = new Set((await json('presentation-cells.json')).icons.flatMap(s => s.keys).map(k => `GFX_idea_zin_${k}`));
  for (const [id, d] of decisionsOf(DEC)) {
    assert(d.has('allowed') && d.has('ai_will_do') && icons.has(d.get('icon')), `${id}: allowed, ai_will_do and a catalog icon`);
    if (d.has('target_trigger')) assert(d.has('target_root_trigger'), `${id} targeted without a pre-check`);
    if (/raid_marches|raid_hold|corsair/.test(id)) assert.equal(d.get('days_remove'), '30', `${id} is a 30-day mission`);
    const allowed = JSON.stringify(d.get('allowed'));
    assert(!/zin_dark_is_|has_country_flag/.test(allowed), `${id}: allowed is read before any startup flag, so it names tags`);
  }
  const mut = await buildWith(d => { d.numbers.raid_hold_cost = 16; d.numbers.beacons_cooldown_chain = 130; });
  assert.deepEqual(decisionProblems(text('common/decisions/zin_dark.txt', mut.s)).sort(), ['zin_dark_light_beacons_chain: cooldown 130 (spec 120)', 'zin_dark_raid_hold: cost 16 (spec 15)'], 'negative');
  for (const v of ['zin_dark_raid_marches', 'zin_dark_great_moot', 'zin_dark_light_beacons', 'zin_dark_muster_brutes']) {
    const flag = `zin_dark_cd_${v.replace('zin_dark_', '')}`;
    const both = [v, `${v}_${{ zin_dark_raid_marches: 'swift', zin_dark_great_moot: 'central', zin_dark_light_beacons: 'chain', zin_dark_muster_brutes: 'drill' }[v]}`].map(id => bodyOf(DEC.replace(/^\t/gm, ''), id));
    for (const b of both) assert(b.includes(`NOT = { has_country_flag = ${flag} }`) && b.includes(`set_country_flag = { flag = ${flag}`), `${v}: switching variants keeps the cooldown`);
  }
  for (const m of DEC.matchAll(/available = \{([\s\S]*?)\n\t\t\}/g)) assert(!/^\t\t\t(NOT = \{ )?has_(country|global)_flag/m.test(m[1]), 'a flag in an available block is tooltipped');
});

/** The strings a body lacks. */
const missing = (body, list) => list.filter(s => !(body ?? '').includes(s));
const RAID_NEEDS = ['global.zin_dark_raid_dark_added < 2.99', 'zin_arg_value = 0.25', 'add_to_variable = { global.zin_dark_raid_dark_added = 0.25 }', 'zin_arg_value = 8', 'flag = zin_goldoroth_fed days = 90', 'flag = zin_dark_raided_recently days = 365', 'amount = 150', 'army_experience = 10', 'global.zin_gathering_dark > 24.99', 'global.zin_dark_border_tension > 59.99', 'zin_dark_grant_raid_cb = yes', 'id = zin_dark.11', 'id = zin_dark.12', 'id = zin_dark.13', 'modifier = zin_dark_corsair_outrage'];

test('Raids and clashes: no raid declares war; tension, Gathering Dark cap, the casus belli both ways; the clash keeps states before the great war', async () => {
  assert(!/declare_war_on/.test(allScript), 'nothing here declares a war');
  const raid = bodyOf(EF, 'zin_dark_resolve_raid');
  assert.deepEqual(missing(raid, RAID_NEEDS), []);
  const mut = await buildWith(d => { d.numbers.cb_dark = 30; d.numbers.raid_dark_cap = 4; });
  assert.deepEqual(missing(bodyOf(text('common/scripted_effects/zin_dark.txt', mut.s), 'zin_dark_resolve_raid'), RAID_NEEDS), ['global.zin_dark_raid_dark_added < 2.99', 'global.zin_gathering_dark > 24.99'], 'negative');
  assert(raid.indexOf('zin_dark_is_accord_member = yes') < raid.indexOf('zin_world_add_gathering_dark'), 'only a raid on an Accord member stirs the Dark');
  const cb = bodyOf(EF, 'zin_dark_grant_raid_cb');
  assert.equal((cb.match(/modifier = zin_cb_orc_raids/g) ?? []).length, 2); assert(cb.includes('days = 365'));
  const clash = bodyOf(EF, 'zin_dark_start_border_clash');
  assert(clash.includes('change_state_after_war = no') && clash.includes('change_state_after_war = yes') && clash.indexOf('has_global_flag = zin_war_of_last_crowns') < clash.indexOf('change_state_after_war = yes'));
  for (const s of ['combat_width = 40', 'minimum_duration_in_days = 21', 'num_provinces = 3', 'state = event_target:zin_dark_clash_a', 'state = event_target:zin_dark_clash_b', 'zin_dark_date_war_floor = yes', 'zin_is_site_goldoroth_march = yes', 'id = zin_dark.15', 'zin_arg_value = 1']) assert(clash.includes(s), s);
  const end = bodyOf(EF, 'zin_dark_end_clash');
  assert(end.indexOf('clr_global_flag = zin_dark_clash_active') < end.indexOf('zin_dark.16'), 'the callbacks apply once');
  const dec = DEC.replace(/^\t/gm, '');
  assert(bodyOf(dec, 'zin_dark_clash_on_the_march').includes('add_command_power = -10') && bodyOf(dec, 'zin_dark_clash_on_the_march').includes('global.zin_dark_border_tension > 59.99'));
});

test('The Accord: resolve sources, the shield, the fray, the invitation and the guarantors', async () => {
  const ans = bodyOf(EF, 'zin_dark_answer_raid'), paid = bodyOf(EF, 'zin_dark_blood_price_paid');
  const ANSWER = ['zin_arg_value = 3', 'modifier = zin_dark_beacons_lit', 'add_political_power = -40', 'add_war_support = 0.03', 'zin_arg_value = 5'];
  assert.deepEqual(missing(ans, ANSWER), []);
  const mut = await buildWith(d => { d.numbers.answer_beacons = 4; d.numbers.blood_price = 45; });
  assert.deepEqual(missing(bodyOf(text('common/scripted_effects/zin_dark.txt', mut.s), 'zin_dark_answer_raid'), ANSWER), ['zin_arg_value = 3', 'add_political_power = -40'], 'negative');
  assert(paid.includes('zin_arg_value = -15') && paid.includes('add_political_power = 25') && paid.includes('add_political_power = 35') && paid.includes('modifier = zin_dark_blood_price_paid'));
  assert(!bodyOf(DEC.replace(/^\t/gm, ''), 'zin_dark_pay_blood_price').includes('add_political_power = -'), 'the decision\'s cost is the price: no second payment');
  const ev20 = eventOf('zin_dark.20');
  assert(ev20.indexOf('add_to_faction') < ev20.indexOf('zin_dark.20.b'), 'Join is the first option');
  const ev30 = eventOf('zin_dark.30');
  assert(ev30.includes('zin_rules_is_historical = yes') && ev30.includes('give_guarantee = ' + DON) && ev30.includes('id = zin_diplo.23'));
  const ev31 = eventOf('zin_dark.31');
  assert(ev31.includes('has_completed_focus = zin_lerendor_friends_of_the_dark_sea_accord') && ev31.includes('has_completed_focus = zin_lerendor_bargain_with_goldoroth') && ev31.includes('zin_leren_add_lean = yes'));
  assert(bodyOf(TR, 'zin_dark_is_accord_member').includes(`is_in_faction_with = ${DON}`));
  assert(text('common/ai_strategy/zin_dark.txt').includes(`type = prepare_for_war\n\t\tid = "${GOL}"`));
});

test('Sway and the Iron Yoke: the offer, the answers, tributaries, One Fire and the pact that never reaches 3', async () => {
  const ev50 = eventOf('zin_dark.50');
  assert(ev50.indexOf('zin_goldoroth_take_tributary = yes') < ev50.indexOf('set_country_flag = zin_dark_refused_yoke'), 'Bend the knee is the first option');
  assert(ev50.includes('zin_dark_date_defiance_cb = yes') && ev50.includes('zin_dark_grant_hold_cb = yes') && ev50.includes('modifier = zin_dark_yoke_refused') && ev50.includes('-10 }'));
  const take = bodyOf(EF, 'zin_goldoroth_take_tributary');
  assert(take.includes('autonomy_state = zin_autonomy_tributary_hold') && take.includes('add_ideas = zin_dark_tributary_hold') && take.includes('id = zin_dark.51'));
  const dec = DEC.replace(/^\t/gm, '');
  assert(bodyOf(dec, 'zin_dark_one_fire').includes('zin_dark_tribute_days > 364.99') && bodyOf(dec, 'zin_dark_one_fire_hard').includes('zin_dark_tribute_days > 179.99') && bodyOf(dec, 'zin_dark_one_fire_hard').includes('zin_goldoroth_sway > 69.99'));
  const pactOk = body => /zin_dark_pact_was < 2\.99[\s\S]*set_variable = \{ zin_volgan_pact = 2 \}/.test(body ?? '');
  assert(pactOk(bodyOf(EF, 'zin_dark_add_volgan_pact')));
  assert(!pactOk(bodyOf(EF, 'zin_dark_add_volgan_pact').replace('set_variable = { zin_volgan_pact = 2 }', '')), 'negative: a pact effect without the guard is refused');
  assert(!/set_variable = \{ zin_volgan_pact = 3 \}/.test(allScript), 'nothing here sets a pact of 3');
  const yoke = bodyOf(dec, 'zin_dark_offer_iron_yoke');
  assert(yoke.includes('zin_dark_date_yoke = yes') && yoke.includes('is_in_faction = no'));
  assert(loc.zin_dark_tt_yoke_sway.includes(String(D.numbers.yoke_sway)) && loc.zin_dark_tt_yoke_sway_cheap.includes(String(D.numbers.yoke_sway_cheap)) && loc.zin_dark_tt_one_fire.includes(String(D.numbers.one_fire_sway)), 'the tooltips say the numbers the script checks');
});

test('The Free Moot: the call, the tree hooks that act once, the ride, the refusals and the break', () => {
  const found = bodyOf(EF, 'zin_dark_found_free_moot'), join = bodyOf(EF, 'zin_dark_join_free_moot');
  const once = body => /^zin_dark_found_free_moot = \{\n\tif = \{\n\t\tlimit = \{\n\t\t\tNOT = \{ has_global_flag = zin_dark_free_moot \}[\s\S]*\n\t\tset_global_flag = zin_dark_free_moot\n/.test(body);
  assert(once(found), 'founding is idempotent (Acceptance 17)');
  assert(!once(found.replace('NOT = { has_global_flag = zin_dark_free_moot }', 'always = yes')), 'negative: a founding without the guard is refused');
  assert(found.includes('id = zin_dark.70') && join.includes('modifier = zin_dark_moot_kin') && join.indexOf('every_country') < join.indexOf('set_country_flag = zin_dark_moot_member'), 'the joiner is not its own kin');
  const war = bodyOf(EF, 'zin_dark_on_declare_war');
  assert(war.includes('NOT = { tag = FROM }') && war.includes('id = zin_dark.71'), 'every other member rides');
  const ev71 = eventOf('zin_dark.71');
  assert(ev71.indexOf('add_to_war') < ev71.indexOf('zin_dark_moot_refusals'), 'The Moot rides is the first option') ;
  assert(ev71.includes('zin_dark_moot_refusals > 1.99'));
  assert(bodyOf(EF, 'zin_dark_pulse').includes('zin_dark_moot_count < 2') && bodyOf(TR, 'zin_dark_moot_eligible').includes('zin_volgan_pact < 2.01'));
  assert(bodyOf(TR, 'zin_dark_moot_may_be_called').includes('zin_goldoroth_unity > 29.99'));
  assert(text('common/decisions/zin_dark.txt').includes(`original_tag = ${tagOf('Dulundur')}`), 'Dulundur calls the Moot first');
  const ai = text('common/ai_strategy/zin_dark.txt');
  assert(ai.includes(`zin_dark_goldoroth_defiant_${tagOf('Bordon').toLowerCase()}`) && ai.includes('zin_goldoroth_war_open = yes') && ai.includes('has_country_flag = zin_dark_refused_yoke'), 'at war, Goldoroth turns on the defiant holds first');
});

const KNEEL_NEEDS = ['autonomy_state = zin_autonomy_sworn_realm', `zin_arg_stance = ${stanceCode('zin_shadow_horde')}`, 'zin_politics_set_stance = yes', 'ruling_party = communism', 'zin_goldoroth_sworn_to_nafeher', 'zin_arg_value = 5', 'zin_arg_value = -15', 'zin_arg_value = 3', 'id = zin_dark.62', 'zin_goldoroth_sway > 59.99', 'zin_arg_value = -20'];
test('Volgan\'s envoys: a kneel that drifts from the spec is found (negative)', async () => {
  const mut = await buildWith(d => { d.numbers.kneel_strength = 6; d.numbers.kneel_stance = 'zin_shadow_dread'; });
  assert.deepEqual(missing(bodyOf(text('common/scripted_effects/zin_dark.txt', mut.s), 'zin_goldoroth_kneel'), KNEEL_NEEDS), [`zin_arg_stance = ${stanceCode('zin_shadow_horde')}`, 'zin_arg_value = 5']);
  assert.throws(() => stanceCode('zin_no_stance'), /Unknown stance/);
});

test('Volgan\'s envoys: the acceptance triggers, the hunt, the envoy flag and kneeling', () => {
  assert(bodyOf(TR, 'zin_goldoroth_refuses_masters').includes('zin_goldoroth_no_masters') && bodyOf(TR, 'zin_goldoroth_seeks_the_south').includes('zin_goldoroth_southern_bargain'));
  assert(bodyOf(TR, 'zin_dark_hold_fears_cocanoor').includes('zin_goldoroth_sway > 39.99') && bodyOf(TR, 'zin_dark_hold_fears_cocanoor').includes('zin_goldoroth_sway < 80'));
  const hunt = bodyOf(DEC.replace(/^\t/gm, ''), 'zin_dark_hunt_envoys');
  for (const s of ['zin_arg_value = -1', 'zin_dark_add_volgan_pact = yes', 'zin_volgan_add_veil = yes', 'id = zin_dark.85', 'modifier = zin_dark_envoys_hunted', 'zin_dark_is_tributary = no']) assert(hunt.includes(s), s);
  assert(bodyOf(EF, 'zin_dark_pulse').includes('has_completed_focus = zin_volgan_goldoroth_question') && bodyOf(EF, 'zin_dark_pulse').includes('set_country_flag = zin_goldoroth_envoy_heard'));
  const kneel = bodyOf(EF, 'zin_goldoroth_kneel');
  assert.deepEqual(missing(kneel, KNEEL_NEEDS), []);
  assert(eventOf('zin_dark.85') && !eventOf('zin_dark.85').includes('zin_dark_refused_nafeher'), 'the hunt is not a refusal of Nafeher');
});

test('The sea and the straits: mastery, the shore triggers, tolls, closing, the Zol hook and the southern war goal', async () => {
  const mut = await buildWith(d => { d.numbers.shore_fort_level = 3; d.numbers.tolls_pp = 45; d.numbers.sea_master_min = 5; });
  const mutTr = text('common/scripted_triggers/zin_dark.txt', mut.s), mutDec = text('common/decisions/zin_dark.txt', mut.s).replace(/^\t/gm, ''), mutEf = text('common/scripted_effects/zin_dark.txt', mut.s);
  assert.deepEqual([...missing(bodyOf(mutTr, 'zin_dark_shore_barred'), ['level > 1']), ...missing(bodyOf(mutDec, 'zin_dark_levy_shore_tolls'), ['add_political_power = 40']), ...missing(bodyOf(mutEf, 'zin_dark_pulse'), ['zin_dark_sea_bases > 3.99'])], ['level > 1', 'add_political_power = 40', 'zin_dark_sea_bases > 3.99'], 'negative: drifted strait and sea numbers are found');
  const shore = bodyOf(TR, 'zin_dark_holds_strait_shore');
  assert(shore.includes('zin_arg_strait = 1') && shore.includes('zin_is_site_dark_strait_north_shore') && shore.includes('zin_arg_strait = 2') && shore.includes('zin_is_site_dark_strait_south_shore'));
  const barred = bodyOf(TR, 'zin_dark_shore_barred');
  assert(barred.includes('building = coastal_bunker') && barred.includes('level > 1') && barred.includes(`has_war_with = ${ZOL}`));
  const dec = DEC.replace(/^\t/gm, '');
  assert(bodyOf(dec, 'zin_dark_levy_shore_tolls').includes('add_political_power = 40') && bodyOf(dec, 'zin_dark_levy_shore_tolls').includes(`${LER} = { add_opinion_modifier`) && bodyOf(dec, 'zin_dark_levy_shore_tolls').includes(`${AEN} = { add_opinion_modifier`) && bodyOf(dec, 'zin_dark_levy_shore_tolls').includes('is_subject = no'));
  assert(bodyOf(dec, 'zin_dark_close_strait').includes('idea = zin_dark_strait_closed days = 180'));
  const zol = bodyOf(EF, 'zin_dark_on_zol_rising');
  assert(zol.includes('zin_is_site_dark_strait_north_shore') && zol.includes('zin_is_site_ocean_of_zol_coast') && zol.includes('id = zin_dark.80') && zol.includes('zin_dark_shore_warned'));
  assert(bodyOf(EF, 'zin_dark_pulse').includes('zin_dark_on_zol_rising = yes') && bodyOf(EF, 'zin_dark_pulse').includes('zin_dark_on_body_destroyed = yes'));
  const south = bodyOf(EF, 'zin_goldoroth_wargoal_strait_south');
  assert(south.includes('type = take_state') && south.includes('generator = { [STATE] }') && south.includes('zin_is_site_dark_strait_south_far'));
  const sea = bodyOf(EF, 'zin_dark_pulse');
  assert(sea.includes('building_level@naval_base') && sea.includes('add_ideas = zin_dark_sea_master') && sea.indexOf('zin_dark_new_master = THIS') < sea.indexOf('remove_ideas = zin_dark_sea_master'), 'the master keeps its spirit while it stays master');
});

test('Events: every shown event takes 30 days, news events have a news picture, every picture is a catalog key', () => {
  assert.deepEqual(eventProblems(EV), []);
  assert.equal(eventProblems('country_event = {\n\tid = zin_dark.999\n\ttitle = x\n\tdesc = x\n\tpicture = GFX_zin_evt_not_a_picture\n\ttimeout_days = 30\n\toption = { name = x }\n}\nnews_event = {\n\tid = zin_dark.998\n\tpicture = GFX_zin_news_generic_wilds\n\ttimeout_days = 30\n\toption = { name = x }\n}').length, 2, 'negative: an unknown picture and a news event without a news crop');
  for (const id of ['zin_dark.15', 'zin_dark.45', 'zin_dark.52', 'zin_dark.60', 'zin_dark.61', 'zin_dark.62']) assert(new RegExp(`news_event = \\{\\n\\tid = ${id.replace('.', '\\.')}\\n`).test(EV), `${id} is news`);
  for (const id of dark.definitions.events) assert(/^zin_dark\.\d+$/.test(id));
});

test('Rules: the game rules are read only through the rules module\'s wrappers; RANDOM is drawn once at the start', () => {
  assert.deepEqual(ruleReadProblems(scriptFiles), []);
  assert.deepEqual(ruleReadProblems(new Map([['x.txt', 'has_game_rule = { rule = zin_rule_ai_goldoroth option = RANDOM }']])), ['x.txt reads a game rule directly'], 'negative');
  const reads = [...allScript.matchAll(/zin_rules_ai_branch_goldoroth_(independent|sworn_to_volgan) = yes/g)];
  assert.equal(reads.length, 2, 'only zin_dark_rule_independent and zin_dark_rule_sworn read the branches');
  assert(bodyOf(TR, 'zin_dark_rule_independent').includes('global.zin_dark_rule_roll = 1') && bodyOf(TR, 'zin_dark_rule_sworn').includes('global.zin_dark_rule_roll = 2'));
  const st = bodyOf(EF, 'zin_dark_startup');
  assert(st.includes('zin_rules_ai_random_goldoroth = yes') && st.includes('random_list'));
  assert(/id = zin_dark\.1\n\thidden = yes\n\tfire_only_once = yes/.test(EV), 'the roll is drawn once');
  assert(bodyOf(DEC.replace(/^\t/gm, ''), 'zin_dark_clash_on_the_march').includes('zin_rules_is_historical = yes\n\t\t\tNOT = { zin_dark_date_clash_historical = yes }'), 'the historical AI never clashes before 1754');
});

test('Story pace: each date trigger is written for the three paces; the slow war floor lies half as far again from the start', () => {
  for (const [key, [y, m, d]] of Object.entries(D.numbers.dates)) {
    const body = bodyOf(TR, `zin_dark_date_${key}`);
    const dates = paceDates(body);
    assert.equal(dates.length, 3, key);
    for (const pace of Object.values(PACES)) assert(dates.includes(paceDate(y, m, d, pace)), `${key} at pace ${pace}`);
    assert.equal([...body.matchAll(/global\.zin_story_pace/g)].length, 6, 'four pace bands, two of them bounded on both sides');
  }
  assert.deepEqual(Object.keys(D.numbers.dates), ['yoke', 'war_floor', 'defiance_cb', 'clash_historical']);
  assert.equal(paceDate(1749, 1, 1, 1), '1749.1.1'); assert(paceDates(bodyOf(TR, 'zin_dark_date_war_floor')).includes(paceDate(1749, 1, 1, 1.5)));
  assert(new Date(paceDate(1749, 1, 1, 1.5).replace(/\./g, '-')) > new Date('1749-01-01'), 'a slow pace moves the floor later (Acceptance 16)');
  assert.equal(paceDates('zin_x = {\n\tdate > 1750.1.1\n}').length, 1, 'negative: a date written once is found');
});

test('On actions: the pulse runs on Goldoroth\'s or Dondor\'s month, never on an every-country periodic action', () => {
  assert.deepEqual(periodicProblems(scriptFiles), []);
  const oa = text('common/on_actions/zin_dark.txt');
  assert(oa.includes(`on_monthly_${GOL} = {`) && oa.includes(`on_monthly_${DON} = {`) && oa.includes('zin_dark_is_runner = yes') && oa.includes('id = zin_dark.1'));
  assert(oa.includes('on_declare_war') && oa.includes('on_capitulation'));
  assert.deepEqual(periodicProblems(new Map([['x.txt', 'on_actions = {\n\ton_monthly = {\n\t}\n}']])), ['x.txt: every-country on_monthly'], 'negative');
  const pulse = bodyOf(EF, 'zin_dark_pulse');
  assert(pulse.lastIndexOf('mark_focus_tree_layout_dirty = yes') > pulse.indexOf('zin_dark_refresh_panel_rows = yes'), 'the layouts are refreshed last (E4)');
});

test('Windows: the Horde and Accord panels under the interface spec\'s names; every element, list and sprite resolves', () => {
  const gui = text('interface/zin_dark_panels.gui'), sg = text('common/scripted_guis/zin_dark_panels.txt');
  assert.deepEqual(windowProblems(gui, sg), []);
  for (const [w, g, flag, vis] of [['zin_horde_window', 'zin_horde', 'zin_ui_horde_open', `original_tag = ${GOL}`], ['zin_accord_window', 'zin_accord', 'zin_ui_accord_open', 'is_faction_leader = yes']]) {
    assert(gui.includes(`name = "${w}"`) && sg.includes(`\t${g} = {`) && sg.includes(`window_name = "${w}"`) && sg.includes(`has_country_flag = ${flag}`) && sg.includes(vis), w);
  }
  const meters = text('common/scripted_effects/zin_dark_panels.txt');
  assert(meters.includes('global.zin_dark_sway_rows^zin_ui_at') && meters.includes('global.zin_dark_accord_rows^zin_ui_at') && bodyOf(EF, 'zin_dark_refresh_panel_rows').includes('add_to_array') && bodyOf(EF, 'zin_dark_refresh_panel_rows').includes('zin_dark_ui_meters = yes'), 'fixed rows filled from the arrays the pulse keeps');
  assert(onGrid(gui), 'every position and size on the 4 px grid');
  for (const b of BLOCS) assert(gui.includes(`zin_horde_bloc_${b.key}_mark`) && sg.includes(`has_country_flag = zin_goldoroth_heir_${b.key}`), `the heir's mark on ${b.key}`);
  assert.equal((sg.match(/ai_enabled = \{\s*always = no/g) ?? []).length, 2, 'the AI never opens a panel');
  assert(!gui.includes('zin_accord_button_window') && !sg.includes('zin_accord_launcher = {'), 'the Aoaz bar opens the Accord panel: no launcher of its own');
  assert(!gui.includes('zin_horde_button_window') && !sg.includes('zin_horde_launcher = {'), 'the Aoaz bar opens the Horde panel: no launcher of its own');
  assert(!/(zin_volgan_pact|Nafeher)/.test(gui + Object.entries(loc).filter(([k]) => /^zin_(horde|accord)_/.test(k)).map(([, v]) => v).join(' ')), 'neither panel shows Volgan\'s pacts');
  const sway = text('common/scripted_localisation/zin_dark.txt');
  for (const k of ['zin_dark_sway_free', 'zin_dark_sway_courted', 'zin_dark_sway_pressed', 'zin_dark_sway_yoked']) assert(sway.includes(`localization_key = ${k}`));
  assert(sway.includes('zin_goldoroth_sway > 49.99') && sway.includes('zin_goldoroth_sway > 24.99'), 'the bands Free 0-24, Courted 25-49, Pressed 50-79');
  assert(windowProblems(gui.replace('name = "zin_horde_close"', 'name = "zin_horde_shut"'), sg).includes('element zin_horde_close'), 'negative: a renamed element is found');
  assert(windowProblems(gui.replace('GFX_zin_frame', 'GFX_zin_no_sprite'), sg).some(p => p.startsWith('sprite')), 'negative: an unknown sprite is found');
});

test('Panels off: the builder can leave the windows to the interface module', async () => {
  const s = new Staged(); const r = await buildMechDark(s, { countries, assignment, panels: false });
  assert(!s.files.has('interface/zin_dark_panels.gui') && !s.files.has('common/scripted_guis/zin_dark_panels.txt') && r.counts.windows === 0);
  assert(s.files.has('common/scripted_effects/zin_dark.txt') && text('common/scripted_localisation/zin_dark.txt', s).includes('name = zin_dark_sway_line'), 'the Free Holds category keeps its sway line');
  assert(!Object.keys(locOf(s)).some(k => /^zin_(horde|accord)_/.test(k)), 'the window texts stay with the windows');
});

const zolProblems = (script, entries) => [...(/zin_zol_manifested|zin_zol_manifest\b/.test(script) ? ['a Zol manifestation name'] : []), ...Object.entries(entries).filter(([, v]) => /Zol (walks|appears|manifests|comes in person)/i.test(v)).map(([k]) => `${k}: Zol in person`)];
test('Zol: nothing here reads or sets the manifestation of Zol, and no text brings him in person', () => {
  assert.deepEqual(zolProblems(allScript, loc), []);
  assert.deepEqual(zolProblems('has_global_flag = zin_zol_manifested', { a: 'Zol walks on the shore.' }), ['a Zol manifestation name', 'a: Zol in person'], 'negative');
});
