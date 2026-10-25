// Tests of the regional_d focus trees (docs/design/stage2/focus_regional_d.md): the five North Lands crowns, the six
// Triton's Islands, the six West Lands realms and Yeldenne, as data files under docs/design/focus/, plus the Buldor
// decisions module. The trees are compiled with the focus compiler's own check API and compared with the counts of
// their specs; negative cases plant one failure each and expect the matching check to fail.
//   node --test tools/content/focus_regional_d.test.mjs
import test from 'node:test';
import { countryTable } from './lib/roster.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { Staged } from './lib/core.mjs';
import { GAME, ZIN } from './lib/paths.mjs';
import { absolutePositions, focusId, spiritId } from './lib/focus_model.mjs';
import { compileBanned, findBanned, loadRuleSet } from './lib/banned.mjs';
import { analyseTrees, compileTree } from './modules/focus_compiler.mjs';
import { exclusiveClosure, isCp1252, loadArgCodes, loadCatalog, loadRegistry } from './checks/focus_checks.mjs';
import { DATA_FILE, buildDecisionsRegional, validateDecisionData } from './modules/decisions_regional.mjs';

const json = async f => JSON.parse(await readFile(f, 'utf8'));
const FOCUS_DIR = `${ZIN}/docs/design/focus`;

// Per tree: [country, focuses, spirits, events, grid width (max x), grid depth (max y)] from the four specs.
const SPEC = {
  regional_tolvael: ['Tolvael', 36, 11, 6, 17, 8], regional_mina: ['Mina', 32, 10, 3, 16, 7], regional_r_en: ["R'en", 36, 12, 4, 17, 8],
  regional_molot: ['Molot', 33, 10, 3, 16, 7], regional_eekedor: ['Eekedor', 33, 11, 4, 15, 8],
  regional_adel: ['Adel', 34, 6, 2, 18, 7], regional_pollos: ['Pollos', 31, 6, 2, 18, 8], regional_raerby: ['Raerby', 32, 7, 2, 17, 7],
  regional_nondondor: ['Nondondor', 34, 8, 2, 17, 7], regional_halenor: ['Halenor', 33, 9, 1, 19, 7], regional_seite_islands: ['Seite Islands', 32, 6, 2, 18, 7],
  regional_girdon: ['Girdon', 37, 8, 4, 20, 9], regional_lambin: ['Lambin', 33, 9, 1, 19, 9], regional_buldor: ['Buldor', 32, 8, 3, 19, 7],
  regional_kradlon: ['Kradlon', 32, 7, 1, 20, 4], regional_corogon: ['Corogon', 32, 8, 4, 19, 7], regional_varnondor: ['Varnondor', 32, 9, 1, 19, 8],
  regional_yeldenne: ['Yeldenne', 36, 8, 9, 17, 10],
};
const IDS = Object.keys(SPEC);
// The start spirit of every tree whose country history adds one at game start (the tier B island and western specs).
const START_SPIRIT = {
  regional_adel: 'chart_hall_pride', regional_pollos: 'the_market_isle', regional_raerby: 'broker_captains', regional_nondondor: 'the_contested_banks',
  regional_halenor: 'wreck_right', regional_seite_islands: 'isle_moot_custom', regional_girdon: 'long_feuds_toll', regional_lambin: 'downs_granaries',
  regional_buldor: 'company_books', regional_kradlon: 'aenoran_duties', regional_corogon: 'tariff_squeeze', regional_varnondor: 'approach_watchers',
};

const BASE = {};
for (const id of IDS) BASE[id] = await json(`${FOCUS_DIR}/${id}.json`);
const roster = countryTable();
const registry = await loadRegistry();
const codes = await loadArgCodes();
const catalog = await loadCatalog();
const rules = compileBanned(await loadRuleSet({ glossary: await json(new URL('./data/glossary.json', import.meta.url)) }));
// The modifier check reads the installed game's documentation; without the install the check is skipped, as the other tests do.
const haveGame = existsSync(`${GAME}/documentation/modifiers_documentation.md`);
const OPTS = { registry, codes, warn: () => {}, ...(haveGame ? {} : { isValidModifier: () => true }) };

