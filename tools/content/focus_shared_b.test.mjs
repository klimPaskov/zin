// Tests of the five shared focus trees of batch B (docs/design/stage2/focus_shared_b.md): shared_lands_of_the_sun,
// shared_magical_lands, shared_north_lands, shared_tritons_islands and shared_west_lands. They compile the real tree
// files with the focus compiler's check API and the registry additions of data/focus_registry_shared_b.json, assert
// counts, ids, prerequisites, localisation and text rules, and plant one failure for each kind of defect.
//   node --test tools/content/focus_shared_b.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { Staged } from './lib/core.mjs';
import { ZIN, GAME } from './lib/paths.mjs';
import { absolutePositions, expandCopies } from './lib/focus_model.mjs';
import { displayText } from './lib/loc_parse.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { analyseTrees, compileTree } from './modules/focus_compiler.mjs';
import { Registry, exclusiveClosure, gateWarnings } from './checks/focus_checks.mjs';
import { buildSharedBCompanion, tritonsOpinionText, TRITONS_OPINIONS } from './modules/focus_shared_b.mjs';

const json = async f => JSON.parse(await readFile(f, 'utf8'));
const IDS = ['shared_lands_of_the_sun', 'shared_magical_lands', 'shared_north_lands', 'shared_tritons_islands', 'shared_west_lands'];
const EXPECT = {
  shared_lands_of_the_sun: { focuses: 44, spirits: 13, events: 1, countries: 39, opinions: 0 },
  shared_magical_lands: { focuses: 55, spirits: 15, events: 4, countries: 15, opinions: 1 },
  shared_north_lands: { focuses: 55, spirits: 18, events: 6, countries: 22, opinions: 2 },
  shared_tritons_islands: { focuses: 52, spirits: 16, events: 3, countries: 28, opinions: 0 },
  shared_west_lands: { focuses: 65, spirits: 11, events: 3, countries: 14, opinions: 1 },
};
const TREE_DIR = `${ZIN}/docs/design/focus`;
const BASE = {};
for (const id of IDS) BASE[id] = await json(`${TREE_DIR}/${id}.json`);

// The registry: the shared registry plus the shared_b additions (the compiler's loadRegistry reads one file only).
const mergeData = (a, b) => {
  const out = structuredClone(a);
  for (const [k, v] of Object.entries(b)) {
    if (Array.isArray(v)) out[k] = [...new Set([...(out[k] ?? []), ...v])];
    else if (v && typeof v === 'object') out[k] = mergeData(out[k] ?? {}, v);
  }
  return out;
};
const baseRegistry = await json(`${ZIN}/tools/content/data/focus_registry.json`);
const extraRegistry = await json(`${ZIN}/tools/content/data/focus_registry_shared_b.json`);
const registry = (extra = {}) => new Registry(mergeData(mergeData(baseRegistry, extraRegistry), extra));

async function analyse(mutate, opts = {}) {
  const raw = structuredClone(BASE);
  mutate?.(raw);
  const entries = Object.entries(raw).map(([name, data]) => ({ name, data }));
  return analyseTrees(entries, new Staged(), { registry: registry(), expected: [], warn: () => {}, ...opts });
}
const codes = a => [...new Set(a.problems.map(p => p.code))];
const failsWith = async (mutate, code, pattern, opts) => {
  const a = await analyse(mutate, opts);
  const hit = a.problems.filter(p => p.code === code);
  assert(hit.length, `expected ${code}, got ${codes(a).join(', ') || 'no problem'}:\n${a.problems.map(p => p.message).join('\n')}`);
  if (pattern) assert(hit.some(p => pattern.test(p.message)), `no ${code} matches ${pattern}: ${hit.map(p => p.message).join(' | ')}`);
};
const focus = (raw, tree, key) => raw[tree].focuses.find(f => f.key === key);

