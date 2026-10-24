// Tests of the regional B focus trees: the nine East Lands, four Islands of the South and seven Lands of the Sun tier B
// trees (docs/specs/05_focus_trees/regional/east_lands.md, islands_of_the_south.md, lands_of_the_sun.md). They compile
// the real tree files in docs/design/focus/ with the focus compiler's own check API, against synthetic, project-owned
// stand-ins of the three shared trees (fixtures/focus_regional_b/) so that the result does not depend on the shared
// trees being finished, and assert counts, ids, prerequisites, copies, localisation and the banned-word scan.
//   node --test tools/content/focus_regional_b.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { absolutePositions, focusId, spiritId } from './lib/focus_model.mjs';
import { compileBanned, findBanned, loadRuleSet } from './lib/banned.mjs';
import { analyseTrees, compileTree } from './modules/focus_compiler.mjs';
import { checkTierRange, collectTexts, loadRegistry, Registry } from './checks/focus_checks.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const TREES = path.join(here, '../../docs/design/focus');
const FIX = path.join(here, 'fixtures/focus_regional_b');
const json = async f => JSON.parse(await readFile(f, 'utf8'));

// tree id -> { region, focuses (copies expanded), own (own focuses), spirits (own), events, shared }
const EXPECT = {
  regional_alerhia: { region: 'east', focuses: 49, own: 27, spirits: 8, events: 2, copies: ['E2', 'E4', 'E9'] },
  regional_miaed: { region: 'east', focuses: 41, own: 19, spirits: 6, events: 3, copies: ['E2', 'E4', 'E9'] },
  regional_erco: { region: 'east', focuses: 41, own: 24, spirits: 6, events: 1, copies: ['E4', 'E9'] },
  regional_plutondo: { region: 'east', focuses: 41, own: 24, spirits: 5, events: 1, copies: ['E4', 'E9'] },
  regional_drak: { region: 'east', focuses: 40, own: 23, spirits: 5, events: 0, copies: ['E4', 'E9'] },
  regional_ostoroth: { region: 'east', focuses: 40, own: 23, spirits: 5, events: 1, copies: ['E4', 'E9'] },
  regional_gondolin: { region: 'east', focuses: 41, own: 24, spirits: 5, events: 3, copies: ['E4', 'E9'] },
  regional_mora: { region: 'east', focuses: 40, own: 23, spirits: 5, events: 2, copies: ['E5', 'E9'] },
  regional_avalon: { region: 'east', focuses: 40, own: 23, spirits: 5, events: 2, copies: ['E4', 'E9'] },
  regional_howan: { region: 'islands', focuses: 34, own: 21, spirits: 5, events: 1, copies: ['I4', 'I3', 'I9'] },
  regional_nara: { region: 'islands', focuses: 35, own: 14, spirits: 5, events: 2, copies: ['I2', 'I4', 'I7', 'I9'] },
  regional_verde: { region: 'islands', focuses: 32, own: 17, spirits: 5, events: 0, copies: ['I2', 'I4', 'I9'] },
  regional_enhis_is_rond: { region: 'islands', focuses: 33, own: 18, spirits: 5, events: 3, copies: ['I1', 'I4', 'I9'] },
  regional_the_lands_of_light: { region: 'sun', focuses: 40, own: 26, spirits: 7, events: 1, copies: ['S1', 'S7', 'S10'] },
  regional_poyang: { region: 'sun', focuses: 32, own: 16, spirits: 5, events: 2, copies: ['S6', 'S6m', 'S7', 'S5', 'S10'] },
  regional_godland: { region: 'sun', focuses: 32, own: 17, spirits: 4, events: 1, copies: ['S2', 'S7', 'S10'] },
  regional_hengyang: { region: 'sun', focuses: 33, own: 18, spirits: 3, events: 1, copies: ['S2', 'S7', 'S10'] },
  regional_elvana: { region: 'sun', focuses: 33, own: 14, spirits: 4, events: 4, copies: ['S2', 'S5', 'S7', 'S10'] },
  regional_goodin: { region: 'sun', focuses: 32, own: 18, spirits: 5, events: 1, copies: ['S1', 'S7', 'S10'] },
  regional_heaven: { region: 'sun', focuses: 32, own: 17, spirits: 5, events: 1, copies: ['S2', 'S7', 'S10'] },
};
const IDS = Object.keys(EXPECT);
const SHARED = { east: 'shared_east_lands', islands: 'shared_islands_of_the_south', sun: 'shared_lands_of_the_sun' };
const COUNTRY = {
  regional_alerhia: 'Alerhia', regional_miaed: 'Miaed', regional_erco: 'Erco', regional_plutondo: 'Plutondo', regional_drak: 'Drak', regional_ostoroth: 'Ostoroth',
  regional_gondolin: 'Gondolin', regional_mora: 'Mora', regional_avalon: 'Avalon', regional_howan: 'Howan', regional_nara: 'Nara', regional_verde: 'Verde',
  regional_enhis_is_rond: 'Enhis Is Rond', regional_the_lands_of_light: 'The Lands of Light', regional_poyang: 'Poyang', regional_godland: 'Godland',
  regional_hengyang: 'Hengyang', regional_elvana: 'Elvana', regional_goodin: 'Goodin', regional_heaven: 'Heaven',
};