async function analyse(only, mutate) {
  const raw = structuredClone(BASE);
  mutate?.(raw);
  const entries = (only ?? IDS).map(name => ({ name, data: raw[name] }));
  return analyseTrees(entries, new Staged(), OPTS);
}
const real = problems => problems.filter(p => p.code !== 'coverage_none');
const failsWith = async (id, mutate, code, pattern) => {
  const a = await analyse([id], mutate);
  const hit = a.problems.filter(p => p.code === code);
  assert(hit.length, `expected ${code}, got ${[...new Set(a.problems.map(p => p.code))].join(', ') || 'no problem'}`);
  if (pattern) assert(hit.some(p => pattern.test(p.message)), `no ${code} problem matches ${pattern}: ${hit.map(p => p.message).join(' | ')}`);
};
const find = (raw, id, key) => raw[id].focuses.find(f => f.key === key);

const analysis = await analyse();
const compiled = new Map(analysis.list.map(t => [t.id, compileTree(t, analysis.ctx)]));
const allLoc = Object.assign({}, ...[...compiled.values()].map(c => c.loc));

// ------------------------------------------------------------------------------------------------ the data files
test('Eighteen tree files exist, with the ids, countries and tier of the specs', () => {
  assert.equal(IDS.length, 18);
  for (const id of IDS) {
    const t = BASE[id];
    assert.equal(t.id, id);
    assert.equal(t.tier, 'regional');
    assert.deepEqual(t.countries, [SPEC[id][0]]);
    assert(roster.some(c => c.name === t.countries[0]), `${t.countries[0]} is not a roster country`);
  }
  assert.equal(new Set(IDS.flatMap(id => BASE[id].countries)).size, 18, 'no country has two trees');
});

test('Every tree passes the compiler checks with no problem', () => {
  assert.equal(analysis.list.length, 18);
  assert.deepEqual(real(analysis.problems).map(p => p.message), []);
});

test('Focus, spirit and event counts match the specs', () => {
  let focuses = 0, spirits = 0, events = 0;
  for (const id of IDS) {
    const t = BASE[id], [, f, s, e] = SPEC[id];
    assert.equal(t.focuses.length, f, `${id} focuses`);
    assert.equal(Object.keys(t.spirits ?? {}).length, s, `${id} spirits`);
    assert.equal(Object.keys(t.events ?? {}).length, e, `${id} events`);
    focuses += f; spirits += s; events += e;
  }
  assert.deepEqual([focuses, spirits, events], [600, 153, 54]);
  // Tier B holds 30 to 50 focuses.
  for (const id of IDS) assert(BASE[id].focuses.length >= 30 && BASE[id].focuses.length <= 50, id);
});

test('Each grid spans the columns and rows of its spec', () => {
  for (const id of IDS) {
    const { pos } = absolutePositions(BASE[id]);
    const xs = [...pos.values()].map(p => p.x), ys = [...pos.values()].map(p => p.y);
    assert.equal(Math.max(...xs), SPEC[id][4], `${id} width`);
    assert.equal(Math.max(...ys), SPEC[id][5], `${id} depth`);
    assert(Math.min(...ys) === 0 && Math.min(...xs) >= 0, `${id} origin`);
  }
});

test('Focus ids, spirit ids and event ids are unique across the 18 trees and carry the regional prefix', () => {
  const seen = new Set();
  for (const id of IDS) {
    const t = BASE[id];
    for (const f of t.focuses) { const full = focusId(t, f.key); assert(full.startsWith(`zin_${id}_`)); assert(!seen.has(full), full); seen.add(full); assert(!f.key.startsWith('zin_')); }
    for (const k of Object.keys(t.spirits ?? {})) { const full = spiritId(t, k); assert(!seen.has(full), full); seen.add(full); }
    for (const [k, ev] of Object.entries(t.events ?? {})) { const full = `zin_${id}.${ev.n}`; assert(!seen.has(full), `${id} ${k}`); seen.add(full); }
  }
  assert(seen.size > 770);
});

