// Tests of the Lands of the Sun mechanic (docs/design/stage2/mech_sun.md, spec docs/specs/04_mechanics/lands_of_the_sun.md): Lorien's
// counsel, the Noon Council and its concord, the Noon League, the Mirror of First Rain, and Lorien's last march and death. The module is
// built into a fresh Staged with the roster (lib/roster.mjs) and the people assignment of docs/design/countries.csv; nothing
// needs a prior build. The installed game is read for engine vocabulary (effects, triggers, modifiers). Every rule has a positive
// check on the real output and at least one negative test that mutates the data or the output and shows the check or the module
// refusing it.
// Run: cd tools && node --test content/mech_sun.test.mjs
import test from 'node:test';
import { countryTable } from './lib/roster.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { parse, tokenize } from './lib/clausewitz.mjs';
import { ZIN } from './lib/paths.mjs';
import { loadCountryTable } from './modules/countries.mjs';
import { buildMechSun, loadSunData, SIGHTS, SUN_DEPENDENCIES } from './modules/mech_sun.mjs';
import { checkCommands } from './lib/mp_check.mjs';
import { dateTrigger, paceDate, knownIcons, gameVocabulary } from './lib/mech_kit.mjs';
import { readable, notCp1252, checkMods } from './lib/inst_util.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { loadGlossary } from './lib/text_engine.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const json = async f => JSON.parse(await readFile(path.join(here, 'data', f), 'utf8'));
const countries = countryTable();
const table = await loadCountryTable(countries, `${ZIN}/docs/design/countries.csv`);
const assignment = new Map([...table].map(([tag, t]) => [tag, t.people]));
const DATA = await loadSunData();
const clone = () => structuredClone(DATA);
const N = DATA.numbers;
const build = async (data = DATA) => { const s = new Staged(); const r = await buildMechSun(s, { countries, assignment, data }); return { s, r }; };
const { s: staged, r: sun } = await build();

const tagOf = n => { const c = countries.find(x => x.name === n); assert(c, `${n} is not in the roster`); return c.tag; };
// Gala is the realm of the Gala Elves (the old rows Gala and North Gala joined it); Puvulan holds the Volgan role of the Southern Dominion.
const GALA = tagOf('Gala'), LOL = tagOf('The Lands of Light'), AENOR = tagOf('Aenor'), ZOL = tagOf("Zol's Mistake"), VOLGAN = tagOf('Puvulan');
const text = rel => { const b = staged.files.get(rel); assert(b, `missing staged file ${rel}`); return b.toString('utf8'); };
const scriptFiles = new Map([...staged.files].filter(([k]) => k.endsWith('.txt')).map(([k, v]) => [k, v.toString('utf8')]));
const allScript = [...scriptFiles.values()].join('\n');
const LOC = 'localisation/english/zin_sun_l_english.yml';
const locOf = t => Object.fromEntries([...t.matchAll(/^ ([A-Za-z0-9_.@-]+):0 "(.*)"$/gm)].map(m => [m[1], m[2]]));
const locEntries = locOf(text(LOC));
const EF = text('common/scripted_effects/zin_sun.txt'), TR = text('common/scripted_triggers/zin_sun.txt'), EV = text('events/zin_sun.txt');
const DEC = text('common/decisions/zin_sun.txt'), ON = text('common/on_actions/zin_sun.txt');
/** The body of a top-level `name = { ... }` block of a script text. */
const blockOf = (t, name) => {
  const start = t.indexOf(`\n${name} = {`) + 1 || (t.startsWith(`${name} = {`) ? 0 : -1);
  assert(start >= 0, `${name} is not defined`);
  let depth = 0;
  for (let i = t.indexOf('{', start); i < t.length; i++) { if (t[i] === '{') depth++; if (t[i] === '}' && --depth === 0) return t.slice(start, i + 1); }
  throw new Error(`${name} is not closed`);
};
const eventBlock = (t, id) => { const at = t.indexOf(`\tid = ${id}\n`); assert(at > 0, `${id} is not defined`); const start = t.lastIndexOf('\n', t.lastIndexOf('_event = {', at)) + 1; return blockOf(t.slice(start - 1), t.slice(start, t.indexOf(' = {', start))); };
const decisionBlock = id => { const at = DEC.indexOf(`\t${id} = {\n`); assert(at > 0, `${id} is not a decision`); return blockOf(DEC.slice(at).replace(/^\t/gm, ''), id); };

// ------------------------------------------------------------------------------------------------ checks used by the rules
/** Brace balance and parse of one script text. */
const braceProblems = (f, t) => {
  const out = []; let depth = 0, min = 0;
  for (const tk of tokenize(t)) { if (tk.t === '{') depth++; if (tk.t === '}') { depth--; min = Math.min(min, depth); } }
  if (depth !== 0) out.push(`${f} is unbalanced`); if (min < 0) out.push(`${f} closes too early`);
  try { parse(t); } catch (e) { out.push(`${f}: ${e.message}`); }
  return out;
};
const operatorProblems = (f, t) => (/<=|>=/.test(t) ? [`${f} uses <= or >=`] : []);
/** Every localisation key the script names: titles, descriptions, options, tooltips, cost texts, and every decision, category, idea and opinion. */
function namedKeys(files) {
  const need = new Set();
  for (const [f, t] of files) {
    for (const m of t.matchAll(/\b(?:title|desc|name|text|tooltip|custom_cost_text) = ([A-Za-z0-9_.]+)/g)) if (/^zin_/.test(m[1])) need.add(m[1]);
    if (/^common\/(decisions\/categories|decisions|ideas|opinion_modifiers)\//.test(f)) {
      const top = parse(t);
      const ids = f.includes('/categories/') ? top.map(e => e.k) : f.includes('/ideas/') ? top[0].v[0].v.map(e => e.k) : f.includes('opinion_modifiers') ? top[0].v.map(e => e.k) : top.flatMap(c => c.v.map(e => e.k));
      for (const id of ids) { need.add(id); if (!f.includes('opinion_modifiers')) need.add(`${id}_desc`); }
    }
  }
  return [...need];
}
const missingKeys = (files, entries) => namedKeys(files).filter(k => !(k in entries));
const bannedRules = compileBanned(await loadRuleSet({ glossary: await loadGlossary() }));
const bannedHits = entries => Object.entries(entries).flatMap(([k, v]) => findBanned(readable(v), bannedRules, ['error']).map(h => `${k}: ${h.word} (${h.id})`));
const settingHits = entries => Object.entries(entries).filter(([, v]) => /\b(Erdae|Arda)\b/.test(v)).map(([k]) => k);
// The secret and the open questions (spec section 1 and Acceptance 4): no Afrit, no Hidden Council, no Deliverer, no Eindil or line of Aen
// before the naming; no kinship, rule or lordship between the Gala elves and the Sunhot elves; no tie to the countries Gala and North Gala.
const SECRET = /Afrit|Hidden Council|Deliverer|Eindil|Einendil|son of Ein|line of Aen|Aen's line|Man from the Ice/i;
const OPEN = /\bkin\b|\bkindred\b|kinsfolk|kinsmen|\bsubjects?\b|\bvassals?\b|their lords|North Gala/i;
const secretHits = entries => Object.entries(entries).filter(([, v]) => SECRET.test(v) || OPEN.test(v)).map(([k, v]) => `${k}: ${v.slice(0, 60)}`);
/** The fixed story dates of a script (V4, R2): every `date >` or `date <` must sit in a three-pace story date trigger. */
function rawDates(t) {
  const out = [];
  for (const m of t.matchAll(/^.*\bdate [<>] (\d+\.\d+\.\d+).*$/gm)) if (!/global\.zin_story_pace/.test(m[0])) out.push(m[1]);
  return out;
}
/** has_country_leader takes a parameter block that the shared command walk does not know; it is checked as the documented trigger itself. */
const flattenParamBlocks = t => t.replace(/has_country_leader = \{[^{}]*\}/g, 'has_country_leader = yes');
const vocabularyOf = async files => {
  const known = new Set([...sun.definitions.effects, ...sun.definitions.triggers, ...SUN_DEPENDENCIES.effects, ...SUN_DEPENDENCIES.triggers]);
  return checkCommands(new Map([...files].map(([k, v]) => [k, flattenParamBlocks(v)])), known);
};
/**
 * A minimal ai_chance / ai_will_do evaluator over the written text: the base, then every modifier in order; `when` receives the
 * modifier's condition lines (its text without the add or factor line) and decides whether they hold.
 */
