// Tests for the natural names of the map (modules/world_names.mjs): every formula name of the map tool is replaced, the names are
// unique, in the language of the owner, deterministic, and fit the game's font. They read the map that is in the mod now.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Staged } from './lib/core.mjs';
import { countryTable } from './lib/roster.mjs';
import { isWindows1252 } from './lib/language_generator.mjs';
import { runTextScan } from './checks/text_scan.mjs';
import { resetNaming } from './modules/names.mjs';
import { NAMES_DOC, NAMES_FILE, buildWorldNames, fontSafe, isGenericName, nameWorld, readCurrentNames, readWorldMap } from './modules/world_names.mjs';

test('isGenericName: the map tool\'s formulas are generic, canon and derived feature names are not', () => {
  for (const name of ['Southwestern Cold Lands II', 'Central North Lands 20', 'MOO District 2', 'MOO Settlement 2938', 'Region 12', 'Sonargur Town', 'Cape Tinton Coast', 'Northern Cold Lands'])
    assert.equal(isGenericName(name), true, name);
  for (const name of ['Parim', 'Konorar Valley', 'Great River Valley', 'Olsuaon Massif Foothills', 'Kerhil Water Ford', 'Bay of Sonargur', 'Eindil\'s Ice', 'Mirror of First Rain', 'Zol\'s Mistake'])
    assert.equal(isGenericName(name), false, name);
});

test('fontSafe writes a macron plain and keeps every other letter', () => {
  assert.equal(fontSafe('Šodolôrō'), 'Šodolôro');
  assert.equal(fontSafe('Isle of Šodolôrō'), 'Isle of Šodolôro');
  assert.equal(fontSafe('R\'en'), 'R\'en');
});

const map = readWorldMap(), current = readCurrentNames(), roster = countryTable();
const run = () => { resetNaming(); return nameWorld({ map, current, roster }); };
const first = run();
const finalName = key => first.names.get(key)?.name ?? current.get(key);
const nameKeys = [...current.keys()].filter(k => /^(STATE|VICTORY_POINTS|STRATEGICREGION)_\d+$/.test(k));

test('every state, victory point and strategic region ends with a natural name', () => {
  assert.equal(nameKeys.length, map.states.length + map.states.reduce((n, s) => n + s.vps.length, 0) + map.regions.length);
  const formulas = nameKeys.filter(k => isGenericName(finalName(k)));
  assert.deepEqual(formulas.slice(0, 5), [], `${formulas.length} formula names remain`);
  assert.ok(first.report.states > 2000 && first.report.victoryPoints > 2000 && first.report.regions > 500, JSON.stringify(first.report));
});

test('names are unique: a state and one of its own points may share a name, nothing else may', () => {
  const stateOfPoint = new Map();
  for (const s of map.states) for (const v of s.vps) stateOfPoint.set(`VICTORY_POINTS_${v.province}`, s.id);
  const groups = new Map();
  for (const key of nameKeys) { const n = finalName(key).toLowerCase(); (groups.get(n) ?? groups.set(n, []).get(n)).push(key); }
  const problems = [];
  for (const [name, keys] of groups) {
    if (keys.length === 1) continue;
    const states = keys.filter(k => k.startsWith('STATE_')), points = keys.filter(k => k.startsWith('VICTORY_')), regions = keys.filter(k => k.startsWith('STRATEGIC'));
    const stateId = states.length ? Number(states[0].slice(6)) : null;
    const landRegionPair = regions.length === 1 && states.length === 1 && points.length === 0;   // an island that is also its region (Adel, Dumgil)
    if (landRegionPair) continue;
    if (states.length > 1 || regions.length > 0 || points.length > 1 || (points.length === 1 && stateOfPoint.get(points[0]) !== stateId)) problems.push(`${name}: ${keys.join(', ')}`);
  }
  assert.deepEqual(problems.slice(0, 5), [], `${problems.length} shared names`);
});

test('names hold only Windows-1252 letters, no digits, no banned or retired words', () => {
  const bad = [];
  for (const key of nameKeys) {
    const name = finalName(key);
    if ([...name].some(ch => !isWindows1252(ch)) || /\d/.test(name) || /waith/i.test(name)) bad.push(`${key} ${name}`);
  }
  assert.deepEqual(bad.slice(0, 5), []);
});