test('No spirit key repeats a focus key of its tree (F3), and every spirit carries an icon or a focus that adds it', () => {
  for (const id of IDS) {
    const keys = new Set(BASE[id].focuses.map(f => f.key));
    for (const k of Object.keys(BASE[id].spirits ?? {})) assert(!keys.has(k), `${id}: spirit ${k} equals a focus key`);
  }
  assert.deepEqual(real(analysis.problems).filter(p => p.code === 'spirit_icon_missing'), []);
});

// ------------------------------------------------------------------------------------------------ structure
test('Every prerequisite names a focus of the tree and sits above its focus; days are multiples of 7', () => {
  for (const id of IDS) {
    const t = BASE[id], { pos } = absolutePositions(t), keys = new Set(t.focuses.map(f => f.key));
    for (const f of t.focuses) {
      for (const group of f.prerequisite ?? []) for (const pre of group) {
        assert(keys.has(pre), `${id}: ${f.key} needs ${pre}`);
        assert(pos.get(f.key).y > pos.get(pre).y, `${id}: ${f.key} sits above ${pre}`);
      }
      assert.equal(f.days % 7, 0);
      assert(f.days >= 7 && f.days <= 140);
    }
  }
});

test('Exactly one root opens each tree at row 0 and no two focuses share a position', () => {
  for (const id of IDS) {
    const t = BASE[id], { pos } = absolutePositions(t);
    assert.equal(new Set([...pos.values()].map(p => `${p.x},${p.y}`)).size, t.focuses.length, `${id} positions`);
    assert(!(t.focuses[0].prerequisite ?? []).length, `${id}: the first focus is a root`);
  }
});

test('The exclusive choices of the specs are symmetric, three-way where the specs say so', () => {
  const closure = id => exclusiveClosure(analysis.trees.get(id));
  const sets = {
    regional_girdon: [['brothers_across_the_ford', 'aenors_old_friend', 'the_southern_councils']],
    regional_buldor: [['swords_for_the_west', 'whoever_pays', 'swords_for_parim']],
    regional_varnondor: [['close_the_approaches', 'open_the_approaches', 'watch_for_parim']],
    regional_yeldenne: [['ride_after_the_bearer', 'keep_the_empty_hall', 'seal_the_hall'], ['open_for_the_heir', 'seek_a_second_bearer']],
    regional_tolvael: [['friendship_with_sonargur', 'parims_old_friend', 'a_third_way']],
    regional_halenor: [['wreckers_of_the_storm_isles', 'pilots_of_the_storms'], ['the_storm_isles_apart', 'pilots_for_the_crossing']],
    regional_nondondor: [['press_the_banks', 'share_the_banks'], ['corsair_letters', 'hang_the_corsairs']],
    regional_seite_islands: [['defy_the_king', 'seek_the_brokers'], ['join_the_charter', 'the_free_coves']],
  };
  for (const [id, groups] of Object.entries(sets)) {
    const m = closure(id);
    for (const g of groups) for (const a of g) assert.deepEqual([...m.get(a)].sort(), g.filter(b => b !== a).sort(), `${id}: ${a}`);
  }
});

test('The historical branch heads of the specs are in place with the right gates', () => {
  const g = (id, key) => find(BASE, id, key);
  assert.deepEqual(g('regional_tolvael', 'the_free_crowns_of_the_north').available.slice(0, 1), [{ or: [{ global_flag: 'zin_golden_king_dead' }, { after: '1751.3.1' }] }]);
  assert(g('regional_tolvael', 'the_shore_burns').available[0].or.some(c => c.at_war === true));
  assert.deepEqual(g('regional_girdon', 'the_winter_ford_remembered').allow_branch, [{ global_flag: 'zin_eindil_awake' }]);
  assert.deepEqual(g('regional_girdon', 'the_winter_ford_remembered').available[0], { global_flag: 'zin_eindil_awake' });
  for (const id of ['regional_adel', 'regional_pollos', 'regional_raerby']) {
    const ship = BASE[id].focuses.find(f => (f.allow_branch ?? []).some(c => c.check === 'zin_tritons_ship_has_sailed'));
    assert(ship && ship.available.some(c => c.check === 'zin_tritons_ship_has_sailed'), `${id}: the southern ship repeats its gate in available`);
  }
  assert.deepEqual(g('regional_yeldenne', 'the_hall_falls_silent').available, [{ global_flag: 'zin_horos_dead' }]);
});