const clean = await analyse();
const compiled = new Map(clean.list.map(t => [t.id, compileTree(t, clean.ctx)]));
const glossary = await json(`${ZIN}/tools/content/data/glossary.json`);
const rules = compileBanned(await loadRuleSet({ glossary }));
const bannedHits = text => findBanned(displayText(text), rules);
const locText = id => Object.values(compiled.get(id).loc).join('\n');

// Vanilla focus names: the display names of every focus id of the installed game (skipped when the game is absent).
async function vanillaFocusNames() {
  if (!existsSync(`${GAME}/common/national_focus`)) return null;
  const ids = new Set();
  for (const f of await readdir(`${GAME}/common/national_focus`)) {
    if (!f.endsWith('.txt')) continue;
    for (const m of (await readFile(`${GAME}/common/national_focus/${f}`, 'utf8')).matchAll(/^\s*id\s*=\s*([A-Za-z0-9_]+)/gm)) ids.add(m[1]);
  }
  const loc = new Map();
  for (const f of await readdir(`${GAME}/localisation/english`)) {
    if (!f.endsWith('.yml')) continue;
    for (const m of (await readFile(`${GAME}/localisation/english/${f}`, 'utf8')).matchAll(/^ ([A-Za-z0-9_.]+):\d* "(.*)"\s*$/gm)) if (!loc.has(m[1])) loc.set(m[1], m[2]);
  }
  const names = new Set();
  for (const id of ids) if (loc.has(id)) names.add(loc.get(id).toLowerCase());
  return names;
}
const vanilla = await vanillaFocusNames();
const vanillaClashes = (tree) => vanilla ? tree.focuses.filter(f => vanilla.has(f.name.toLowerCase())).map(f => f.key) : [];

// ------------------------------------------------------------------------------------------------ positive
test('The five tree files exist, are named by their id and are shared trees', () => {
  assert.equal(Object.keys(BASE).length, 5);
  for (const id of IDS) { assert.equal(BASE[id].id, id); assert.equal(BASE[id].tier, 'shared'); }
});

test('Counts of focuses, spirits, events, opinion modifiers and countries match the specs', () => {
  for (const id of IDS) {
    const t = BASE[id], e = EXPECT[id];
    assert.equal(t.focuses.length, e.focuses, `${id} focuses`);
    assert.equal(Object.keys(t.spirits ?? {}).length, e.spirits, `${id} spirits`);
    assert.equal(Object.keys(t.events ?? {}).length, e.events, `${id} events`);
    assert.equal(Object.keys(t.opinion_modifiers ?? {}).length, e.opinions, `${id} opinion modifiers`);
    assert.equal(t.countries.length, e.countries, `${id} countries`);
  }
  assert.equal(IDS.reduce((n, id) => n + BASE[id].focuses.length, 0), 271);
});

test('The compiler accepts all five trees with no problem and every tree is within the shared tier range', () => {
  assert.deepEqual(clean.problems.map(p => p.message), []);
  for (const id of IDS) assert(clean.trees.get(id).focuses.length >= 40 && clean.trees.get(id).focuses.length <= 70, id);
});

test('Each tree serves exactly the countries the tiers spec lists, and no country is in two of the five', async () => {
  const md = await readFile(`${ZIN}/docs/specs/05_focus_trees/01_tiers_and_coverage.md`, 'utf8');
  const seen = new Map();
  for (const id of IDS) {
    const line = md.split('\n').find(l => l.includes(`shared tree \`${id}\``));
    assert(line, `${id} is listed in the tiers spec`);
    const listed = line.slice(line.indexOf('):') + 2).trim().replace(/\.$/, '').split(', ');
    assert.deepEqual([...BASE[id].countries].sort(), [...listed].sort(), id);
    for (const c of BASE[id].countries) { assert(!seen.has(c), `${c} is in ${seen.get(c)} and ${id}`); seen.set(c, id); }
  }
  assert.equal(seen.size, 118);
});