function aiValue(block, when) {
  let v = Number(/^\s*base = (-?[\d.]+)/m.exec(block)?.[1] ?? 0);
  for (const m of block.matchAll(/modifier = \{\n/g)) {
    let depth = 1, i = m.index + m[0].length;
    for (; depth; i++) { if (block[i] === '{') depth++; if (block[i] === '}') depth--; }
    const lines = block.slice(m.index + m[0].length, i - 1).split('\n'), op = lines.find(l => /^\s*(add|factor) = /.test(l));
    const cond = lines.filter(l => l !== op).join('\n');
    if (!when(cond)) continue;
    const [, kind, n] = /(add|factor) = (-?[\d.]+)/.exec(op);
    v = kind === 'factor' ? v * Number(n) : v + Number(n);
  }
  return Math.max(0, v);
}
/** The ai_chance blocks of an event, in option order. */
const aiBlocks = ev => [...ev.matchAll(/\tai_chance = \{\n([\s\S]*?)\n\t\t\}\n/g)].map(m => m[1]);
const condText = cond => cond;

// ================================================================================================ rules
test('Counts and ids: what the module writes matches the spec', () => {
  assert.deepEqual(sun.counts, { effects: 20, triggers: 17, events: 9, decisions: 10, categories: 3, ideas: 11, opinions: 1, textKeys: Object.keys(locEntries).length });
  assert.deepEqual(sun.definitions.events, ['zin_sun.5', 'zin_sun.6', 'zin_sun.10', 'zin_sun.20', 'zin_sun.21', 'zin_sun.30', 'zin_sun.31', 'zin_sun.35', 'zin_sun.36']);
  assert.deepEqual(sun.definitions.categories, ['zin_sun_counsel', 'zin_sun_mirror', 'zin_sun_council']);
  assert.deepEqual(sun.definitions.ideas, ['zin_sun_council_timber', 'zin_sun_heeded_north', 'zin_sun_heeded_south', 'zin_sun_heeded_seas', 'zin_sun_heeded_east', 'zin_sun_kings_ride', 'zin_sun_old_powers_stand_1', 'zin_sun_old_powers_stand_2', 'zin_sun_old_powers_stand_3', 'zin_sun_king_fallen', 'zin_sun_mourning']);
  for (const e of ['zin_sun_add_gala_counsel', 'zin_sun_add_concord', 'zin_sun_add_old_lords', 'zin_sun_add_clarity', 'zin_sun_spend_clarity', 'zin_sun_mirror_vision', 'zin_sun_send_warning', 'zin_sun_form_noon_league', 'zin_sun_lorien_rides', 'zin_sun_lorien_falls', 'zin_sun_monthly']) assert(sun.definitions.effects.includes(e), `effect ${e} (spec, "Scripted effects")`);
  for (const t of ['zin_sun_is_lands_of_the_sun_country', 'zin_sun_is_sunhot_realm', 'zin_sun_is_elven_realm', 'zin_sun_is_gala', 'zin_sun_mirror_available', 'zin_sun_league_needed']) assert(sun.definitions.triggers.includes(t), `trigger ${t} (spec, "Scripted triggers")`);
  assert(!sun.definitions.triggers.includes('zin_is_site_gala') && !/^zin_is_site_gala = \{/m.test(TR), 'the site trigger is the key-sites table\'s');
});

test('Negative: an event id the spec retires or a missing event is refused by the id check', () => {
  const ids = t => [...t.matchAll(/^\tid = (zin_sun\.\d+)$/gm)].map(m => m[1]);
  const check = t => { const got = ids(t), want = sun.definitions.events; return [...want.filter(i => !got.includes(i)).map(i => `missing ${i}`), ...got.filter(i => !want.includes(i)).map(i => `extra ${i}`), ...(got.includes('zin_sun.43') ? ['zin_sun.43 is retired (O4)'] : [])]; };
  assert.deepEqual(check(EV), []);
  assert(check(EV.replace('id = zin_sun.36', 'id = zin_sun.43')).some(p => p.includes('retired')));
  assert(check(EV.replace('\tid = zin_sun.21\n', '\tid = zin_sun.22\n')).some(p => p === 'missing zin_sun.21'));
});

// The roster of 24 October 2026 counts 10 Lands of the Sun realms, 7 of them Sunhot (the data's expected counts; many old rows merged).
test('Roster: the Lands of the Sun countries and Sunhot realms of the data, the Lands of Light and the Gala Elves with a capital state', () => {
  const sunland = countries.filter(c => c.scan === 'Sunhot');
  assert.equal(sunland.length, DATA.roster.expectedCountries);
  assert.equal(sunland.filter(c => assignment.get(c.tag) === 'sun_elves').length, DATA.roster.expectedSunhotRealms);
  assert.equal(sun.tags.sunhotRealms, DATA.roster.expectedSunhotRealms);
  assert(DATA.roster.expectedSunhotRealms > 1 && DATA.roster.expectedSunhotRealms < DATA.roster.expectedCountries);
  assert.equal(sun.tags.gala, GALA); assert.equal(sun.tags.landsOfLight, LOL);
  assert(countries.find(c => c.tag === GALA).capitalState > 0, 'the Gala Elves have a capital state');
  const list = parse(TR).find(e => e.k === 'zin_sun_is_lands_of_the_sun_country').v[0].v.map(e => e.v);
  assert.deepEqual([...list].sort(), sunland.map(c => c.tag).sort());
  for (const name of ['Goodin', 'Gala']) assert.notEqual(assignment.get(tagOf(name)), 'sun_elves', `${name} is no Sunhot realm`);
});

test('Negative: the module refuses a roster count, a missing name or a realm outside the region', async () => {
  const realms = DATA.roster.expectedSunhotRealms, lands = DATA.roster.expectedCountries;
  const a = clone(); a.roster.expectedSunhotRealms = realms - 1;
  await assert.rejects(() => build(a), new RegExp(`${realms} Sunhot realms, the data expects ${realms - 1}`));
  const b = clone(); b.roster.expectedCountries = lands - 1;
  await assert.rejects(() => build(b), new RegExp(`${lands} Sunhot countries`));
  const c = clone(); c.roster.igara = 'Igaraa';
  await assert.rejects(() => build(c), /not in the roster/);
  const d = clone(); d.roster.elvana = 'Selen';
  await assert.rejects(() => build(d), /Selen is not a Sunhot country/);
});

test('Determinism: a second build gives the same bytes, and a changed number changes them', async () => {
  const { s: again } = await build();
  assert.deepEqual([...again.files.keys()], [...staged.files.keys()]);
  for (const [k, v] of staged.files) assert(v.equals(again.files.get(k)), `${k} differs between builds`);
  const m = clone(); m.numbers.counsel_start = 49;
  const { s: other } = await build(m);
  assert(!other.files.get('common/scripted_effects/zin_sun.txt').equals(staged.files.get('common/scripted_effects/zin_sun.txt')), 'the byte comparison sees a change');
});

test('Scripts: every staged script parses with balanced braces, uses no <= or >=, and is LF-terminated', () => {
  for (const [f, t] of scriptFiles) { assert.deepEqual(braceProblems(f, t), []); assert.deepEqual(operatorProblems(f, t), []); assert(!t.includes('\r') && t.endsWith('\n'), `${f} line ends`); }
  assert(!text(LOC).includes('\r'));
});

test('Negative: a lost brace, an extra brace and a <= are refused', () => {
  assert(braceProblems('x', EF.replace(/\}\n$/, '\n')).length > 0);
  assert(braceProblems('x', `}\n${EF}`).length > 0);
  assert.equal(operatorProblems('x', DEC.replace('zin_gala_counsel > ', 'zin_gala_counsel >= ')).length, 1);
  assert.equal(operatorProblems('x', 'a = { b <= 2 }').length, 1);
});

test('Files: the spec\'s file table is staged; the faction files are the diplomacy slice\'s; the text has a byte order mark', () => {
  assert.deepEqual(sun.files, ['common/ai_strategy/zin_sun.txt', 'common/decisions/categories/zin_sun.txt', 'common/decisions/zin_sun.txt', 'common/ideas/zin_sun.txt', 'common/on_actions/zin_sun.txt', 'common/opinion_modifiers/zin_sun.txt', 'common/scripted_effects/zin_sun.txt', 'common/scripted_triggers/zin_sun.txt', 'events/zin_sun.txt', LOC]);
  assert.deepEqual([...staged.files.keys()].sort(), sun.files);
  assert(!sun.files.some(f => f.startsWith('common/factions/')), 'template zin_faction_noon_league and rule zin_faction_rule_join_sun_realms are written by diplomacy.mjs');
  const bom = b => b.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]));
  assert(bom(staged.files.get(LOC)));
  assert(!bom(Buffer.from(text(LOC).replace(/^﻿/, ''), 'utf8')), 'the check sees a file without the mark');
  for (const f of sun.files.filter(x => x.endsWith('.txt'))) assert(text(f).startsWith('# Generated by the ZIN content builder (modules/mech_sun.mjs'), `${f} overview header`);
});

test('Engine vocabulary: every command is an engine effect or trigger of the installed documentation, a defined helper or a declared external', async () => {
  assert.deepEqual(await vocabularyOf(scriptFiles), []);
  const { effects, triggers } = await gameVocabulary();
  for (const c of ['kill_country_leader', 'retire_character', 'become_exiled_in', 'give_guarantee', 'create_faction_from_template', 'dismantle_faction', 'add_to_war', 'declare_war_on', 'add_timed_idea', 'mark_focus_tree_layout_dirty', 'add_war_support', 'add_opinion_modifier']) assert(effects.has(c), `${c} is a documented effect`);
  for (const c of ['has_country_leader', 'has_character', 'is_in_faction', 'is_in_faction_with', 'has_war_with', 'country_exists', 'has_opinion', 'is_faction_leader', 'has_capitulated']) assert(triggers.has(c), `${c} is a documented trigger`);
});

test('Negative: the vocabulary check finds an unknown trigger, an unknown effect and an undefined helper', async () => {
  const bad = new Map([['common/scripted_triggers/zin_x.txt', 'zin_sun_x_t = {\n\tthis_trigger_does_not_exist = yes\n}\n'], ['common/scripted_effects/zin_x.txt', 'zin_sun_x_e = {\n\tadd_political_powerr = 5\n\tzin_sun_helper_nobody_wrote = yes\n}\n']]);
  const problems = await vocabularyOf(bad);
  assert.equal(problems.length, 3, problems.join('; '));
  const mutated = new Map(scriptFiles); mutated.set('common/scripted_effects/zin_sun.txt', EF.replace('kill_country_leader = yes', 'kill_country_leaderr = yes'));
  assert((await vocabularyOf(mutated)).some(p => p.includes('kill_country_leaderr')));
});

