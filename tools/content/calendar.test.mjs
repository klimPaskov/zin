// Tests for the Reckoning of the Twelve, the local reckonings and the defines file (docs/lore/references/calendar.md,
// decisions K28 and K30, docs/design/calendar_localisation.md, docs/specs/00_foundation/05_defines_and_rules.md): the staged
// tree opens the game on 1 Lumae 4A 1748, names the twelve god-months in every language by the formula of pantheon.json,
// leaves no former month name in any staged text, converts the shared year count into the local reckonings, and sets only
// defines the installed game has.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stagingDir, GAME } from './lib/paths.mjs';
import {
  START_DATE, END_DATE, START_SHOWN, MONTHS, PANTHEON, FORMER_MONTHS, LANGUAGE_FORMULA, CALENDARS, monthKeys, monthIndex,
  sharedYear, eraYear, eraOffset, risingDay, firstRisingYear, risingOf, ordinalWord, ordinalSuffix, reckonDate, fillForm,
} from './lib/calendar.mjs';
import { assertKeysExist, LANGUAGES, resolveReckoningRealms, reckoningLoc, startupFile } from './modules/calendar.mjs';
import { parseWindow } from './modules/events_world.mjs';
import { parseLocText, isCp1252 } from './lib/loc_parse.mjs';
import { assertDefinesExist, rowsInEffect, vanillaCategories } from './modules/defines.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const STAGED = stagingDir(process.env.ZIN_STAGED);
const read = p => readFile(path.join(STAGED, p), 'utf8');
const json = async rel => JSON.parse(await readFile(path.join(here, rel), 'utf8'));
const vanillaDefines = await readFile(`${GAME}/common/defines/00_defines.lua`, 'utf8');
const ROSTER = await json('data/world/roster.json');
const COUNTRIES = (await json('data/countries.json')).countries;
const locOf = async p => new Map(parseLocText(await read(p)).map(e => [e.key, e.value]));

// The owner's order (decision K28, 24 October 2026).
const K28 = ['Glernaen', 'Sulethe', 'Lumae', 'Maelwen', 'Vaelei', 'Rasthel', 'Kerun', 'Aurlan', 'Ailtal', 'Irumas', 'Gaelor', 'Naisa'];
const FORMER = ['Deepwinter', 'Ironfrost', 'Thaw', 'Rainwake', 'Sowing', 'Highsun', 'Goldfield', 'Harvest', 'Fallowing', 'Emberleaf', 'Mistfall', 'Longnight'];
const ENGINE_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ------------------------------------------------------------------------------------------------ the twelve
test('The game opens on 1 Lumae 4A 1748 and the twelve god-months stand in the owner\'s order, read from pantheon.json', () => {
  assert.equal(START_DATE, '1748.3.1.12');
  assert.equal(END_DATE, '1800.1.1.1');
  assert.equal(START_SHOWN, '1 Lumae 4A 1748');
  assert.equal(PANTHEON.calendar.startShown, START_SHOWN);
  assert.deepEqual(MONTHS.map(m => m.name), K28);
  assert.deepEqual(MONTHS.map(m => m.god), K28, 'each month is named after its god');
  assert.deepEqual(MONTHS.map(m => m.key), ENGINE_FULL);
  assert.equal(MONTHS[2].name, 'Lumae', 'month 3 is Lumae, so the start is the first day of spring');
  for (const g of PANTHEON.gods.filter(x => x.monthIndex)) assert.equal(MONTHS[g.monthIndex - 1].name, g.monthName, `${g.name} names month ${g.monthIndex}`);
});

test('Names and abbreviations are unique, abbreviations have at most four letters, and every form is Windows-1252', () => {
  assert.equal(new Set(MONTHS.map(m => m.name)).size, 12);
  assert.equal(new Set(MONTHS.map(m => m.abbr)).size, 12);
  for (const m of MONTHS) {
    assert.match(m.abbr, /^[A-Za-z]{1,4}$/, `${m.name}: ${m.abbr}`);
    assert(m.name.startsWith(m.abbr), `${m.abbr} abbreviates ${m.name}`);
    for (const form of [m.name, m.shortForm, m.abbr]) assert([...form].every(isCp1252), `${form} is outside Windows-1252`);
    assert.match(m.name, /^[A-Za-z]+$/, `${m.name} needs no character a game font may lack`);
  }
});