const OWN = {};
for (const id of IDS) OWN[id] = await json(path.join(TREES, `${id}.json`));
const STANDINS = {};
for (const s of Object.values(SHARED)) STANDINS[s] = await json(path.join(FIX, `${s}.json`));
const registry = await loadRegistry();

async function analyse(mutate, { only = IDS, shared = STANDINS, reg = registry } = {}) {
  const own = structuredClone(OWN), sh = structuredClone(shared);
  mutate?.(own, sh);
  const entries = [...only.map(id => ({ name: id, data: own[id] })), ...Object.entries(sh).map(([name, data]) => ({ name, data }))];
  return analyseTrees(entries, new Staged(), { warn: () => {}, expected: [], tierRanges: null, registry: reg });
}
const mine = a => a.problems.filter(p => IDS.includes(p.tree));
const codes = a => [...new Set(a.problems.map(p => p.code))];
const base = await analyse();
const rules = compileBanned(await loadRuleSet({ glossary: await json(path.join(here, 'data/glossary.json')) }));
const eff = id => base.trees.get(id);

// ------------------------------------------------------------------------------------------------ positive
test('The 20 regional B trees and the stand-ins of the shared trees pass every compiler check', () => {
  assert.equal(base.problems.length, 0, base.problems.map(p => p.message).join('\n'));
  assert.equal(IDS.length, 20);
  for (const id of IDS) assert(base.trees.has(id), id);
});

test('Each tree has the focus count of its spec, copies expanded, inside the tier B range', () => {
  for (const [id, x] of Object.entries(EXPECT)) {
    assert.equal(eff(id).focuses.length, x.focuses, `${id} focuses`);
    assert.equal(OWN[id].focuses.length, x.own, `${id} own focuses`);
    assert.deepEqual(checkTierRange(eff(id)), [], `${id} tier range`);
    assert(eff(id).focuses.length >= 30 && eff(id).focuses.length <= 50, id);
  }
  const total = IDS.reduce((n, id) => n + eff(id).focuses.length, 0);
  assert.equal(total, 49 + 41 + 41 + 41 + 40 + 40 + 41 + 40 + 40 + 34 + 35 + 32 + 33 + 40 + 32 + 32 + 33 + 33 + 32 + 32);
});

test('Region totals: nine East Lands trees, four Islands trees, seven Lands of the Sun trees', () => {
  const count = r => IDS.filter(id => EXPECT[id].region === r).length;
  assert.deepEqual([count('east'), count('islands'), count('sun')], [9, 4, 7]);
  assert.equal(IDS.filter(id => EXPECT[id].region === 'east').reduce((n, id) => n + eff(id).focuses.length, 0), 49 + 41 + 41 + 41 + 40 + 40 + 41 + 40 + 40);
  assert.equal(IDS.filter(id => EXPECT[id].region === 'islands').reduce((n, id) => n + eff(id).focuses.length, 0), 34 + 35 + 32 + 33);
  assert.equal(IDS.filter(id => EXPECT[id].region === 'sun').reduce((n, id) => n + eff(id).focuses.length, 0), 40 + 32 + 32 + 33 + 33 + 32 + 32);
});

test('Every tree serves exactly its country and is a regional tree with the regional_ id prefix', () => {
  for (const id of IDS) {
    const t = OWN[id];
    assert.equal(t.tier, 'regional', id);
    assert.deepEqual(t.countries, [COUNTRY[id]], id);
    assert(id.startsWith('regional_'), id);
  }
  const all = IDS.flatMap(id => OWN[id].countries);
  assert.equal(new Set(all).size, 20);
});

test('Spirit, event and own-focus counts match the design', () => {
  for (const [id, x] of Object.entries(EXPECT)) {
    assert.equal(Object.keys(OWN[id].spirits ?? {}).length, x.spirits, `${id} spirits`);
    assert.equal(Object.keys(OWN[id].events ?? {}).length, x.events, `${id} events`);
    assert.deepEqual((OWN[id].copy ?? []).map(c => c.module), x.copies, `${id} copies`);
  }
});

