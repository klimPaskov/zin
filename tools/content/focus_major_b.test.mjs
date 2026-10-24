// Tests of the major_b focus trees (mirolon, gunwaith, lerendor, magical_forest): docs/design/stage2/focus_major_b.md.
// They compile the real tree files with the focus compiler's check API (nothing is written), assert the counts the
// specs fix, and plant one failure for each check class that matters to these trees.
//   node --test tools/content/focus_major_b.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { Staged } from './lib/core.mjs';
import { ZIN } from './lib/paths.mjs';
import { readTreeFiles, focusId } from './lib/focus_model.mjs';
import { analyseTrees, compileTree } from './modules/focus_compiler.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { loadGlossary } from './lib/text_engine.mjs';
import { displayText } from './lib/loc_parse.mjs';
import { Registry, mergeRegistryData, REGISTRY_FILE } from './checks/focus_checks.mjs';
import { countryTable, successor } from './lib/roster.mjs';

// The realm of the roster that took an old row's role (Volgan's roles went to Puvulan, the first realm of its split).
const realm = old => countryTable().find(c => c.key === successor(old).primary).name;
const IDS = ['gunwaith', 'lerendor', 'magical_forest', 'mirolon'];
const EXPECT = {
  mirolon: { focuses: 83, spirits: 27, events: 12, raw: 6, x: 25, y: 16 },
  gunwaith: { focuses: 116, spirits: 28, events: 7, raw: 5, x: 29, y: 19 },
  lerendor: { focuses: 127, spirits: 31, events: 31, raw: 10, x: 29, y: 15 },
  magical_forest: { focuses: 121, spirits: 30, events: 20, raw: 10, x: 29, y: 14 },
};
const DIR = `${ZIN}/docs/design/focus`;
const all = (await readTreeFiles(DIR)).filter(e => IDS.includes(e.name));
const raw = Object.fromEntries(all.map(e => [e.name, e.data]));
// Only the shared base registry and this slice's own file: other slices' rows must not decide this slice's tests.
const registry = new Registry(mergeRegistryData([REGISTRY_FILE, new URL('./data/focus_registry_major_b.json', import.meta.url)].map(f => JSON.parse(readFileSync(f, 'utf8')))));
const run = async (mutate, ids = IDS) => {
  const data = structuredClone(raw);
  mutate?.(data);
  const entries = ids.map(n => ({ name: n, data: data[n] }));
  return analyseTrees(entries, new Staged(), { expected: [], registry });
};
const codes = a => [...new Set(a.problems.map(p => p.code))];
const base = await run();
const focus = (d, tree, key) => d[tree].focuses.find(f => f.key === key);
const glossary = await loadGlossary();
const banned = compileBanned(await loadRuleSet({ glossary }));

// ------------------------------------------------------------------------------------------------ the real trees
test('The four tree files exist, validate and compile with no problem', () => {
  assert.deepEqual(all.map(e => e.name).sort(), IDS);
  for (const e of all) assert.equal(e.error, undefined, e.error);
  assert.deepEqual(base.problems.map(p => p.message), []);
  assert.equal(base.list.length, 4);
});

test('Each tree holds the focuses, spirits, events and raw blocks its spec fixes', () => {
  for (const tree of base.list) {
    const ex = EXPECT[tree.id], out = compileTree(tree, base.ctx);
    assert.equal(tree.tier, 'major');
    assert.equal(out.stats.focuses, ex.focuses, `${tree.id} focuses`);
    assert.equal(out.stats.spirits, ex.spirits, `${tree.id} spirits`);
    assert.equal(out.stats.events, ex.events, `${tree.id} events`);
    assert.equal(out.stats.raw, ex.raw, `${tree.id} raw blocks`);
    assert(out.stats.raw <= 10, `${tree.id} stays within the raw limit`);
    assert(tree.focuses.length >= 80 && tree.focuses.length <= 140);
  }
});

test('Positions are unique and stay inside the spec grid', () => {
  for (const tree of base.list) {
    const ex = EXPECT[tree.id], seen = new Set();
    for (const f of tree.focuses) {
      assert(f.x >= 0 && f.x <= ex.x && f.y >= 0 && f.y <= ex.y, `${tree.id}.${f.key} at ${f.x},${f.y}`);
      const k = `${f.x},${f.y}`;
      assert(!seen.has(k), `${tree.id}: two focuses at ${k}`);
      seen.add(k);
    }
  }
});