test('Focus ids, spirit ids and event ids carry the tree prefix and the file lists them all', () => {
  for (const id of IDS) {
    const text = compiled.get(id).files.get(`common/national_focus/zin_${id}.txt`);
    for (const f of BASE[id].focuses) assert(text.includes(`id = zin_${id}_${f.key}\n`), `${id}.${f.key}`);
    const ideas = compiled.get(id).files.get(`common/ideas/zin_focus_${id}.txt`);
    for (const k of Object.keys(BASE[id].spirits)) assert(ideas.includes(`zin_${id}_${k} = {`), `${id} spirit ${k}`);
    const events = compiled.get(id).files.get(`events/zin_${id}.txt`);
    for (const e of Object.values(BASE[id].events)) assert(events.includes(`id = zin_${id}.${e.n}\n`), `${id} event ${e.n}`);
  }
});

test('Every prerequisite sits above its focus, positions are unique and days are weeks within 1 to 20', () => {
  for (const id of IDS) {
    const t = clean.trees.get(id), { pos } = absolutePositions(t), seen = new Set();
    for (const f of t.focuses) {
      const p = pos.get(f.key), k = `${p.x},${p.y}`;
      assert(!seen.has(k), `${id} ${f.key} shares ${k}`); seen.add(k);
      for (const g of f.prerequisite ?? []) for (const pre of g) assert(pos.get(pre).y < p.y, `${id} ${f.key} <- ${pre}`);
      assert.equal(f.days % 7, 0, `${id} ${f.key} days`);
      assert(f.days >= 7 && f.days <= 140, `${id} ${f.key} days range`);
    }
  }
});

