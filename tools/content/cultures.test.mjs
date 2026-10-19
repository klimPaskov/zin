// Tests for the culture and faith layer (modules/cultures.mjs, lib/cultures_model.mjs, checks/cultures_check.mjs):
// docs/specs/02_lore/08_world_in_game.md sections 1, 6, 13 and 14. The module runs on the real data into a fresh staged
// set (no full build needed). Negative tests plant one mistake in a copy of the model and expect the check that owns it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged, assertModifiers } from './lib/core.mjs';
import { ZIN } from './lib/paths.mjs';
import { loadBanned, compileBanned } from './lib/banned.mjs';
import { MONTHS } from './lib/calendar.mjs';
import * as C from './modules/cultures.mjs';
import { runCultureChecks, findDuplicateJsonKeys, loadGeographyIds, SPEC_COUNTS } from './checks/cultures_check.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const model = await C.loadCultureModel();
const geography = await loadGeographyIds();
const banned = compileBanned(await loadBanned());
const staged = new Staged();
const built = await C.buildCultures(staged, { countries, geography, quiet: true });
const text = rel => staged.files.get(rel).toString('utf8');
const check = (m, extra = {}) => runCultureChecks(m, { countries, geography, banned, ...extra });
const codes = r => new Set(r.errors.map(e => e.code));
const mutated = fn => { const m = structuredClone(model); fn(m); return m; };
const byName = name => countries.find(c => c.name === name);
const startupOf = name => built.startup.split('\n').find(l => l.startsWith(`\t\t\t${byName(name).tag} = `));
const defs = file => [...text(file).matchAll(/^([a-z0-9_]+) = \{$/gm)].map(m => m[1]);

// ----------------------------------------------------------------------------------------------------- the build
test('The module stages the ten files and counts what the task asks for', () => {
  assert.deepEqual([...staged.files.keys()].sort(), [
    'common/ideas/zin_cultures.txt', 'common/scripted_effects/zin_cultures.txt', 'common/scripted_effects/zin_faiths.txt',
    'common/scripted_localisation/zin_cultures.txt', 'common/scripted_triggers/zin_cultures.txt', 'common/scripted_triggers/zin_faiths.txt',
    'docs/design/world/culture_coverage.json', 'docs/design/world/culture_mappings.json', 'docs/design/world/state_cultures.json',
    'localisation/english/zin_cultures_l_english.yml',
  ]);
  assert.equal(built.counts.countries, 305);
  assert.equal(built.counts.cultures, 53);
  assert.equal(built.counts.cultureIdeas, 106, '53 culture ideas and 53 second-culture ideas');
  assert.equal(built.counts.faithSpirits, 38, '39 faith rows, the open one has no spirit');
  assert.equal(built.counts.festivals, Object.values(model.game.faiths).reduce((n, f) => n + f.festivals.length, 0));
  assert(built.counts.triggers > 400);
  assert.equal(built.counts.scriptedEffects, 2 + Object.values(model.game.faiths).filter(f => f.festivals.length).length);
});

test('Every culture has a culture idea, every faith a spirit, in the right category', () => {
  const ideas = text('common/ideas/zin_cultures.txt');
  const countrySection = ideas.slice(ideas.indexOf('\tcountry = {'), ideas.indexOf('\thidden_ideas = {'));
  const hiddenSection = ideas.slice(ideas.indexOf('\thidden_ideas = {'));
  for (const k of model.cultureKeys) {
    assert(ideas.includes(`\t\tzin_culture_${k} = {`), `culture idea ${k}`);
    assert(hiddenSection.includes(`\t\tzin_culture2_${k} = {`), `second-culture idea ${k} is hidden`);
    const tier = model.world.cultures[k].tier;
    assert.equal(countrySection.includes(`\t\tzin_culture_${k} = {`), tier <= 2, `${k} (tier ${tier}) sits in the visible section only for tiers 1 and 2`);
  }
  for (const k of model.faithKeys) assert.equal(ideas.includes(`\t\tzin_faith_${k} = {`), k !== 'none', `faith spirit ${k}`);
  assert.equal([...ideas.matchAll(/allowed = \{ always = no \}/g)].length, 106 + 38);
  assert.equal([...ideas.matchAll(/removal_cost = -1/g)].length, 106 + 38);
  assert.equal([...ideas.matchAll(/allowed_civil_war = \{ always = yes \}/g)].length, 106 + 38, 'spirits survive a civil war');
});

test('Culture modifiers are valid, small, distinct and within the bounds of the data file', async () => {
  const keys = model.cultureKeys, seen = new Map();
  for (const k of keys) {
    const mods = model.game.cultures[k].modifier, n = Object.keys(mods).length;
    assert(n >= 3 && n <= 5, `${k} has ${n} modifiers`);
    await assertModifiers(`culture ${k}`, mods);
    for (const [m, v] of Object.entries(mods)) {
      const [lo, hi] = model.game.bounds.modifiers[m] ?? model.game.bounds.default;
      assert(v >= lo && v <= hi && v !== 0, `${k}: ${m} = ${v} within ${lo}..${hi}`);
    }
    const sig = JSON.stringify(Object.entries(mods).sort());
    assert(!seen.has(sig), `${k} repeats the modifiers of ${seen.get(sig)}`); seen.set(sig, k);
  }
  let worst = 0;
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    const a = new Set(Object.keys(model.game.cultures[keys[i]].modifier)), b = new Set(Object.keys(model.game.cultures[keys[j]].modifier));
    worst = Math.max(worst, [...a].filter(x => b.has(x)).length / new Set([...a, ...b]).size);
  }
  assert(worst <= model.game.limits.max_pair_similarity + 1e-9, `no two cultures share more than ${model.game.limits.max_pair_similarity} of their modifier keys (worst ${worst})`);
  assert(new Set(keys.flatMap(k => Object.keys(model.game.cultures[k].modifier))).size >= 40, 'at least 40 different modifier keys in use');
});