test('Every prerequisite and exclusive resolves, and every focus sits below its prerequisites', () => {
  for (const tree of base.list) {
    const by = new Map(tree.focuses.map(f => [f.key, f]));
    for (const f of tree.focuses) {
      for (const g of f.prerequisite ?? []) for (const k of g) { assert(by.has(k), `${tree.id}.${f.key} needs ${k}`); assert(by.get(k).y < f.y); }
      for (const k of f.mutually_exclusive ?? []) { assert(by.has(k)); assert(by.get(k).mutually_exclusive?.includes(f.key) || f.mutually_exclusive.includes(k)); }
    }
  }
});

test('The exclusive groups of every spec are present', () => {
  const pairs = {
    mirolon: [['parim_bankers', 'own_coin'], ['elective_crown', 'warden_assembly'], ['ask_the_lost_cause', 'warden_league'], ['last_stand_at_the_passes', 'the_exile_court'], ['carry_the_war_south', 'a_watch_for_the_ages']],
    gunwaith: [['the_kings_peace', 'heed_the_war_thanes'], ['the_ford_holds', 'blood_at_the_ford'], ['brothers_of_the_ford', 'girdon_must_bend'], ['cross_for_the_old_claims', 'west_keeps_its_own_shore'], ['cross_for_the_old_claims', 'the_western_relief'], ['west_keeps_its_own_shore', 'the_western_relief'], ['claim_the_throne_of_men', 'parim_as_pledge'], ['sail_home', 'hold_what_we_took']],
    lerendor: [['treaty_toll', 'full_strait_dues'], ['strait_watch', 'beyond_the_strait'], ['endow_the_temples', 'crown_over_altar'], ['crown_ascendant', 'estates_ascendant'], ['crown_ascendant', 'admiralty_ascendant'], ['estates_ascendant', 'admiralty_ascendant'], ['first_among_equals', 'one_banner_for_the_north'], ['shield_of_dondor', 'bargain_with_goldoroth'], ['honour_the_treaty', 'stand_apart'], ['honour_the_treaty', 'master_of_the_strait'], ['stand_apart', 'master_of_the_strait'], ['faithful_to_the_crown', 'faithful_to_the_realm']],
    magical_forest: [['old_houses', 'open_houses'], ['remember_edrans_folly', 'aoaz_is_shared'], ['close_the_wall_roads', 'renew_accord'], ['pilgrim_hostels', 'road_tolls'], ['close_every_road', 'drive_out_temple'], ['no_elf_pursues', 'war_across_rift'], ['refusal_stands', 'hidden_woods'], ['refusal_stands', 'kindred_marches'], ['hidden_woods', 'kindred_marches']],
  };
  for (const tree of base.list) for (const [a, b] of pairs[tree.id]) {
    const fa = tree.focuses.find(f => f.key === a), fb = tree.focuses.find(f => f.key === b);
    assert(fa && fb, `${tree.id}: ${a} / ${b}`);
    assert((fa.mutually_exclusive ?? []).includes(b) || (fb.mutually_exclusive ?? []).includes(a), `${tree.id}: ${a} / ${b} exclusive`);
  }
});

test('Spec ids exist: sample focus ids, spirit keys and event numbers', () => {
  const need = {
    mirolon: ['wardens_hall', 'proof_no_court_can_laugh_at', 'the_storm_comes', 'mirolon_rises_again', 'the_free_south'],
    gunwaith: ['clan_halls', 'convene_the_ford_council', 'launch_the_crossing', 'beside_former_foes', 'equals_across_the_sea'],
    lerendor: ['strait_treasury', 'question_of_the_strait', 'the_dead_walk', 'sovereign_of_the_narrow_sea', 'the_old_alliance_restored'],
    magical_forest: ['council_of_houses', 'question_of_refusal', 'wings_over_woods', 'home_to_woods', 'woods_endure'],
  };
  for (const tree of base.list) {
    for (const k of need[tree.id]) assert(tree.focuses.some(f => f.key === k), `${tree.id}.${k}`);
    assert.equal(focusId(tree, tree.focuses[0].key), `zin_${tree.id}_${tree.focuses[0].key}`);
  }
  const ev = id => Object.values(raw[id].events).map(e => e.n).sort((a, b) => a - b);
  assert.deepEqual(ev('mirolon'), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.deepEqual(ev('gunwaith'), [1, 2, 3, 4, 5, 6, 7]);
  for (const n of [1, 2, 4, 5, 6, 7, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]) assert(ev('magical_forest').includes(n), `magical_forest .${n}`);
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]) assert(ev('lerendor').includes(n), `lerendor .${n}`);
});

