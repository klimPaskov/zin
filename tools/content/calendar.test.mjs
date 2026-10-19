// Tests for the Fourth Age calendar and the defines file (docs/specs/00_foundation/01_start_and_calendar.md and
// 05_defines_and_rules.md): the staged tree must open the game on 1 Thaw 4A 1748, name every month in Erdae terms,
// and set only defines the installed game has.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stagingDir, GAME } from './lib/paths.mjs';
import { START_DATE, END_DATE, MONTHS, monthKeys } from './lib/calendar.mjs';
import { assertKeysExist, LANGUAGES } from './modules/calendar.mjs';
import { assertDefinesExist, rowsInEffect, vanillaCategories } from './modules/defines.mjs';

const STAGED = stagingDir(process.env.ZIN_STAGED);
const read = p => readFile(path.join(STAGED, p), 'utf8');
const vanillaDefines = await readFile(`${GAME}/common/defines/00_defines.lua`, 'utf8');

test('The start date is 1 Thaw 4A 1748 and the month table names all twelve months', () => {
  assert.equal(START_DATE, '1748.3.1.12');
  assert.equal(END_DATE, '1800.1.1.1');
  assert.equal(MONTHS.length, 12);
  assert.equal(MONTHS[2].name, 'Thaw', 'month 3 is Thaw, so the start is the first day of spring');
  assert.equal(new Set(MONTHS.map(m => m.name)).size, 12);
  assert.equal(new Set(MONTHS.map(m => m.abbr)).size, 12);
});

test('Every month key the engine reads is replaced, in every language folder, with no Earth month left', async () => {
  const keys = monthKeys();
  assert.equal(Object.keys(keys).length, 23, '12 full keys and 11 short keys (May serves both)');
  for (const lang of LANGUAGES) {
    const text = await read(`localisation/replace/zin_calendar_l_${lang}.yml`);
    assert(text.startsWith('﻿l_' + lang + ':'), `${lang} header and BOM`);
    for (const [k, v] of Object.entries(keys)) assert(text.includes(` ${k}:0 "${v}"`), `${lang}: ${k}`);
    for (const earth of ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
      assert(!new RegExp(`:0 "${earth}"`).test(text), `${lang} still names ${earth}`);
  }
});

test('Negative: a month key the game does not define fails the build', async () => {
  await assert.rejects(assertKeysExist({ Smarch: 'Nonsense' }), /Calendar keys the game does not define: Smarch/);
});

test('The defines file opens the game in 4A 1748 and makes the nuclear defines inert', async () => {
  const lua = await read('common/defines/zin_defines.lua');
  assert.match(lua, /NDefines\.NGame\.START_DATE = "1748\.3\.1\.12"/);
  assert.match(lua, /NDefines\.NGame\.END_DATE = "1800\.1\.1\.1"/);
  assert.match(lua, /NDefines\.NDiplomacy\.TENSION_TIME_SCALE_START_DATE = "1748\.3\.1\.12"/);
  assert.match(lua, /NDefines\.NRaids\.NUCLEAR_BOMB_PRODUCTION_SCALE = 1000000/);
  assert.match(lua, /NDefines\.NTechnology\.BASE_YEAR_AHEAD_PENALTY_FACTOR = 0 /, 'no ahead-of-time penalty until the warfare stage');
  assert.match(lua, /NDefines\.NGame\.HANDS_OFF_START_TAG = "Y60"/);
  assert(!/=s*"19dd/.test(lua), 'no vanilla date is assigned');
});

test('Every define in the table exists in the installed game under its category', async () => {
  const data = JSON.parse(await readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), 'data/defines.json'), 'utf8'));
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