test('A second culture counts at half strength and loses the integer skill level', () => {
  const gala = C.secondaryModifiers(model, 'gala_court');
  assert.equal(gala.army_leader_start_level, undefined);
  assert.equal(gala.special_project_speed_factor, 0.075);
  assert.equal(C.secondaryModifiers(model, 'lake_aenoran').research_speed_factor, 0.025);
  assert.deepEqual(C.scaleModifiers({ a: 0.001 }, 0.1), {}, 'values that round to zero are dropped');
});

test('The startup lines carry the culture, the second culture, the language and the faith the way the people do', () => {
  assert.equal(built.startup.split('\n').length, 305);
  assert.equal(startupOf('Aenor'), `\t\t\t${byName('Aenor').tag} = { add_ideas = { zin_culture_lake_aenoran zin_faith_deliverer } set_country_flag = zin_culture_lake_aenoran set_variable = { zin_culture_id = 1 } set_country_flag = zin_language_aenoran set_variable = { zin_language_id = 1 } set_country_flag = zin_faith_deliverer set_variable = { zin_faith_id = 1 } }`);
  const kilinti = startupOf('Kilinti');
  assert(kilinti.includes('zin_culture_kilinti_ents') && kilinti.includes('zin_culture2_selen_ranger') && kilinti.includes('set_country_flag = zin_culture2_selen_ranger'));
  const zol = startupOf('Zol');
  assert(!zol.includes('zin_language_'), "Zol's dead have no language");
  assert(zol.includes('set_country_flag = zin_faith_none') && !zol.includes('add_ideas = { zin_culture_zols_dead zin_faith'), "Zol's dead have no faith spirit");
  const ideas = text('common/ideas/zin_cultures.txt');
  const used = new Set([...built.startup.matchAll(/add_ideas = \{ ([^}]*) \}/g)].flatMap(m => m[1].split(' ')));
  for (const id of used) assert(ideas.includes(`\t\t${id} = {`), `${id} is defined`);
  assert.equal(built.startup.split('\n').filter(l => l.includes('zin_culture2_')).length, 11, 'eleven countries carry a second culture');
});

test('The trigger family reads flags and variables, never a list of tags', () => {
  const cultures = text('common/scripted_triggers/zin_cultures.txt'), faiths = text('common/scripted_triggers/zin_faiths.txt');
  const names = new Set(defs('common/scripted_triggers/zin_cultures.txt'));
  for (const k of model.cultureKeys) for (const t of [`zin_is_culture_${k}`, `zin_includes_culture_${k}`, `zin_state_is_culture_${k}`, `zin_state_includes_culture_${k}`]) assert(names.has(t), t);
  for (const id of model.languageKeys) assert(names.has(`zin_is_language_${id}`), id);
  for (const k of model.faithKeys) { assert(names.has(`zin_is_faith_${k}`), k); assert(names.has(`zin_state_is_faith_${k}`), k); }
  assert.match(cultures, /zin_is_culture_lake_aenoran = \{\n\thas_country_flag = zin_culture_lake_aenoran\n\}/);
  assert.match(cultures, /zin_state_is_culture_lake_aenoran = \{\n\tcheck_variable = \{ zin_state_culture = 1 \}\n\}/);
  for (const file of [cultures, faiths, text('common/scripted_effects/zin_cultures.txt'), text('common/scripted_effects/zin_faiths.txt')]) assert.doesNotMatch(file, /\btag = |original_tag|\bTAG\b/, 'no list of tags');
  assert.match(cultures, /zin_state_culture_same_kin_as_owner[\s\S]*check_variable = \{ zin_state_culture = 4 \}[\s\S]*zin_culture_id = 1/, 'the Wall-Folk and Lake Aenorans are one culture');
  assert.equal(new Set(names).size, names.size, 'no trigger is defined twice');
  const all = new Set([...names, ...defs('common/scripted_triggers/zin_faiths.txt')]);
  assert.equal(all.size, names.size + defs('common/scripted_triggers/zin_faiths.txt').length, 'no name repeats across the two trigger files');
});