test('Negative: an abbreviation over four letters, a duplicate or a character outside Windows-1252 is caught by the same checks', () => {
  const bad = [{ abbr: 'Glern' }, { abbr: 'Gleń' }];
  assert(!/^[A-Za-z]{1,4}$/.test(bad[0].abbr));
  assert(![...bad[1].abbr].every(isCp1252));
  assert.equal(new Set(['Gler', 'Gler']).size, 1);
});

test('The month keys follow the per-language formula: 12 full keys and 11 short keys (May serves both)', () => {
  for (const lang of LANGUAGES) {
    const keys = monthKeys(lang), f = LANGUAGE_FORMULA[lang];
    assert(f, `${lang} has a formula`);
    assert.equal(Object.keys(keys).length, 23);
    for (const m of MONTHS) {
      assert.equal(keys[m.key], f.full.replace('{name}', m.name).replace('{abbr}', m.abbr), `${lang} ${m.key}`);
      if (m.short !== m.key) assert.equal(keys[m.short], f.short.replace('{name}', m.name).replace('{abbr}', m.abbr), `${lang} ${m.short}`);
    }
  }
  assert.equal(monthKeys('english').May, 'Vaelei');
  assert.equal(monthKeys('japanese').March, 'Lumae月');
  assert.equal(monthKeys('korean').Mar, 'Lumae월');
  assert.throws(() => monthKeys('klingon'), /no month formula for klingon/);
});

test('Every staged language folder names the twelve in order, with no Earth month left', async () => {
  for (const lang of LANGUAGES) {
    const raw = await read(`localisation/replace/zin_calendar_l_${lang}.yml`);
    assert(raw.startsWith('﻿l_' + lang + ':'), `${lang} header and BOM`);
    const loc = new Map(parseLocText(raw).map(e => [e.key, e.value]));
    const want = monthKeys(lang);
    assert.deepEqual(Object.fromEntries(loc), want, `${lang}: exactly the month keys`);
    const full = ENGINE_FULL.map(k => loc.get(k));
    assert.deepEqual(full.map(v => K28.find(n => v.startsWith(n))), K28, `${lang}: the twelve in order`);
    for (const earth of ENGINE_FULL.filter(e => e !== 'May')) assert(![...loc.values()].some(v => v.includes(earth)), `${lang} still names ${earth}`);
    if (!['japanese', 'korean', 'simp_chinese'].includes(lang)) for (const v of loc.values()) assert([...v].every(isCp1252), `${lang}: ${v}`);
  }
});

test('Negative: a month key the game does not define fails the build', async () => {
  await assert.rejects(assertKeysExist({ Smarch: 'Nonsense' }), /Calendar keys the game does not define: Smarch/);
});

test('No former month name is left in the staged localisation', async () => {
  const files = [];
  const walk = async dir => { for (const e of await readdir(path.join(STAGED, dir), { withFileTypes: true })) { const rel = `${dir}/${e.name}`; if (e.isDirectory()) await walk(rel); else if (rel.endsWith('.yml')) files.push(rel); } };
  await walk('localisation');
  assert(files.length > 100, `${files.length} localisation files`);
  // The nine coined names are never ordinary words. Thaw, Sowing and Harvest stay as season words ("Harvest Home", "the Thaw"),
  // but never as a month: after a day number or a preposition, or before a year.
  const coined = new RegExp(`\\b(${FORMER.filter(n => !['Thaw', 'Sowing', 'Harvest'].includes(n)).join('|')})\\b`);
  const asMonth = /\b(?:\d{1,2}|in|each|every|from|to|until|since|before|after|at|of) (?:Thaw|Sowing|Harvest)\b|\b(?:Thaw|Sowing|Harvest),? (?:4A )?\d{3,4}\b/;
  const hits = [];
  for (const f of files) for (const e of parseLocText(await read(f))) if (coined.test(e.value) || asMonth.test(e.value)) hits.push(`${f} ${e.key}: ${e.value.slice(0, 80)}`);
  assert.deepEqual(hits, []);
  assert(asMonth.test('He wakes in Thaw of 4A 1749.') && coined.test('the Mistfall Vigil') && !asMonth.test('Harvest Home') && !asMonth.test('When the Thaw Comes'), 'the patterns catch a month and pass a season word');
});