test('Focus ids, spirit ids and event ids compile with the tree prefix and are unique across the 20 trees', () => {
  const seen = new Set();
  for (const id of IDS) {
    for (const f of eff(id).focuses) {
      const full = focusId(eff(id), f.key);
      assert(full.startsWith(`zin_${id}_`), full);
      assert(!seen.has(full), `duplicate ${full}`);
      seen.add(full);
    }
    for (const k of Object.keys(eff(id).spirits ?? {})) {
      const full = spiritId(eff(id), k);
      assert(full.startsWith(`zin_${id}_`), full);
      assert(!seen.has(full), `duplicate ${full}`);
      seen.add(full);
    }
  }
  assert(seen.size > 800);
});

test('Event ids are the numbers of the specs in the tree namespace', () => {
  for (const id of IDS) {
    const t = OWN[id], keys = Object.keys(t.events ?? {});
    keys.forEach((k, i) => assert.equal(t.events[k].n, i + 1, `${id} ${k}`));
    assert.equal(t.event_namespace, undefined, id);
  }
  const out = compileTree(eff('regional_elvana'), base.ctx);
  const events = out.files.get('events/zin_regional_elvana.txt');
  assert.match(events, /add_namespace = zin_regional_elvana/);
  for (const n of [1, 2, 3, 4]) assert.match(events, new RegExp(`id = zin_regional_elvana\\.${n}\\b`));
  const poyang = compileTree(eff('regional_poyang'), base.ctx).files.get('events/zin_regional_poyang.txt');
  assert.match(poyang, /id = zin_regional_poyang\.2\b/);
});

test('Prerequisites exist, no focus sits above its prerequisites and positions are unique', () => {
  for (const id of IDS) {
    const t = eff(id), keys = new Set(t.focuses.map(f => f.key)), { pos } = absolutePositions(t), at = new Set();
    for (const f of t.focuses) {
      for (const g of f.prerequisite ?? []) for (const p of g) {
        assert(keys.has(p), `${id}.${f.key} needs missing ${p}`);
        assert(pos.get(f.key).y > pos.get(p).y, `${id}.${f.key} above ${p}`);
      }
      const k = `${pos.get(f.key).x},${pos.get(f.key).y}`;
      assert(!at.has(k), `${id} position ${k} used twice`);
      at.add(k);
      assert.equal(f.days % 7, 0, `${id}.${f.key} days`);
      assert(f.days >= 7 && f.days <= 140, `${id}.${f.key} days range`);
    }
  }
});

test('Mutual exclusions are written on both focuses and name focuses of the tree', () => {
  for (const id of IDS) {
    const t = OWN[id], byKey = new Map(t.focuses.map(f => [f.key, f]));
    for (const f of t.focuses) for (const ex of f.mutually_exclusive ?? []) {
      assert(byKey.has(ex), `${id}.${f.key} excludes missing ${ex}`);
      assert((byKey.get(ex).mutually_exclusive ?? []).includes(f.key), `${id}: ${ex} does not exclude ${f.key}`);
    }
  }
  assert.deepEqual(OWN.regional_avalon.focuses.find(f => f.key === 'the_first_tribune').mutually_exclusive.sort(), ['the_citizens_assembly', 'the_free_charter']);
});

test('The copy blocks put each module root where the spec says and carry the module with it', () => {
  const rootAt = (id, module) => OWN[id].copy.find(c => c.module === module).root_at;
  assert.deepEqual(rootAt('regional_alerhia', 'E2'), [15, 2]);
  assert.deepEqual(rootAt('regional_alerhia', 'E4'), [18, 1]);
  assert.deepEqual(rootAt('regional_miaed', 'E2'), [10, 1]);
  assert.deepEqual(rootAt('regional_plutondo', 'E4'), [15, 1]);
  assert.deepEqual(rootAt('regional_mora', 'E5'), [14, 1]);
  assert.deepEqual(rootAt('regional_nara', 'I7'), [22, 1]);
  assert.deepEqual(rootAt('regional_howan', 'I3'), [21, 1]);
  assert.deepEqual(rootAt('regional_elvana', 'S2'), [12, 1]);
  assert.deepEqual(rootAt('regional_poyang', 'S6m'), [15, 2]);
  const pos = (id, key) => absolutePositions(eff(id)).pos.get(key);
  assert.deepEqual(pos('regional_alerhia', 'riders_of_the_dunes'), { x: 14, y: 4 });
  assert.deepEqual(pos('regional_alerhia', 'close_the_houses'), { x: 18, y: 4 });
  assert.deepEqual(pos('regional_nara', 'masters_of_the_southern_seas'), { x: 22, y: 4 });
  assert.deepEqual(pos('regional_howan', 'songs_for_strangers'), { x: 21, y: 3 });
  assert.deepEqual(pos('regional_the_lands_of_light', 'orchards_and_vines'), { x: 20, y: 2 });
  assert.deepEqual(pos('regional_poyang', 'heed_the_old_king'), { x: 13, y: 2 });
  assert.deepEqual(pos('regional_elvana', 'ready_for_the_noon_league'), { x: 13, y: 3 });
  // every East tree places E9 with its root at (14,6)
  for (const id of IDS.filter(i => EXPECT[i].region === 'east')) assert.deepEqual(pos(id, 'question_of_the_east'), { x: 14, y: 6 }, id);
  // every Islands tree places I9 at (13,6); every Sun tree S10 at (12,6)
  for (const id of IDS.filter(i => EXPECT[i].region === 'islands')) assert.deepEqual(pos(id, 'the_storm_years'), { x: 13, y: 6 }, id);
  for (const id of IDS.filter(i => EXPECT[i].region === 'sun')) assert.deepEqual(pos(id, 'when_shadows_reach_the_sun'), { x: 12, y: 6 }, id);
});