test('Peace at the start: no focus makes a war goal or a claim without a war gate, and nothing is free to take a war on day one', () => {
  const gated = f => (f.available ?? []).length > 0;
  for (const id of IDS) for (const f of BASE[id].focuses) {
    const text = JSON.stringify(f.effects ?? []);
    if (/"wargoal"|"claims_on"|"annex"|"puppet"/.test(text)) assert(gated(f), `${id}: ${f.key} makes a war move with no gate`);
  }
  // The late war focuses of the two island kingdoms sit behind the gathering dark or the war itself.
  assert(JSON.stringify(find(BASE, 'regional_halenor', 'the_isles_by_the_sword').available).includes('zin_war_of_last_crowns'));
  assert(JSON.stringify(find(BASE, 'regional_nondondor', 'the_banks_by_force').available).includes('dark_above_49'));
});

// ------------------------------------------------------------------------------------------------ text
test('Every compiled focus, spirit, event and option has a non-empty localisation text in Windows-1252', () => {
  let keys = 0;
  for (const [id, c] of compiled) {
    const t = analysis.trees.get(id);
    for (const f of t.focuses) for (const k of [focusId(t, f.key), `${focusId(t, f.key)}_desc`]) { assert(String(c.loc[k] ?? '').trim(), `${id}: ${k}`); keys++; }
    for (const k of Object.keys(t.spirits ?? {})) for (const kk of [spiritId(t, k), `${spiritId(t, k)}_desc`]) { assert(String(c.loc[kk] ?? '').trim(), `${id}: ${kk}`); keys++; }
    for (const text of Object.values(c.loc)) assert(isCp1252(text), `${id}: a text holds a character outside Windows-1252`);
  }
  assert(keys > 1200);
});

test('Every localisation key a compiled file names has an entry (title, desc, option names, focus names)', () => {
  for (const [id, c] of compiled) {
    for (const [rel, body] of c.files) {
      const text = body.toString?.() ?? body;
      if (rel.startsWith('events/') || rel.startsWith('common/national_focus/') || rel.startsWith('common/ideas/') || rel.startsWith('common/opinion_modifiers/')) {
        for (const m of text.matchAll(/^\s*(?:title|desc|name)\s*=\s*(zin_[A-Za-z0-9_.]+)\s*$/gm)) assert(c.loc[m[1]], `${rel}: ${m[1]} has no text`);
      }
    }
    const events = [...c.files.keys()].some(r => r.startsWith('events/'));
    assert.equal(events, Object.keys(analysis.trees.get(id).events ?? {}).length > 0, `${id}: events file`);
  }
});

test('No banned word, glossary term or superseded name appears in any compiled text', () => {
  const hits = [];
  for (const [id, c] of compiled) for (const [k, v] of Object.entries(c.loc)) for (const h of findBanned(v, rules, ['error', 'review'])) hits.push(`${id} ${k}: ${h.word} (${h.id})`);
  assert.deepEqual(hits, []);
});

test('No text names Afrit, the Hidden Council or Eindil; the Deliverer appears only in the public label of Yeldenne\'s pilgrims', () => {
  for (const [id, c] of compiled) for (const [k, v] of Object.entries(c.loc)) {
    assert(!/Afrit|Hidden Council|Eindil|Einendil/i.test(v), `${id} ${k}`);
    if (/Deliverer/.test(v)) assert.equal(id, 'regional_yeldenne');
  }
  assert.match(allLoc['zin_regional_yeldenne.5.d'], /Deliverer/);
});