test('Faith hooks: one festival effect per faith with festivals, one trigger per festival, holy-site triggers', () => {
  const effects = new Set(defs('common/scripted_effects/zin_faiths.txt')), triggers = new Set(defs('common/scripted_triggers/zin_faiths.txt'));
  for (const [k, f] of Object.entries(model.game.faiths)) {
    assert.equal(effects.has(`zin_faith_${k}_hold_festival`), f.festivals.length > 0, `${k} festival effect`);
    assert.equal(triggers.has(`zin_faith_${k}_festival_active`), f.festivals.length > 0, `${k} festival trigger`);
    for (const fest of f.festivals) assert(triggers.has(`zin_faith_${k}_${fest.id}_active`), `${k} ${fest.id}`);
    assert.equal(triggers.has(`zin_state_has_holy_site_${k}`), f.holy_sites.length > 0, `${k} holy-site trigger`);
  }
  const fx = text('common/scripted_effects/zin_faiths.txt');
  assert.match(fx, /zin_faith_deliverer_hold_festival = \{[\s\S]*flag = zin_festival_deliverer_jubilee days = 14/);
  assert.doesNotMatch(fx, /country_event|state_event|news_event/, 'the hooks fire no event');
  assert.match(text('common/scripted_effects/zin_cultures.txt'), /zin_culture_set = \{\n\tzin_culture_clear = yes/);
});

test('Scripted localisation names the culture and faith of a country and of a state, and every key exists', () => {
  const loc = text('common/scripted_localisation/zin_cultures.txt'), yml = text('localisation/english/zin_cultures_l_english.yml');
  for (const n of ['zin_culture_name', 'zin_culture_adjective', 'zin_culture_text', 'zin_culture2_name', 'zin_faith_name', 'zin_faith_text', 'zin_language_name', 'zin_state_culture_name', 'zin_state_culture_adjective', 'zin_state_culture2_name', 'zin_state_faith_name'])
    assert(loc.includes(`name = ${n}\n`), n);
  const keys = new Set([...yml.matchAll(/^ ([A-Za-z0-9_.'-]+):0 "/gm)].map(m => m[1]));
  for (const m of loc.matchAll(/localization_key = ([a-z0-9_]+)/g)) assert(keys.has(m[1]), `loc key ${m[1]}`);
  assert.equal([...loc.matchAll(/^defined_text = \{/gm)].length, 11);
});

test('The localisation: UTF-8 with BOM, an entry for every idea, no secret, no banned error, Windows-1252 only', () => {
  const buf = staged.files.get('localisation/english/zin_cultures_l_english.yml');
  assert.deepEqual([...buf.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
  const yml = buf.toString('utf8');
  assert(yml.startsWith('\ufeffl_english:\n'));
  const entries = C.cultureLocEntries(model);
  for (const k of model.cultureKeys) for (const key of [`zin_culture_${k}`, `zin_culture_${k}_desc`, `zin_culture2_${k}`, `zin_culture2_${k}_desc`, `zin_cname_${k}`, `zin_ctext_${k}`]) assert(entries[key] && yml.includes(` ${key}:0 "`), key);
  for (const k of model.faithKeys) assert(entries[`zin_fname_${k}`], k);
  for (const [k, f] of Object.entries(model.game.faiths)) if (f.spirit_desc) assert(entries[`zin_faith_${k}`] && entries[`zin_faith_${k}_desc`], k);
  assert.doesNotMatch(yml, /Afrit|Eindil|Einendil|Hidden Council|Edvoid|birth roll|hearth-name/i, 'no secret before the reveals');
  assert.doesNotMatch(yml, /\[(?:E|P|O|W|secret)[ ,\]]/, 'no bible label');
  assert.equal(C.faithName(model, 'deliverer'), 'The Faith of the Deliverer');
  assert.doesNotMatch(entries.zin_faith_deliverer_desc + entries.zin_ftext_deliverer + entries.zin_ctext_zilin_pilgrims, /rolls|Council|secret/i, 'the public Deliverer text keeps the secret');
  assert.equal(entries.zin_cname_zols_dead, "Zol's Dead");
  assert.equal(Object.values(entries).filter(v => /["\\]/.test(v)).length, 0, 'no quote or backslash to escape');
});

test('The build is deterministic', async () => {
  const again = new Staged();
  const second = await C.buildCultures(again, { countries, geography, quiet: true });
  assert.equal(second.startup, built.startup);
  assert.deepEqual([...again.files.keys()], [...staged.files.keys()]);
  for (const [rel, bytes] of staged.files) assert(bytes.equals(again.files.get(rel)), `${rel} differs between builds`);
});

test('The state table is staged byte for byte, and the seeded documents match the generator', async () => {
  assert.equal(text('docs/design/world/state_cultures.json'), await readFile(`${ZIN}/docs/design/world/state_cultures.json`, 'utf8'));
  for (const rel of ['docs/design/world/culture_coverage.json', 'docs/design/world/culture_mappings.json']) {
    const onDisk = await readFile(`${ZIN}/${rel}`, 'utf8').catch(() => null);
    assert.equal(onDisk, text(rel), `${rel} in the repository is what the builder writes (run the build, or write the staged copy, when the data changes)`);
  }
});

// -------------------------------------------------------------------------------------------------- the coverage
test('Coverage: every country has a culture and a faith that exist, every culture a language that exists, every culture a country or a note', async () => {
  const r = await check(model);
  assert.equal(r.errors.length, 0, JSON.stringify(r.errors.slice(0, 3)));
  const cov = JSON.parse(text('docs/design/world/culture_coverage.json'));
  assert.equal(cov.totals.countries, 305);
  assert.deepEqual(cov.gaps.cultures_without_country, ['goblin_warrens']);
  assert.match(cov.cultures.goblin_warrens.unused, /minor people/);
  assert.equal(cov.cultures.lake_aenoran.countries.length, 11);
  assert.equal(cov.cultures.kilinti_ents.second_countries.length, 0);
  assert.deepEqual(cov.cultures.selen_ranger.second_countries, ['Kilinti']);
  assert.equal(cov.gaps.countries_with_second_culture.length, 11);
  assert.deepEqual(cov.gaps.countries_without_language, ['Zol']);
  assert.equal(Object.values(cov.cultures).reduce((n, c) => n + c.countries.length, 0), 305, 'each country is the dominant culture of exactly one culture');
  assert.equal(Object.keys(cov.languages).length, 24);
  assert.deepEqual(Object.entries(cov.languages).filter(([, l]) => !l.cultures.length).map(([k]) => k), ['ainic'], 'only the liturgical Old Ainic has no culture');
  for (const row of C.resolveCountryCultures(model, countries).rows.values()) {
    assert(model.world.cultures[row.culture], `${row.country} culture`); assert(model.world.faiths[row.faith], `${row.country} faith`);
    assert(row.language === null || model.languages[row.language], `${row.country} language`);
  }
  for (const k of model.cultureKeys) { const l = model.world.cultures[k].language; assert(l === null || model.languages[l], `${k} language`); }
  assert.equal(model.world.cultures.zols_dead.language, null);
  assert.equal(model.world.faiths.none.name, '(none written)');
  for (const f of model.faithKeys) assert(Object.values(model.world.cultures).some(c => c.faith === f || c.faith_secondary === f), `faith ${f} is kept by a culture`);
});

test('Mappings: portrait pools, flag styles, building kits, music moods, unit groups and graphical cultures', () => {
  const pools = model.cultureKeys.map(k => C.portraitPoolFor(model, k));
  assert.equal(C.portraitPoolFor(model, 'lake_aenoran').per_sex, 6);
  assert.equal(C.portraitPoolFor(model, 'selen_ranger').per_sex, 4);
  assert.equal(C.portraitPoolFor(model, 'march_folk').per_sex, 2);
  assert.equal(C.portraitPoolFor(model, 'goblin_warrens').per_sex, 1);
  assert.equal(pools.reduce((n, p) => n + p.total, 0), 374, 'the bible budget of about 374 culture portraits');
  assert.equal(C.portraitPoolFor(model, 'volcano_clans').kit, 'orcs');
  assert.equal(C.flagStyleFor(model, 'leren_sea_kings').shape, 'swallowtail');
  assert.equal(C.flagStyleFor(model, 'steppe_rider').shape, 'pennant');
  assert.equal(C.flagStyleFor(model, 'noris_riders').shape, 'rect');
  assert.deepEqual(C.flagStyleFor(model, 'lake_aenoran').palette, ['#2f5d8a', '#e8d9a0', '#f2f0e6']);
  assert.equal(C.buildingStyles(model).length, SPEC_COUNTS.building_styles);
  assert.equal(C.musicMoods(model).length, SPEC_COUNTS.music_moods);
  assert.equal(C.unitGroups(model).length, SPEC_COUNTS.unit_groups);
  assert.equal(C.buildingStyleFor(model, 'wall_folk'), 'wall_grey');
  assert.equal(C.musicMoodFor(model, 'caravan_princes'), 'lyre_bronze');
  assert.equal(C.unitGroupFor(model, 'noris_riders'), 'desert_riders');
  assert.deepEqual(C.graphicalCultureFor(model, 'noris_riders'), { key: 'zin_desert_riders_gfx', group: 'zin_desert_riders_gfx', fallback: 'zin_men_gfx' });
  assert.equal(C.graphicalCultureFor(model, 'noris_riders', new Set(['zin_men_gfx'])).key, 'zin_men_gfx', 'the people culture stands in until the group has one');
  assert.equal(C.graphicalCultureFor(model, 'noris_riders', new Set(['zin_desert_riders_gfx'])).key, 'zin_desert_riders_gfx');
  assert.equal(C.graphicalCultureFor(model, 'kilinti_ents').fallback, 'zin_ents_gfx');
  const maps = JSON.parse(text('docs/design/world/culture_mappings.json'));
  assert.equal(Object.keys(maps.cultures).length, 53);
  assert.equal(maps.cultures.gala_court.music_mood, 'elven_voices');
  assert.equal(maps.chronicle.cultures.lake_aenoran.name, 'Lake Aenorans');
  assert.equal(maps.chronicle.faiths.none.name, 'No Faith Recorded');
  assert.equal(Object.keys(C.chronicleNames(model).languages).length, 24);
});

// --------------------------------------------------------------------------------------------- per-state cultures
test('State cultures: the function resolves enclaves, mixed lands, minorities, holy sites and resistance', () => {
  const aenor = { culture: 'lake_aenoran', faith: 'deliverer' };
  const cursed = C.resolveStateCulture(model, { owner: aenor, features: ['waste_cursed_lands', 'region_middle_lands'] });
  assert.equal(cursed.culture, 'veiled_folk'); assert.equal(cursed.faith, 'old_knots');
  assert.equal(cursed.resistance.level, 'total'); assert.equal(cursed.resistance.target, 0.6);
  assert.deepEqual(cursed.holy_sites, ['old_knots']); assert.deepEqual(cursed.rules, ['sc_cursed_lands_veiled']);
  const plain = C.resolveStateCulture(model, { owner: aenor, features: ['plain_vale_of_aenor'] });
  assert.equal(plain.culture, 'lake_aenoran'); assert.deepEqual(plain.minorities, []); assert.equal(plain.resistance.level, 'none'); assert.deepEqual(plain.holy_sites, []);
  const isle = C.resolveStateCulture(model, { owner: aenor, features: ['region_aenor_isle'] });
  assert.deepEqual(isle.minorities, [{ culture: 'isle_houses', faith: 'isle_tide', share: 0.3 }]);
  const ford = C.resolveStateCulture(model, { owner: { culture: 'gunwaith_clans', faith: 'clan_stones' }, features: ['pass_grey_ford'] });
  assert.equal(ford.culture, 'gunwaith_clans'); assert.deepEqual(ford.minorities.map(m => m.culture), ['girdon_wardens']); assert.deepEqual(ford.holy_sites, ['clan_stones']);
  const kilinti = C.resolveStateCulture(model, { owner: { culture: 'kilinti_ents', culture2: 'selen_ranger' }, features: ['forest_kilinti'] });
  assert.deepEqual(kilinti.minorities.map(m => [m.culture, m.share]), [['selen_ranger', 0.35]], 'the larger of the rule and the owner share wins');
  assert.equal(kilinti.resistance.level, 'none', 'ents rule their own forest');
  const second = C.resolveStateCulture(model, { owner: { culture: 'leren_sea_kings', culture2: 'free_crowns_north' }, features: [] });
  assert.deepEqual(second.minorities.map(m => [m.culture, m.share]), [['free_crowns_north', 0.25]], "the owner's own second culture adds its share");
  assert.deepEqual(C.resolveStateCulture(model, { owner: { culture: 'leren_sea_kings', culture2: 'free_crowns_north' }, features: [], include_owner_second: false }).minorities, []);
  const fog = C.resolveStateCulture(model, { owner: { culture: 'buldor_companies' }, features: ['pass_fog_gap'] });
  assert.deepEqual(fog.minorities.map(m => [m.culture, m.share]), [['gunwaith_clans', 0.3], ['girdon_wardens', 0.2]]);
  assert.deepEqual(C.resolveStateCulture(model, { owner: { culture: 'buldor_companies' }, features: ['pass_fog_gap'] }), fog, 'same input, same result');
  const deadlands = C.resolveStateCulture(model, { owner: { culture: 'grave_hosts' }, features: ['waste_deadlands'] });
  assert(deadlands.minorities.reduce((n, m) => n + m.share, 0) <= model.game.limits.max_minority_total + 1e-9);
  // Resistance rules of the demography spec.
  assert.equal(C.resolveStateCulture(model, { owner: { culture: 'wall_folk' }, features: ['region_aenor_isle'] }).resistance.target, 0, 'no mixed rule for another owner');
  const kin = C.resolveStateCulture(model, { owner: { culture: 'wall_folk', faith: 'stone_vigil' }, features: ['forest_selen'] });
  assert.equal(kin.culture, 'wall_folk');
  assert(C.culturesAreKin(model, 'wall_folk', 'lake_aenoran') && C.culturesAreKin(model, 'lake_aenoran', 'wall_folk') && !C.culturesAreKin(model, 'wall_folk', 'selen_ranger'));
  const zilin = C.resolveStateCulture(model, { owner: { culture: 'lake_aenoran', faith: 'deliverer' }, features: ['hills_zilin'] });
  assert.equal(zilin.culture, 'zilin_pilgrims');
  assert.deepEqual([zilin.resistance.target, zilin.resistance.level], [0.2, 'medium'], 'another culture adds 20 percent; the faith is the same');
  const elfRealm = C.resolveStateCulture(model, { owner: { culture: 'forest_council_elves', faith: 'kindred_song' }, features: ['hills_zilin'] });
  assert.deepEqual([elfRealm.resistance.level, elfRealm.resistance.target], ['strong', 0.4], 'men inside an elven realm resist it');
  const ents = C.resolveStateCulture(model, { owner: { culture: 'selen_ranger', faith: 'green_lords' }, features: ['forest_kilinti'] });
  assert.deepEqual(ents.minorities.map(m => [m.culture, m.share]), [['kilinti_ents', 0.3]]); assert.equal(ents.resistance.level, 'strong');
  const orcsOverGiants = C.resolveStateCulture(model, { owner: { culture: 'volcano_clans', faith: 'skull_fire' }, features: ['forest_troll'] });
  assert.equal(orcsOverGiants.culture, 'troll_tribes'); assert.equal(orcsOverGiants.resistance.level, 'strong');
  assert.equal(C.resolveStateCulture(model, { owner: { culture: 'troll_tribes' }, features: ['forest_troll'] }).resistance.level, 'none', 'a people ruling its own forest does not resist itself');
  assert.equal(C.resolveStateCulture(model, { owner: { culture: 'forest_council_elves', faith: 'kindred_song' }, features: ['waste_zols_mistake'] }).resistance.target, 0.25, 'another culture 0.20 and another faith 0.05');
  const holy = C.resolveStateCulture(model, { owner: aenor, features: ['site_parim'] });
  assert.deepEqual(holy.holy_sites, ['deliverer']);
  assert.throws(() => C.resolveStateCulture(model, { owner: { culture: 'no_such_culture' }, features: [] }), /unknown owner culture/);
});

test('State cultures: startup lines set the variables and flags the triggers read', () => {
  const r = C.resolveStateCulture(model, { owner: { culture: 'lake_aenoran', faith: 'deliverer' }, features: ['waste_cursed_lands'] });
  const lines = C.stateStartupLines(model, [{ state: 12, ...r }, { state: 3, ...C.resolveStateCulture(model, { owner: { culture: 'lake_aenoran' }, features: ['region_aenor_isle', 'site_parim'] }) }]).split('\n');
  assert.equal(lines[0], '\t\t\t3 = { set_variable = { zin_state_culture = 1 } set_variable = { zin_state_faith = 1 } set_variable = { zin_state_culture2 = 6 } set_state_flag = zin_holy_site_deliverer }');
  assert.equal(lines[1], `\t\t\t12 = { set_variable = { zin_state_culture = ${C.cultureNumber(model, 'veiled_folk')} } set_variable = { zin_state_faith = ${C.faithNumber(model, 'old_knots')} } set_state_flag = zin_holy_site_old_knots }`);
});

test('The state table is keyed by geography features, never by state numbers', () => {
  assert(model.state.rules.length >= 30);
  for (const rule of model.state.rules) { assert(geography.has(rule.feature), `${rule.id}: ${rule.feature}`); assert.doesNotMatch(String(rule.feature), /^\d+$/); }
  assert.equal(new Set(model.state.rules.map(r => r.id)).size, model.state.rules.length);
  assert(model.state.interface.function.includes('resolveStateCulture'));
});

// ------------------------------------------------------------------------------------------ the checks themselves
test('The data passes its own checks with no error, and the Knots warning is the known review item', async () => {
  const r = await check(model);
  assert.deepEqual(r.errors, []);
  assert(r.warnings.every(w => ['country-faith', 'text'].includes(w.code)));
  assert(r.warnings.some(w => w.code === 'country-faith' && /Yeldenne/.test(w.detail)));
  assert.equal(findDuplicateJsonKeys(model.gameText).length, 0);
  assert.equal(findDuplicateJsonKeys(model.stateText).length, 0);
  assert.equal(model.cultureKeys.length, SPEC_COUNTS.cultures);
  assert.equal(MONTHS.length, 12);
});

test('Negative: an unknown modifier fails the check and the build', async () => {
  const bad = mutated(m => { m.game.cultures.selen_ranger.modifier.moon_phase_factor = 0.05; });
  const r = await check(bad);
  assert(codes(r).has('modifier'));
  assert(r.errors.some(e => /Unknown modifier moon_phase_factor in culture selen_ranger/.test(e.detail)));
  await assert.rejects(() => C.buildCultures(new Staged(), { countries, geography, model: bad, quiet: true }), /Culture checks failed[\s\S]*moon_phase_factor/);
});

test('Negative: a country without a culture, and a culture that does not exist', async () => {
  const missing = await check(model, { countries: [...countries, { tag: 'Z99', name: 'Nowhereland' }] });
  assert(missing.errors.some(e => e.code === 'country-culture' && /Nowhereland has no culture row/.test(e.detail)));
  const badOwner = await check(model, { table: new Map([[byName('Aenor').tag, { culture: 'sky_pirates' }]]) });
  assert(badOwner.errors.some(e => e.code === 'country-culture' && /unknown culture sky_pirates/.test(e.detail)));
  const badFaith = await check(model, { table: new Map([[byName('Aenor').tag, { faith: 'moon_cult' }]]) });
  assert(badFaith.errors.some(e => e.code === 'country-faith' && /unknown faith moon_cult/.test(e.detail)));
  const noFaith = mutated(m => { m.assignments.find(a => a.country === 'Selen').faith = null; });
  assert((await check(noFaith)).errors.some(e => /Selen/.test(e.detail)));
  await assert.rejects(() => C.buildCultures(new Staged(), { countries: [...countries, { tag: 'Z99', name: 'Nowhereland' }], geography, quiet: true }), /Nowhereland has no culture row/);
});

test('Negative: duplicate keys, ids, spirits and countries', async () => {
  assert.deepEqual(findDuplicateJsonKeys('{"a":1,"b":{"c":1,"c":2},"a":3}'), ['$.b.c', '$.a']);
  assert.deepEqual(findDuplicateJsonKeys('{"a":[{"x":1},{"x":1}]}'), []);
  assert((await check(model, { files: { 'x.json': '{"cultures":{"a":{},"a":{}}}' } })).errors.some(e => e.code === 'file-duplicate' && /\$\.cultures\.a/.test(e.detail)));
  const sameId = await check(mutated(m => { m.game.cultures.wall_folk.id = 1; }));
  assert(codes(sameId).has('duplicate') && sameId.errors.some(e => /share the number 1/.test(e.detail)));
  const sameSpirit = await check(mutated(m => { m.game.cultures.wall_folk.spirit = m.game.cultures.selen_ranger.spirit; }));
  assert(sameSpirit.errors.some(e => e.code === 'duplicate' && /culture spirit/.test(e.detail)));
  const sameIcon = await check(mutated(m => { m.game.cultures.wall_folk.icon = m.game.cultures.selen_ranger.icon; }));
  assert(sameIcon.errors.some(e => e.code === 'duplicate' && /culture icon/.test(e.detail)));
  const twoRows = await check(mutated(m => { m.assignments.push({ ...m.assignments[0] }); }));
  assert(twoRows.errors.some(e => e.code === 'duplicate' && /two culture rows/.test(e.detail)));
  const sameRule = await check(mutated(m => { m.state.rules.push({ ...m.state.rules[0] }); }));
  assert(sameRule.errors.some(e => e.code === 'duplicate' && /appears twice/.test(e.detail)));
  const sameMods = await check(mutated(m => { m.game.cultures.wall_folk.modifier = { ...m.game.cultures.selen_ranger.modifier }; }));
  assert(sameMods.errors.some(e => /identical modifiers/.test(e.detail)));
});

test('Negative: modifier values, counts and overlap', async () => {
  const big = await check(mutated(m => { m.game.cultures.noris_riders.modifier.army_attack_factor = 0.5; }));
  assert(big.errors.some(e => e.code === 'modifier' && /army_attack_factor = 0.5 is outside its bounds/.test(e.detail)));
  const zero = await check(mutated(m => { m.game.cultures.noris_riders.modifier.army_attack_factor = 0; }));
  assert(zero.errors.some(e => /not a non-zero number/.test(e.detail)));
  const many = await check(mutated(m => { Object.assign(m.game.cultures.noris_riders.modifier, { army_attack_factor: 0.01, army_defence_factor: 0.01 }); }));
  assert(many.errors.some(e => /has 6 modifiers, the limit is 3 to 5/.test(e.detail)));
  const few = await check(mutated(m => { m.game.cultures.noris_riders.modifier = { army_speed_factor: 0.03 }; }));
  assert(few.errors.some(e => /has 1 modifiers/.test(e.detail)));
  const alike = await check(mutated(m => { m.game.cultures.wall_folk.modifier = { ...m.game.cultures.selen_ranger.modifier, army_org_factor: 0.01 }; }));
  assert(codes(alike).has('similar'));
  const faith = await check(mutated(m => { m.game.faiths.green_lords.modifier.stability_factor = 0.9; }));
  assert(faith.errors.some(e => /faith green_lords: stability_factor = 0.9/.test(e.detail)));
});

test('Negative: a culture nobody keeps, a language that does not exist, a faith nobody keeps', async () => {
  const unused = await check(mutated(m => { delete m.game.cultures.goblin_warrens.unused; }));
  assert(unused.errors.some(e => e.code === 'unused' && /goblin_warrens/.test(e.detail)));
  const stale = await check(mutated(m => { m.game.cultures.noris_riders.unused = 'a stale note'; }));
  assert(stale.warnings.some(w => w.code === 'unused'));
  const noLanguage = await check(mutated(m => { m.world.cultures.selen_ranger.language = 'elder_tongue'; }));
  assert(noLanguage.errors.some(e => e.code === 'language' && /elder_tongue, which does not exist/.test(e.detail)));
  const lost = await check(mutated(m => { m.world.cultures.zols_dead.language = null; m.game.no_language_cultures = []; }));
  assert(lost.errors.some(e => e.code === 'language' && /zols_dead has no language/.test(e.detail)));
  const unkept = await check(mutated(m => { for (const c of Object.values(m.world.cultures)) { if (c.faith === 'yeti_hum') c.faith = 'none'; if (c.faith_secondary === 'yeti_hum') c.faith_secondary = null; } }));
  assert(unkept.errors.some(e => e.code === 'faith-unkept' && /yeti_hum/.test(e.detail)));
  const lacking = await check(mutated(m => { delete m.game.cultures.netherborn; }));
  assert(lacking.errors.some(e => e.code === 'set' && /netherborn is in the bible and has no game data/.test(e.detail)));
  const extra = await check(mutated(m => { m.game.faiths.moon_cult = { ...m.game.faiths.yeti_hum, id: 40 }; }));
  assert(extra.errors.some(e => e.code === 'set' && /moon_cult/.test(e.detail)));
});

test('Negative: text that leaks the secret, uses a banned word, breaks Windows-1252 or carries a bible label', async () => {
  const leak = await check(mutated(m => { m.game.faiths.deliverer.text = 'Afrit is the Deliverer.'; }));
  assert(leak.errors.some(e => e.code === 'secret' && /Afrit/.test(e.detail)));
  assert((await check(mutated(m => { m.game.cultures.gala_court.text = 'Eindil is not here.'; }))).errors.some(e => e.code === 'secret'));
  assert((await check(mutated(m => { m.game.faiths.deliverer.spirit_desc = 'The Hidden Council keeps the faith.'; }))).errors.some(e => e.code === 'secret'));
  assert((await check(mutated(m => { m.game.faiths.deliverer.spirit_desc = 'Confessors write the birth rolls.'; }))).errors.some(e => e.code === 'secret'));
  const word = await check(mutated(m => { m.game.cultures.dondor_brutes.spirit_desc = 'The factory pays the blood-price.'; }));
  assert(word.errors.some(e => e.code === 'text' && /factory/.test(e.detail)));
  const font = await check(mutated(m => { m.game.cultures.dondor_brutes.text = 'Iron halls of Dondor \u014d.'; }));
  assert(font.errors.some(e => e.code === 'text' && /Windows-1252/.test(e.detail)));
  const tag = await check(mutated(m => { m.game.cultures.dondor_brutes.text = 'Iron halls [E] of Dondor.'; }));
  assert(tag.errors.some(e => e.code === 'text' && /bible label/.test(e.detail)));
  const long = await check(mutated(m => { m.game.cultures.dondor_brutes.text = 'Iron '.repeat(80); }));
  assert(long.errors.some(e => e.code === 'text' && /characters, the limit is/.test(e.detail)));
});

test('Negative: mappings, festivals and sites', async () => {
  const kit = await check(mutated(m => { m.game.cultures.wall_folk.building = 'lake_stone'; }));
  assert(kit.errors.some(e => e.code === 'mapping' && /50 building styles, the spec has 51/.test(e.detail)));
  const music = await check(mutated(m => { m.game.cultures.wall_folk.music = 'Bad Key'; }));
  assert(music.errors.some(e => e.code === 'mapping' && /music "Bad Key"/.test(e.detail)));
  const magic = await check(mutated(m => { m.game.cultures.wall_folk.magic = 'adored'; }));
  assert(magic.errors.some(e => e.code === 'mapping' && /magic attitude/.test(e.detail)));
  const month = await check(mutated(m => { m.game.faiths.horse_oath.festivals[0].month = 'Smarch'; }));
  assert(month.errors.some(e => e.code === 'festival' && /Smarch/.test(e.detail)));
  const days = await check(mutated(m => { m.game.faiths.horse_oath.festivals[0].days = 90; }));
  assert(days.errors.some(e => e.code === 'festival' && /90 days/.test(e.detail)));
  const site = await check(mutated(m => { m.game.faiths.horse_oath.holy_sites.push('site_atlantis'); }));
  assert(site.errors.some(e => e.code === 'site' && /site_atlantis/.test(e.detail)));
});

test('Negative: state rules keyed by a state number, an unknown feature or culture, a bad share', async () => {
  const num = await check(mutated(m => { m.state.rules[0].feature = '1234'; }));
  assert(num.errors.some(e => e.code === 'state-rule' && /never by a state number/.test(e.detail)));
  const feature = await check(mutated(m => { m.state.rules[0].feature = 'forest_of_dreams'; }));
  assert(feature.errors.some(e => e.code === 'site' && /forest_of_dreams/.test(e.detail)));
  const culture = await check(mutated(m => { m.state.rules[0].culture = 'sky_pirates'; }));
  assert(culture.errors.some(e => e.code === 'state-rule' && /sky_pirates/.test(e.detail)));
  const share = await check(mutated(m => { m.state.rules.find(r => r.kind === 'mixed').minorities[0].share = 1.5; }));
  assert(share.errors.some(e => e.code === 'state-rule' && /the share of/.test(e.detail)));
  const total = await check(mutated(m => { m.state.rules.find(r => r.kind === 'mixed').minorities.push({ culture: 'wall_folk', share: 0.9 }); }));
  assert(total.errors.some(e => e.code === 'state-rule' && /minorities total/.test(e.detail)));
  const level = await check(mutated(m => { m.state.rules[0].owner_resistance = { '*': 'overwhelming' }; }));
  assert(level.errors.some(e => e.code === 'state-rule' && /overwhelming/.test(e.detail)));
  const kind = await check(mutated(m => { m.state.rules[0].kind = 'swamp'; }));
  assert(kind.errors.some(e => e.code === 'state-rule' && /neither enclave nor mixed/.test(e.detail)));
  const both = await check(mutated(m => { m.state.rules[0].when_owner = ['wall_folk']; m.state.rules[0].unless_owner = ['selen_ranger']; }));
  assert(both.errors.some(e => /when_owner and unless_owner together/.test(e.detail)));
  assert.throws(() => C.resolveStateCulture(model, { owner: {}, features: [] }), /unknown owner culture/);
});

test('The test script of tools/package.json runs this file', async () => {
  const pkg = JSON.parse(await readFile(path.join(here, '../package.json'), 'utf8'));
  assert.match(pkg.scripts.test, /content\/cultures\.test\.mjs/);
});