test('Text is complete for every id and uses no banned word', () => {
  for (const tree of base.list) {
    const out = compileTree(tree, base.ctx);
    for (const f of tree.focuses) {
      const id = focusId(tree, f.key);
      assert(out.loc[id]?.length > 2, `${id} name`);
      assert(out.loc[`${id}_desc`]?.length > 40, `${id} desc`);
    }
    for (const k of Object.keys(tree.spirits)) {
      const id = `zin_${tree.id}_${k}`;
      assert(out.loc[id] && out.loc[`${id}_desc`], `${id} text`);
    }
    for (const [k, ev] of Object.entries(tree.events)) {
      const id = `${tree.event_namespace ?? `zin_${tree.id}`}.${ev.n}`;
      assert(out.loc[`${id}.t`] && out.loc[`${id}.d`], `event ${k} title and text`);
      ev.options.forEach((o, i) => assert(out.loc[`${id}.${'abcdefghijklmnopqrstuvwxyz'[i]}`], `event ${k} option ${i + 1}`));
    }
    for (const [key, value] of Object.entries(out.loc)) {
      assert(String(value).trim().length > 0, key);
      assert.doesNotMatch(value, /lorem ipsum|TODO|placeholder|xxx/i, key);
      const hits = findBanned(displayText(value), banned);
      assert.deepEqual(hits.map(h => `${h.word} (${h.id})`), [], `banned word in ${key}`);
    }
  }
});

test('Every description is one to three sentences', () => {
  for (const tree of base.list) for (const f of tree.focuses) {
    const n = (f.desc.match(/[.!?](\s|$)/g) ?? []).length;
    assert(n >= 1 && n <= 3, `${tree.id}.${f.key}: ${n} sentences`);
  }
});

test('Only the two hidden branches of Gunwaith use allow_branch, and each repeats its condition in available', () => {
  const g = raw.gunwaith;
  const branch = g.focuses.filter(f => f.allow_branch);
  assert.deepEqual(branch.map(f => f.key).sort(), ['beside_former_foes', 'judgment_remembered']);
  for (const f of branch) for (const c of f.allow_branch) assert(f.available.some(x => JSON.stringify(x) === JSON.stringify(c)), f.key);
  for (const id of ['mirolon', 'lerendor', 'magical_forest']) assert(!raw[id].focuses.some(f => f.allow_branch), id);
});

test('No visible text names Afrit or the Hidden Council except behind the reveal gate', () => {
  for (const tree of base.list) {
    for (const [k, ev] of Object.entries(tree.events)) {
      const text = `${ev.title} ${ev.desc} ${ev.options.map(o => o.name).join(' ')}`;
      if (/Afrit|Hidden Council/.test(text)) assert.equal(ev.text_gate, 'zin_afrit_revealed', `${tree.id} event ${k}`);
    }
    for (const f of tree.focuses) assert.doesNotMatch(`${f.name} ${f.desc}`, /Afrit|Hidden Council|Eindil/, `${tree.id}.${f.key}`);
  }
  assert.equal(raw.magical_forest.events.temple.text_gate, 'zin_afrit_revealed');
});