test('The returning figure is named (the Heir, the stranger, the war-king) only by focuses that wait for the story flags', () => {
  const gate = /zin_eindil_|zin_horos_dead|zin_glo_/;
  const needle = /(?<![a-z])(?:the stranger|heir|houseless|war-king)(?![a-z])/i;
  let named = 0;
  for (const id of IDS) {
    const byKey = new Map(BASE[id].focuses.map(f => [f.key, f]));
    const gated = (f, seen = new Set()) => {
      if (seen.has(f.key)) return false;
      seen.add(f.key);
      if (gate.test(JSON.stringify([f.available, f.allow_branch]))) return true;
      return (f.prerequisite ?? []).length > 0 && f.prerequisite.every(group => group.every(k => gated(byKey.get(k), seen)));
    };
    for (const f of BASE[id].focuses) if (needle.test(`${f.name} ${f.desc}`)) { named++; assert(gated(f), `${id}: ${f.key} names the returning figure with no story gate`); }
  }
  assert(named >= 10, String(named));
  assert.match(allLoc['zin_regional_yeldenne.9.d'], /walked out of the old ice/);
  assert.match(allLoc['zin_regional_tolvael_northern_companies_desc'], /Heir/);
});

test('Spirit modifiers exist in the game documentation and every icon and picture is a catalog key', () => {
  assert.deepEqual(real(analysis.problems).filter(p => ['modifier_unknown', 'icon_unknown', 'picture_unknown', 'picture_crop'].includes(p.code)), []);
  for (const id of IDS) for (const ev of Object.values(BASE[id].events ?? {})) if (!ev.hidden) assert(catalog.events.has(ev.picture), `${id}: ${ev.picture}`);
  for (const id of IDS) for (const f of BASE[id].focuses) assert(catalog.icons.has(f.icon), `${id}: ${f.icon}`);
});

test('Start spirits are defined by the tree and carry an icon of their own', () => {
  for (const [id, key] of Object.entries(START_SPIRIT)) {
    const s = BASE[id].spirits[key];
    assert(s, `${id}: ${key}`);
    assert(catalog.icons.has(s.icon), `${id}: ${key} icon`);
    assert(compiled.get(id).files.get(`common/ideas/zin_focus_${id}.txt`).includes(`zin_${id}_${key} = {`));
  }
});

// ------------------------------------------------------------------------------------------------ references and calls
test('Every call, check, event, flag, idea and faction a tree names resolves', () => {
  assert.deepEqual(real(analysis.problems).filter(p => /unresolved|unknown|nocode|missing/.test(p.code)), []);
});

test('Recruit effects exist for every named character, with a code per person', () => {
  for (const id of IDS.filter(i => i !== 'regional_yeldenne')) {
    const name = id.replace('regional_', ''), def = BASE[id].scripted_effects?.[`zin_regional_${name}_recruit`];
    if (!def) { assert(['regional_tolvael', 'regional_mina', 'regional_r_en', 'regional_molot', 'regional_eekedor'].includes(id), `${id} lacks recruit`); continue; }
    const people = Object.keys(def.args.character.keyword);
    assert(people.length >= 1 && people.length <= 2);
    const text = compiled.get(id).files.get(`common/scripted_effects/zin_${id}.txt`);
    for (const p of people) assert(text.includes(`recruit_character = zin_regional_${name}_${p}`), `${id}: ${p}`);
  }
});

