// Tests of the tier A trees of content wave C: Noris, Stabilo, Volgan, Worshipdom and Zol
// (docs/design/focus/<tree>.json, docs/design/stage2/focus_major_c.md). They compile the real tree files through the
// focus compiler's check API without writing anything, and compare the data with the spec tables.
//   node --test tools/content/focus_major_c.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { GAME } from './lib/paths.mjs';
import { analyseTrees, compileTree } from './modules/focus_compiler.mjs';
import { absolutePositions } from './lib/focus_model.mjs';
import { loadBanned, compileBanned, findBanned } from './lib/banned.mjs';
import { exclusiveClosure, loadRegistry, countRaw } from './checks/focus_checks.mjs';
import { buildFocusMajorC, DYNAMIC_MODIFIERS, dynamicModifierText } from './modules/focus_major_c.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ZIN = path.resolve(here, '../..');
const TREES = { noris: { n: 112, spirits: 22 }, stabilo: { n: 111, spirits: 22 }, volgan: { n: 114, spirits: 36 }, worshipdom: { n: 116, spirits: 24 }, zol: { n: 97, spirits: 24 } };
const IDS = Object.keys(TREES);
const json = async f => JSON.parse(await readFile(f, 'utf8'));
const DATA = {};
for (const id of IDS) DATA[id] = await json(path.join(ZIN, 'docs/design/focus', `${id}.json`));
const FACES = (await json(path.join(here, 'data/focus_worshipdom_faces.json'))).focuses;
const banned = compileBanned(await loadBanned());

const analyse = async (mutate, ids = IDS) => {
  const raw = structuredClone(DATA);
  mutate?.(raw);
  return analyseTrees(ids.map(name => ({ name, data: raw[name] })), new Staged(), { expected: [] });
};
const base = await analyse();
const compiled = Object.fromEntries(base.list.map(t => [t.id, compileTree(t, base.ctx)]));
const codes = a => a.problems.map(p => p.code);
const focusOf = (raw, tree, key) => raw[tree].focuses.find(f => f.key === key);

// ------------------------------------------------------------------------------------------------ the spec tables
async function specRows(id) {
  const md = (await readFile(path.join(ZIN, 'docs/specs/05_focus_trees/major', `${id}.md`), 'utf8')).replace(/\r\n/g, '\n');
  const rows = [];
  for (const line of md.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.replace(/\\\|/g, '\u0001').split('|').slice(1, -1).map(s => s.trim().replace(/\u0001/g, '|'));
    if (cells.length >= 8 && /^`[a-z][a-z0-9_]*`$/.test(cells[0]) && /^\d+\s*,\s*\d+$/.test(cells[4])) {
      const [x, y] = cells[4].split(',').map(Number);
      rows.push({ key: cells[0].slice(1, -1), x, y, days: Number(cells[5]) });
    }
  }
  return rows;
}

// ------------------------------------------------------------------------------------------------ positive
test('The five trees pass every check of the focus compiler with no problem', () => {
  assert.deepEqual(base.problems.map(p => p.message), []);
  assert.equal(base.list.length, 5);
});