test('The start text and the bookmark date read 1 Lumae 4A 1748', async () => {
  const tech = await locOf('localisation/english/zin_technologies_l_english.yml');
  assert.equal(tech.get('zin_techtree_year_start'), '1 Lumae 4A 1748');
  const months = await locOf('localisation/replace/zin_calendar_l_english.yml');
  assert.equal(months.get('March'), 'Lumae', 'the engine shows the bookmark date 1748.3.1 with the key March');
  const lua = await read('common/defines/zin_defines.lua');
  assert.match(lua, /NDefines\.NGame\.START_DATE = "1748\.3\.1\.12"/);
  const rules = await locOf('localisation/english/zin_game_rules_l_english.yml');
  assert.equal(rules.get('ZIN_RULE_EINDIL_WAKING_EARLY_DESC'), 'He wakes in Rasthel of 4A 1748.');
});

// ------------------------------------------------------------------------------------------------ seasons
test('The seasonal mechanic keeps its months by index: thaw 3, floods 4, sowing 5, harvest 8, long nights 12 and 1', async () => {
  const c = PANTHEON.calendar;
  assert.deepEqual(c.seasonalMechanic, { thaw: 3, floods: 4, sowing: 5, harvest: 8, long_nights: [12, 1] });
  assert.deepEqual(MONTHS.map(m => m.season), ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter']);
  assert.deepEqual([...FORMER_MONTHS.keys()], FORMER);
  FORMER.forEach((n, i) => { assert.equal(monthIndex(n), i + 1, n); assert.equal(monthIndex(K28[i]), i + 1, K28[i]); });
  assert.equal(monthIndex('Smarch'), null);
  // Windows written before the god-months keep their days; the god-months give the same days.
  assert.deepEqual(parseWindow('Thaw 1749'), parseWindow('Lumae 1749'));
  assert.deepEqual(parseWindow('1 Highsun 1748'), parseWindow('1 Rasthel 1748'));
  assert.deepEqual(parseWindow('Thaw 1748 to Ironfrost 1749'), parseWindow('Lumae 1748 to Sulethe 1749'));
  assert.throws(() => parseWindow('Midsummer 1748'));
  const cold = await json('data/mech_regions_cold.json');
  assert.deepEqual([cold.seasons.mistfall, cold.seasons.deepwinter], [[11, 1], [1, 1]], 'the Cold Lands seasons are month numbers, not names');
  const staged = await read('localisation/english/zin_cold_l_english.yml');
  assert.match(staged, /On the first day of Glernaen the headmen/);
});

// ------------------------------------------------------------------------------------------------ local reckonings
test('The shared year count: 1A 1 is year 1 and 4A 1748 is 6816', () => {
  assert.equal(sharedYear('1A', 1), 1);
  assert.equal(sharedYear('2A', 1), 1676);
  assert.equal(sharedYear('2A', 2133), 3808);
  assert.equal(sharedYear('3A', 1), 3809);
  assert.equal(sharedYear('4A', 1), 5069);
  assert.equal(sharedYear('4A', 1748), 6816);
  assert.throws(() => sharedYear('3A', 1261), /3A has no year 1261/);
  assert.throws(() => sharedYear('4A', 0), /no year 0/);
  assert.throws(() => sharedYear('5A', 1), /No age 5A/);
});

test('The Count of the Wells and the Ledger Count: 4A 1748 is the 3952nd year of the Wells and the 1108th of the Ledger', () => {
  assert.equal(eraYear('well_count', 1748), 3952);
  assert.equal(eraYear('ledger_count', 1748), 1108);
  assert.equal(eraYear('well_count', 1800), 4004);
  assert.equal(eraOffset('well_count'), 2204);
  assert.equal(eraOffset('ledger_count'), -640);
  assert.equal(eraYear('ledger_count', 641), 1, 'the Gold Road opened in 4A 641');
  assert.equal(eraYear('ledger_count', 640), null, 'negative: no Ledger year before the Gold Road');
  assert.equal(sharedYear('4A', 1748) - eraYear('well_count', 1748) + 1, sharedYear('2A', 1190), 'the Seven Wells were dug in 2A 1190');
  assert.throws(() => eraOffset('flood_count'), /does not count years from an era/);
  assert.throws(() => eraYear('moon_count', 1748), /No reckoning moon_count/);
});

test('The Count of the Floods numbers the Risings of each reign from the first day of Maelwen', () => {
  assert.deepEqual(risingDay(), { month: 4, day: 1 });
  const start = { year: 1748, month: 3, day: 1 };
  assert.equal(firstRisingYear(12, start), 1736, 'Alerh Kerseus is in his twelfth Rising at the start');
  assert.equal(risingOf(1736, start), 12);
  assert.equal(risingOf(1736, { year: 1748, month: 3, day: 31 }), 12, 'the last day of Lumae is still the twelfth Rising');
  assert.equal(risingOf(1736, { year: 1748, month: 4, day: 1 }), 13, 'the river rises on 1 Maelwen');
  assert.equal(risingOf(1749, { year: 1748, month: 6, day: 1 }), 0, 'negative: a king whose first Rising has not come');
  assert.throws(() => firstRisingYear(0, start), /no Rising 0/);
  for (const [n, w] of [[1, 'first'], [12, 'twelfth'], [20, 'twentieth'], [21, 'twenty-first'], [42, 'forty-second'], [99, 'ninety-ninth'], [113, '113th']]) assert.equal(ordinalWord(n), w);
  assert.throws(() => ordinalWord(0), /No ordinal/);
  for (const [n, s] of [[1, 'st'], [2, 'nd'], [3, 'rd'], [4, 'th'], [11, 'th'], [12, 'th'], [13, 'th'], [21, 'st'], [101, 'st'], [111, 'th'], [1108, 'th'], [3952, 'nd']]) assert.equal(ordinalSuffix(n), s, String(n));
});

test('Dates read as the histories write them in each reckoning', async () => {
  const d = { year: 1748, month: 3, day: 1 };
  const east = await json('data/world/history/east_lands.json');
  const today = Object.fromEntries(east.countries.map(c => [c.name, c.today]));
  const well = reckonDate('well_count', d), ledger = reckonDate('ledger_count', d);
  assert.equal(well, 'the 3952nd year of the Wells');
  assert(today.Noris.startsWith(`In ${well},`), 'Noris dates its history by the Wells');
  assert(today.Stabilo.startsWith(`In ${ledger} `), 'Stabilo dates its history by the Ledger');
  const firstRising = firstRisingYear(CALENDARS.flood_count.reigns.alerhia.rising, d);
  assert.equal(reckonDate('flood_count', d, { leader: 'Kerseus Furanides', firstRising }), 'the twelfth Rising of Kerseus Furanides');
  assert(today.Alerhia.startsWith('In the twelfth Rising of'));
  assert(today.Erco.startsWith(`In the ${ordinalWord(CALENDARS.flood_count.reigns.erco.rising)} Rising of`));
  assert(today.Plutondo.startsWith(`In the ${ordinalWord(CALENDARS.flood_count.reigns.plutondo.rising)} Rising of`));
  assert.equal(reckonDate('flood_count', d, { leader: 'Esiuran' }), 'the reign of Esiuran', 'no written Rising: the reign');
  assert.equal(reckonDate('numbered_musters', d), 'the Third Muster of 4A 1748');
  assert.equal(reckonDate('twelve', d), 'Lumae, 4A 1748');
  assert.equal(reckonDate('twelve', { year: 1750, month: 11, day: 30 }), 'Gaelor, 4A 1750', 'the Day of Deliverance falls in Gaelor');
  assert.equal(reckonDate('season_count', { year: 1748, month: 12, day: 1 }), 'the winter');
  assert.equal(reckonDate('elven_seasons', { year: 1748, month: 7, day: 1 }), 'the summer');
  assert.equal(reckonDate('ledger_count', { year: 600, month: 1, day: 1 }), 'a year before the opening of the Gold Road', 'negative: before the era');
  assert.throws(() => reckonDate('twelve', { year: 1748, month: 4, day: 31 }), /No day 31 of month 4/);
  assert.throws(() => reckonDate('twelve', { year: 1748, month: 13, day: 1 }), /No day/);
  assert.throws(() => fillForm('the {fortnight}', {}), /names \{fortnight\}/);
});

test('Every calendar of the roster has a reckoning, and every river-crown of the Count of the Floods a reign entry', () => {
  const used = new Set(ROSTER.realms.map(r => r.calendar));
  for (const id of used) assert(CALENDARS[id], `reckonings.json lacks ${id}`);
  for (const id of Object.keys(ROSTER.calendars)) assert(CALENDARS[id], `reckonings.json lacks the roster calendar ${id}`);
  const floods = ROSTER.realms.filter(r => r.calendar === 'flood_count').map(r => r.key).sort();
  assert.deepEqual(Object.keys(CALENDARS.flood_count.reigns).sort(), floods);
});

test('Negative: an unknown calendar, two realms on one tag, and a river-crown without a reign entry fail', () => {
  const realm = (o) => ({ key: 'x', tag: 'XXX', name: 'Nowhere', calendar: 'well_count', formerLabels: [], ...o });
  assert.throws(() => resolveReckoningRealms({ realms: [realm({ calendar: 'moon_count' })] }, COUNTRIES), /moon_count, which reckonings.json does not define/);
  const c = COUNTRIES[0];
  assert.throws(() => resolveReckoningRealms({ realms: [realm({ tag: c.tag }), realm({ key: 'y', name: c.name })] }, COUNTRIES), /both resolve to/);
  assert.throws(() => startupFile([{ key: 'nowhere', name: 'Nowhere', calendar: 'flood_count', tag: 'XXX' }]), /no reign for the river-crown nowhere/);
  const r = resolveReckoningRealms({ realms: [realm({ name: 'Nowhere at all' })] }, COUNTRIES);
  assert.deepEqual(r, { resolved: [], unresolved: ['x'] });
});

test('The staged reckoning: start-up flags, the first Risings, the constants, the effect and the scripted localisation agree', async () => {
  const { resolved } = resolveReckoningRealms(ROSTER, COUNTRIES);
  assert(resolved.length > 40, `${resolved.length} realms keep their own reckoning`);
  const startup = await read('common/on_actions/zin_calendar.txt');
  for (const r of resolved) assert(startup.includes(`${r.tag} = { set_country_flag = zin_calendar_${r.calendar} `), `${r.name} (${r.tag})`);
  const alerhia = resolved.find(r => r.key === 'alerhia');
  if (alerhia) assert(startup.includes(`${alerhia.tag} = { set_country_flag = zin_calendar_flood_count set_variable = { zin_reckoning_first_rising = 1736 } zin_reckoning_refresh = yes }`));
  assert(!/^\s*(?:on_daily|on_weekly|on_monthly)/m.test(startup), 'no world pulse');
  const constants = await read('common/script_constants/zin_calendar_constants.txt');
  assert.match(constants, /well_count_offset = 2204/);
  assert.match(constants, /ledger_count_offset = -640/);
  assert.match(constants, /rising_month = 4/);
  const effects = await read('common/scripted_effects/zin_calendar.txt');
  for (const m of effects.matchAll(/constant:zin_calendar\.([a-z_]+)/g)) assert(constants.includes(`\t${m[1]} = `), `constant ${m[1]}`);
  assert(effects.includes('zin_reckoning_refresh = {') && effects.includes('zin_reckoning_new_reign = {'));
  assert(!/[<>]=/.test(effects), 'no <= or >=');
  const sl = await read('common/scripted_localisation/zin_calendar.txt');
  const defined = new Set([...sl.matchAll(/name = (\w+)/g)].map(m => m[1]));
  for (const id of Object.keys(CALENDARS).filter(i => i !== 'twelve')) assert(sl.includes(`has_country_flag = zin_calendar_${id} } localization_key = zin_reckoning_${id} }`), id);
  for (const lang of LANGUAGES) {
    const loc = await locOf(`localisation/${lang}/zin_reckoning_l_${lang}.yml`);
    assert.deepEqual(Object.fromEntries(loc), reckoningLoc(), `${lang}: the reckoning texts`);
    const months = monthKeys(lang);
    for (const m of sl.matchAll(/localization_key = (\w+)/g)) assert(loc.has(m[1]) || m[1] in months, `${lang}: ${m[1]}`);
    for (const v of loc.values()) for (const call of v.matchAll(/\[This\.(\w+)\]/g)) assert(defined.has(call[1]) || call[1] === 'GetLeader', `${lang}: ${call[1]}`);
  }
});

// ------------------------------------------------------------------------------------------------ defines
test('The defines file opens the game in 4A 1748 and makes the nuclear defines inert', async () => {
  const lua = await read('common/defines/zin_defines.lua');
  assert.match(lua, /NDefines\.NGame\.START_DATE = "1748\.3\.1\.12"/);
  assert.match(lua, /NDefines\.NGame\.END_DATE = "1800\.1\.1\.1"/);
  assert.match(lua, /NDefines\.NDiplomacy\.TENSION_TIME_SCALE_START_DATE = "1748\.3\.1\.12"/);
  assert.match(lua, /NDefines\.NRaids\.NUCLEAR_BOMB_PRODUCTION_SCALE = 1000000/);
  assert.match(lua, /NDefines\.NTechnology\.BASE_YEAR_AHEAD_PENALTY_FACTOR = 2 /, 'the ahead-of-time penalty returns with the Aoaz technology years');
  assert.match(lua, /NDefines\.NGame\.HANDS_OFF_START_TAG = "Y60"/);
  assert(!/=s*"19dd/.test(lua), 'no vanilla date is assigned');
});

test('Every define in the table exists in the installed game under its category', async () => {
  const data = await json('data/defines.json');
  assertDefinesExist(data.rows, vanillaDefines);
  assert(vanillaCategories(vanillaDefines).has('NGame'));
});

test('Negative: an unknown define or category fails (the engine would ignore it silently)', () => {
  assert.throws(() => assertDefinesExist([{ category: 'NGame', key: 'START_DAET', value: 1 }], vanillaDefines), /no such define/);
  assert.throws(() => assertDefinesExist([{ category: 'NMagic', key: 'START_DATE', value: 1 }], vanillaDefines), /no such category/);
});

test('For one key the row with the highest stage not above the current stage wins', () => {
  const rows = [
    { category: 'NTechnology', key: 'BASE_YEAR_AHEAD_PENALTY_FACTOR', value: 0, fromStage: 1 },
    { category: 'NTechnology', key: 'BASE_YEAR_AHEAD_PENALTY_FACTOR', value: 2, fromStage: 2 },
    { category: 'NCountry', key: 'MIN_MAJOR_COUNTRIES', value: 9, fromStage: 3 },
  ];
  assert.deepEqual(rowsInEffect(rows, 1).map(r => r.value), [0]);
  assert.deepEqual(rowsInEffect(rows, 2).map(r => r.value), [2]);
  assert.deepEqual(rowsInEffect(rows, 3).map(r => r.value), [9, 2]);
});