test('Every lean change goes through zin_leren_add_lean and no tree writes zin_leren_lean directly', () => {
  for (const id of ['regional_tolvael', 'regional_mina', 'regional_r_en', 'regional_molot', 'regional_eekedor']) {
    for (const [rel, body] of compiled.get(id).files) {
      const text = body.toString();
      assert(!/(?:set_variable|add_to_variable)\s*=\s*\{\s*zin_leren_lean/.test(text), `${id}: ${rel} writes the lean directly`);
    }
    assert(compiled.get(id).files.get(`common/national_focus/zin_${id}.txt`).includes('zin_leren_add_lean = yes'), id);
  }
});

test('Events are fired only by effects and the first option is the default of the 30-day timeout', () => {
  for (const [id, c] of compiled) {
    const file = c.files.get(`events/zin_${id}.txt`);
    if (!file) continue;
    const text = file.toString();
    assert.equal((text.match(/timeout_days = 30/g) ?? []).length, (text.match(/is_triggered_only = yes/g) ?? []).length, id);
    assert(!/\bmean_time_to_happen\b|\btrigger = \{/.test(text), `${id}: an event has a trigger`);
  }
});

// ------------------------------------------------------------------------------------------------ the compiled files
test('Compilation is deterministic and writes the files of the format spec', () => {
  for (const id of ['regional_yeldenne', 'regional_buldor', 'regional_girdon']) {
    const again = compileTree(analysis.trees.get(id), analysis.ctx);
    for (const [rel, body] of compiled.get(id).files) assert(Buffer.from(body).equals(Buffer.from(again.files.get(rel))), rel);
    const rels = [...compiled.get(id).files.keys()];
    assert(rels.includes(`common/national_focus/zin_${id}.txt`));
    assert(rels.includes(`common/ideas/zin_focus_${id}.txt`));
    assert(rels.includes(`common/scripted_effects/zin_${id}.txt`));
  }
  assert.equal(compiled.get('regional_adel').files.has('common/opinion_modifiers/zin_regional_adel.txt'), true);
  assert.equal(compiled.get('regional_pollos').files.has('common/opinion_modifiers/zin_regional_pollos.txt'), false);
});

test('Yeldenne keeps its ward score, its three branch heads and the tribes\' two texts', () => {
  const y = BASE.regional_yeldenne;
  const wardsSum = y.focuses.filter(f => ['the_long_watch', 'wake_the_wards', 'the_frozen_gate', 'glernaens_old_protections', 'the_hall_of_pillars', 'the_unyielding_hall'].includes(f.key))
    .flatMap(f => f.effects).filter(e => e.call === 'zin_yeldenne_add_wards').reduce((n, e) => n + e.args.value, 0);
  assert.equal(wardsSum, 5 + 10 + 5 + 15 + 10 + 15);
  assert.equal(find(BASE, 'regional_yeldenne', 'the_tribes_of_the_ice').effects.at(-1).if.else[0].event, 'tribes_of_the_ice');
  assert.equal(Object.keys(y.opinion_modifiers).length, 3);
  assert.equal(Object.keys(y.scripted_effects).length, 3);
});

// ------------------------------------------------------------------------------------------------ negative cases
test('A tree that calls an unknown scripted trigger fails', async () => {
  await failsWith('regional_mina', raw => { find(raw, 'regional_mina', 'the_hill_moot').available = [{ check: 'zin_mina_not_a_trigger' }]; }, 'trigger_unresolved', /zin_mina_not_a_trigger/);
});

test('A duplicate focus key fails', async () => {
  await failsWith('regional_adel', raw => { raw.regional_adel.focuses.push(structuredClone(raw.regional_adel.focuses[0])); }, 'duplicate_key');
});

test('A missing prerequisite fails', async () => {
  await failsWith('regional_pollos', raw => { find(raw, 'regional_pollos', 'fish_fairs').prerequisite = [['no_such_focus']]; }, 'prerequisite_missing', /no_such_focus/);
});

test('A prerequisite below its focus fails, and two focuses on one position fail', async () => {
  await failsWith('regional_raerby', raw => { find(raw, 'regional_raerby', 'captains_council').prerequisite = [['peace_of_the_pupor']]; }, 'prerequisite_above');
  await failsWith('regional_raerby', raw => { Object.assign(find(raw, 'regional_raerby', 'the_old_captains'), { x: 0, y: 1 }); }, 'duplicate_position');
});

test('A days value that is not a multiple of 7 fails', async () => {
  await failsWith('regional_halenor', raw => { find(raw, 'regional_halenor', 'storm_yards').days = 30; }, 'days_multiple');
});

test('An unknown icon and an unknown event picture fail', async () => {
  await failsWith('regional_seite_islands', raw => { find(raw, 'regional_seite_islands', 'the_isle_moot').icon = 'no_such_icon'; }, 'icon_unknown');
  await failsWith('regional_seite_islands', raw => { raw.regional_seite_islands.events.seite_petition.picture = 'no_such_picture'; }, 'picture_unknown');
});

test('An unresolved reference fails: an unknown event key, spirit and opinion modifier', async () => {
  await failsWith('regional_kradlon', raw => { find(raw, 'regional_kradlon', 'the_guild_moot').effects = [{ event: 'no_such_event' }]; }, 'event_unknown');
  await failsWith('regional_kradlon', raw => { find(raw, 'regional_kradlon', 'the_guild_moot').effects = [{ add_spirit: 'no_such_spirit' }]; }, 'spirit_unknown');
  await failsWith('regional_kradlon', raw => { raw.regional_kradlon.events.kradlon_market.options[0].effects = [{ opinion: { target: 'FROM', modifier: 'no_such_modifier' } }]; }, 'opinion_unknown');
});

test('A spirit key equal to a focus key fails (F3)', async () => {
  await failsWith('regional_corogon', raw => { raw.regional_corogon.spirits.merchant_fleet = structuredClone(raw.regional_corogon.spirits.consulates); }, 'key_collision');
});

test('A changing condition in allow_branch fails (E4), a refreshed one needs the same condition in available', async () => {
  await failsWith('regional_lambin', raw => { find(raw, 'regional_lambin', 'the_old_claims').allow_branch = [{ flag: 'zin_west_pledged' }]; }, 'allow_branch_changing');
  await failsWith('regional_lambin', raw => { find(raw, 'regional_lambin', 'a_stranger_on_the_downs').available = []; }, 'allow_branch_not_repeated');
});

test('A name of Afrit in a text fails the secret scan, and a retired name fails the name check', async () => {
  await failsWith('regional_varnondor', raw => { find(raw, 'regional_varnondor', 'king_oslins_court').desc = 'Afrit holds the capes.'; }, 'secret_leak');
  await failsWith('regional_varnondor', raw => { find(raw, 'regional_varnondor', 'king_oslins_court').desc = 'Einendil holds the capes.'; }, 'text_superseded');
});

test('The banned-word scan catches a modern word and a real-world name', () => {
  assert(findBanned('The factory of Hitler near Berlin', rules, ['error']).length >= 3);
  assert.equal(findBanned('The forge of the Deliverer near Parim', rules, ['error']).length, 0);
  assert(findBanned('pilot of the sea', rules, ['error']).length >= 1, 'the glossary forbids pilot');
});

test('A text outside Windows-1252 fails', async () => {
  await failsWith('regional_mina', raw => { find(raw, 'regional_mina', 'the_lord_of_mina').desc = 'Hammer ō of Mina.'; }, 'text_charset');
});

test('A tree outside the tier range fails, and a missing field fails the schema', async () => {
  await failsWith('regional_mina', raw => { raw.regional_mina.focuses = raw.regional_mina.focuses.slice(0, 10).map(f => ({ ...f, prerequisite: undefined })); for (const f of raw.regional_mina.focuses) delete f.prerequisite; }, 'tier_range');
  const a = await analyse(['regional_mina'], raw => { delete find(raw, 'regional_mina', 'the_hill_moot').desc; });
  assert(a.problems.some(p => p.code === 'schema' && /desc/.test(p.message)));
});

test('A keyword argument without a code fails, and so does a hidden event with a title', async () => {
  await failsWith('regional_nondondor', raw => { find(raw, 'regional_nondondor', 'corsair_letters').effects = [{ call: 'zin_tritons_set_side', args: { side: 'nowhere' } }]; }, 'call_keyword_nocode');
  const a = await analyse(['regional_buldor'], raw => { raw.regional_buldor.events.contract_ends.title = 'Contract Ends'; });
  assert(a.problems.some(p => p.code === 'schema' && /hidden/.test(p.message)));
});

test('A tree id equal to another module or a wrong prefix fails', async () => {
  const a = await analyse(['regional_adel'], raw => { raw.regional_adel.id = 'adel'; });
  assert(a.problems.some(p => p.code === 'schema'));
});

// ------------------------------------------------------------------------------------------------ Buldor decisions
const known = new Set([...Object.keys(BASE.regional_buldor.scripted_effects), ...Object.keys(BASE.regional_buldor.scripted_triggers)]);
const decisionData = await json(DATA_FILE);
const dopts = { countries: roster, known, banned: text => findBanned(text, rules, ['error', 'review']).map(h => h.word) };
const dmut = fn => { const d = structuredClone(decisionData); fn(d); return validateDecisionData(d, dopts); };

test('The Buldor decisions data is valid and the module writes the category, the decisions and their text', async () => {
  assert.deepEqual(validateDecisionData(decisionData, dopts), []);
  const staged = new Staged();
  const counts = await buildDecisionsRegional(staged, { countries: roster, known });
  assert.deepEqual(counts, { groups: 1, categories: 1, decisions: 2, files: 3 });
  const tag = roster.find(c => c.name === 'Buldor').tag;
  const cat = staged.files.get('common/decisions/categories/zin_regional_buldor.txt').toString();
  assert.match(cat, new RegExp(`zin_regional_buldor_contracts = \\{\\n\\tallowed = \\{\\n\\t\\toriginal_tag = ${tag}`));
  const dec = staged.files.get('common/decisions/zin_regional_buldor.txt').toString();
  assert.match(dec, /zin_regional_buldor_sell_contract = \{/);
  assert.match(dec, /target_array = global\.countries/);
  assert.match(dec, /cost = 25/);
  assert.match(dec, /zin_regional_buldor_offer_contract = yes/);
  assert.match(dec, /zin_regional_buldor_recall_contract = yes/);
  const loc = staged.files.get('localisation/english/zin_decisions_regional_l_english.yml').toString('utf8');
  assert.match(loc, /zin_regional_buldor_sell_contract:0 "Sell a Contract"/);
  assert(loc.startsWith('﻿'));
  const again = new Staged(); await buildDecisionsRegional(again, { countries: roster, known });
  for (const [rel, bytes] of staged.files) assert(bytes.equals(again.files.get(rel)), rel);
});

test('The decisions call effects and triggers that the Buldor tree declares', () => {
  for (const name of ['zin_regional_buldor_offer_contract', 'zin_regional_buldor_recall_contract', 'zin_regional_buldor_sign_contract', 'zin_regional_buldor_end_contract', 'zin_regional_buldor_contract_allowed']) assert(known.has(name), name);
  const text = JSON.stringify(decisionData);
  assert(text.includes('zin_regional_buldor_contract_allowed = yes'));
  assert.equal(BASE.regional_buldor.events.contract_ends.hidden, true);
  assert.equal(find(BASE, 'regional_buldor', 'open_the_books').effects.some(e => e.variable?.name === 'zin_regional_buldor_contract_cap' && e.variable.set === 2), true);
});

test('Decision data fails on a duplicate id, an unknown category or country, a banned word, bad braces and an unresolved call', () => {
  assert(dmut(d => { d.groups[0].decisions[1].id = d.groups[0].decisions[0].id; }).some(p => p.code === 'id_duplicate'));
  assert(dmut(d => { d.groups[0].decisions[0].category = 'zin_regional_buldor_nothing'; }).some(p => p.code === 'category_unknown'));
  assert(dmut(d => { d.groups[0].country = 'Atlantis'; }).some(p => p.code === 'country_unknown'));
  assert(dmut(d => { d.groups[0].decisions[0].desc = 'Sell the factory to the highest bidder.'; }).some(p => p.code === 'banned_word'));
  assert(dmut(d => { d.groups[0].decisions[0].complete_effect = ['set_country_flag = {\n\tflag = x']; }).some(p => p.code === 'fragment_braces'));
  assert(dmut(d => { d.groups[0].decisions[0].complete_effect = ['zin_regional_buldor_no_such_effect = yes']; }).some(p => p.code === 'unresolved'));
  assert(dmut(d => { d.groups[0].decisions[0].id = 'sell_contract'; }).some(p => p.code === 'id_shape'));
  assert(dmut(d => { delete d.groups[0].decisions[0].ai_will_do; }).some(p => p.code === 'fragment_missing'));
  assert(dmut(d => { d.groups[0].decisions[0].name = ''; }).some(p => p.code === 'text_empty'));
});

test('The module refuses invalid data instead of writing partial files', async () => {
  const staged = new Staged();
  await assert.rejects(() => buildDecisionsRegional(staged, { countries: roster.filter(c => c.name !== 'Buldor'), known }), /country_unknown/);
  assert.equal(staged.files.size, 0);
});