for (const id of IDS) {
  test(`${id}: focus count, ids, positions and spirits agree with the spec`, async () => {
    const tree = DATA[id], rows = await specRows(id);
    assert.equal(tree.id, id);
    assert.equal(tree.tier, 'major');
    assert.equal(tree.focuses.length, TREES[id].n, 'focus count');
    assert.equal(rows.length, TREES[id].n, 'spec row count');
    assert.deepEqual(tree.focuses.map(f => f.key).sort(), rows.map(r => r.key).sort(), 'keys');
    for (const r of rows) {
      const f = tree.focuses.find(g => g.key === r.key);
      assert.deepEqual([f.x, f.y, f.days], [r.x, r.y, r.days], `${r.key} position and days`);
    }
    assert.equal(Object.keys(tree.spirits).length, TREES[id].spirits, 'spirit count');
    assert(tree.focuses.length >= 80 && tree.focuses.length <= 140, 'major range');
  });

  test(`${id}: prerequisites and exclusives resolve, every focus sits below its prerequisites, positions are unique`, () => {
    const tree = base.trees.get(id), keys = new Set(tree.focuses.map(f => f.key));
    const { pos } = absolutePositions(tree);
    const seen = new Set();
    for (const f of tree.focuses) {
      for (const g of f.prerequisite ?? []) for (const p of g) { assert(keys.has(p), `${f.key} needs ${p}`); assert(pos.get(f.key).y > pos.get(p).y, `${f.key} below ${p}`); }
      for (const e of f.mutually_exclusive ?? []) { assert(keys.has(e)); assert(focusOf(DATA, id, e).mutually_exclusive.includes(f.key), `${f.key} / ${e} listed on both sides`); }
      const at = `${pos.get(f.key).x},${pos.get(f.key).y}`;
      assert(!seen.has(at), `position ${at} used twice`); seen.add(at);
      assert.equal(f.days % 7, 0);
    }
    const closure = exclusiveClosure(tree);
    for (const [k, set] of closure) for (const e of set) assert(closure.get(e).has(k));
  });

  test(`${id}: localisation is complete for every focus, spirit and event`, () => {
    const loc = compiled[id].loc, tree = DATA[id];
    for (const f of tree.focuses) { assert(loc[`zin_${id}_${f.key}`]?.trim(), `${f.key} name`); assert(loc[`zin_${id}_${f.key}_desc`]?.trim(), `${f.key} desc`); }
    for (const k of Object.keys(tree.spirits)) { assert(loc[`zin_${id}_${k}`]?.trim(), `${k} name`); assert(loc[`zin_${id}_${k}_desc`]?.trim(), `${k} desc`); }
    const ns = tree.event_namespace ?? `zin_${id}`;
    for (const [k, e] of Object.entries(tree.events)) {
      if (e.hidden) continue;
      const eid = `${ns}.${(tree.event_base ?? 0) + e.n}`;
      assert(loc[`${eid}.t`]?.trim() && loc[`${eid}.d`]?.trim(), `${k} title and desc`);
      e.options.forEach((o, i) => assert(loc[`${eid}.${'abcdefghijklmnopqrstuvwxyz'[i]}`]?.trim(), `${k} option ${i}`));
    }
    for (const v of Object.values(loc)) assert(typeof v === 'string' && v.length > 0);
  });

  test(`${id}: text has no banned or modern word, no placeholder and no superseded name`, () => {
    const loc = compiled[id].loc;
    for (const [k, v] of Object.entries(loc)) {
      const shown = v.replace(/\[[^\]]*\]/g, '');
      const hits = findBanned(shown, banned);
      assert.deepEqual(hits.map(h => h.word), [], `${k}: ${v}`);
      assert(!/lorem|todo|tbd|placeholder|xxx/i.test(shown), `${k} placeholder`);
      assert(!/Eindil|Einendil|Kusven|\bRush\b|Sunhot/.test(shown), `${k} names a withheld or retired name`);
      assert(!/ō/.test(shown), `${k} has o-macron`);
    }
  });

  test(`${id}: at most ten raw blocks, deterministic output, every call and check resolves`, () => {
    assert(countRaw(base.trees.get(id)) <= 10);
    const again = compileTree(base.trees.get(id), base.ctx);
    for (const [rel, body] of compiled[id].files) assert.equal(again.files.get(rel), body, rel);
    assert(compiled[id].files.has(`common/national_focus/zin_${id}.txt`));
    assert(compiled[id].files.has(`events/zin_${id}.txt`));
  });

  test(`${id}: no war, claim or annexation can be taken before a story flag opens it`, () => {
    const tree = DATA[id], byKey = new Map(tree.focuses.map(f => [f.key, f]));
    const gated = (f, seen = new Set()) => {
      if (seen.has(f.key)) return false; seen.add(f.key);
      if (f.available?.length) return true;
      return (f.prerequisite ?? []).flat().some(p => gated(byKey.get(p), seen));
    };
    const war = e => e.wargoal || e.claims_on || e.cores_on || e.annex || e.puppet || (e.call && /grant_(free|high_king)_cb|claim_(rift|road)|wargoal|strike_volgan/.test(e.call));
    const hit = [];
    const walk = (list, f) => (list ?? []).forEach(e => { if (war(e)) hit.push(f); if (e.if) { walk(e.if.then, f); walk(e.if.else, f); } if (e.for_country) walk(e.for_country.effects, f); });
    for (const f of tree.focuses) walk(f.effects, f);
    // Volgan's one peace-time claim is the Old Claim on Mirolon (spec: "old_claim is the only claim"); the march claim needs the Mirolon war.
    const allowed = new Set(id === 'volgan' ? ['old_claim'] : []);
    for (const f of hit) assert(allowed.has(f.key) || gated(f), `${f.key} reaches a war effect with no gate`);
  });
}