test('Mirolon never places Dardan or names Eindil, and starts without war', () => {
  const text = JSON.stringify(raw.mirolon);
  assert.doesNotMatch(text, /Eindil|Afrit/);
  for (const w of text.match(/Dardan[^"]{0,20}/g) ?? []) assert.fail(`Mirolon text mentions ${w}`);
  const war = f => JSON.stringify(f.effects ?? []).match(/wargoal|claims_on|annex/);
  assert.deepEqual(raw.mirolon.focuses.filter(war).map(f => f.key), []);
  assert(focus(raw, 'mirolon', 'the_storm_comes').available.some(c => c.at_war_with === realm('Volgan')));
  assert(focus(raw, 'mirolon', 'mirolon_rises_again').available.some(c => c.global_flag === 'zin_volgan_body_destroyed'));
  assert(focus(raw, 'mirolon', 'carry_the_war_south').prerequisite[0][0] === 'rebuild_the_gates');
  assert(raw.mirolon.events.carry_war_south.options[0].effects.some(e => e.if?.then?.some(x => x.wargoal)));
});

test('Gunwaith: no war focus before its story flag, and the Crossing waits for the mechanic', () => {
  const g = raw.gunwaith;
  for (const key of ['girdon_must_bend', 'the_river_mouths', 'first_crown_of_the_west', 'lesser_crowns_bend', 'launch_the_crossing', 'land_as_friends']) {
    const f = focus(raw, 'gunwaith', key), p = JSON.stringify(f);
    assert(/girdon_must_bend|zin_war_of_last_crowns|zin_gathering_dark|zin_west_crossing_ready|peace|at_war/.test(p), key);
  }
  assert(focus(raw, 'gunwaith', 'launch_the_crossing').available.some(c => c.check === 'zin_west_crossing_ready'));
  assert(focus(raw, 'gunwaith', 'convene_the_ford_council').available.some(c => c.check === 'zin_west_council_can_meet'));
  assert(g.focuses.every(f => f.days >= 7 && f.days <= 70));
});

test('Lerendor: the Question opens only by the mechanic trigger, and war focuses wait for flags', () => {
  const q = focus(raw, 'lerendor', 'question_of_the_strait');
  assert(q.available.some(c => c.check === 'zin_leren_question_open'));
  for (const k of ['the_dead_walk', 'withdraw_from_the_treaty', 'tear_up_the_treaty', 'the_far_shore']) assert(focus(raw, 'lerendor', k).available?.length, k);
  assert(raw.lerendor.focuses.every(f => f.days === 7 || f.days % 7 === 0));
  const mech = raw.lerendor.scripted_effects;
  assert(mech.zin_lerendor_compact_lean && mech.zin_lerendor_recruit && mech.zin_lerendor_lay_down_ships);
});

test('Magical Forest: war and route focuses wait for their flags', () => {
  const m = k => focus(raw, 'magical_forest', k);
  assert(m('question_of_refusal').available.some(c => c.check === 'zin_elves_refusal_question_open'));
  assert(m('kindred_marches').available.some(c => c.check === 'zin_elves_march_allowed'));
  assert(m('temple_in_our_woods').available.some(c => c.global_flag === 'zin_afrit_revealed'));
  assert(m('sails_on_rift').available.length && m('house_musters').available.length);
  assert.equal(m('kindred_marches').ai.modifiers.find(x => x.factor === 0).if[0].check, 'zin_rules_is_historical');
});

// ------------------------------------------------------------------------------------------------ negative tests
test('A missing prerequisite fails', async () => {
  const a = await run(d => { focus(d, 'mirolon', 'lake_fisheries').prerequisite = [['no_such_focus']]; });
  assert(codes(a).includes('prerequisite_missing'));
});
test('A duplicate focus key fails', async () => {
  const a = await run(d => { d.mirolon.focuses.push({ ...focus(d, 'mirolon', 'lake_fisheries'), x: 20, y: 14 }); });
  assert(codes(a).includes('duplicate_key'));
});
test('A duplicate position fails', async () => {
  const a = await run(d => { focus(d, 'gunwaith', 'horse_fairs').x = 2; focus(d, 'gunwaith', 'horse_fairs').y = 0; });
  assert(codes(a).includes('duplicate_position'));
});
test('A focus above its prerequisite fails', async () => {
  const a = await run(d => { focus(d, 'lerendor', 'toll_rolls').y = 0; focus(d, 'lerendor', 'toll_rolls').x = 20; });
  assert(codes(a).includes('prerequisite_above'));
});
test('A unknown scripted trigger fails', async () => {
  const a = await run(d => { focus(d, 'magical_forest', 'old_groves').available = [{ check: 'zin_elves_not_a_trigger' }]; });
  assert(codes(a).includes('trigger_unresolved'));
});
test('An unknown scripted effect, event, flag and site fail', async () => {
  const a = await run(d => {
    focus(d, 'gunwaith', 'horse_fairs').effects.push({ call: 'zin_west_not_an_effect' });
    focus(d, 'gunwaith', 'highland_studs').effects.push({ event: 'zin_west.9999' });
    focus(d, 'gunwaith', 'timber_rights').available = [{ global_flag: 'zin_never_set_flag' }];
    focus(d, 'gunwaith', 'market_towns').effects.push({ building: { type: 'bunker', level: 1, where: 'nowhere_site' } });
  });
  for (const c of ['effect_unresolved', 'event_unresolved', 'flag_unresolved', 'site_unresolved']) assert(codes(a).includes(c), c);
});
test('An unknown icon and an unknown picture fail', async () => {
  const a = await run(d => { focus(d, 'mirolon', 'lake_and_coast').icon = 'no_such_icon'; d.mirolon.events.archives.picture = 'no_such_picture'; });
  assert(codes(a).includes('icon_unknown') && codes(a).includes('picture_unknown'));
});
test('An unknown country fails the schema', async () => {
  const a = await run(d => { focus(d, 'mirolon', 'friendship_with_herez').effects = [{ event_for: { country: 'Herezzz', key: 'herez_friendship' } }]; });
  assert(codes(a).includes('schema'));
});
test('An unknown modifier in a spirit fails', async () => {
  const a = await run(d => { d.lerendor.spirits.strait_merchants.modifier = { not_a_real_modifier: 0.5 }; });
  assert(codes(a).includes('modifier_unknown'));
});
test('A spirit key equal to a focus key fails', async () => {
  const a = await run(d => { d.mirolon.spirits.lake_and_coast = d.mirolon.spirits.long_watch; });
  assert(codes(a).includes('key_collision'));
});
test('A days value that is not a multiple of seven fails', async () => {
  const a = await run(d => { focus(d, 'mirolon', 'lake_and_coast').days = 30; });
  assert(codes(a).includes('days_multiple'));
});
test('A modern word is caught by the banned-word scan', () => {
  assert(findBanned('The king buys a factory and a tank.', banned).length >= 2);
  assert(findBanned('The Warden raises a standing division.', banned).length >= 1);
  assert.equal(findBanned('The Warden raises a standing company of spears.', banned).length, 0);
});
test('A text that names Afrit without the gate fails the secret check', async () => {
  const a = await run(d => { focus(d, 'lerendor', 'honour_the_treaty').desc = 'The oath is to the realm, and not to Afrit.'; });
  assert(codes(a).includes('secret_leak'));
});
test('A retired name in a text fails', async () => {
  const a = await run(d => { focus(d, 'gunwaith', 'clan_halls').desc = 'The Einendil moot gathers.'; });
  assert(codes(a).includes('text_superseded'));
});
test('A changing condition in allow_branch fails', async () => {
  const a = await run(d => { focus(d, 'gunwaith', 'horse_fairs').allow_branch = [{ global_flag: 'zin_west_truce_broken' }]; });
  assert(codes(a).includes('allow_branch_changing'));
});
test('A call with a keyword that has no code fails', async () => {
  const a = await run(d => { focus(d, 'gunwaith', 'cross_for_the_old_claims').effects[0] = { call: 'zin_west_set_route', args: { route: 'sideways' } }; });
  assert(codes(a).includes('call_keyword_nocode'));
});
test('A tree-declared effect that reads an undeclared argument fails', async () => {
  const a = await run(d => { d.lerendor.scripted_effects.zin_lerendor_lay_down_ships.args = {}; });
  assert(codes(a).includes('effect_arg_undeclared'));
});
test('More than ten raw blocks fail a major tree', async () => {
  const a = await run(d => { for (let i = 0; i < 2; i++) focus(d, 'lerendor', 'strait_treasury').effects.push({ raw: `add_stability = 0.0${i + 1}` }); });
  assert(codes(a).includes('raw_limit'));
});
test('A tree outside the major size range fails', async () => {
  const a = await run(d => { d.mirolon.focuses = d.mirolon.focuses.slice(0, 20).filter(f => !f.prerequisite); });
  assert(codes(a).includes('tier_range'));
});
test('Two trees may not claim the same country', async () => {
  const a = await run(d => { d.gunwaith.countries = ['Mirolon']; });
  assert(codes(a).includes('coverage_many'));
});

test('The registry file of this slice parses and lists only strings', async () => {
  const reg = JSON.parse(await readFile(new URL('./data/focus_registry_major_b.json', import.meta.url), 'utf8'));
  for (const [k, v] of Object.entries(reg)) if (k !== 'source') { assert(Array.isArray(v), k); assert(v.every(n => typeof n === 'string' && /^[a-z][a-z0-9_.]*$/.test(n)), k); assert.deepEqual(v, [...v].sort(), `${k} sorted`); }
  assert(reg.scripted_effects.includes('zin_mirolon_add_proof') && reg.events.includes('zin_west.20'));
});

test('Compiling twice gives identical files', () => {
  for (const tree of base.list) {
    const a = compileTree(tree, base.ctx), b = compileTree(tree, base.ctx);
    assert.deepEqual([...a.files.keys()], [...b.files.keys()]);
    for (const [rel, text] of a.files) assert.equal(text, b.files.get(rel), rel);
    assert(a.files.has(`common/national_focus/zin_${tree.id}.txt`) && a.files.has(`common/ideas/zin_focus_${tree.id}.txt`) && a.files.has(`events/zin_${tree.id}.txt`));
  }
});