test('Exclusive focuses are symmetric and the specs\' exclusions are present', () => {
  const closure = id => exclusiveClosure(clean.trees.get(id));
  const sun = closure('shared_lands_of_the_sun');
  assert.deepEqual([...sun.get('welcome_the_healing_houses')], ['a_courteous_distance']);
  assert.deepEqual([...sun.get('the_sanctuary_endures')], ['free_steadings_of_the_sun']);
  assert.deepEqual([...sun.get('our_own_sun')], ['a_loyal_realm']);
  const mag = closure('shared_magical_lands');
  assert.deepEqual([...mag.get('the_open_houses')], ['the_old_houses']);
  assert.deepEqual([...mag.get('toll_the_pilgrims')], ['keep_the_roads_open']);
  assert.deepEqual([...closure('shared_north_lands').get('look_to_parim')].sort(), ['look_to_sonargur', 'our_own_counsel']);
  assert.deepEqual([...closure('shared_north_lands').get('keep_faith_with_parim')], ['stand_apart_with_sonargur']);
  assert.deepEqual([...closure('shared_tritons_islands').get('the_free_coves')].sort(), ['join_the_pupor_charter', 'keep_to_our_own_waters']);
  assert.deepEqual([...closure('shared_tritons_islands').get('sail_with_the_crossing')], ['the_isle_keeps_apart']);
  assert.deepEqual([...closure('shared_west_lands').get('take_parims_coin')].sort(), ['look_to_our_own', 'nurse_the_grudge']);
  for (const id of IDS) {
    const text = compiled.get(id).files.get(`common/national_focus/zin_${id}.txt`);
    const withExclusive = [...closure(id)].filter(([, s]) => s.size).length;
    assert.equal((text.match(/mutually_exclusive = \{/g) ?? []).length, withExclusive, id);
  }
});

test('Localisation is complete: every focus, spirit, event, option and opinion modifier has text', () => {
  for (const id of IDS) {
    const loc = compiled.get(id).loc, t = BASE[id];
    for (const f of t.focuses) {
      assert(loc[`zin_${id}_${f.key}`]?.trim(), `${id}.${f.key} name`);
      assert(loc[`zin_${id}_${f.key}_desc`]?.trim(), `${id}.${f.key} desc`);
    }
    for (const k of Object.keys(t.spirits)) { assert(loc[`zin_${id}_${k}`]?.trim(), `${id} spirit ${k}`); assert(loc[`zin_${id}_${k}_desc`]?.trim(), `${id} spirit ${k} desc`); }
    for (const e of Object.values(t.events)) {
      assert(loc[`zin_${id}.${e.n}.t`]?.trim() && loc[`zin_${id}.${e.n}.d`]?.trim(), `${id} event ${e.n}`);
      e.options.forEach((o, i) => assert(loc[`zin_${id}.${e.n}.${'abcdef'[i]}`]?.trim(), `${id} event ${e.n} option ${i}`));
    }
    for (const k of Object.keys(t.opinion_modifiers ?? {})) assert(loc[`zin_${id}_${k}`]?.trim(), `${id} opinion ${k}`);
    // A localization key named inside a scripted effect (autonomy reasons) must exist.
    for (const [rel, body] of compiled.get(id).files) {
      if (!rel.startsWith('common/scripted_effects/')) continue;
      for (const m of body.matchAll(/localization = ([A-Za-z0-9_]+)/g)) assert(loc[m[1]]?.trim(), `${id}: ${m[1]}`);
    }
  }
});

test('Descriptions are one to three sentences and short; names are not empty', () => {
  for (const id of IDS) for (const f of BASE[id].focuses) {
    const n = f.desc.split(/(?<=[.!?])\s+(?=[A-Z\[])/).length;
    assert(n >= 1 && n <= 3, `${id}.${f.key} has ${n} sentences`);
    assert(f.desc.length <= 300 && f.name.length >= 3, `${id}.${f.key} length`);
  }
});

test('No player text holds a banned modern word, a glossary-forbidden word or a real-world name', () => {
  for (const id of IDS) for (const [k, v] of Object.entries(compiled.get(id).loc)) assert.deepEqual(bannedHits(v), [], `${id} ${k}`);
});

test('No focus, spirit or event name equals a focus name of the installed game', { skip: vanilla === null }, () => {
  for (const id of IDS) assert.deepEqual(vanillaClashes(clean.trees.get(id)), [], id);
  for (const id of IDS) for (const s of Object.values(BASE[id].spirits)) assert(!vanilla.has(s.name.toLowerCase()), `${id} spirit ${s.name}`);
});

test('The secrets stay hidden: no Afrit, Hidden Council, Ilvane or Eindil in any text; the Man from the Ice only in the West', () => {
  for (const id of IDS) {
    const text = locText(id);
    assert.doesNotMatch(text, /Afrit|Hidden Council|Ilvane|Eindil|Einendil|Kusven/i, id);
    if (id !== 'shared_west_lands') assert.doesNotMatch(text, /Man from the Ice|the Heir|war-king/i, id);
  }
  assert.match(locText('shared_west_lands'), /Man from the Ice/);
  assert.match(locText('shared_north_lands'), /Parim/);
  assert.doesNotMatch(locText('shared_north_lands'), /Aurevan/);
});

test('The peaceful start: no focus reward creates a war goal, a claim, a core, a war or a puppet', () => {
  for (const id of IDS) {
    const text = compiled.get(id).files.get(`common/national_focus/zin_${id}.txt`);
    assert.doesNotMatch(text, /create_wargoal|declare_war|add_claim_by|add_core_of|start_civil_war|annex_country|puppet =|add_to_war/, id);
  }
});

test('Lands of the Sun: S3 never names Lorien, and no text states a tie between Gala and the Sunhot elves', () => {
  const t = BASE.shared_lands_of_the_sun, loc = compiled.get('shared_lands_of_the_sun').loc;
  for (const f of t.focuses.filter(x => x.module === 'S3')) assert.doesNotMatch(`${loc[`zin_shared_lands_of_the_sun_${f.key}`]} ${loc[`zin_shared_lands_of_the_sun_${f.key}_desc`]}`, /Lorien|Gala|court/i, f.key);
  assert.doesNotMatch(locText('shared_lands_of_the_sun'), /\bkin\b|kindred|kinsfolk|kinship|vassal|subjects of|lords of/i);
  assert.equal(t.focuses.filter(f => f.module === 'S6').length, 2);
  assert.equal(focus(BASE, 'shared_lands_of_the_sun', 'mourning_for_lorien').module, 'S6m');
});

test('Branch heads: allow_branch carries the spec\'s condition and available repeats every refreshed one', () => {
  const head = (id, key) => focus(BASE, id, key);
  const sun = 'shared_lands_of_the_sun';
  assert.deepEqual(head(sun, 'a_seat_at_noon').allow_branch, [{ people: 'sun_elves' }]);
  assert.deepEqual(head(sun, 'the_quiet_woods').allow_branch, [{ people: 'elves' }]);
  assert.deepEqual(head(sun, 'men_under_the_sun').allow_branch, [{ people: 'men' }]);
  assert.deepEqual(head(sun, 'harbours_on_the_sea_of_gods').allow_branch, [{ check: 'zin_shared_has_coast' }]);
  assert.deepEqual(head(sun, 'harbours_on_the_sea_of_gods').available, [{ check: 'zin_shared_has_coast' }]);
  assert.deepEqual(head('shared_west_lands', 'the_call_to_cross_heard').allow_branch, [{ global_flag: 'zin_west_route_crossing' }]);
  assert.deepEqual(head('shared_west_lands', 'the_call_to_cross_heard').available, [{ global_flag: 'zin_west_route_crossing' }]);
  assert.deepEqual(head('shared_tritons_islands', 'the_southern_ship').allow_branch, [{ check: 'zin_tritons_ship_has_sailed' }]);
  assert.deepEqual(head('shared_north_lands', 'under_the_leren_banner').allow_branch, [{ subject_of: 'Lerendor' }]);
  for (const id of IDS) for (const f of BASE[id].focuses) for (const c of f.allow_branch ?? []) {
    const [k] = Object.keys(c);
    if (['ideology', 'is_subject', 'subject_of'].includes(k)) assert(f.available.some(x => JSON.stringify(x) === JSON.stringify(c)), `${id}.${f.key} repeats ${k}`);
  }
});

test('Module tags: every module of the Sun and Magical libraries has one root (M1 has two) and a Sun module copies without problems', () => {
  for (const [id, prefix] of [['shared_lands_of_the_sun', 'S'], ['shared_magical_lands', 'M']]) {
    const tags = [...new Set(BASE[id].focuses.map(f => f.module).filter(Boolean))];
    assert(tags.length >= 11, `${id} has ${tags.length} module tags`);
    for (const tag of tags) assert(tag.startsWith(prefix), tag);
    for (const tag of tags) {
      const mod = BASE[id].focuses.filter(f => f.module === tag), keys = new Set(mod.map(f => f.key));
      const roots = mod.filter(f => !(f.prerequisite ?? []).flat().some(k => keys.has(k)));
      // M1 of the Magical Lands has two heads (the elders and the young houses), so the copy block cannot take it whole.
      assert.equal(roots.length, id === 'shared_magical_lands' && tag === 'M1' ? 2 : 1, `${id} ${tag} roots`);
    }
  }
  const sun = BASE.shared_lands_of_the_sun;
  const copier = { id: 'regional_copy_test', tier: 'regional', countries: ['Poyang'], focuses: [{ key: 'the_seat', name: 'The Seat', desc: 'A seat.', icon: 'crown_gold', x: 0, y: 0, days: 35 }], copy: [{ from: sun.id, module: 'S7', root_at: [25, 1], root_prerequisite: [['the_seat']] }] };
  const { trees, problems } = expandCopies([sun, copier]);
  assert.deepEqual(problems, []);
  const eff = trees.get('regional_copy_test');
  assert.equal(eff.focuses.length, 1 + 4);
  assert.deepEqual(eff.focuses.find(f => f.key === 'priests_from_afar').prerequisite, [['the_seat']]);
  assert.equal(eff.focuses.find(f => f.key === 'priests_from_afar').x, 25);
  assert(eff.spirits.healing_houses);
});

test('Events: pictures are catalog keys without a gate, every compiled event is timed out in 30 days and fired by effects', () => {
  for (const id of IDS) {
    assert.deepEqual(gateWarnings(clean.trees.get(id), clean.ctx), [], id);
    const text = compiled.get(id).files.get(`events/zin_${id}.txt`);
    const n = (text.match(/^country_event = \{/gm) ?? []).length;
    assert.equal(n, EXPECT[id].events, id);
    assert.equal((text.match(/timeout_days = 30/g) ?? []).length, n, id);
    assert.equal((text.match(/is_triggered_only = yes/g) ?? []).length, n, id);
    assert.doesNotMatch(text, /mean_time_to_happen|trigger = \{/, id);
  }
  assert.match(compiled.get('shared_west_lands').files.get('common/scripted_effects/zin_shared_west_lands.txt'), /country_event = zin_shared_west_lands\.1/);
  assert.match(compiled.get('shared_tritons_islands').files.get('common/scripted_effects/zin_shared_tritons_islands.txt'), /country_event = zin_shared_tritons_islands\.2/);
});

test('The stable helper names the tier B trees call are declared', () => {
  const eff = id => Object.keys(BASE[id].scripted_effects ?? {}), trg = id => Object.keys(BASE[id].scripted_triggers ?? {});
  for (const n of ['zin_shared_lands_of_the_sun_join_league', 'zin_shared_lands_of_the_sun_islands_goodwill']) assert(eff('shared_lands_of_the_sun').includes(n), n);
  for (const n of ['zin_north_ask_compact_seat', 'zin_north_ask_parim_shield']) assert(eff('shared_north_lands').includes(n), n);
  assert(trg('shared_north_lands').includes('zin_shared_north_in_compact'));
  for (const n of ['zin_tritons_add_piracy', 'zin_tritons_set_side', 'zin_tritons_found_charter', 'zin_tritons_join_charter', 'zin_tritons_offer_banks_mediation', 'zin_tritons_make_banks_accord', 'zin_tritons_join_crossing']) assert(eff('shared_tritons_islands').includes(n), n);
  assert(eff('shared_magical_lands').includes('zin_shared_magical_lands_opinion_both_ways'));
});

test('Compiling twice gives identical bytes', async () => {
  const again = await analyse();
  for (const t of again.list) {
    const a = compileTree(t, again.ctx), b = compiled.get(t.id);
    assert.deepEqual([...a.files.keys()], [...b.files.keys()]);
    for (const [rel, text] of a.files) assert.equal(text, b.files.get(rel), rel);
    assert.deepEqual(a.loc, b.loc);
  }
});

// ------------------------------------------------------------------------------------------------ negative
test('Without the registry additions the external names are unresolved (the additions are needed)', async () => {
  const entries = Object.entries(structuredClone(BASE)).map(([name, data]) => ({ name, data }));
  const a = await analyseTrees(entries, new Staged(), { registry: new Registry(baseRegistry), expected: [], warn: () => {} });
  assert(a.problems.some(p => p.code === 'effect_unresolved'));
  assert(a.problems.some(p => p.code === 'trigger_unresolved'));
  assert(a.problems.some(p => p.code === 'flag_unresolved'));
});

test('Negative: an unknown trigger, an unknown effect, an unknown flag and an unknown event fail', async () => {
  await failsWith(r => focus(r, 'shared_west_lands', 'the_old_grudge').available = [{ check: 'zin_west_not_a_trigger' }], 'trigger_unresolved', /zin_west_not_a_trigger/);
  await failsWith(r => focus(r, 'shared_west_lands', 'the_old_grudge').effects.push({ call: 'zin_west_not_an_effect' }), 'effect_unresolved', /zin_west_not_an_effect/);
  await failsWith(r => focus(r, 'shared_north_lands', 'our_own_counsel').available = [{ global_flag: 'zin_never_set_anywhere' }], 'flag_unresolved', /zin_never_set_anywhere/);
  await failsWith(r => focus(r, 'shared_lands_of_the_sun', 'sun_terraces').effects.push({ event: 'no_such_event' }), 'event_unknown', /no_such_event/);
});

test('Negative: duplicate keys, missing prerequisites, misplaced focuses and bad days fail', async () => {
  await failsWith(r => r.shared_north_lands.focuses.push({ ...focus(r, 'shared_north_lands', 'timber_rights'), x: 30, y: 9 }), 'duplicate_key', /timber_rights/);
  await failsWith(r => focus(r, 'shared_north_lands', 'timber_rights').prerequisite = [['no_such_focus']], 'prerequisite_missing', /no_such_focus/);
  await failsWith(r => { focus(r, 'shared_north_lands', 'timber_rights').y = 0; }, 'prerequisite_above');
  await failsWith(r => { Object.assign(focus(r, 'shared_north_lands', 'timber_rights'), { x: 8, y: 2 }); }, 'duplicate_position');
  await failsWith(r => { focus(r, 'shared_north_lands', 'timber_rights').days = 36; }, 'days_multiple');
  await failsWith(r => { focus(r, 'shared_north_lands', 'timber_rights').prerequisite = [['a_prosperous_crown']]; }, 'prerequisite_above');
});

test('Negative: an unknown icon, an unknown picture and an unknown modifier fail', async () => {
  await failsWith(r => { focus(r, 'shared_west_lands', 'the_old_grudge').icon = 'no_such_icon'; }, 'icon_unknown', /no_such_icon/);
  await failsWith(r => { r.shared_west_lands.events.council_league_offer.picture = 'no_such_picture'; }, 'picture_unknown');
  await failsWith(r => { r.shared_west_lands.spirits.horse_fair.modifier = { not_a_modifier_of_the_game: 1 }; }, 'modifier_unknown', /not_a_modifier_of_the_game/);
});

test('Negative: a spirit key equal to a focus key collides, and a spirit that is not defined is refused', async () => {
  await failsWith(r => { r.shared_north_lands.spirits.grain_and_fish = r.shared_north_lands.spirits.grain_and_fish_spirit; }, 'key_collision', /grain_and_fish/);
  await failsWith(r => { focus(r, 'shared_north_lands', 'grain_and_fish').effects = [{ add_spirit: 'no_such_spirit' }]; }, 'spirit_unknown');
});

test('Negative: allow_branch rules of decision E4', async () => {
  await failsWith(r => { focus(r, 'shared_north_lands', 'boats_and_nets').allow_branch = [{ flag: 'zin_afrit_suspicious' }]; }, 'allow_branch_changing');
  await failsWith(r => { delete focus(r, 'shared_north_lands', 'the_freeholders_moot').available; }, 'allow_branch_not_repeated');
  await failsWith(r => { focus(r, 'shared_lands_of_the_sun', 'a_seat_at_noon').allow_branch = [{ at_war: true }]; }, 'allow_branch_changing');
});

test('Negative: calls need declared arguments and codes', async () => {
  await failsWith(r => focus(r, 'shared_tritons_islands', 'the_free_coves').effects.push({ call: 'zin_tritons_set_side', args: { side: 'wild' } }), 'call_keyword_nocode', /wild/);
  await failsWith(r => focus(r, 'shared_tritons_islands', 'the_free_coves').effects.push({ call: 'zin_tritons_add_piracy' }), 'call_arg_missing', /value/);
  await failsWith(r => focus(r, 'shared_tritons_islands', 'the_free_coves').effects.push({ call: 'zin_tritons_add_piracy', args: { value: 1, extra: 2 } }), 'call_arg_unknown', /extra/);
});

test('Negative: retired names and a leak of the secret fail', async () => {
  await failsWith(r => { focus(r, 'shared_north_lands', 'a_watchful_crown').desc = 'The Hierarch watches.'; }, 'retired_name', /Hierarch/);
  await failsWith(r => { focus(r, 'shared_north_lands', 'a_watchful_crown').desc = 'Afrit watches the ledgers.'; }, 'secret_leak', /Afrit/);
  await failsWith(r => { focus(r, 'shared_north_lands', 'a_watchful_crown').desc = 'Das Zeichen Ж.'; }, 'text_charset');
  await failsWith(r => { focus(r, 'shared_north_lands', 'a_watchful_crown').desc = ' '; }, 'text_empty');
});

test('Negative: the banned-word matcher and the vanilla-name check catch planted defects', () => {
  assert(bannedHits('A factory for steel and a tank.').length >= 3);
  assert(bannedHits('The president of the republic.').length >= 2);
  assert.deepEqual(bannedHits('A hall of tall elves and a quiet road.'), []);
  if (vanilla) {
    const planted = { focuses: [{ key: 'x', name: [...vanilla].find(n => /^[a-z ]{8,24}$/.test(n)) }] };
    assert.deepEqual(vanillaClashes(planted), ['x']);
  }
});

test('Negative: a bad country, a duplicate trigger across trees and an unknown copy module fail', async () => {
  const a = await analyse(r => { r.shared_west_lands.countries.push('Atlantis'); });
  assert(a.problems.some(p => p.code === 'schema' && /Atlantis/.test(p.message)));
  await failsWith(r => { r.shared_west_lands.scripted_triggers.zin_shared_north_in_compact = { conditions: [{ flag: 'zin_afrit_suspicious' }] }; }, 'name_prefix');
  await failsWith(r => { r.shared_west_lands.name_prefixes = ['zin_north_']; r.shared_west_lands.scripted_triggers.zin_north_can_ask_compact = { conditions: [] }; }, 'collision_tree', /zin_north_can_ask_compact/);
  const { problems } = expandCopies([BASE.shared_lands_of_the_sun, { id: 'regional_x', tier: 'regional', countries: ['Poyang'], focuses: [{ key: 'a', name: 'A', desc: 'A.', icon: 'crown_gold', x: 0, y: 0, days: 35 }], copy: [{ from: 'shared_lands_of_the_sun', module: 'S99', root_at: [1, 1] }] }]);
  assert.equal(problems.length, 1);
  assert.match(problems[0].message, /no focus tagged module S99/);
});

test('Negative: a country in two trees is reported by the coverage check', async () => {
  const a = await analyse(r => { r.shared_west_lands.countries.push('Belg'); });
  assert(a.problems.some(p => p.code === 'coverage_many' && /Belg/.test(p.message)));
});

test('The companion module writes the two Tritons opinion modifiers whose ids the tier B island trees use', async () => {
  const staged = new Staged();
  const total = await buildSharedBCompanion(staged);
  assert.deepEqual(total, { opinionModifiers: 2, files: 2 });
  const text = staged.files.get('common/opinion_modifiers/zin_tritons_pupor.txt').toString('utf8');
  assert.match(text, /zin_tritons_banks_quarrel = \{\n\t\tvalue = -20\n\t\tdecay = 0\.5\n\t\}/);
  assert.match(text, /zin_tritons_mediation_refused = \{\n\t\tvalue = -10\n\t\tdecay = 1\n\t\}/);
  assert.equal(text, tritonsOpinionText());
  const loc = staged.files.get('localisation/english/zin_tritons_pupor_l_english.yml').toString('utf8');
  assert(loc.startsWith('﻿l_english:'));
  for (const id of Object.keys(TRITONS_OPINIONS)) assert.match(loc, new RegExp(` ${id}:0 `));
  // The tree's effects use exactly those ids, and the registry lists them for a build without the companion.
  const effects = compiled.get('shared_tritons_islands').files.get('common/scripted_effects/zin_shared_tritons_islands.txt');
  assert.match(effects, /modifier = zin_tritons_banks_quarrel/);
  assert.match(effects, /modifier = zin_tritons_mediation_refused/);
  for (const id of Object.keys(TRITONS_OPINIONS)) assert(extraRegistry.opinion_modifiers.includes(id), id);
});

test('Negative: an opinion modifier that nobody writes is unresolved', async () => {
  await failsWith(r => focus(r, 'shared_tritons_islands', 'the_free_coves').effects.push({ opinion: { target: 'Nondondor', modifier: 'zin_tritons_not_written' } }), 'opinion_unresolved', /zin_tritons_not_written/);
});