test('the roster capital names the seat of every realm, and Šodolôro is written without a macron', () => {
  const byTag = new Map(roster.map(r => [r.tag, r]));
  let seats = 0;
  for (const s of map.states) {
    const seat = s.vps.find(v => v.value === 25);
    if (!seat || !s.owner) continue;
    const cap = byTag.get(s.owner).capital;
    if (!cap) continue;   // the Mushroom Forest has no seat on the roster
    seats++;
    assert.equal(finalName(`VICTORY_POINTS_${seat.province}`), fontSafe(typeof cap === 'string' ? cap : cap.name), `${s.owner} capital`);
  }
  assert.equal(seats, roster.filter(r => r.capital).length);
  // The model's name of a seat stays on its state when it fits (Straton's Cursed Square, Hungohon's South Gate Fortress, Biir-Raab's Sun Desert).
  const seatState = tag => map.states.find(s => s.owner === tag && s.vps.some(v => v.value === 25));
  assert.equal(finalName(`STATE_${seatState('SNT').id}`), 'The Cursed Square');
  assert.equal(finalName(`STATE_${seatState('KLU').id}`), 'South Gate Fortress');
  assert.equal(finalName(`STATE_${seatState('WAH').id}`), 'Sun Desert');
  assert.ok(!nameKeys.some(k => finalName(k).includes('ō')));
});

test('the largest Aenoran towns take hand-composed names', () => {
  const hand = [...first.names].filter(([, n]) => n.layer === 'hand');
  assert.equal(hand.length, 60);
  const values = new Map(map.states.flatMap(s => s.vps.map(v => [`VICTORY_POINTS_${v.province}`, v.value])));
  const byTag = new Map(map.states.flatMap(s => s.vps.map(v => [`VICTORY_POINTS_${v.province}`, s.owner])));
  for (const [key] of hand) assert.equal(roster.find(r => r.tag === byTag.get(key)).language, 'aenoran', key);
  const smallest = Math.min(...hand.map(([k]) => values.get(k)));
  const unhanded = [...first.names].filter(([k, n]) => n.kind === 'vp' && n.layer !== 'hand' && n.layer !== 'kept' && roster.find(r => r.tag === byTag.get(k))?.language === 'aenoran' && values.get(k) < 25);
  assert.ok(unhanded.every(([k]) => values.get(k) <= smallest), 'no larger Aenoran town is left to the generator');
});

test('a state is named in the language of its owner; Zol\'s Mistake and the Mushroom Forest take English compounds', () => {
  const layerOf = new Map(map.states.map(s => [s.id, s.owner]));
  let themed = 0, native = 0;
  for (const [key, n] of first.names) {
    if (n.kind !== 'state' || n.layer === 'kept' || n.layer === 'roster') continue;
    const owner = layerOf.get(Number(key.slice(6)));
    if (owner === null) continue;   // unowned land takes the language of the people around it
    if (owner === 'ZOL' || owner === 'MSH') { assert.match(n.layer, /^theme:/, key); themed++; }
    else { assert.doesNotMatch(n.layer, /^theme:/, key); native++; }
  }
  assert.ok(themed > 50 && native > 1500, `${themed} themed, ${native} native`);
});

test('the same map gives the same names, and the staged file is the map tool\'s names file with the natural names written in', async () => {
  const again = run();
  assert.deepEqual([...again.names].map(([k, v]) => [k, v.name]), [...first.names].map(([k, v]) => [k, v.name]));
  resetNaming();
  const staged = new Staged();
  const report = await buildWorldNames(staged);
  const bytes = staged.files.get(NAMES_FILE);
  assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
  const lines = bytes.toString('utf8').split('\n');
  assert.equal(lines[0].replace('﻿', ''), 'l_english:');
  // State, victory point, region and province keys (PROV1468), and the lowercase continent keys (world_continent_1).
  const rows = lines.slice(1).filter(Boolean).map(l => /^ ([A-Za-z_]+_?\d+): "(.*)"$/.exec(l));
  const keys = rows.map(r => r?.[1]);
  assert.ok(keys.every(Boolean) && new Set(keys).size === keys.length && keys.length === current.size && keys.every(k => current.has(k)), 'every key of the map tool\'s file, once');
  for (const [, k, v] of rows) assert.equal(v, first.names.get(k)?.name ?? current.get(k), k);
  assert.ok(!lines.some(l => /:0 /.test(l)), 'no :0 version marker');
  const doc = JSON.parse(staged.files.get(NAMES_DOC).toString('utf8'));
  assert.equal(doc.entries.length, first.names.size, 'the name document lists every renamed key');
  assert.equal(report.states, first.report.states);
});

test('the text scan finds nothing on the names file (no banned word, nothing outside Windows-1252, no duplicate key)', async () => {
  resetNaming();
  const staged = new Staged();
  await buildWorldNames(staged);
  const scan = await runTextScan(staged);
  const mine = scan.findings.filter(f => f.file === NAMES_FILE);
  assert.deepEqual(mine.map(f => `${f.check} ${f.key} ${f.detail}`).slice(0, 5), []);
});