test('Copied focuses take the tree prefix and the module spirits are re-declared under it', () => {
  const t = eff('regional_alerhia');
  assert(t.focuses.some(f => f.key === 'temples_of_the_deliverer' && f.copied_from === 'shared_east_lands:E4'));
  assert('generous_friends' in t.spirits);
  const text = compileTree(t, base.ctx).files.get('common/national_focus/zin_regional_alerhia.txt');
  assert.match(text, /id = zin_regional_alerhia_temples_of_the_deliverer/);
  assert.doesNotMatch(text, /zin_shared_east_lands_temples/);
  const ideas = compileTree(t, base.ctx).files.get('common/ideas/zin_focus_regional_alerhia.txt');
  assert.match(ideas, /zin_regional_alerhia_generous_friends = \{/);
  assert.match(compileTree(eff('regional_nara'), base.ctx).files.get('common/ideas/zin_focus_regional_nara.txt'), /zin_regional_nara_island_navigators_spirit = \{/);
});

test('Every focus, spirit, event and option has non-empty text, and the compiled localisation holds every key', () => {
  for (const id of IDS) {
    const out = compileTree(eff(id), base.ctx);
    for (const f of eff(id).focuses) {
      const fid = focusId(eff(id), f.key);
      assert((out.loc[fid] ?? '').length > 2, `${fid} name`);
      assert((out.loc[`${fid}_desc`] ?? '').length > 20, `${fid} desc`);
    }
    for (const k of Object.keys(eff(id).spirits ?? {})) {
      const sid = spiritId(eff(id), k);
      assert((out.loc[sid] ?? '').length > 2, `${sid} name`);
      assert((out.loc[`${sid}_desc`] ?? '').length > 20, `${sid} desc`);
    }
    const evs = Object.keys(OWN[id].events ?? {});
    for (const k of evs) {
      const e = OWN[id].events[k], eid = `zin_${id}.${e.n}`;
      assert((out.loc[`${eid}.t`] ?? '').length > 2, `${eid} title`);
      assert((out.loc[`${eid}.d`] ?? '').length > 40, `${eid} desc`);
      e.options.forEach((o, i) => assert((out.loc[`${eid}.${'abcdefghijklmnopqrstuvwxyz'[i]}`] ?? '').length > 2, `${eid} option ${i}`));
    }
    for (const [key, text] of Object.entries(out.loc)) assert(typeof text === 'string' && text.trim().length > 0, `${id} ${key}`);
  }
});

test('Own descriptions are one to three sentences and no text is a placeholder', () => {
  for (const id of IDS) {
    const t = OWN[id];
    const descs = [...t.focuses.map(f => [f.key, f.desc]), ...Object.entries(t.spirits ?? {}).map(([k, s]) => [k, s.desc]), ...Object.entries(t.events ?? {}).map(([k, e]) => [k, e.desc])];
    for (const [k, d] of descs) {
      const n = (d.match(/[.!?](\s|$)/g) ?? []).length;
      assert(n >= 1 && n <= 3, `${id}.${k}: ${n} sentences`);
      assert(!/\b(TODO|lorem|placeholder|TBD|XXX)\b/i.test(d), `${id}.${k}`);
      assert(!d.includes('!'), `${id}.${k}: exclamation mark`);
    }
  }
});

test('No banned word of the text sweep, error or review, appears in any own text of the 20 trees', () => {
  let scanned = 0;
  for (const id of IDS) {
    const own = new Set(OWN[id].focuses.map(f => f.key));
    for (const x of collectTexts(eff(id))) {
      if (x.owner.kind === 'focus' && !own.has(x.owner.key)) continue;   // copied text belongs to the shared tree
      scanned++;
      const hits = findBanned(x.text, rules, ['error', 'review']);
      assert.equal(hits.length, 0, `${id}: ${x.where}: ${hits.map(h => h.word).join(', ')}`);
    }
  }
  assert(scanned > 1000, `scanned ${scanned} texts`);
});

test('No own text names Afrit or the Hidden Council, and only one event of the Islands names Eindil', () => {
  for (const id of IDS) {
    for (const x of collectTexts(OWN[id].copy ? { ...OWN[id], copy: undefined } : OWN[id])) {
      assert(!/Afrit|Hidden Council/i.test(x.text), `${id}: ${x.where}`);
      if (/Eindil/.test(x.text)) assert.equal(`${id}:${x.where.split(' ').slice(0, 2).join(' ')}`, 'regional_enhis_is_rond:event the_name_is_answered');
    }
  }
  assert.deepEqual(base.problems.filter(p => /secret/.test(p.code)), []);
});

test('British spelling and Windows-1252 text: no American spellings and no character outside the code page', () => {
  const american = /\b(armor|defense|color|honor|favor|harbor|neighbor|center|labor|plow|gray)(s|ed|ing)?\b/i;
  for (const id of IDS) for (const x of collectTexts(OWN[id])) {
    assert(!american.test(x.text), `${id}: ${x.where}`);
    assert([...x.text].every(c => c.codePointAt(0) < 0x2000 || /[–—‘’“”…]/.test(c)), `${id}: ${x.where}`);
  }
  assert.deepEqual(codes(base).filter(c => c === 'text_charset'), []);
});

test('Every icon is a catalog key, every event picture is a standard-crop catalog key, and no picture is gated', () => {
  for (const id of IDS) {
    for (const f of OWN[id].focuses) assert(base.ctx.catalog.icons.has(typeof f.icon === 'string' ? f.icon : f.icon.default), `${id}.${f.key} ${f.icon}`);
    for (const [k, e] of Object.entries(OWN[id].events ?? {})) {
      const pic = base.ctx.catalog.events.get(e.picture);
      assert(pic, `${id}.${k} ${e.picture}`);
      assert(pic.crop === 'standard' || pic.crop === 'both', `${id}.${k}`);
      assert(!pic.gate, `${id}.${k} uses the gated picture ${e.picture}`);
    }
  }
});

test('Every spirit names an icon through the focus that adds it, keys never equal a focus key, and modifiers are known', () => {
  for (const id of IDS) {
    const focusKeys = new Set(eff(id).focuses.map(f => f.key));
    for (const k of Object.keys(eff(id).spirits ?? {})) assert(!focusKeys.has(k), `${id}: spirit ${k} equals a focus key`);
    for (const [k, s] of Object.entries(OWN[id].spirits ?? {})) {
      assert(Object.keys(s.modifier).length >= 1, `${id}.${k}`);
      assert.equal(s.icon, undefined, `${id}.${k}: icon comes from the adding focus`);
    }
  }
  assert(!codes(base).includes('modifier_unknown'));
  assert(!codes(base).includes('spirit_icon_missing'));
  assert(!codes(base).includes('key_collision'));
});

test('Peace: no own focus or event creates a war goal, a claim, a core or a war declaration', () => {
  const bad = ['wargoal', 'claims_on', 'cores_on', 'annex', 'puppet'];
  const visit = (list, where) => {
    for (const e of list ?? []) {
      for (const k of bad) assert(!(k in e), `${where}: ${k}`);
      if (e.raw) assert(!/declare_war|create_wargoal|add_state_claim|add_claim_by|add_core_of/.test(e.raw), `${where}: raw`);
      if (e.if) { visit(e.if.then, where); visit(e.if.else, where); }
      if (e.for_country) visit(e.for_country.effects, where);
    }
  };
  for (const id of IDS) {
    for (const f of OWN[id].focuses) visit(f.effects, `${id}.${f.key}`);
    for (const [k, e] of Object.entries(OWN[id].events ?? {})) e.options.forEach(o => visit(o.effects, `${id}.${k}`));
    for (const [k, se] of Object.entries(OWN[id].scripted_effects ?? {})) visit(se.effects, `${id}.${k}`);
  }
  // the one claim in the trees comes from the mechanic's rift claim, behind coalition membership
  const crossing = OWN.regional_alerhia.focuses.find(f => f.key === 'the_crossing_of_the_rift');
  assert.deepEqual(crossing.available, [{ flag: 'zin_east_coalition_member' }]);
  assert.equal(OWN.regional_alerhia.focuses.filter(f => JSON.stringify(f.effects ?? []).includes('zin_east_claim_rift')).length, 1);
});

test('The war focuses wait for story flags and the Islands stage focuses read the journey stage', () => {
  const f = (id, key) => OWN[id].focuses.find(x => x.key === key);
  assert(JSON.stringify(f('regional_miaed', 'hold_the_southern_passes').available).includes('zin_volgan_marches'));
  assert(JSON.stringify(f('regional_gondolin', 'the_dead_on_the_shore').available).includes('zin_zol_rising'));
  assert(JSON.stringify(f('regional_drak', 'ready_for_the_caravan_war').available).includes('zin_east_caravan_war'));
  assert(JSON.stringify(f('regional_plutondo', 'the_great_levy').available).includes('zin_war_of_last_crowns'));
  assert(JSON.stringify(f('regional_mora', 'a_shield_for_the_lake').available).includes('zin_war_of_last_crowns'));
  assert(JSON.stringify(f('regional_howan', 'a_seat_by_the_fire').available).includes('global.zin_eindil_stage'));
  assert(JSON.stringify(f('regional_howan', 'a_seat_by_the_fire').bypass).includes('zin_eindil_lost'));
  assert(JSON.stringify(f('regional_enhis_is_rond', 'the_name_is_answered').available).includes('"above":7'));
  assert(JSON.stringify(f('regional_nara', 'the_silent_reef').available).includes('zin_eindil_reef_island'));
  assert(JSON.stringify(f('regional_the_lands_of_light', 'raise_the_noon_league').available).includes('zin_sun_league_needed'));
  assert(JSON.stringify(f('regional_heaven', 'letters_to_the_mirror_keepers').available).includes('zin_mirror_stilled'));
});

test('Branch heads use allow_branch only with a refresh-safe condition repeated in available', () => {
  const f = (id, key) => OWN[id].focuses.find(x => x.key === key);
  for (const [id, key] of [['regional_plutondo', 'the_hill_coast'], ['regional_gondolin', 'harbours_of_gondolin'], ['regional_drak', 'the_old_seat'], ['regional_enhis_is_rond', 'the_shrine_beneath_the_tide']]) {
    assert(f(id, key).allow_branch.length === 1, `${id}.${key}`);
    assert.deepEqual(f(id, key).available.filter(c => JSON.stringify(c) === JSON.stringify(f(id, key).allow_branch[0])).length, 1, `${id}.${key} repeats`);
  }
  assert(!codes(base).includes('allow_branch_changing'));
  assert(!codes(base).includes('allow_branch_not_repeated'));
});

test('Tree-declared scripts exist with the tree prefix and the spec names', () => {
  assert.deepEqual(Object.keys(OWN.regional_alerhia.scripted_triggers), ['zin_regional_alerhia_holds_far_shore']);
  assert.deepEqual(Object.keys(OWN.regional_alerhia.scripted_effects), ['zin_regional_alerhia_guard_rift']);
  assert.deepEqual(Object.keys(OWN.regional_drak.scripted_effects).sort(), ['zin_regional_drak_fortify_march', 'zin_regional_drak_yield_seat']);
  assert.deepEqual(Object.keys(OWN.regional_enhis_is_rond.scripted_triggers), ['zin_regional_enhis_is_rond_holds_shrine']);
  assert(Object.keys(OWN.regional_the_lands_of_light.scripted_effects).includes('zin_regional_the_lands_of_light_settle_quarrels'));
  assert(Object.keys(OWN.regional_the_lands_of_light.scripted_effects).includes('zin_regional_the_lands_of_light_fortify_east'));
  assert(Object.keys(OWN.regional_poyang.scripted_effects).includes('zin_regional_poyang_seed_gifts'));
  const drak = compileTree(eff('regional_drak'), base.ctx).files.get('common/scripted_effects/zin_regional_drak.txt');
  assert.match(drak, /transfer_state_to = Y16/);
  assert.match(drak, /zin_stabilo_add_debt = yes/);
});

test('Lean, footholds and debt change only through their mechanic effects', () => {
  const direct = /zin_east_lean|zin_footholds|zin_stabilo_debt/;
  for (const id of IDS) {
    const walk = (list, where) => {
      for (const e of list ?? []) {
        if (e.variable) assert(!direct.test(e.variable.name), `${where}: writes ${e.variable.name}`);
        if (e.raw) assert(!/set_variable|add_to_variable/.test(e.raw) || !direct.test(e.raw), `${where}: raw`);
        if (e.if) { walk(e.if.then, where); walk(e.if.else, where); }
        if (e.for_country) walk(e.for_country.effects, where);
      }
    };
    for (const f of OWN[id].focuses) walk(f.effects, `${id}.${f.key}`);
    for (const [k, ev] of Object.entries(OWN[id].events ?? {})) ev.options.forEach(o => walk(o.effects, `${id}.${k}`));
  }
  const bankers = OWN.regional_alerhia.focuses.find(f => f.key === 'the_bankers_offer');
  assert(JSON.stringify(bankers.effects).includes('zin_east_add_lean'));
  assert(JSON.stringify(bankers.effects).includes('zin_stabilo_add_debt'));
});

test('Startup AI strategies are the ones of the spec', () => {
  const s = id => (OWN[id].ai_strategies ?? []).map(x => `${x.type} ${x.target} ${x.value}`);
  assert.deepEqual(s('regional_alerhia'), ['befriend Noris 5', 'befriend Stabilo 5']);
  assert.deepEqual(s('regional_drak'), ['befriend Stabilo 15']);
  assert.deepEqual(s('regional_gondolin'), ['befriend Noris 15']);
  assert.deepEqual(s('regional_ostoroth'), ['befriend Noris 15']);
  assert.deepEqual(s('regional_mora'), ['befriend Ostoroth 10']);
  assert.match(compileTree(eff('regional_mora'), base.ctx).files.get('common/ai_strategy/zin_regional_mora.txt'), /type = befriend/);
});

test('Compiling the 20 trees twice gives identical bytes', async () => {
  const again = await analyse();
  for (const id of IDS) {
    const a = compileTree(eff(id), base.ctx), b = compileTree(again.trees.get(id), again.ctx);
    assert.deepEqual([...a.files.keys()], [...b.files.keys()], id);
    for (const [rel, text] of a.files) assert.equal(text, b.files.get(rel), rel);
  }
});

test('The registry additions file lists every outside name the trees use', async () => {
  const reg = await json(path.join(here, 'data/focus_registry_regional_b.json'));
  for (const k of ['scripted_effects', 'scripted_triggers', 'flags', 'global_flags']) assert(Array.isArray(reg[k]) && reg[k].length > 3, k);
  assert(reg.scripted_effects.includes('zin_east_add_lean'));
  assert(reg.branch.refreshed_checks.includes('zin_regional_drak_holds_old_seat'));
  assert(reg.branch.refreshed_checks.includes('zin_regional_enhis_is_rond_holds_shrine'));
  assert(reg.branch.fixed_checks.includes('zin_east_is_south_court'));
});

test('When the real shared trees are finished, the trees compile against them too', async () => {
  for (const [region, shared] of Object.entries(SHARED)) {
    const file = path.join(TREES, `${shared}.json`);
    if (!existsSync(file)) continue;
    const real = await json(file);
    const alone = await analyseTrees([{ name: shared, data: real }], new Staged(), { warn: () => {}, expected: [], tierRanges: null, registry });
    if (alone.problems.length) continue;                        // the shared tree is still being written; its own tests judge it
    const ids = IDS.filter(i => EXPECT[i].region === region);
    const a = await analyse(null, { only: ids, shared: { [shared]: real } });
    assert.deepEqual(mine(a).map(p => p.message), [], `${region} against the real ${shared}`);
    for (const id of ids) assert.equal(a.trees.get(id).focuses.length, EXPECT[id].focuses, `${id} against the real ${shared}`);
  }
});

// ------------------------------------------------------------------------------------------------ negative
const fails = async (mutate, code, opts) => {
  const a = await analyse(mutate, opts);
  assert(a.problems.some(p => p.code === code), `expected ${code}, got ${codes(a).join(', ') || 'nothing'}`);
  return a;
};

test('Negative: an unknown scripted trigger is reported', async () => {
  await fails(own => { own.regional_erco.focuses[0].available = [{ check: 'zin_not_a_trigger_anywhere' }]; }, 'trigger_unresolved');
});
test('Negative: an unknown scripted effect is reported', async () => {
  await fails(own => { own.regional_erco.focuses[0].effects.push({ call: 'zin_not_an_effect_anywhere' }); }, 'effect_unresolved');
});
test('Negative: a duplicate focus key is reported', async () => {
  await fails(own => { own.regional_drak.focuses.push(structuredClone(own.regional_drak.focuses[1])); }, 'duplicate_key');
});
test('Negative: a missing prerequisite is reported', async () => {
  await fails(own => { own.regional_mora.focuses[2].prerequisite = [['no_such_focus']]; }, 'prerequisite_missing');
});
test('Negative: a focus above its prerequisite is reported', async () => {
  await fails(own => { own.regional_howan.focuses[1].y = 0; own.regional_howan.focuses[1].x = 4; }, 'prerequisite_above');
});
test('Negative: a banned modern word is found by the sweep', () => {
  assert(findBanned('The factory makes tanks for the republic.', rules, ['error', 'review']).length >= 3);
  assert.equal(findBanned('The workshop forges spears for the commonwealth.', rules, ['error', 'review']).length, 0);
});
test('Negative: a vanilla or platform name is found by the sweep', () => {
  assert(findBanned('Hearts of Iron in the age of Paradox.', rules, ['error', 'review']).length >= 1);
});
test('Negative: an unresolved event reference is reported', async () => {
  await fails(own => { own.regional_miaed.focuses[0].effects.push({ event: 'no_such_event' }); }, 'event_unknown');
});
test('Negative: a spirit that no tree defines is reported', async () => {
  await fails(own => { own.regional_nara.focuses[1].effects = [{ add_spirit: 'no_such_spirit' }]; }, 'spirit_unknown');
});
test('Negative: a spirit key equal to a focus key is reported', async () => {
  await fails(own => { own.regional_verde.spirits.the_green_woods = structuredClone(own.regional_verde.spirits.forest_law); }, 'key_collision');
});
test('Negative: an icon outside the catalog is reported', async () => {
  await fails(own => { own.regional_heaven.focuses[0].icon = 'no_such_icon'; }, 'icon_unknown');
});
test('Negative: a copy of a module the shared tree lacks is reported', async () => {
  const a = await analyse(own => { own.regional_erco.copy[0].module = 'E99'; });
  assert(a.problems.some(p => p.code === 'copy' && /no focus tagged module E99/.test(p.message)));
});
test('Negative: a copied position on top of an own focus is reported', async () => {
  await fails(own => { own.regional_erco.copy[0].root_at = [10, 1]; }, 'duplicate_position');
});
test('Negative: a banned secret name in a text is reported', async () => {
  await fails(own => { own.regional_gondolin.focuses[0].desc = 'Afrit holds the Hidden Council in the northern hall.'; }, 'secret_leak');
});
test('Negative: a superseded name in a text is reported', async () => {
  await fails(own => { own.regional_howan.focuses[0].desc = 'The stranger Einendil walks the quay.'; }, 'text_superseded');
});
test('Negative: a flag no tree or module sets is reported', async () => {
  await fails(own => { own.regional_avalon.focuses[0].available = [{ flag: 'zin_flag_nobody_sets' }]; }, 'flag_unresolved');
});
test('Negative: a name left out of the registry is reported', async () => {
  const data = structuredClone({ scripted_effects: [], scripted_triggers: [], flags: [], global_flags: [], branch: {} });
  const a = await analyse(null, { reg: new Registry(data) });
  assert(a.problems.length > 20);
  assert(codes(a).includes('effect_unresolved') && codes(a).includes('flag_unresolved'));
});
test('Negative: a changing condition in allow_branch without a layout refresh is reported', async () => {
  await fails(own => { own.regional_plutondo.focuses.find(f => f.key === 'the_hill_coast').allow_branch = [{ flag: 'zin_east_rift_talk' }]; }, 'allow_branch_changing');
});
test('Negative: a branch head that does not repeat its refreshed condition is reported', async () => {
  await fails(own => { delete own.regional_gondolin.focuses.find(f => f.key === 'harbours_of_gondolin').available; }, 'allow_branch_not_repeated');
});
test('Negative: a tree of 51 focuses is outside the tier B range', async () => {
  const t = structuredClone(eff('regional_alerhia'));
  for (let i = 0; i < 2; i++) t.focuses.push({ ...t.focuses[0], key: `extra_${i}`, x: 40 + i, y: 1 });
  assert.equal(checkTierRange(t).length, 1);
  assert.equal(checkTierRange({ ...t, focuses: t.focuses.slice(0, 20) }).length, 1);
});
test('Negative: a schema violation (unknown field) is reported', async () => {
  const a = await analyse(own => { own.regional_goodin.focuses[0].surprise = true; });
  assert(a.problems.some(p => p.code === 'schema' && /surprise/.test(p.message)));
});
test('Negative: an event with the same number twice is reported', async () => {
  await fails(own => { own.regional_elvana.events.the_rival_at_igara.n = 1; }, 'event_duplicate');
});
test('Negative: a country served by two trees is reported', async () => {
  const a = await analyse(own => { own.regional_miaed.countries = ['Erco']; });
  assert(a.problems.some(p => p.code === 'coverage_many'));
});