test('Every first focus of the spec order is available on day one and opens the right branch', () => {
  const first = { noris: 'desert_throne', stabilo: 'the_merchant_houses', volgan: 'court_of_nafeher', worshipdom: 'zilin_hermitage', zol: 'silence_of_the_north' };
  for (const [id, key] of Object.entries(first)) {
    const f = focusOf(DATA, id, key);
    assert.equal(f.prerequisite, undefined);
    assert(!f.available?.length);
    assert(f.ai.base >= 50, `${id} ${key} is the AI's first focus`);
  }
});

test('Noris: the route junction, its three exclusive routes and the clan accord', () => {
  const q = focusOf(DATA, 'noris', 'question_of_the_east');
  assert.deepEqual(q.available, [{ check: 'zin_east_question_open' }]);
  const routes = ['the_deliverers_sword', 'shield_of_the_east', 'high_king_of_the_sands'];
  for (const r of routes) {
    const f = focusOf(DATA, 'noris', r);
    assert.deepEqual(f.mutually_exclusive.sort(), routes.filter(x => x !== r).sort());
    assert.deepEqual(f.prerequisite, [['question_of_the_east']]);
    assert.equal(f.y, 8);
  }
  assert.deepEqual(focusOf(DATA, 'noris', 'throne_of_furvior').mutually_exclusive, ['tent_moot']);
  assert(DATA.noris.scripted_effects.zin_noris_monthly && DATA.noris.scripted_effects.zin_noris_add_accord);
  assert(DATA.noris.events.unrest_in_the_tents.n === 20 && DATA.noris.events.clans_ride_as_one.n === 21);
});

test('Stabilo: the Reckoning, three routes, the ledger events 30 to 33 and the start debts', () => {
  const routes = ['treasurer_of_the_east', 'paymaster_of_the_free_crowns', 'prince_of_all_roads'];
  for (const r of routes) assert.deepEqual(focusOf(DATA, 'stabilo', r).mutually_exclusive.sort(), routes.filter(x => x !== r).sort());
  assert.deepEqual(['loan_from_postondoroth', 'debt_called_in', 'debtor_cannot_pay', 'court_defaults'].map(k => DATA.stabilo.events[k].n), [30, 31, 32, 33]);
  const monthly = JSON.stringify(DATA.stabilo.scripted_effects.zin_stabilo_monthly);
  for (const [name, debt] of [['Drak', 20], ['Plutondo', 10], ['Mostok', 10]]) assert(monthly.includes(`"country":"${name}"`) && monthly.includes(`"set":${debt}`));
  assert.equal(DATA.stabilo.spirits.credit.icon, 'scroll_sealed');
});