test('References: every scripted call, event, idea and opinion resolves here or is a declared dependency', () => {
  const callable = new Set([...sun.definitions.effects, ...sun.definitions.triggers, ...SUN_DEPENDENCIES.effects, ...SUN_DEPENDENCIES.triggers]);
  const calls = [...new Set([...allScript.matchAll(/\b(zin_[a-z0-9_]+) = (?:yes|no)\b/g)].map(m => m[1]))];
  assert.deepEqual(calls.filter(c => !callable.has(c)), []);
  const events = new Set([...allScript.matchAll(/\bid = (zin_[a-z]+\.\d+)/g)].map(m => m[1]));
  assert.deepEqual([...events].filter(e => !sun.definitions.events.includes(e) && !SUN_DEPENDENCIES.events.includes(e)), []);
  for (const e of SUN_DEPENDENCIES.events) assert(!sun.definitions.events.includes(e) && events.has(e), `${e} is fired here and written by its event owner`);
  const ideas = new Set([...allScript.matchAll(/\b(?:has_idea|idea) = (zin_[a-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...ideas].filter(i => !sun.definitions.ideas.includes(i) && !SUN_DEPENDENCIES.ideas.includes(i)), []);
  const opinions = new Set([...allScript.matchAll(/\bmodifier = (zin_[a-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...opinions].filter(o => !sun.definitions.ideas.includes(o) && o !== 'zin_opinion_warning_dismissed'), []);
  for (const name of [...SUN_DEPENDENCIES.globalFlags, ...SUN_DEPENDENCIES.variables, ...SUN_DEPENDENCIES.countryFlags, ...SUN_DEPENDENCIES.characters, ...SUN_DEPENDENCIES.factionTemplates]) assert(allScript.includes(name), `${name} is declared but never used`);
});

test('Modifiers: every spirit modifier key is in the installed modifier documentation; the values are the spec\'s', async () => {
  const ideas = parse(text('common/ideas/zin_sun.txt'))[0].v[0].v;
  for (const i of ideas) { const mods = Object.fromEntries(i.v.find(x => x.k === 'modifier').v.map(m => [m.k, Number(m.v)])); await checkMods(i.k, mods); }
  const mod = id => Object.fromEntries(ideas.find(i => i.k === id).v.find(x => x.k === 'modifier').v.map(m => [m.k, Number(m.v)]));
  assert.deepEqual(mod('zin_sun_council_timber'), { industrial_capacity_dockyard: 0.15, production_speed_buildings_factor: 0.05 });
  assert.deepEqual(mod('zin_sun_heeded_north'), { coastal_bunker_effectiveness_factor: 0.1, army_core_defence_factor: 0.05 });
  assert.deepEqual(mod('zin_sun_heeded_south'), { army_core_defence_factor: 0.05, dig_in_speed_factor: 0.1 });
  assert.deepEqual(mod('zin_sun_heeded_seas'), { coastal_bunker_effectiveness_factor: 0.1, naval_detection: 0.1 });
  assert.deepEqual(mod('zin_sun_heeded_east'), { army_core_defence_factor: 0.05, war_support_factor: 0.03 });
  assert.deepEqual(mod('zin_sun_kings_ride'), { army_attack_factor: 0.2, army_morale_factor: 0.2 });
  assert.deepEqual([1, 2, 3].map(n => mod(`zin_sun_old_powers_stand_${n}`)), [{ army_defence_factor: 0.05, army_org_factor: 0.03 }, { army_defence_factor: 0.1, army_org_factor: 0.05 }, { army_defence_factor: 0.15, army_org_factor: 0.08 }]);
  assert.deepEqual(mod('zin_sun_king_fallen'), { stability_factor: -0.1, war_support_factor: 0.1, political_power_gain: -0.1 });
  assert.deepEqual(mod('zin_sun_mourning'), { stability_factor: -0.02 });
  const pics = Object.fromEntries(ideas.map(i => [i.k, i.v.find(x => x.k === 'picture').v]));
  assert.deepEqual([pics.zin_sun_council_timber, pics.zin_sun_heeded_north, pics.zin_sun_heeded_south, pics.zin_sun_heeded_seas, pics.zin_sun_heeded_east, pics.zin_sun_kings_ride, pics.zin_sun_old_powers_stand_2, pics.zin_sun_king_fallen, pics.zin_sun_mourning], ['zin_timber_mill', 'zin_beacon', 'zin_fort_wall', 'zin_lighthouse', 'zin_eye_watchful', 'zin_gala_sun', 'zin_forest_ancient', 'zin_banner_laid_down', 'zin_tree_silver']);
  assert(!/zin_has_potent_magic|zin_potent_magic/.test(allScript), 'the Old Powers Stand is ordinary help: nothing here touches potent magic (Acceptance 10)');
});

test('Negative: the module refuses an unknown modifier key and an icon outside the catalog', async () => {
  const a = clone(); a.ideas[0].modifier = { industrial_capacity_dockyardd: 0.15 };
  await assert.rejects(() => build(a), /Unknown modifier industrial_capacity_dockyardd/);
  const b = clone(); b.ideas[1].icon = 'no_such_icon_anywhere';
  await assert.rejects(() => build(b), /not in the icon catalog/);
});

test('Localisation: every key the script names exists, nothing is empty, no banned or modern word, only Windows-1252', () => {
  assert.deepEqual(missingKeys(scriptFiles, locEntries), []);
  for (const [k, v] of Object.entries(locEntries)) assert(v.trim().length > 0, `${k} is empty`);
  assert.deepEqual(bannedHits(locEntries), []);
  assert.deepEqual(notCp1252(locEntries), []);
  const dataTexts = new Set(Object.values(DATA.text));
  assert.deepEqual(Object.entries(locEntries).filter(([, v]) => !dataTexts.has(v.replace(/\\"/g, '"'))).map(([k]) => k), [], 'every text comes from the data file');
});

test('Negative: a missing key, a modern word, a banned unit and a character the font cannot draw are refused', async () => {
  const { zin_sun_need_counsel_40: _gone, ...fewer } = locEntries;
  assert.deepEqual(missingKeys(scriptFiles, fewer), ['zin_sun_need_counsel_40']);
  assert(bannedHits({ a: 'The tank division moves with its manpower', b: 'Forty kilometres of road' }).length >= 2);
  assert.equal(notCp1252({ k: 'Šodolôrō' }).length, 1);
  const m = clone(); m.text['zin_sun.5.a'] = 'A king who remembers the tank battalions.';
  await assert.rejects(() => build(m), /text problems/);
  const u = clone(); u.text.zin_sun_never_used = 'Nothing reads this.';
  await assert.rejects(() => build(u), /holds text nothing uses: zin_sun_never_used/);
  const g = clone(); delete g.text['zin_sun.10.a'];
  await assert.rejects(() => build(g), /no text for zin_sun\.10\.a/);
});

test('Setting names: no text says Erdae or Arda; the banned rules and the direct scan both refuse them', () => {
  assert.deepEqual(settingHits(locEntries), []);
  assert(!/\b(Erdae|Arda)\b/.test(allScript));
  assert.deepEqual(settingHits({ a: 'The kingdoms of Erdae', b: 'all of Arda', c: 'all of Aoaz' }), ['a', 'b']);
  const hits = bannedHits({ a: 'The kingdoms of Erdae', b: 'all of Arda' });
  assert(hits.some(h => h.includes('bw_setting_names_001')) && hits.some(h => h.includes('bw_setting_names_002')));
});

test('Secrets and open questions: no text names Afrit, the Hidden Council, the Deliverer or Eindil, or settles the two peoples\' bond', () => {
  assert.deepEqual(secretHits(locEntries), []);
  assert(!/\bkin\b|subject/i.test(locEntries['zin_sun.6.d']), 'Gala asks as a neighbour, not as kin or subject');
  for (const k of Object.keys(locEntries).filter(x => /^zin_sun\.(10|20)\./.test(x))) assert(!/\b(he|she|his|her|man|woman|king|queen)\b.*\b(face|hand) (of|was)/i.test(locEntries[k]), `${k} shows no person`);
  assert(/did not show whose hand/.test(locEntries['zin_sun.10.d_centre']) && /did not show whose hand/.test(locEntries['zin_sun.20.d_centre']), 'the centre never shows whose hand (section 5)');
});

test('Negative: the secret scan refuses Afrit, the Deliverer, Eindil, the son of Ein, kinship and North Gala', () => {
  const bad = { a: 'Afrit watches the harbour.', b: 'The Deliverer sends priests.', c: 'Eindil sails north.', d: 'The son of Ein stands at the basin.', e: 'Our kin of the sun send timber.', f: 'North Gala answers.', g: 'The Hidden Council hears of it.' };
  assert.equal(secretHits(bad).length, 7);
  assert.equal(secretHits({ ok: 'The King of Gala receives an envoy.' }).length, 0);
});

test('Start values: counsel 50, concord 40, clarity 60, old lords 1, the Council sits, the Lands of Light presides; once only', () => {
  const start = blockOf(EF, 'zin_sun_startup');
  const problems = startProblems(start);
  assert.deepEqual(problems, []);
  const oa = parse(ON)[0].v;
  const startup = JSON.stringify(oa.find(e => e.k === 'on_startup'));
  assert(startup.includes('zin_sun_started') && startup.includes('zin_sun_startup'), 'the start runs once, behind zin_sun_started');
});
function startProblems(start) {
  const want = [`set_global_flag = zin_sun_noon_council`, `set_variable = { global.zin_sun_concord = ${N.concord_start} }`, `set_variable = { global.zin_mirror_clarity = ${N.clarity_start} }`, `set_variable = { zin_gala_counsel = ${N.counsel_start} }`, `set_variable = { zin_gala_old_lords = ${N.old_lords_start} }`, `${LOL} = { set_country_flag = zin_sun_council_president }`, `${GALA} = {`];
  const out = want.filter(w => !start.includes(w)).map(w => `missing: ${w}`);
  if ([N.counsel_start, N.concord_start, N.clarity_start, N.old_lords_start].join() !== '50,40,60,1') out.push('the spec\'s start values are 50, 40, 60 and 1');
  return out;
}

test('Negative: a changed start value or a lost Council flag is refused', () => {
  const start = blockOf(EF, 'zin_sun_startup');
  assert(startProblems(start.replace(`zin_gala_counsel = ${N.counsel_start}`, 'zin_gala_counsel = 45')).length > 0);
  assert(startProblems(start.replace('set_global_flag = zin_sun_noon_council', '')).length > 0);
});

test('Lorien\'s counsel: one adder that clamps, the monthly gain while Lorien leads or the court endures, the Audience and the asks', () => {
  const add = blockOf(EF, 'zin_sun_add_gala_counsel');
  assert(add.includes(`${GALA} = {`) && add.includes('add_to_variable = { zin_gala_counsel = zin_arg_value }') && add.includes('clamp_variable = { var = zin_gala_counsel min = 0 max = 100 }'));
  assert.equal([...allScript.matchAll(/(?:add_to|set|subtract_from)_variable = \{ zin_gala_counsel =/g)].length, 2, 'counsel changes only in the adder and the start (multiply on the fall)');
  const monthly = blockOf(EF, 'zin_sun_monthly');
  assert(monthly.includes('limit = { zin_sun_counsel_grows = yes }') && monthly.includes(`zin_arg_value = ${N.counsel_monthly}`) && N.counsel_monthly === 0.2);
  const grows = blockOf(TR, 'zin_sun_counsel_grows');
  assert(grows.includes('zin_sun_lorien_leads = yes') && grows.includes('has_idea = zin_gala_gala_endures_spirit'), 'no monthly gain after the death until Gala Endures');
  assert(blockOf(TR, 'zin_sun_lorien_leads').includes('has_country_leader = { character = zin_lorien ruling_only = yes }') && blockOf(TR, 'zin_sun_lorien_leads').includes('NOT = { has_global_flag = zin_lorien_dead }'));
  const aud = decisionBlock('zin_sun_audience');
  assert(aud.includes('cost = 25') && aud.includes('days_re_enable = 120') && aud.includes('has_country_flag = zin_gala_audiences') && aud.includes('zin_arg_value = 5') && aud.includes('zin_elves_goodwill = yes') && aud.includes('country_event = { id = zin_sun.5 }'));
  assert(aud.includes('zin_sun_is_lands_of_the_sun_country = yes') && aud.includes('zin_sun_is_elven_realm = yes') && aud.includes('has_country_flag = zin_region_islands_of_the_south'));
  const timber = decisionBlock('zin_sun_ask_timber');
  assert(timber.includes('zin_gala_counsel > 39.99') && /custom_cost_trigger = \{\n\t*check_variable = \{ zin_gala_counsel > 19\.99 \}/.test(timber) && timber.includes('zin_arg_value = -20') && timber.includes('add_timed_idea = { idea = zin_sun_council_timber days = 365 }'), 'needs 40, spends 20');
  const guard = decisionBlock('zin_sun_ask_sun_guard');
  assert(guard.includes('zin_gala_counsel > 59.99') && guard.includes('zin_gala_counsel > 29.99') && guard.includes('zin_arg_value = -30') && guard.includes('global.zin_gathering_dark > 49.99') && guard.includes('has_war = yes') && guard.includes('country_event = { id = zin_sun.6 }'), 'needs 60, spends 30');
  const quarrel = decisionBlock('zin_sun_speak_quarrel');
  assert(quarrel.includes('has_country_flag = zin_gala_mediator') && quarrel.includes('zin_gala_counsel > 9.99') && quarrel.includes('zin_arg_value = -10') && quarrel.includes(`original_tag = ${tagOf('Elvana')}`) && quarrel.includes(`original_tag = ${tagOf('Igara')}`) && quarrel.includes('has_opinion = { target = PREV value < 0 }') && /zin_arg_value = 5 \}\n\t*zin_sun_add_concord = yes/.test(quarrel));
  for (const k of ['zin_sun_cost_counsel_10', 'zin_sun_cost_counsel_20', 'zin_sun_cost_counsel_30']) assert(k in locEntries && `${k}_blocked` in locEntries && `${k}_tooltip` in locEntries, `${k}: the three keys a custom cost reads`);
  assert(/counsel/i.test(locEntries.zin_sun_counsel_desc) && locEntries.zin_sun_counsel_desc.includes('[?zin_gala_counsel|0]'), 'the category shows counsel');
});

/** Each ask needs the spec's counsel (40, 60, or the mediator flag) in `available`, spends its price in the effect, and costs it in the row. */
function askProblems(dec) {
  const out = [];
  const block = id => { const at = dec.indexOf(`\t${id} = {\n`); return at < 0 ? '' : blockOf(dec.slice(at).replace(/^\t/gm, ''), id); };
  for (const [id, need, spend] of [['zin_sun_ask_timber', 40, 20], ['zin_sun_ask_sun_guard', 60, 30], ['zin_sun_speak_quarrel', 10, 10]]) {
    const b = block(id), avail = /\tavailable = \{\n([\s\S]*?)\n\t\}/.exec(b)?.[1] ?? '';
    if (!avail.includes(`zin_gala_counsel > ${need - 0.01}`)) out.push(`${id} needs ${need}`);
    if (!b.includes(`custom_cost_text = zin_sun_cost_counsel_${spend}`) || !b.includes(`zin_arg_value = -${spend} }`)) out.push(`${id} spends ${spend}`);
  }
  return out;
}

test('Negative: an ask that needs only what it spends is refused, and the module refuses a need with no text', async () => {
  assert.deepEqual(askProblems(DEC), []);
  assert(askProblems(DEC.replace('zin_gala_counsel > 39.99', 'zin_gala_counsel > 19.99')).includes('zin_sun_ask_timber needs 40'));
  assert(askProblems(DEC.replace('zin_arg_value = -30 }', 'zin_arg_value = -20 }')).includes('zin_sun_ask_sun_guard spends 30'));
  const m = clone(); m.numbers.timber_need = 20;
  await assert.rejects(() => build(m), /no text for zin_sun_need_counsel_20/);
});

test('The Noon Council and its concord: one adder, the monthly drift, a war between Sunhot realms, the rally once, the president', () => {
  assert(blockOf(EF, 'zin_sun_add_concord').includes('clamp_variable = { var = global.zin_sun_concord min = 0 max = 100 }'));
  assert.deepEqual(councilProblems(EF, ON), []);
});
function councilProblems(ef, on) {
  const out = [];
  const monthly = blockOf(ef, 'zin_sun_monthly');
  if (!/any_enemy_country = \{ zin_sun_is_sunhot_realm = yes \}[\s\S]*zin_arg_value = 0\.1 \}\n\t*zin_sun_add_concord = yes/.test(monthly)) out.push('concord +0.1 while no two Sunhot realms fight');
  const war = blockOf(ef, 'zin_sun_on_declare_war');
  if (!(war.includes('zin_sun_is_sunhot_realm = yes') && war.includes('FROM = { zin_sun_is_sunhot_realm = yes }') && war.includes('zin_arg_value = -10'))) out.push('concord -10 on a war between Sunhot realms');
  const ctrl = blockOf(ef, 'zin_sun_on_state_control');
  if (!(ctrl.includes('NOT = { has_global_flag = zin_sun_concord_rallied }') && ctrl.includes('set_global_flag = zin_sun_concord_rallied') && ctrl.includes('zin_arg_value = 10'))) out.push('the rally +10 once');
  if (!blockOf(ef, 'zin_sun_refresh_foreign_hold').includes('clr_global_flag = zin_sun_concord_rallied')) out.push('the rally resets when no outsider holds a state');
  const pres = blockOf(ef, 'zin_sun_refresh_president');
  if (!(pres.includes(`country_exists = ${LOL}`) && pres.includes('num_owned_states > PREV.num_owned_states') && pres.includes('clr_global_flag = zin_sun_noon_council'))) out.push('the president moves to the largest Sunhot realm; the Council ends with the last realm');
  if (!/zin_arg_value = 5 \}\n\t*zin_sun_add_concord = yes/.test(blockOf(ef, 'zin_sun_lorien_falls'))) out.push('concord +5 in mourning');
  for (const hook of ['on_declare_war', 'on_state_control_changed', 'on_capitulation_immediate', 'on_monthly', 'on_startup']) if (!on.includes(`\t${hook} = {`)) out.push(`on_action ${hook}`);
  return out;
}

test('Negative: a concord drift without its peace gate or a rally without its once-only flag is refused', () => {
  assert(councilProblems(EF.replace('NOT = { has_global_flag = zin_sun_concord_rallied }', 'always = yes'), ON).some(p => p.includes('rally')));
  assert(councilProblems(EF.replace(/any_enemy_country = \{ zin_sun_is_sunhot_realm = yes \}/, 'always = no'), ON).some(p => p.includes('+0.1')));
  assert(councilProblems(EF, ON.replace('\ton_declare_war = {', '\ton_declare_peace = {')).some(p => p.includes('on_declare_war')));
});

test('The Noon League: raised once by the president from the template, news and invitations, AI join 40 + concord / 2, dismantled after 730 days of peace', () => {
  assert.deepEqual(leagueProblems(EF), []);
  const raise = decisionBlock('zin_sun_raise_league');
  assert(raise.includes('cost = 50') && raise.includes('has_country_flag = zin_sun_council_president') && raise.includes('zin_sun_league_needed = yes') && raise.includes('global.zin_sun_concord > 59.99') && raise.includes('zin_sun_form_noon_league = yes'));
  const needed = blockOf(TR, 'zin_sun_league_needed');
  assert(needed.includes('global.zin_gathering_dark > 59.99') && needed.includes('has_global_flag = zin_sun_foreign_hold'));
  const hold = blockOf(EF, 'zin_sun_refresh_foreign_hold');
  assert(hold.includes('zin_is_region_lands_of_the_sun = yes') && hold.includes('NOT = { zin_sun_is_lands_of_the_sun_country = yes }') && hold.includes(`original_tag = ${GALA}`));
  const [keep, join] = aiBlocks(eventBlock(EV, 'zin_sun.31'));
  for (const concord of [0, 20, 40, 60, 80, 100]) {
    const when = cond => { const m = /global\.zin_sun_concord > (\d+)/.exec(condText(cond)); return m ? concord > Number(m[1]) : true; };
    const j = aiValue(join, when), k = aiValue(keep, when);
    assert.equal(j + k, 100, `the two options sum to 100 at concord ${concord}`);
    assert(Math.abs(j - (40 + concord / 2)) <= 10, `join ${j} near 40 + ${concord} / 2`);
  }
  assert(eventBlock(EV, 'zin_sun.31').indexOf('zin_sun.31.a') < eventBlock(EV, 'zin_sun.31').indexOf('zin_sun.31.b') && locEntries['zin_sun.31.a'] === 'Keep apart.', 'Keep apart first (E2)');
  assert(eventBlock(EV, 'zin_sun.31').includes('FROM = { add_to_faction = ROOT }'));
});
function leagueProblems(ef) {
  const out = [];
  const form = blockOf(ef, 'zin_sun_form_noon_league');
  if (!form.includes('NOT = { has_global_flag = zin_sun_noon_league }')) out.push('the League is raised only once (Acceptance 9)');
  if (!form.includes('create_faction_from_template = zin_faction_noon_league')) out.push('the template');
  if (!(form.includes('set_global_flag = zin_sun_noon_league') && form.includes('news_event = { id = zin_sun.30 }') && form.includes('country_event = { id = zin_sun.31 }'))) out.push('flag, news, invitations');
  if (!(form.includes('zin_sun_is_sunhot_realm = yes') && form.includes(`original_tag = ${GALA}`))) out.push('invitations to the Sunhot realms and the Gala Elves');
  const monthly = blockOf(ef, 'zin_sun_monthly');
  if (!(monthly.includes(`add_to_variable = { global.zin_sun_league_peace_days = ${N.league_peace_step} }`) && monthly.includes('set_variable = { global.zin_sun_league_peace_days = 0 }') && monthly.includes(`global.zin_sun_league_peace_days > ${N.league_peace_days - 0.01}`) && monthly.includes('dismantle_faction = yes') && monthly.includes('clr_global_flag = zin_sun_noon_league'))) out.push('730 days of peace dismantle the League');
  if (N.league_peace_days !== 730 || N.league_peace_step !== 30) out.push('the spec counts 30 a month to 730');
  return out;
}

test('Negative: a League without its once-only guard or its template is refused', () => {
  assert(leagueProblems(EF.replace('NOT = { has_global_flag = zin_sun_noon_league }', 'always = yes')).some(p => p.includes('once')));
  assert(leagueProblems(EF.replace('create_faction_from_template = zin_faction_noon_league', 'create_faction = zin_faction_noon_league')).some(p => p.includes('template')));
});

test('The Mirror of First Rain: clarity, regain, visions and their cost, the reading order, the sights and their thresholds, stilling', () => {
  assert.deepEqual(mirrorProblems(EF, TR), []);
  const look = decisionBlock('zin_sun_look_mirror');
  assert(look.includes('cost = 50') && look.includes('days_re_enable = 180') && look.includes('has_country_flag = zin_gala_mirror_open') && look.includes('zin_sun_mirror_available = yes') && look.includes('global.zin_mirror_clarity > 29.99') && look.includes('zin_sun_mirror_vision = yes'));
  const vision = blockOf(EF, 'zin_sun_mirror_vision');
  for (const s of SIGHTS) assert(vision.includes(`set_country_flag = { flag = zin_sun_sight_${s.key} days = 730 }`), s.key);
  assert(vision.includes('country_event = { id = zin_sun.10 }'));
  const ten = eventBlock(EV, 'zin_sun.10');
  for (const k of ['rain', 'north', 'south', 'seas', 'east', 'centre']) assert(ten.includes(`text = zin_sun.10.d_${k}`), `.10 shows ${k}`);
  const still = blockOf(EF, 'zin_sun_on_state_control');
  assert(still.includes('zin_is_site_gala = yes') && still.includes('set_global_flag = zin_mirror_stilled') && still.includes('clr_global_flag = zin_mirror_stilled') && still.includes('has_country_flag = zin_gala_courtyard_guarded') && still.includes('country_event = { id = zin_sun.36 days = 30 }') && still.includes('country_event = { id = zin_sun.35 }'));
  const hidden = eventBlock(EV, 'zin_sun.36');
  assert(hidden.includes('hidden = yes') && hidden.includes('controller = { zin_sun_is_elven_realm = no }') && hidden.includes('set_global_flag = zin_mirror_stilled') && hidden.includes('controller = { country_event = { id = zin_sun.35 } }'));
  assert(blockOf(EF, 'zin_sun_refresh_mirror').includes('clr_global_flag = zin_mirror_stilled'), 'a returned courtyard clears the stilling');
  assert(/clarity/i.test(locEntries.zin_sun_mirror_desc) && locEntries.zin_sun_mirror_desc.includes('[?global.zin_mirror_clarity|0]') && locEntries.zin_sun_mirror_desc.includes('[?zin_gala_old_lords|0]'));
});
function mirrorProblems(ef, tr) {
  const out = [];
  if (N.clarity_start !== 60 || N.clarity_regain !== 2 || N.clarity_regain_still_water !== 1 || N.vision_cost !== 25 || N.vision_cost_true_traces !== 15) out.push('the spec\'s clarity numbers');
  const add = blockOf(ef, 'zin_sun_add_clarity');
  if (!(add.includes('has_global_flag = zin_mirror_stilled') && add.includes('zin_arg_value > 0') && add.includes('clamp_variable = { var = global.zin_mirror_clarity min = 0 max = 100 }'))) out.push('no gain while stilled; clamp 0-100');
  if (!blockOf(ef, 'zin_sun_spend_clarity').includes('clamp_variable = { var = global.zin_mirror_clarity min = 0 max = 100 }')) out.push('a spend never drops below 0');
  const monthly = blockOf(ef, 'zin_sun_monthly');
  if (!(monthly.includes(`zin_sun_regain = ${N.clarity_regain}`) && monthly.includes('has_idea = zin_gala_still_water_spirit') && monthly.includes(`add_to_temp_variable = { zin_sun_regain = ${N.clarity_regain_still_water} }`))) out.push('the monthly regain');
  const vision = blockOf(ef, 'zin_sun_mirror_vision');
  const order = [...vision.matchAll(/zin_sun_sight_true_([a-z]+) = yes/g)].map(m => m[1]);
  if (order.join() !== 'centre,south,north,seas,east') out.push(`reading order ${order.join()}`);
  if (!(vision.includes(`zin_sun_cost = ${N.vision_cost}`) && vision.includes(`zin_sun_cost = ${N.vision_cost_true_traces}`) && vision.includes('has_country_flag = zin_gala_true_traces') && vision.includes('multiply_temp_variable = { zin_sun_cost = 0.5 }'))) out.push('vision cost 25, 15 with true traces, half for rain');
  const sight = (k, s) => { if (!blockOf(tr, `zin_sun_sight_true_${k}`).includes(s)) out.push(`sight ${k}: ${s}`); };
  sight('north', `${ZOL} = { check_variable = { zin_mistake_power > 29.99 } }`);
  sight('south', `${VOLGAN} = { check_variable = { zin_dominion_strength > 39.99 } }`);
  sight('seas', 'global.zin_west_resolve > 39.99');
  sight('east', 'any_country = { has_country_flag = zin_east_rift_talk }'); sight('east', 'has_global_flag = zin_war_of_last_crowns');
  sight('centre', 'NOT = { has_global_flag = zin_golden_king_dead }'); sight('centre', 'has_global_flag = zin_afrit_regicide_ready'); sight('centre', `${AENOR} = { check_variable = { zin_council_influence > 69.99 } }`);
  return out;
}

test('Negative: a wrong reading order, a wrong threshold or a regain while stilled is refused', () => {
  const swapped = EF.replace('zin_sun_sight_true_centre = yes', 'zin_sun_sight_true_tmp = yes').replace('zin_sun_sight_true_south = yes', 'zin_sun_sight_true_centre = yes').replace('zin_sun_sight_true_tmp = yes', 'zin_sun_sight_true_south = yes');
  assert(mirrorProblems(swapped, TR).some(p => p.startsWith('reading order')));
  assert(mirrorProblems(EF, TR.replace('zin_mistake_power > 29.99', 'zin_mistake_power > 39.99')).some(p => p.startsWith('sight north')));
  const clarity = blockOf(EF, 'zin_sun_add_clarity');
  assert(mirrorProblems(EF.replace(clarity, clarity.replace('has_global_flag = zin_mirror_stilled', 'always = no')), TR).some(p => p.includes('stilled')));
});

test('Warnings: three prices of Send Word, the named or any sight, the heeded ideas, the centre for Aenor only, the fear of prophecy', () => {
  const prices = ['zin_sun_send_word', 'zin_sun_send_word_half', 'zin_sun_send_word_free'].map(d => /cost = (\d+)/.exec(decisionBlock(d))[1]);
  assert.deepEqual(prices, ['50', '25', '0']);
  // The three are never visible together: exactly one for each combination of the two Gala flags.
  const vis = d => parse(decisionBlock(d)).find(e => e.k === d).v.find(e => e.k === 'visible').v;
  const holds = (entries, flagsSet) => entries.every(e => (e.k === 'NOT' ? !holds(e.v, flagsSet) : e.k === 'OR' ? e.v.some(x => holds([x], flagsSet)) : e.k === 'AND' ? holds(e.v, flagsSet) : e.k === 'has_country_flag' ? flagsSet.has(e.v) : true));
  for (const set of [[], ['zin_gala_share_sight'], ['zin_gala_kings_warning'], ['zin_gala_share_sight', 'zin_gala_kings_warning']]) {
    const shown = ['zin_sun_send_word', 'zin_sun_send_word_half', 'zin_sun_send_word_free'].filter(d => holds(vis(d), new Set(set)));
    assert.equal(shown.length, 1, `flags ${set.join('+') || 'none'}: ${shown.join(', ')}`);
    assert.equal(shown[0], ['zin_sun_send_word', 'zin_sun_send_word_half', 'zin_sun_send_word_half', 'zin_sun_send_word_free'][set.length === 2 ? 3 : set.length === 0 ? 0 : 1]);
  }
  assert(locEntries.zin_sun_send_word_half === locEntries.zin_sun_send_word && locEntries.zin_sun_send_word_free === locEntries.zin_sun_send_word, 'one name for the three prices');
  const send = blockOf(EF, 'zin_sun_send_warning');
  assert(send.includes('check_variable = { zin_arg_sight = 5 }') && send.includes('check_variable = { zin_arg_sight = 0 }') && send.includes(`var:zin_arg_target = { original_tag = ${AENOR} }`) && send.includes('country_event = { id = zin_sun.20 }') && send.includes('set_country_flag = zin_sun_warned_aenor'));
  const heed = blockOf(EF, 'zin_sun_heed_warning');
  for (const k of ['north', 'south', 'seas', 'east']) assert(heed.includes(`add_timed_idea = { idea = zin_sun_heeded_${k} days = 365 }`) && heed.includes(`set_country_flag = { flag = zin_sun_heeded_${k} days = 730 }`), k);
  assert(!heed.includes('idea = zin_sun_heeded_centre') && /zin_arg_value = -3 \}\n\t*zin_afrit_add_veil = yes/.test(heed), 'the centre gives no idea but the veil -3');
  assert(heed.includes('20 = { zin_sun_prophecy_fear = yes }') && heed.includes('80 = { }') && heed.includes('10 = { zin_sun_prophecy_fear = yes }') && heed.includes('has_country_flag = zin_gala_cautious_seers'));
  const fear = blockOf(EF, 'zin_sun_prophecy_fear');
  assert(fear.includes('add_war_support = 0.05') && /zin_arg_value = 1 \}\n\t*zin_world_add_gathering_dark = yes/.test(fear) && fear.includes('country_event = { id = zin_sun.21 }'));
  assert.equal([...allScript.matchAll(/zin_world_add_gathering_dark = yes/g)].length, 1, 'the only Gathering Dark from this spec is the fear (section 9)');
  const twenty = eventBlock(EV, 'zin_sun.20');
  assert(twenty.indexOf('zin_sun.20.a') < twenty.indexOf('zin_sun.20.b') && locEntries['zin_sun.20.a'] === 'Old elves see ghosts in water.' && locEntries['zin_sun.20.b'] === 'Heed it.', 'dismissal first (E2)');
  assert(twenty.includes('modifier = zin_opinion_warning_dismissed') && text('common/opinion_modifiers/zin_sun.txt').includes('value = -5') && text('common/opinion_modifiers/zin_sun.txt').includes('decay = 0.25'));
});

test('Warnings: the AI heeds at 10 + opinion / 2, +30 for the heeding and elven realms, Aenor 10 then 0, and the two answers sum to 100', () => {
  const heeders = ['Selen', 'Mirolon', 'Kingson', 'Hirolon', 'Magical Forest'].map(tagOf);
  const [dismiss, heed] = aiBlocks(eventBlock(EV, 'zin_sun.20'));
  for (const h of heeders) assert(heed.includes(`original_tag = ${h}`), h);
  const scenario = s => cond => {
    const c = condText(cond);
    if (c.includes('zin_sun_is_elven_realm')) return s.realm;
    let m = /value > (-?\d+)/.exec(c); if (m) return s.opinion > Number(m[1]);
    m = /value < (-?\d+)/.exec(c); if (m) return s.opinion < Number(m[1]);
    if (c.includes('zin_aurevan_crowned')) return s.aenor && s.crowned;
    if (c.includes('zin_golden_king_dead')) return s.aenor && !s.kingDead;
    return true;
  };
  const cases = [
    [{ realm: false, opinion: 0, aenor: false }, 10], [{ realm: false, opinion: 40, aenor: false }, 30], [{ realm: true, opinion: 0, aenor: false }, 40],
    [{ realm: true, opinion: 100, aenor: false }, 90], [{ realm: false, opinion: -50, aenor: false }, 0],
    [{ realm: false, opinion: 60, aenor: true, kingDead: false }, 10], [{ realm: false, opinion: 60, aenor: true, kingDead: true, crowned: true }, 0], [{ realm: false, opinion: 20, aenor: true, kingDead: true, crowned: false }, 20],
  ];
  for (const [s, want] of cases) {
    const h = aiValue(heed, scenario(s)), d = aiValue(dismiss, scenario(s));
    assert.equal(h, want, JSON.stringify(s)); assert.equal(h + d, 100, `sum ${JSON.stringify(s)}`);
  }
  const ai = /ai_will_do = \{([\s\S]*)\n\t\}/.exec(decisionBlock('zin_sun_send_word'))[1];
  assert(ai.includes(`FROM = { original_tag = ${tagOf('Worshipdom')} }`) && ai.includes('zin_rules_is_free = yes') && ai.includes('has_country_flag = zin_sun_warned_aenor'), 'never to the Worshipdom; more often under FREE; once to Aenor');
});

test('Negative: an answer pair that does not sum to 100 is caught by the evaluator', () => {
  const [dismiss, heed] = aiBlocks(eventBlock(EV, 'zin_sun.20'));
  const broken = dismiss.replace('base = 90', 'base = 60');
  assert.notEqual(aiValue(broken, () => false) + aiValue(heed, () => false), 100);
});

test('Lorien\'s last march: the ride, the war on Zol, the King\'s Ride, the Old Powers Stand by old lords, the news', () => {
  assert.deepEqual(rideProblems(EF), []);
  const lords = decisionBlock('zin_sun_old_lords');
  assert(lords.includes('cost = 75') && lords.includes('days_re_enable = 365') && lords.includes('has_global_flag = zin_zol_rising') && lords.includes('global.zin_gathering_dark > 59.99') && lords.includes('zin_sun_add_old_lords = yes'));
  assert(blockOf(EF, 'zin_sun_add_old_lords').includes('clamp_variable = { var = zin_gala_old_lords min = 0 max = 5 }'));
  const days = l => Math.min(N.stand_days_max, N.stand_days_base + N.stand_days_per_lord * l);
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(days), [14, 21, 28, 35, 42, 49]);
});
function rideProblems(ef, n = N) {
  const out = [], ride = blockOf(ef, 'zin_sun_lorien_rides');
  const has = (s, why) => { if (!ride.includes(s)) out.push(why); };
  has('set_global_flag = zin_lorien_rides', 'the flag');
  has('NOT = { has_country_flag = zin_refusal_lifted }', 'the Refusal safety net'); has('zin_diplo_lift_refusal = yes', 'the Refusal safety net');
  if (ride.indexOf('zin_gala_ready_to_ride') > ride.indexOf('zin_sun_old_powers_stand_1')) out.push('old lords +1 first');
  has('var:global.zin_eindil_host = { has_war_with', 'Eindil\'s host first');
  has(`add_to_war = { targeted_alliance = PREV enemy = ${ZOL} hostility_reason = asked_to_join }`, 'add_to_war');
  has('zin_is_region_middle_lands = yes', 'else the country with the most Middle Lands states');
  has(`declare_war_on = { target = ${ZOL} type = annex_everything }`, 'or a war of its own');
  if (ride.indexOf('zin_story_war') > ride.indexOf('declare_war_on')) out.push('zin_story_war before the declaration');
  has(`add_timed_idea = { idea = zin_sun_kings_ride days = ${N.kings_ride_days} }`, 'the King\'s Ride');
  for (const n of [1, 2, 3]) has(`add_timed_idea = { idea = zin_sun_old_powers_stand_${n} days = zin_sun_stand_days }`, `stand ${n}`);
  has(`clamp_temp_variable = { var = zin_sun_stand_days min = ${N.stand_days_base} max = ${N.stand_days_max} }`, '14-49 days');
  has('news_event = { id = zin_sun.40 }', 'the news');
  const tiers = n.stand_tiers.map(t => `${t.lords_from}-${t.lords_to}`).join();
  if (tiers !== '0-1,2-3,4-5') out.push(`tiers ${tiers}`);
  if (`${n.stand_days_base},${n.stand_days_per_lord},${n.stand_days_max},${n.kings_ride_days}` !== '14,7,49,30') out.push('14 + 7 x lords days, at most 49; the King\'s Ride 30');
  if (/zin_potent_magic/.test(ride)) out.push('potent magic is the Zol spec\'s');
  return out;
}

test('Negative: a ride without its flag or with the stand before the extra lord is refused', () => {
  assert(rideProblems(EF.replace('set_global_flag = zin_lorien_rides', '')).includes('the flag'));
  const moved = EF.replace(/\tif = \{\n\t\tlimit = \{ has_country_flag = zin_gala_ready_to_ride \}\n[\s\S]*?\n\t\}\n/, '');
  assert(rideProblems(moved.replace('\tnews_event = { id = zin_sun.40 }', '\tif = {\n\t\tlimit = { has_country_flag = zin_gala_ready_to_ride }\n\t}\n\tnews_event = { id = zin_sun.40 }')).includes('old lords +1 first'));
  const m = clone(); m.numbers.stand_tiers[2].lords_from = 3;
  assert(rideProblems(EF, m.numbers).some(p => p.startsWith('tiers')));
  const d = clone(); d.numbers.stand_days_max = 60;
  assert(rideProblems(EF, d.numbers).some(p => p.includes('at most 49')));
});

test('Lorien\'s death: once only, the leader removed, the old powers spent, halves and mourning, After the King in 14 days, no news of its own', () => {
  assert.deepEqual(fallProblems(EF), []);
  assert(!/^\tid = zin_sun\.4[0-3]$/m.test(EV), 'zin_sun.40 and .42 are written by their event owner; zin_sun.43 is retired (O4)');
});
function fallProblems(ef) {
  const out = [], fall = blockOf(ef, 'zin_sun_lorien_falls');
  if (!fall.startsWith('zin_sun_lorien_falls = {\n\tif = {\n\t\tlimit = { NOT = { has_global_flag = zin_lorien_dead } }\n\t\tset_global_flag = zin_lorien_dead')) out.push('guarded by zin_lorien_dead (Acceptance 9)');
  for (const [s, why] of [['kill_country_leader = yes', 'the leader is killed'], ['retire_character = zin_lorien', 'or retired where he does not lead'], ['set_variable = { zin_gala_old_lords = 0 }', 'old lords 0'], ['multiply_variable = { zin_gala_counsel = 0.5 }', 'counsel halves'], ['multiply_variable = { global.zin_mirror_clarity = 0.5 }', 'clarity halves'], [`add_timed_idea = { idea = zin_sun_king_fallen days = ${N.king_fallen_days} }`, 'The King Has Fallen'], [`add_timed_idea = { idea = zin_sun_mourning days = ${N.mourning_days} }`, 'Mourning'], [`country_event = { id = zin_sun.42 days = ${N.after_king_days} }`, 'After the King']]) if (!fall.includes(s)) out.push(why);
  const fired = [...fall.matchAll(/(?:country|news)_event = \{ id = (zin_[a-z]+\.\d+)/g)].map(m => m[1]);
  if (fired.join() !== 'zin_sun.42') out.push(`fires ${fired.join()} (only zin_sun.42, O4)`);
  if (/zin_gathering_dark/.test(fall)) out.push('the tension spec counts the death, not this effect');
  if ([N.king_fallen_days, N.mourning_days, N.after_king_days].join() !== '730,180,14') out.push('730, 180 and 14 days');
  return out;
}

test('Negative: a second death news, a lost guard or a death that feeds the meter is refused', () => {
  assert(fallProblems(EF.replace(`country_event = { id = zin_sun.42 days = ${N.after_king_days} }`, `country_event = { id = zin_sun.42 days = ${N.after_king_days} }\n\t\tnews_event = { id = zin_sun.43 }`)).some(p => p.includes('O4')));
  assert(fallProblems(EF.replace('limit = { NOT = { has_global_flag = zin_lorien_dead } }\n\t\tset_global_flag = zin_lorien_dead', 'limit = { always = yes }\n\t\tset_global_flag = zin_lorien_dead')).some(p => p.includes('guarded')));
  assert(fallProblems(EF.replace('set_variable = { zin_gala_old_lords = 0 }', 'set_variable = { zin_gala_old_lords = 0 }\n\t\tadd_to_variable = { global.zin_gathering_dark = 1 }')).some(p => p.includes('tension')));
});

test('If Gala falls: the court goes into exile with Lorien before his ride, with the spec\'s host order', () => {
  const cap = blockOf(EF, 'zin_sun_on_capitulation');
  assert(cap.includes(`original_tag = ${GALA}`) && cap.includes('NOT = { has_global_flag = zin_lorien_rides }'));
  const order = [`target = ${LOL}`, 'target = PREV', `target = ${tagOf('Magical Forest')}`].map(s => cap.indexOf(s));
  assert(order.every(i => i > 0) && order[0] < order[1] && order[1] < order[2], 'the Lands of Light, then the largest elven or Sunhot realm, then the Magical Forest');
  assert(cap.includes('legitimacy = 60') && cap.includes('NOT = { has_war_with = FROM }') && cap.includes('NOT = { tag = FROM }'), 'a host at peace with the conqueror and not the conqueror');
  assert(ON.includes('on_capitulation_immediate = {\n\t\teffect = {\n\t\t\tzin_sun_on_capitulation = yes'));
});

test('Decisions and their costs: categories, prices, cooldowns, icons from the catalog, targets with a pre-check, the quarrel\'s name', async () => {
  const want = { zin_sun_audience: ['zin_sun_counsel', 'cost = 25'], zin_sun_ask_timber: ['zin_sun_counsel', 'custom_cost_text = zin_sun_cost_counsel_20'], zin_sun_ask_sun_guard: ['zin_sun_counsel', 'custom_cost_text = zin_sun_cost_counsel_30'], zin_sun_speak_quarrel: ['zin_sun_counsel', 'custom_cost_text = zin_sun_cost_counsel_10'], zin_sun_look_mirror: ['zin_sun_mirror', 'cost = 50'], zin_sun_send_word: ['zin_sun_mirror', 'cost = 50'], zin_sun_send_word_half: ['zin_sun_mirror', 'cost = 25'], zin_sun_send_word_free: ['zin_sun_mirror', 'cost = 0'], zin_sun_old_lords: ['zin_sun_mirror', 'cost = 75'], zin_sun_raise_league: ['zin_sun_council', 'cost = 50'] };
  assert.deepEqual(decisionProblems(DEC, want, await knownIcons()), []);
  assert.equal(locEntries.zin_sun_speak_quarrel, 'Speak for a Sunhot Quarrel', 'the quarrel decision\'s name (Acceptance 12)');
  const cats = parse(text('common/decisions/categories/zin_sun.txt'));
  assert(!JSON.stringify(cats.find(c => c.k === 'zin_sun_mirror')).includes('zin_sun_mirror_available'), 'a stilled Mirror hides only its visions');
  assert(JSON.stringify(cats.find(c => c.k === 'zin_sun_council')).includes('zin_sun_council_president'));
});
function decisionProblems(dec, want, icons) {
  const out = [];
  const tree = parse(dec);
  const seen = new Map(tree.flatMap(c => c.v.map(d => [d.k, { cat: c.k, d }])));
  for (const [id, [cat, cost]] of Object.entries(want)) {
    const e = seen.get(id); if (!e) { out.push(`${id} missing`); continue; }
    if (e.cat !== cat) out.push(`${id} in ${e.cat}`);
    const body = decisionBlock(id);
    if (!body.includes(cost)) out.push(`${id}: ${cost}`);
    const has = k => e.d.v.some(x => x.k === k);
    if (!(has('allowed') && has('complete_effect') && has('ai_will_do'))) out.push(`${id} lacks a block`);
    if (has('target_trigger') && !has('target_root_trigger')) out.push(`${id} targeted without a pre-check`);
    if (!icons.has(e.d.v.find(x => x.k === 'icon').v)) out.push(`${id} icon`);
  }
  for (const id of seen.keys()) if (!(id in want)) out.push(`${id} is not in the spec`);
  return out;
}

test('Negative: a wrong price, a decision in the wrong category or an unplanned decision is refused', async () => {
  const icons = await knownIcons();
  const want = { zin_sun_look_mirror: ['zin_sun_mirror', 'cost = 50'] };
  assert(decisionProblems(DEC, { zin_sun_look_mirror: ['zin_sun_mirror', 'cost = 40'] }, icons).some(p => p.includes('cost = 40')));
  assert(decisionProblems(DEC, { zin_sun_look_mirror: ['zin_sun_counsel', 'cost = 50'] }, icons).some(p => p.includes('in zin_sun_mirror')));
  assert(decisionProblems(DEC, want, icons).some(p => p.includes('zin_sun_audience is not in the spec')));
  assert(decisionProblems(DEC.replace('icon = GFX_idea_zin_mirror_rain', 'icon = GFX_idea_zin_no_such_icon'), want, icons).some(p => p.includes('zin_sun_look_mirror icon')));
});

test('Events and their pictures: every visible event takes 30 days, news events are news, every picture is a catalog key with its crop', async () => {
  assert.deepEqual(await eventProblems(EV), []);
  const pic = id => /picture = (GFX_[a-z_]+)/.exec(eventBlock(EV, id))[1];
  assert.deepEqual(['zin_sun.5', 'zin_sun.6', 'zin_sun.10', 'zin_sun.20', 'zin_sun.21', 'zin_sun.30', 'zin_sun.31', 'zin_sun.35'].map(pic), ['GFX_zin_evt_gala_court', 'GFX_zin_evt_gala_court', 'GFX_zin_evt_gala_court', 'GFX_zin_evt_gala_court', 'GFX_zin_evt_gala_court', 'GFX_zin_news_generic_war', 'GFX_zin_evt_generic_war', 'GFX_zin_evt_generic_court']);
  assert(!/mean_time_to_happen/.test(EV), 'every event is fired by an effect or an on_action');
  const six = aiBlocks(eventBlock(EV, 'zin_sun.6'));
  const strained = b => cond => (condText(cond).includes('has_war') ? b : true);
  assert.equal(aiValue(six[0], strained(false)), 80); assert.equal(aiValue(six[0], strained(true)), 10);
  assert.equal(aiValue(six[0], strained(true)) + aiValue(six[1], strained(true)), 100);
  assert(eventBlock(EV, 'zin_sun.6').includes(`give_guarantee = ${GALA}`) && eventBlock(EV, 'zin_sun.6').includes('zin_arg_value = 15'));
});
async function eventProblems(ev) {
  const cells = await json('presentation-cells.json');
  const pics = new Map(cells.events.map(e => [e.key, e]));
  const out = [];
  for (const e of parse(ev).filter(x => /^(country|news)_event$/.test(x.k))) {
    const get = k => e.v.find(x => x.k === k)?.v, id = get('id');
    if (get('hidden') === 'yes') { if (!e.v.some(x => x.k === 'immediate')) out.push(`${id} hidden without effects`); continue; }
    if (get('timeout_days') !== '30') out.push(`${id} timeout`);
    const m = /^GFX_zin_(evt|news)_(.+)$/.exec(get('picture') ?? '');
    if (!m || !pics.has(m[2])) { out.push(`${id} picture`); continue; }
    if (e.k === 'news_event' && !['both', 'news'].includes(pics.get(m[2]).crop)) out.push(`${id}: ${m[2]} has no news crop`);
    if (e.k === 'news_event' && get('major') !== 'yes') out.push(`${id} news is not major`);
    if (!e.v.some(x => x.k === 'option')) out.push(`${id} has no option`);
  }
  return out;
}

test('Negative: a short timeout, a picture outside the catalog or a picture key the module does not know is refused', async () => {
  assert((await eventProblems(EV.replace('timeout_days = 30', 'timeout_days = 7'))).some(p => p.endsWith('timeout')));
  assert((await eventProblems(EV.replace('picture = GFX_zin_evt_gala_court', 'picture = GFX_zin_evt_mirror_courtyard'))).some(p => p.endsWith('picture')), 'mirror_courtyard is requested art, not yet a catalog key');
});

test('Rule reads: the AI reads the path rule only through the wrappers; the League is never raised on the historical path', () => {
  assert.deepEqual(ruleProblems(allScript), []);
  const ai = /ai_will_do = \{([\s\S]*)\n\t\}/.exec(decisionBlock('zin_sun_raise_league'))[1];
  assert.equal(aiValue(`base = 0\n${ai.replace(/^\t\t/gm, '')}`, cond => condText(cond).includes('zin_rules_is_historical') || condText(cond).includes('zin_sun_league_needed')), 0, 'HISTORICAL: 0');
  assert.equal(aiValue(`base = 0\n${ai.replace(/^\t\t/gm, '')}`, cond => !condText(cond).includes('zin_rules_is_historical')), 100, 'otherwise 100 when needed');
});
function ruleProblems(script) {
  const out = [];
  if (/has_game_rule/.test(script)) out.push('a rule is read directly, not through zin_rules_*');
  if (/zin_rule_[a-z_]+/.test(script.replace(/zin_rules_is_(historical|free)/g, ''))) out.push('a rule name outside the wrappers');
  for (const w of ['zin_rules_is_historical = yes', 'zin_rules_is_free = yes']) if (!script.includes(w)) out.push(`${w} is not read`);
  return out;
}

test('Negative: a direct has_game_rule read or a lost historical gate is refused', () => {
  assert(ruleProblems(`${allScript}\nx = { has_game_rule = { rule = zin_rule_historical_path option = HISTORICAL } }`).some(p => p.includes('directly')));
  assert(ruleProblems(allScript.replace('zin_rules_is_historical = yes', 'always = no')).some(p => p.includes('historical')));
});

test('Story pace: the slice writes no fixed story date; a story date trigger is written once for each of the three paces', () => {
  for (const [f, t] of scriptFiles) assert.deepEqual(rawDates(t), [], `${f} has a date outside the story pace (V4, R2)`);
  const t = dateTrigger('zin_sun_x_after', 1752, 3, 1);
  assert.equal([...t.matchAll(/date > /g)].length, 4, 'slow, standard, fast and the unset pace');
  for (const pace of [1, 1.5, 0.75]) assert(t.includes(`date > ${paceDate(1752, 3, 1, pace)}`), `pace ${pace}`);
  assert.equal(new Set([1, 1.5, 0.75].map(p => paceDate(1752, 3, 1, p))).size, 3, 'three different dates');
  assert.deepEqual(rawDates(t), [], 'a story date trigger passes the check');
});

test('Negative: a fixed date in script is refused by the story-pace check', () => {
  assert.deepEqual(rawDates(`${EF}\nzin_sun_x = {\n\tdate > 1752.3.1\n}\n`), ['1752.3.1']);
});

test('Runners: the one monthly hook runs only for the runner and refreshes the region\'s focus layouts last; no daily or weekly hook', () => {
  assert.deepEqual(runnerProblems(ON, EF), []);
  const runner = blockOf(TR, 'zin_sun_is_runner');
  assert(runner.includes(`original_tag = ${GALA}`) && runner.includes('has_country_flag = zin_sun_council_president'));
});
function runnerProblems(on, ef) {
  const out = [];
  if (/\bon_(daily|weekly)\b/.test(on)) out.push('a daily or weekly hook');
  if (!/on_monthly = \{\n\t\teffect = \{\n\t\t\tif = \{\n\t\t\t\tlimit = \{ zin_sun_is_runner = yes \}\n\t\t\t\tzin_sun_monthly = yes/.test(on)) out.push('the monthly hook is not gated on the runner');
  const monthly = blockOf(ef, 'zin_sun_monthly');
  if (monthly.lastIndexOf('mark_focus_tree_layout_dirty = yes') < monthly.lastIndexOf('zin_sun_add_clarity')) out.push('layouts refresh last (E4)');
  if (!/every_country = \{\n\t\tlimit = \{ zin_sun_is_lands_of_the_sun_country = yes \}\n\t\tmark_focus_tree_layout_dirty = yes/.test(monthly)) out.push('the region\'s layouts');
  return out;
}

test('Negative: an ungated monthly hook or a weekly hook is refused', () => {
  assert(runnerProblems(ON.replace('limit = { zin_sun_is_runner = yes }', 'limit = { always = yes }'), EF).some(p => p.includes('runner')));
  assert(runnerProblems(ON.replace('\ton_monthly = {', '\ton_weekly = {'), EF).some(p => p.includes('weekly')));
});

test('AI strategies: every Sunhot realm befriends the Gala Elves and the Lands of Light and will conquer no country of the region', () => {
  const ai = text('common/ai_strategy/zin_sun.txt');
  const top = parse(ai)[0];
  assert.equal(top.k, 'zin_sun_peaceful_realms');
  const strategies = top.v.filter(e => e.k === 'ai_strategy').map(e => Object.fromEntries(e.v.map(x => [x.k, x.v])));
  assert.deepEqual(strategies.filter(s => s.type === 'befriend').map(s => [s.id, s.value]), [[GALA, '20'], [LOL, '20']]);
  const conquer = strategies.filter(s => s.type === 'conquer');
  assert.equal(conquer.length, DATA.roster.expectedCountries); assert(conquer.every(s => s.value === '-100'));
  assert.equal(new Set(conquer.map(s => s.id)).size, DATA.roster.expectedCountries, 'no duplicate strategy');
  assert(ai.includes('enable = { zin_sun_is_sunhot_realm = yes }'));
  assert(!/declare_war_on|create_wargoal|add_state_claim|add_claim_by/.test(allScript.replace(blockOf(EF, 'zin_sun_lorien_rides'), '')), 'the only war this slice opens is the ride against Zol');
});

test('Zol: this slice adds no manifestation content of its own (owner decision K4)', () => {
  assert(!/zin_zol_manifested/.test(allScript) && !/zin_zol_manifested/.test(JSON.stringify(DATA)), 'the manifestation flag is read by the Zol spec, which calls the ride');
  assert(!/\bZol\b/.test(Object.values(locEntries).join('\n')), 'no text of this slice names Zol');
  assert(/\bZol\b/.test(`${Object.values(locEntries).join('\n')}\nZol walks.`), 'the scan sees the name');
});