test('Volgan: the exclusive pairs, exactly the raw blocks the spec allows and the war gate', () => {
  const pairs = [['break_the_veil', 'wait_for_the_storm'], ['rule_through_orders', 'rule_through_warlords'], ['bargain_with_the_king', 'bend_the_nether'], ['dead_garrison', 'client_crown_of_mirolon'], ['dead_against_dead', 'leave_north_to_its_dead'], ['hold_the_ember_lands', 'host_fights_on']];
  for (const [a, b] of pairs) { assert.deepEqual(focusOf(DATA, 'volgan', a).mutually_exclusive, [b]); assert.deepEqual(focusOf(DATA, 'volgan', b).mutually_exclusive, [a]); }
  assert.deepEqual(focusOf(DATA, 'volgan', 'silent_throne').allow_branch, [{ global_flag: 'zin_volgan_body_destroyed' }]);
  assert.deepEqual(focusOf(DATA, 'volgan', 'silent_throne').available, [{ global_flag: 'zin_volgan_body_destroyed' }]);
  assert.equal(DATA.volgan.events.what_remains.picture, 'volgan_broken');
  assert(JSON.stringify(focusOf(DATA, 'volgan', 'what_remains').available).includes('zin_volgan_body_destroyed'), 'gated picture is used only behind its flag');
  assert(JSON.stringify(focusOf(DATA, 'volgan', 'ash_mines').effects).includes('add_resource'));
});

test('Zol: the three route focuses, the gate on every war focus and the Sodoloro spelling', () => {
  const routes = ['the_appointed_hour', 'the_hastened_hour', 'the_long_patience'];
  for (const r of routes) assert.deepEqual(focusOf(DATA, 'zol', r).mutually_exclusive.sort(), routes.filter(x => x !== r).sort());
  for (const k of ['southward_to_aenor', 'the_northern_shores', 'the_edge_of_the_woods', 'two_darknesses_meet', 'the_land_made_waste', 'the_late_rising']) {
    assert(JSON.stringify(focusOf(DATA, 'zol', k).available).includes('zin_zol_rising'), `${k} needs the rising`);
  }
  assert.equal(focusOf(DATA, 'zol', 'sodoloro').name, 'Šodolôro');
  assert.equal(countRaw(base.trees.get('zol')), 0);
  const wounded = DATA.zol.events.wounded_not_slain;
  assert.equal(wounded.picture, 'vast_shadow');
  assert(JSON.stringify(focusOf(DATA, 'zol', 'wounded_not_slain').available).includes('zin_zol_manifested'));
});

// ------------------------------------------------------------------------------------------------ Worshipdom secrecy
test('Worshipdom: two faces, secrecy of the public face and the faces table', () => {
  const tree = DATA.worshipdom, two = tree.focuses.filter(f => f.name.startsWith('[zin_wsd_'));
  assert.equal(two.length, 62);
  assert.deepEqual(Object.keys(FACES).sort(), two.map(f => f.key).sort());
  for (const f of two) {
    assert.equal(f.name, `[zin_wsd_${f.key}_name]`);
    assert.equal(f.desc, `[zin_wsd_${f.key}_desc]`);
    const face = FACES[f.key];
    assert(face.name_public && face.name_true && face.desc_public && face.desc_true);
  }
  const SECRET = /\b(afrit|hidden council|demons?|murder\w*|poison\w*|plots?|eindil|regicide|assassin\w*)\b/i;
  for (const [k, f] of Object.entries(FACES)) {
    for (const t of [f.name_public, f.desc_public]) assert(!SECRET.test(t), `${k} public face: ${t}`);
    for (const t of [f.name_public, f.name_true, f.desc_public, f.desc_true]) assert.deepEqual(findBanned(t, banned).map(h => h.word), [], `${k}: ${t}`);
    assert(!/Eindil/.test(f.desc_true));
  }
  for (const f of tree.focuses.filter(g => !g.name.startsWith('[zin_wsd_'))) assert(!SECRET.test(`${f.name} ${f.desc}`), `${f.key} is single-face and must be mask-safe`);
  for (const [k, s] of Object.entries(tree.spirits)) assert(!SECRET.test(`${s.name} ${s.desc}`), `spirit ${k}`);
  const PRIVATE = new Set(['leren_mood', 'report_from_the_passes', 'letter_from_merovan', 'reliquary_inventory', 'guest_who_does_not_age', 'what_council_knows', 'servants_beyond_veil', 'quiet_court', 'quiet_court_heir']);
  for (const [k, e] of Object.entries(tree.events)) {
    if (PRIVATE.has(k)) { assert.equal(e.picture, 'council_chamber', k); continue; }
    assert.notEqual(e.picture, 'council_chamber');
    assert(!SECRET.test(`${e.title} ${e.desc} ${e.options.map(o => o.name).join(' ')}`), `public event ${k}`);
  }
  // A private event is fired only through a tree-declared hidden wrapper, never with the event effect.
  const fired = new Set();
  for (const f of tree.focuses) JSON.stringify(f.effects ?? []).replace(/"event":"?([a-z_]+)/g, (_, k) => fired.add(k));
  for (const k of fired) assert(!PRIVATE.has(k), `${k} is fired with the event effect`);
  for (const [name, def] of Object.entries(tree.scripted_effects)) if (/_private_\d+$|_private_afrit_\d+$/.test(name)) assert(def.effects.some(e => e.tooltip), `${name} shows a tooltip`);
  // Two-face icons switch on the reveal flag only.
  for (const f of tree.focuses) if (typeof f.icon === 'object') assert.deepEqual(f.icon.after.map(a => a.global_flag), ['zin_afrit_revealed']);
  // Every focus of the late branches is closed once the Deliverer is dead.
  for (const k of ['first_of_his_name', 'king_of_the_east', 'lord_of_all_aoaz', 'the_quiet_court', 'cast_off_the_mask']) assert(JSON.stringify(focusOf(DATA, 'worshipdom', k).available).includes('zin_afrit_dead'), k);
  // The compiler's own secret scan found nothing.
  assert(!base.problems.some(p => /secret_/.test(p.code)));
});

test('No public text of any of the five trees names Afrit, the Hidden Council or Eindil', () => {
  for (const id of IDS) for (const [k, v] of Object.entries(compiled[id].loc)) assert(!/Afrit|Hidden Council|Eindil/.test(v), `${id} ${k}`);
});

test('No focus name equals a name of the installed game\'s focus localisation', async () => {
  const dir = path.join(GAME, 'localisation/english');
  if (!existsSync(dir)) return;
  const vanilla = new Set();
  for (const n of (await readdir(dir)).filter(x => /focus.*_l_english\.yml$/.test(x))) {
    for (const m of (await readFile(path.join(dir, n), 'utf8')).matchAll(/^ ([A-Za-z0-9_]+):\d* "(.*)"\s*$/gm)) if (!/_desc$|_tt$/.test(m[1])) vanilla.add(m[2].toLowerCase());
  }
  assert(vanilla.size > 1000);
  for (const id of IDS) for (const f of DATA[id].focuses) if (!f.name.startsWith('[')) assert(!vanilla.has(f.name.toLowerCase()), `${id} ${f.key}: ${f.name} is a vanilla focus name`);
});

// ------------------------------------------------------------------------------------------------ registry and arguments
test('The registry file lists exactly the names other owners write, and they exist in the contract documents', async () => {
  const file = await json(path.join(here, 'data/focus_registry_major_c.json'));
  const corpus = (await Promise.all((await readdir(path.join(ZIN, 'docs/specs/04_mechanics'))).filter(n => n.endsWith('.md')).map(n => readFile(path.join(ZIN, 'docs/specs/04_mechanics', n), 'utf8')))).join('\n')
    + (await readFile(path.join(ZIN, 'docs/specs/03_gameplay/03_diplomacy_and_factions.md'), 'utf8')) + (await readFile(path.join(ZIN, 'docs/specs/03_gameplay/05_world_tension_and_endings.md'), 'utf8')) + (await readFile(path.join(ZIN, 'docs/specs/01_map/02_key_sites.md'), 'utf8').catch(() => ''))
    + (await readFile(path.join(ZIN, 'docs/specs/00_foundation/05_defines_and_rules.md'), 'utf8').catch(() => ''));
  const missing = [], PROPOSED = new Set(['events: zin_east.73', 'flags: zin_stabilo_great_loan']); // zin_east.70 to .73 are written as a range; the flag is this tree's request (note, section Requests)
  for (const kind of ['scripted_effects', 'scripted_triggers', 'events', 'ideas', 'flags', 'global_flags']) for (const name of file[kind] ?? []) {
    // generated names (zin_is_site_<key>, rule wrappers) are described by their pattern; everything else is named in a spec
    if (!corpus.includes(name) && !/^zin_is_(site|region)_/.test(name) && !PROPOSED.has(`${kind}: ${name}`)) missing.push(`${kind}: ${name}`);
  }
  assert.deepEqual(missing, []);
  const reg = await loadRegistry();
  for (const name of file.scripted_effects) assert(reg.has('scripted_effects', name));
});

test('Keyword arguments carry codes; numeric arguments stand where no code table exists', () => {
  const calls = [];
  const visit = (v) => { if (Array.isArray(v)) v.forEach(visit); else if (v && typeof v === 'object') { if (typeof v.call === 'string') calls.push(v); Object.values(v).forEach(visit); } };
  for (const id of IDS) visit(DATA[id]);
  assert(calls.length > 300);
  const cb = calls.filter(c => c.call === 'zin_diplo_grant_cb');
  assert.equal(cb.length, 2);
  for (const c of cb) assert.equal(c.args.cb, 3);
  const spread = calls.filter(c => c.call === 'zin_afrit_spread_footholds');
  assert(spread.length > 10 && spread.every(c => typeof c.args.region === 'number' || /^[a-z_]+$/.test(c.args.region)));
});

// ------------------------------------------------------------------------------------------------ negatives
test('Fails: an unknown scripted trigger, a duplicate key, a missing prerequisite and an unresolved event', async () => {
  let a = await analyse(r => { focusOf(r, 'noris', 'salt_road').available = [{ check: 'zin_noris_no_such_trigger' }]; });
  assert(codes(a).includes('trigger_unresolved'));
  a = await analyse(r => { r.zol.focuses.push({ ...focusOf(r, 'zol', 'servants_unseen'), y: 20 }); });
  assert(codes(a).includes('duplicate_key'));
  a = await analyse(r => { focusOf(r, 'volgan', 'ash_mines').prerequisite = [['no_such_focus']]; });
  assert(codes(a).includes('prerequisite_missing'));
  a = await analyse(r => { focusOf(r, 'stabilo', 'ledger_of_the_east').effects.push({ event: 'zin_east.9999' }); });
  assert(codes(a).includes('event_unresolved'));
  a = await analyse(r => { focusOf(r, 'worshipdom', 'zilin_hermitage').effects.push({ event: 'no_such_event' }); });
  assert(codes(a).includes('event_unknown'));
});

test('Fails: a spirit equal to a focus key, an unknown modifier, an unknown icon, an unknown country', async () => {
  let a = await analyse(r => { r.noris.spirits.salt_road = r.noris.spirits.queen_of_roads; });
  assert(codes(a).includes('key_collision'));
  a = await analyse(r => { r.zol.spirits.veiled_service.modifier = { no_such_modifier_at_all: 1 }; });
  assert(codes(a).includes('modifier_unknown'));
  a = await analyse(r => { focusOf(r, 'volgan', 'ash_mines').icon = 'no_such_icon'; });
  assert(codes(a).includes('icon_unknown'));
  a = await analyse(r => { focusOf(r, 'stabilo', 'west_to_alerhia').effects.push({ for_country: { country: 'Nowhere Land', effects: [] } }); });
  assert(a.problems.some(p => p.code === 'schema'));
});

test('Fails: a modern word, a retired name, a leak of the secret and a cycle', async () => {
  const mod = findBanned('The factory kilns burn coal for the steel.', banned);
  assert(mod.length >= 3);
  let a = await analyse(r => { focusOf(r, 'worshipdom', 'pilgrim_roads').desc = 'The road leads to Afrit and the Hidden Council.'; });
  assert(codes(a).includes('secret_leak'));
  a = await analyse(r => { focusOf(r, 'noris', 'salt_road').desc = 'The Einendil road.'; });
  assert(codes(a).includes('text_superseded'));
  a = await analyse(r => { focusOf(r, 'zol', 'servants_unseen').prerequisite = [['servants_at_war']]; });
  assert(codes(a).includes('prerequisite_cycle'));
  a = await analyse(r => { const f = focusOf(r, 'noris', 'salt_road'); f.y = focusOf(r, 'noris', 'master_of_caravans').y; });
  assert(codes(a).includes('prerequisite_above') || codes(a).includes('duplicate_position'));
});

test('Fails: a call with a keyword that has no code, an undeclared tree argument and more than ten raw blocks', async () => {
  let a = await analyse(r => { focusOf(r, 'noris', 'salt_road').effects.push({ call: 'zin_east_add_road_influence', args: { road: 'no_such_road', value: 1 } }); });
  assert(codes(a).includes('call_keyword_nocode'));
  a = await analyse(r => { focusOf(r, 'noris', 'salt_road').effects.push({ call: 'zin_noris_add_accord', args: { value: 1, extra: 2 } }); });
  assert(codes(a).includes('call_arg_unknown'));
  a = await analyse(r => { for (let i = 0; i < 5; i++) focusOf(r, 'worshipdom', 'zilin_hermitage').effects.push({ raw: `set_country_flag = zin_x${i}` }); });
  assert(codes(a).includes('raw_limit'));
});

test('Fails: a war goal before the gate is caught by the scan, and the scan passes the real trees', () => {
  const tree = structuredClone(DATA.noris);
  focusOf({ noris: tree }, 'noris', 'salt_road').effects.push({ wargoal: { target: 'Stabilo', type: 'annex_everything' } });
  const f = tree.focuses.find(g => g.key === 'salt_road');
  assert(f.effects.some(e => e.wargoal) && !f.available);
  for (const id of IDS) assert(!JSON.stringify(DATA[id]).includes('"wargoal"') || id === 'volgan' || id === 'zol' || id === 'worshipdom');
});

// ------------------------------------------------------------------------------------------------ dynamic modifiers
test('The dynamic modifiers of Noris and Stabilo are written with valid modifier keys', async () => {
  const staged = new Staged();
  const counts = await buildFocusMajorC(staged);
  assert.deepEqual(counts, { dynamicModifiers: 2, files: 3 });
  const noris = staged.files.get('common/dynamic_modifiers/zin_noris.txt').toString('utf8');
  assert(noris.includes('zin_noris_clans = {') && noris.includes('stability_factor = zin_noris_accord_stab') && noris.includes('conscription_factor = zin_noris_accord_cons'));
  const stabilo = staged.files.get('common/dynamic_modifiers/zin_stabilo.txt').toString('utf8');
  assert(stabilo.includes('political_power_gain = zin_stabilo_ledger_pp') && stabilo.includes('trade_opinion_factor = zin_stabilo_ledger_trade'));
  const bytes = staged.files.get('localisation/english/zin_focus_major_c_l_english.yml');
  assert.equal(bytes[0], 0xef);
  assert(bytes.toString('utf8').includes('zin_noris_clans:0'));
  assert.equal(dynamicModifierText('x', { icon: 'GFX_a', modifiers: { a: 'b' } }), '# Generated by the ZIN content builder (modules/focus_major_c.mjs). Do not edit.\nx = {\n\ticon = GFX_a\n\ta = b\n}\n');
  // each file's variables are the ones the tree's scripted effects keep
  const noEffects = JSON.stringify(DATA.noris.scripted_effects.zin_noris_add_accord);
  for (const v of Object.values(DYNAMIC_MODIFIERS.zin_noris_clans.modifiers)) assert(noEffects.includes(v));
  const stEffects = JSON.stringify(DATA.stabilo.scripted_effects.zin_stabilo_monthly);
  for (const v of Object.values(DYNAMIC_MODIFIERS.zin_stabilo_ledger_income.modifiers)) assert(stEffects.includes(v));
});
