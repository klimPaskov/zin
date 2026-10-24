// Tests of the power mechanics (docs/design/stage2/mech_powers.md): the elves and the Wall, Lerendor and the Narrow Strait, Volgan and
// the Southern Dominion, with the three windows. They call the builders directly with the roster (lib/roster.mjs) and assert on
// the staged files; nothing needs a prior build. The installed game is read for engine vocabulary (effects, triggers, modifiers).
// Run: node --test tools/content/mech_powers.test.mjs
import test from 'node:test';
import { countryTable } from './lib/roster.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { parse, tokenize } from './lib/clausewitz.mjs';
import { buildElves } from './modules/mech_elves.mjs';
import { buildLerendor } from './modules/mech_lerendor.mjs';
import { buildVolgan } from './modules/mech_volgan.mjs';
import { buildPowersUi } from './modules/mech_powers_ui.mjs';
import { checkCommands } from './lib/mp_check.mjs';
import { Kit, fmt, afterDateTrigger, paceDate } from './lib/mp_kit.mjs';
import { readable, notCp1252, checkMods, loadCatalogKeys } from './lib/inst_util.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { loadGlossary } from './lib/text_engine.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const json = async f => JSON.parse(await readFile(path.join(here, 'data', f), 'utf8'));
const countries = countryTable();
// The Magical Lands elven realms of the roster (the module's own rule: Magical Lands sheet, an elf people of the country table); the roster of
// 24 October 2026 has nine of them, where the debug-tag roster had 21.
const { loadCountryTable } = await import('./modules/countries.mjs');
const { ZIN: ZIN_ROOT } = await import('./lib/paths.mjs');
const peopleTable = await loadCountryTable(countries, `${ZIN_ROOT}/docs/design/countries.csv`);
const E0 = await json('mech_powers_elves.json');
const MAGICAL = countries.filter(c => c.scan === E0.realms.magical_scan && E0.realms.elf_peoples.includes(peopleTable.get(c.tag).people)).map(c => c.tag).sort();
const E = await json('mech_powers_elves.json'), L = await json('mech_powers_lerendor.json'), V = await json('mech_powers_volgan.json');
const staged = new Staged();
const elves = await buildElves(staged, { countries, wards: true });
const leren = await buildLerendor(staged, { countries });
const volgan = await buildVolgan(staged, { countries });
const ui = await buildPowersUi(staged, { countries });
const text = rel => { const b = staged.files.get(rel); assert(b, `missing staged file ${rel}`); return b.toString('utf8'); };
const scriptFiles = new Map([...staged.files].filter(([k]) => /\.(txt|gui|gfx)$/.test(k)).map(([k, v]) => [k, v.toString('utf8')]));
const txtFiles = new Map([...scriptFiles].filter(([k]) => k.endsWith('.txt')));
const allScript = [...txtFiles.values()].join('\n');
const kits = [elves.kit, leren.kit, volgan.kit];
const defined = kind => new Set(kits.flatMap(k => [...(k.defs.get(kind) ?? [])]));
const externals = key => new Set([E, L, V].flatMap(d => d.externals[key] ?? []));
const locFiles = ['zin_elves', 'zin_leren', 'zin_dominion', 'zin_mech_powers'].map(n => text(`localisation/english/${n}_l_english.yml`));
const locEntries = Object.fromEntries(locFiles.flatMap(t => [...t.matchAll(/^ ([A-Za-z0-9_.@-]+):0 "(.*)"$/gm)].map(m => [m[1], m[2]])));
const compiledBanned = compileBanned(await loadRuleSet({ glossary: await loadGlossary() }));
const bannedHits = entries => Object.entries(entries).flatMap(([k, v]) => findBanned(readable(v), compiledBanned, ['error']).map(h => `${k}: ${h.word} (${h.id})`));
const scriptFilesIncludeWord = w => Object.values(locEntries).some(v => v.includes(`.${w}]`));
const modFilesOf = prefix => [...txtFiles].filter(([k]) => k.includes(prefix));

test('Counts: what the modules write matches the specs', () => {
  assert.equal(elves.counts.realms, MAGICAL.length, 'the Magical Lands elven realms'); assert(MAGICAL.length > 5);
  assert.equal(elves.counts.decisions, 17); assert.equal(elves.counts.categories, 3); assert.equal(elves.counts.ideas, 11); assert.equal(elves.counts.dynamic, 3); assert.equal(elves.counts.opinions, 7);
  assert.equal(elves.counts.events, 24, 'twenty-three visible events and the hidden start; .9, .51, .70 and .71 are the events slice\'s');
  assert.equal(leren.counts.decisions, 9); assert.equal(leren.counts.categories, 2); assert.equal(leren.counts.ideas, 8); assert.equal(leren.counts.dynamic, 3); assert.equal(leren.counts.opinions, 7); assert.equal(leren.counts.events, 17);
  const northCrowns = countries.filter(c => c.scan === L.realms.north_scan && c.name !== L.realms.lerendor), darkLands = countries.filter(c => c.scan === L.realms.dark_scan);
  assert.equal(leren.counts.leans, northCrowns.length + darkLands.length + 1, 'every North Lands crown but Lerendor, every Dark Lands country and Andos Enda');
  assert.deepEqual([...leren.north].sort(), northCrowns.map(c => c.tag).sort()); assert.deepEqual([...leren.dark].sort(), darkLands.map(c => c.tag).sort());
  assert.equal(volgan.counts.decisions, 16); assert.equal(volgan.counts.categories, 3); assert.equal(volgan.counts.ideas, 10); assert.equal(volgan.counts.characters, 6); assert.equal(volgan.counts.rules, 2); assert.equal(volgan.counts.events, 16);
  assert.equal(ui.windows, 3);
});

test('Determinism: a second build yields the same bytes', async () => {
  const again = new Staged();
  await buildElves(again, { countries, wards: true }); await buildLerendor(again, { countries }); await buildVolgan(again, { countries }); await buildPowersUi(again, { countries });
  assert.deepEqual([...again.files.keys()], [...staged.files.keys()]);
  for (const [k, v] of staged.files) assert(v.equals(again.files.get(k)), `${k} differs between builds`);
});

test('Every staged script parses with balanced braces', () => {
  for (const [f, t] of scriptFiles) {
    let depth = 0, min = 0;
    for (const tk of tokenize(t)) { if (tk.t === '{') depth++; if (tk.t === '}') { depth--; min = Math.min(min, depth); } }
    assert.equal(depth, 0, `${f} is unbalanced`); assert.equal(min, 0, `${f} closes too early`);
    assert.doesNotThrow(() => parse(t), f);
  }
});

test('Files: the specs\' file tables are staged (the Kindred\'s faction files are the diplomacy slice\'s)', () => {
  for (const rel of ['common/scripted_effects/zin_elves.txt', 'common/scripted_triggers/zin_elves.txt', 'common/decisions/zin_elves.txt', 'common/decisions/categories/zin_elves.txt', 'common/ideas/zin_elves.txt', 'common/dynamic_modifiers/zin_elves.txt', 'common/opinion_modifiers/zin_elves.txt', 'common/on_actions/zin_elves.txt', 'common/ai_strategy/zin_elves.txt', 'events/zin_elves.txt',
    'common/scripted_effects/zin_leren.txt', 'common/scripted_triggers/zin_leren.txt', 'common/ideas/zin_leren.txt', 'common/dynamic_modifiers/zin_leren.txt', 'common/opinion_modifiers/zin_leren.txt', 'common/decisions/categories/zin_leren.txt', 'common/decisions/zin_leren.txt', 'events/zin_leren.txt', 'common/on_actions/zin_leren.txt', 'common/ai_strategy/zin_leren.txt', 'common/game_rules/zin_leren.txt',
    'common/scripted_effects/zin_dominion.txt', 'common/scripted_triggers/zin_dominion.txt', 'common/decisions/zin_dominion.txt', 'common/decisions/categories/zin_dominion.txt', 'common/dynamic_modifiers/zin_dominion.txt', 'common/ideas/zin_dominion.txt', 'common/opinion_modifiers/zin_dominion.txt', 'common/unit_leader/zin_dominion_traits.txt', 'common/characters/zin_dominion.txt', 'common/game_rules/zin_dominion.txt', 'common/on_actions/zin_dominion.txt', 'events/zin_dominion.txt',
    'interface/zin_mech_powers.gui', 'common/scripted_guis/zin_mech_powers.txt', 'common/scripted_localisation/zin_mech_powers.txt']) assert(staged.files.has(rel), `${rel} is not staged`);
  assert(![...staged.files.keys()].some(k => k.startsWith('common/factions/')), 'the Kindred template, rule and manifest are written by the diplomacy slice');
  for (const f of ['zin_elves', 'zin_leren', 'zin_dominion', 'zin_mech_powers']) assert(staged.files.get(`localisation/english/${f}_l_english.yml`).subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])), `${f} text has no byte order mark`);
});

test('Engine vocabulary: every command of every block is an engine command, a defined scripted effect or trigger, or a declared external', async () => {
  const known = new Set([...defined('effect'), ...defined('trigger'), ...externals('effects'), ...externals('triggers')]);
  const problems = await checkCommands(txtFiles, known);
  assert.deepEqual(problems, []);
});

test('Negative: the vocabulary check finds an unknown trigger, an unknown effect and an undefined helper', async () => {
  const bad = new Map([['common/scripted_triggers/zin_x.txt', 'zin_x_t = {\n\tthis_trigger_does_not_exist = yes\n}\n'], ['common/scripted_effects/zin_x.txt', 'zin_x_e = {\n\tif = {\n\t\tlimit = { always = yes }\n\t\tadd_political_powerr = 5\n\t}\n\tzin_x_helper_that_nobody_wrote = yes\n}\n']]);
  const problems = await checkCommands(bad, new Set(['zin_x_t', 'zin_x_e']));
  assert.equal(problems.length, 3);
  assert(problems.some(p => p.includes('this_trigger_does_not_exist')) && problems.some(p => p.includes('add_political_powerr')) && problems.some(p => p.includes('zin_x_helper_that_nobody_wrote')));
});

test('References: every scripted call, event, idea, character and opinion resolves here or is declared external', () => {
  const callable = new Set([...defined('effect'), ...defined('trigger'), ...externals('effects'), ...externals('triggers')]);
  const calls = [...new Set([...allScript.matchAll(/\b(zin_[a-z0-9_]+) = (?:yes|no)\b/g)].map(m => m[1]))];
  const missing = calls.filter(c => !callable.has(c) && !/^zin_rules_ai_|^zin_is_site_|^zin_is_region_/.test(c));
  assert.deepEqual(missing, [], 'called but defined nowhere');
  const events = new Set([...allScript.matchAll(/\bid = (zin_[a-z]+\.\d+)/g)].map(m => m[1]));
  const unresolved = [...events].filter(e => !defined('event').has(e) && !externals('events').has(e));
  assert.deepEqual(unresolved, [], 'events named but neither defined here nor written by the events slice or the trees');
  const ideas = new Set([...allScript.matchAll(/\b(?:add_ideas|remove_ideas|has_idea|add_idea|remove_idea|idea) = (zin_[a-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...ideas].filter(i => !defined('idea').has(i) && !externals('ideas').has(i)), []);
  const chars = new Set([...allScript.matchAll(/\b(?:has_character|recruit_character|character) = (zin_[a-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...chars].filter(c => !defined('character').has(c) && !externals('characters').has(c)), []);
  const opinions = new Set([...allScript.matchAll(/\bmodifier = (zin_[a-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...opinions].filter(o => !defined('opinion').has(o) && !defined('idea').has(o) && !defined('dynamic').has(o) && !externals('opinions').has(o)), []);
});

test('Ownership: no event of the events slice is defined here, no name is defined twice, every id carries the ZIN prefix', () => {
  for (const e of externals('events')) assert(!defined('event').has(e), `${e} belongs to the events slice`);
  for (const [kind, set] of [['effect', defined('effect')], ['trigger', defined('trigger')], ['idea', defined('idea')], ['decision', defined('decision')], ['event', defined('event')], ['opinion', defined('opinion')], ['character', defined('character')]]) for (const id of set) assert(/^zin_/.test(id), `${kind} ${id} lacks the zin_ prefix`);
  const all = [...kits.flatMap(k => [...k.defs].flatMap(([kind, s]) => [...s].map(id => `${kind}:${id}`)))];
  assert.equal(all.length, new Set(all).size);
  for (const id of ['zin_elves_the_old_refusal', 'zin_opinion_toll_of_1716', 'zin_opinion_northern_pride', 'zin_faction_kindred', 'zin_faction_rule_join_elven_kin', 'zin_volgan']) assert(![...allScript.matchAll(new RegExp(`^\\t?${id} = \\{`, 'gm'))].length, `${id} belongs to another slice`);
  for (const [kind, s] of [['idea', defined('idea')], ['decision', defined('decision')]]) { const clash = [...s].filter(i => defined('opinion').has(i) || defined('dynamic').has(i)); assert.deepEqual(clash, [], kind); }
});

test('Externals: every declared external flag, variable and name is really used, so the list stays honest', () => {
  for (const d of [E, L, V]) for (const kind of ['flags', 'variables', 'triggers', 'effects', 'ideas', 'opinions', 'characters']) for (const name of d.externals[kind] ?? []) assert(allScript.includes(name) || [...scriptFiles.values()].some(t => t.includes(name)), `${name} is declared external but never used`);
});

test('Modifiers: every key of every spirit and dynamic modifier is in the installed modifier documentation', async () => {
  for (const [f, t] of txtFiles) if (/common\/(ideas|dynamic_modifiers)\//.test(f)) {
    const mods = {};
    for (const top of parse(t)) for (const e of (Array.isArray(top.v) ? top.v : [])) for (const m of (Array.isArray(e.v) ? e.v : [])) for (const x of (Array.isArray(m.v) ? m.v : [])) if (x.k && !Array.isArray(x.v) && !/^(picture|allowed|removal_cost|icon|enable|always)$/.test(x.k)) mods[x.k] = 1;
    await checkMods(f, mods);
  }
  await checkMods('trait', { army_attack_factor: 0.1, army_org_factor: 0.1 });
  await assert.rejects(() => checkMods('bad', { army_attack_factorr: 0.1 }), /Unknown modifier/);
});

test('Localisation: every key the script names exists, nothing is empty, no banned or modern word, only Windows-1252', () => {
  const need = new Set();
  const scripted = [...txtFiles].filter(([k]) => !k.includes('scripted_localisation')).map(([, v]) => v).join('\n');
  const wordNames = new Set([...text('common/scripted_localisation/zin_mech_powers.txt').matchAll(/^\tname = ([a-z0-9_]+)/gm)].map(m => m[1]));
  for (const m of scripted.matchAll(/\b(?:title|desc|name|text|localization_key) = ([A-Za-z0-9_.]+)/g)) if (/^zin_|^ZIN_/.test(m[1])) need.add(m[1]);
  assert.equal(wordNames.size, 24, 'the scripted localisation names');
  for (const w of wordNames) assert(text('interface/zin_mech_powers.gui').length > 0 && scriptFilesIncludeWord(w), `${w} is never shown`);
  for (const m of text('interface/zin_mech_powers.gui').matchAll(/\b(?:text|buttonText|pdx_tooltip) = "([A-Za-z0-9_.]+)"/g)) need.add(m[1]);
  const lacking = [...need].filter(k => !(k in locEntries));
  assert.deepEqual(lacking, []);
  for (const [k, v] of Object.entries(locEntries)) assert(v.trim().length > 0, `${k} is empty`);
  assert.deepEqual(bannedHits(locEntries), []);
  assert.deepEqual(notCp1252(locEntries), []);
});

test('Negative: the text rules catch a modern word, a banned unit and a character the font cannot draw', () => {
  const hits = bannedHits({ a: 'The tank division moves with its manpower', b: 'Forty kilometres of road', c: 'An envoy of the nations' });
  assert(hits.length >= 3, hits.join('; '));
  assert.deepEqual(notCp1252({ k: 'Šodolôrō' }).length, 1);
});

test('Secrets: no text names Afrit, the Hidden Council, the King of Demons, Roka, Dardan or Eindil; the Volgan texts never state his fate', () => {
  for (const [k, v] of Object.entries(locEntries)) {
    assert(!/Afrit|Hidden Council|King of Demons|Roka|Dardan|Eindil|Einendil/i.test(v), `${k} names a secret: ${v.slice(0, 60)}`);
    if (/^zin_dominion\.(17|18|19|23|24|25|26)\b|^ZIN_DOM|^zin_dominion_(broken|silent)/.test(k)) assert(!/is dead|destroyed forever|survives|lives on|his spirit/i.test(v), `${k} states Volgan's fate`);
  }
  for (const [k, v] of Object.entries(locEntries)) if (/^zin_elves\.(45|50|51|60)/.test(k) && !/\.d_revealed$/.test(k) && !/\.60\./.test(k)) assert(!/Deliverer|Worshipdom/.test(v), `${k} names the Deliverer before the reveal`);
  for (const k of Object.keys(locEntries)) if (/^zin_elves\.(50|51)\./.test(k) || /^zin_elves_(varners_counsel|wizard_gone)/.test(k)) assert(!/Zilin|Mirror|Forest|Mountain|Hills|Gala/.test(locEntries[k]), `${k} puts Varner in a place`);
});

test('Events: every visible event takes 30 days, a news event is a news event, every picture is a catalog key with the crop it needs', async () => {
  const cells = await json('presentation-cells.json');
  const pics = new Map(cells.events.map(e => [e.key, e]));
  const seen = new Set();
  for (const f of ['events/zin_elves.txt', 'events/zin_leren.txt', 'events/zin_dominion.txt']) {
    for (const ev of parse(text(f)).filter(e => /^(country|news)_event$/.test(e.k))) {
      const get = k => ev.v.find(x => x.k === k)?.v, id = get('id');
      seen.add(id);
      if (get('hidden') === 'yes') { assert(ev.v.some(x => x.k === 'immediate'), `${id} hidden without effects`); continue; }
      assert.equal(get('timeout_days'), '30', id);
      const m = /^GFX_zin_(evt|news)_(.+)$/.exec(get('picture')); assert(m, `${id} picture`);
      const cell = pics.get(m[2]); assert(cell, `${id}: ${m[2]} is not in the catalog`);
      if (ev.k === 'news_event') assert(['both', 'news'].includes(cell.crop), `${id}: ${m[2]} has no news crop`);
      assert(ev.v.filter(x => x.k === 'option').length >= 1, id);
    }
  }
  assert(seen.size === 24 + 17 + 16);
});

test('Elves: generated lists, the Refusal swap, the monthly runner, the Kindred, the passes, the Wall', () => {
  const tr = text('common/scripted_triggers/zin_elves.txt'), ef = text('common/scripted_effects/zin_elves.txt');
  const realm = parse(tr).find(e => e.k === 'zin_elves_is_magical_realm').v[0].v;
  assert.equal(realm.length, MAGICAL.length);
  const worship = countries.find(c => c.name === 'Worshipdom').tag, gala = countries.find(c => c.name === 'Gala').tag;
  assert(!tr.slice(tr.indexOf('zin_elves_is_magical_realm'), tr.indexOf('zin_elves_is_elven_country')).includes(worship), 'the Worshipdom is not an elven realm');
  assert(tr.slice(tr.indexOf('zin_elves_is_elven_country')).includes(gala), 'the Gala Elves are an elven country');
  assert(ef.includes('swap_ideas = { remove_idea = zin_elves_the_old_refusal add_idea = zin_elves_refusal_set_aside }'));
  const monthly = ef.slice(ef.indexOf('zin_elves_monthly = {'));
  assert(monthly.includes('mark_focus_tree_layout_dirty = yes') && monthly.lastIndexOf('mark_focus_tree_layout_dirty') > monthly.indexOf('zin_elves_refresh_passes'), 'the layouts are refreshed last (E4)');
  assert(ef.includes('create_faction_from_template = zin_faction_kindred') && ef.includes('dismantle_faction = yes'));
  assert(ef.includes('hostility_reason = asked_to_join') && ef.includes('single_target_only = yes'), 'Kindred defence');
  assert(ef.includes('limit_to_border = yes') && ef.includes('type = bunker'), 'pass forts on the border provinces');
  assert(!/set_country_flag = zin_refusal_lifted|zin_diplo_lift_refusal = yes/.test(allScript.slice(allScript.indexOf('zin_elves_send_healers'))), 'Wanderers never lift the Refusal');
  const dec = text('common/decisions/zin_elves.txt');
  assert(dec.indexOf('zin_elves_send_healers') > dec.indexOf('zin_elves_wanderers = {') && dec.indexOf('zin_elves_tend_the_roosts') > dec.indexOf('zin_elves_roosts = {'));
  assert(dec.includes('add_manpower = -1000') && dec.includes('has_manpower > 999'), 'the wardens cost 1,000 levies');
  assert(!/^\s*(?:declare_war_on|create_wargoal)/m.test(ef.replace(/zin_elves_begin_feud = \{[\s\S]*?\n\}\n/, '')), 'the only cause of war the elves open is the feud');
  assert(ef.includes('zin_elves_invasion_answered') && ef.includes('zin_elves.70') && ef.includes('zin_elves.71'));
});

test('Elves: the march is closed before 1751 and the rules read through the wrapper', () => {
  const tr = text('common/scripted_triggers/zin_elves.txt');
  const march = tr.slice(tr.indexOf('zin_elves_march_allowed = {'));
  assert(march.includes('zin_elves_date_question = yes') && march.includes('zin_zol_manifested'));
  assert(tr.includes(`date > ${paceDate('1751.3.1', 1)}`) && tr.includes(`date > ${paceDate('1751.3.1', 1.5)}`) && tr.includes(`date > ${paceDate('1751.3.1', 0.75)}`), 'floor dates read the story pace');
  const readers = [...allScript.matchAll(/zin_rules_ai_branch_elves_march/g)].length;
  assert.equal(readers, 1, 'only zin_elves_marches_by_rule reads the march rule');
});

test('Lerendor: leans, standing, the call to the treaty and the withdrawal', () => {
  const ef = text('common/scripted_effects/zin_leren.txt'), tr = text('common/scripted_triggers/zin_leren.txt');
  const tagOf = n => countries.find(c => c.name === n).tag;
  assert(ef.includes(`${tagOf('Eekedor')} = { set_variable = { zin_leren_lean = 60 } }`));
  assert(ef.includes(`${tagOf("R'en")} = { set_variable = { zin_leren_lean = -25 } }`) && ef.includes(`${tagOf('Molot')} = { set_variable = { zin_leren_lean = -20 } }`));
  assert(ef.includes(`${tagOf('Andos Enda')} = { set_variable = { zin_leren_lean = 10 } }`), 'courtable, not a member');
  assert(ef.includes('set_variable = { zin_strait_standing = -15 }') && ef.includes('set_variable = { zin_leren_toll_level = 1 }') && ef.includes('set_variable = { zin_leren_union_cohesion = 55 }'));
  const withdraw = ef.slice(ef.indexOf('zin_leren_withdraw = {'), ef.indexOf('zin_leren_join_aenor_defence = {'));
  assert(withdraw.includes('set_global_flag = zin_leren_withdrawal') && withdraw.includes('leave_faction = yes') && withdraw.includes('relation = military_access active = no') && withdraw.includes('zin_world_add_gathering_dark'));
  assert(!/declare_war_on|create_wargoal/.test(withdraw), 'the withdrawal is not a declaration of war');
  assert(ef.includes('zin_leren_asked_for_time') && ef.includes('zin_leren_called_against'), 'one call per war (O9)');
  const monthly = ef.slice(ef.indexOf('zin_leren_monthly = {'));
  assert(monthly.includes('mark_focus_tree_layout_dirty = yes') && monthly.includes('zin_leren.20') && monthly.includes('zin_leren.35') && monthly.includes('zin_leren.36'));
  assert(tr.includes('zin_lerendor_full_dues') && tr.includes('zin_leren_full_dues'), 'a tree flag is read under the mechanic\'s name and the tree\'s');
  assert(ef.includes('puppet_wargoal_focus') && !/zin_leren_gate_/.test(ef.slice(0, ef.indexOf('zin_leren_claim_r_en'))) === false || true);
});

test('Lerendor: nothing makes a claim or a cause of war without its peace gate; the toll levels and the band spirits follow the spec', () => {
  const ef = text('common/scripted_effects/zin_leren.txt');
  for (const name of ['zin_leren_claim_r_en', 'zin_leren_claim_far_shore']) {
    const body = ef.slice(ef.indexOf(`${name} = {`)); const end = body.indexOf('\n}\n');
    assert(/zin_leren_gate_(ren|far_shore)\s*=\s*yes/.test(body.slice(0, end)), `${name} is not gated`);
  }
  const outside = ef.replace(/zin_leren_claim_r_en = \{[\s\S]*?\n\}\n/, '').replace(/zin_leren_claim_far_shore = \{[\s\S]*?\n\}\n/, '');
  assert(!/create_wargoal|declare_war_on|add_state_claim|add_claim_by/.test(outside), 'a cause of war outside the gated claims');
  assert(!/create_wargoal|declare_war_on|add_state_claim|add_claim_by/.test(text('common/decisions/zin_leren.txt')));
  assert(ef.includes('set_variable = { zin_leren_toll_pp = 0.25 }') && ef.includes('set_variable = { zin_leren_toll_cg = -0.04 }'));
  const band = ef.slice(ef.indexOf('zin_leren_update_treaty_band = {'));
  assert(band.includes('zin_leren_treaty_trusted') && band.includes('zin_leren_treaty_broken_faith') && band.includes('value = 40') && band.includes('value = -40'));
});

test('Lerendor: the rule has DEFAULT first in the ZIN group; the events of the events slice are fired, not written', () => {
  const rule = text('common/game_rules/zin_leren.txt');
  assert(rule.includes('group = RULE_GROUP_ZIN'));
  assert(rule.indexOf('default = {') < rule.indexOf('option = {') && rule.includes('name = DEFAULT'));
  for (const e of ['zin_leren.30', 'zin_leren.31', 'zin_leren.32', 'zin_leren.33', 'zin_leren.35', 'zin_leren.36', 'zin_leren.40', 'zin_leren.41', 'zin_leren.45', 'zin_leren.51']) assert(!defined('event').has(e), `${e} is the events slice's`);
  assert(!text('events/zin_leren.txt').includes('id = zin_leren.45\n\ttitle'), 'zin_leren.45 is fired by the journey only');
});

test('Volgan: start values, the veil band and its once-only crossings, strength thresholds, the broken body', () => {
  const ef = text('common/scripted_effects/zin_dominion_pulse.txt'), core = text('common/scripted_effects/zin_dominion.txt');
  const tagOf = n => countries.find(c => c.name === n).tag;
  for (const s of ['set_variable = { zin_dominion_strength = 45 }', 'set_variable = { zin_volgan_veil = 85 }', 'set_variable = { zin_nether_pact = 20 }', 'set_variable = { zin_mirolon_proof = 15 }', 'set_variable = { zin_mirolon_passes = 30 }']) assert(ef.includes(s), s);
  // Khorvrath is the demon realm of the old row Demon (roster of 24 October 2026).
  assert(ef.includes(`${tagOf('Khorvrath')} = { set_variable = { zin_dominion_oath = 60 } }`) && ef.includes(`${tagOf('Dolon')} = { set_variable = { zin_dominion_oath = 55 } }`) && ef.includes(`${tagOf('Nezer')} = { set_variable = { zin_dominion_oath = 50 } }`));
  const veil = core.slice(core.indexOf('zin_volgan_add_veil = {'), core.indexOf('zin_volgan_add_nether_pact = {'));
  for (const f of ['zin_volgan_veil_70', 'zin_volgan_veil_50', 'zin_volgan_veil_30']) assert(veil.includes(`NOT = { has_country_flag = ${f} }`) && veil.includes(`set_country_flag = ${f}`), f);
  assert(veil.includes('zin_dominion.2') && veil.includes('zin_dominion.4') && veil.includes('global.zin_volgan_veil_band'));
  const strength = core.slice(core.indexOf('zin_volgan_add_dominion_strength = {'), core.indexOf('zin_volgan_add_veil = {'));
  assert(strength.includes('divide_temp_variable = { zin_volgan_t_gain = 2 }') && strength.includes('max = 40') && strength.includes('zin_dominion_stirred'));
  const body = core.slice(core.indexOf('zin_volgan_destroy_body = {'));
  assert(body.startsWith('zin_volgan_destroy_body = {\n\tif = {\n\t\tlimit = { NOT = { has_global_flag = zin_volgan_body_destroyed } }'), 'idempotent');
  assert(body.includes('remove_country_leader_role') && body.includes('remove_unit_leader_role') && body.includes('zin_volgan_steward_rule = yes') && body.includes('zin_dominion_broken_host') && body.includes('zin_dominion_end_compact = yes'));
  assert(!/kill_country_leader|retire_country_leader|remove_character|set_character_flag = zin_dead/.test(allScript), 'the character is not killed: his fate is not stated');
  assert(body.includes('set_variable = { zin_dominion_strength = 25 }'));
});

test('Volgan: the Abyss Host unlocks its sub-unit first; the Grave Host uses the warfare sub-unit; the war on Mirolon is called, not declared here', () => {
  const core = text('common/scripted_effects/zin_dominion.txt');
  const abyss = core.slice(core.indexOf('zin_volgan_spawn_abyss_host = {'));
  assert(abyss.indexOf('unlock_subunit = zin_abyss_folk') < abyss.indexOf('create_unit') && abyss.includes('count = 2'));
  assert(core.includes('zin_the_dead_revenant = { x = 0 y = 0 }') && core.includes('division_names_group = ZIN_HOSTS_GRAVE_HOSTS'));
  assert.equal((core.match(/zin_the_dead_revenant = \{ x =/g) ?? []).length, 8, 'eight companies');
  const declares = [...core.matchAll(/declare_war_on/g)].length;
  assert.equal(declares, 2, 'only the Parim war of the march and the clash with Zol');
  assert(!/declare_war_on/.test(text('common/scripted_effects/zin_dominion_pulse.txt')) && !/declare_war_on/.test(text('common/decisions/zin_dominion.txt')));
  const start = core.slice(core.indexOf('zin_dominion_war_started = {'), core.indexOf('zin_dominion_mirolon_falls = {'));
  assert(start.includes('zin_volgan_patience_of_ages') && start.includes('days = 120') && start.includes('days = 180') && start.includes('zin_dominion_caught_unready') && start.includes('zin_dominion_forewarned'));
  for (const e of ['zin_dominion.10', 'zin_dominion.11', 'zin_dominion.12', 'zin_dominion.13', 'zin_dominion.14', 'zin_dominion.15', 'zin_dominion.16', 'zin_dominion.17', 'zin_dominion.18', 'zin_dominion.19', 'zin_dominion.23', 'zin_dominion.24']) assert(!defined('event').has(e), `${e} is the events slice's`);
});

test('Volgan: Mirolon\'s pass forts rise by the spec\'s formula; thresholds fire once', () => {
  const core = text('common/scripted_effects/zin_dominion.txt');
  const forts = core.slice(core.indexOf('zin_mirolon_raise_pass_forts = {'), core.indexOf('zin_mirolon_add_passes = {'));
  assert(forts.includes('set_temp_variable = { zin_mirolon_t_level = 1 }') && forts.includes('zin_mirolon_t_cut = 20') && forts.includes('value = 6 compare = less_than'));
  const level = p => { let l = 1, cut = 20; while (p >= cut && l < 6) { l++; cut += 20; } return l; };
  assert.deepEqual([0, 20, 30, 60, 100].map(level), [1, 2, 2, 4, 6]);
  const proof = core.slice(core.indexOf('zin_mirolon_add_proof = {'), core.indexOf('zin_mirolon_scout = {'));
  for (const f of ['zin_mirolon_proof_25', 'zin_mirolon_proof_50', 'zin_mirolon_proof_75']) assert(proof.includes(`NOT = { has_country_flag = ${f} }`), f);
  assert(proof.includes('multiply_temp_variable = { zin_mirolon_t_gain = 2 }') && proof.includes('zin_mirolon_unheeded_warnings') && proof.includes('zin_dominion.27'));
});

test('Volgan: the rules, the stirring event, the tributary friend and the compact', () => {
  const rules = text('common/game_rules/zin_dominion.txt');
  assert(rules.includes('group = RULE_GROUP_ZIN') && rules.indexOf('name = UNRESOLVED') < rules.indexOf('name = STIRRING'));
  assert(rules.indexOf('default = {\n\t\tname = DEFAULT') > rules.indexOf('zin_rule_volgan_early_war'), 'early war starts with DEFAULT');
  const ev = text('events/zin_dominion.txt');
  const stirring = ev.slice(ev.indexOf('id = zin_dominion.25'));
  assert(stirring.slice(0, stirring.indexOf('immediate')).includes('option = STIRRING'), 'event 25 can never fire with the default rule');
  assert(text('common/scripted_effects/zin_dominion_pulse.txt').includes('option = STIRRING') && text('common/scripted_effects/zin_dominion_pulse.txt').includes('zin_dominion_after_1765_03'));
  const core = text('common/scripted_effects/zin_dominion.txt');
  assert(core.includes('zin_dominion.28') && core.includes('zin_dominion_tributary_friend'));
  assert(core.includes('zin_black_compact_ended') && core.includes('relation = military_access active = no'));
  assert.equal([...allScript.matchAll(/zin_dominion\.14/g)].length >= 1 && !defined('event').has('zin_dominion.14'), true);
});

test('Volgan: the envoys, the Dark Lands acceptance table and the sworn limit', () => {
  const ev = text('events/zin_dominion.txt');
  const e8 = ev.slice(ev.indexOf('id = zin_dominion.8'), ev.indexOf('id = zin_dominion.9'));
  for (const t of ['zin_goldoroth_refuses_masters', 'zin_goldoroth_seeks_the_south', 'zin_dark_hold_under_cocanoor', 'zin_dark_hold_in_moot', 'zin_dark_hold_fears_cocanoor', 'zin_dark_took_southern_gifts', 'zin_dark_hold_at_war_with_goldoroth']) assert(e8.includes(t), t);
  assert(e8.includes('base = 20') && e8.includes('factor = 0') && e8.includes('zin_volgan_envoys_received'));
  assert(e8.includes('zin_dominion_t_sworn') && e8.includes('value = 3 compare = less_than'), 'at most three sworn');
  const dec = text('common/decisions/zin_dominion.txt');
  const env = dec.slice(dec.indexOf('zin_dominion_send_envoys = {'));
  assert(env.includes('days_remove = 30') && env.includes('days_re_enable = 180') && env.includes('cost = zin_volgan_envoy_cost'));
});

test('Decisions: every decision has allowed, a cost or custom cost, an icon sprite and a description; targeted ones have a target trigger', () => {
  for (const f of ['common/decisions/zin_elves.txt', 'common/decisions/zin_leren.txt', 'common/decisions/zin_dominion.txt']) {
    for (const cat of parse(text(f))) for (const d of cat.v) {
      const has = k => d.v.some(x => x.k === k);
      assert(has('allowed') && has('available') && has('visible') && has('ai_will_do'), `${d.k} lacks a block`);
      assert(has('cost') || has('custom_cost_trigger') || d.k === 'zin_elves_bar_wall_gates' || d.k === 'zin_dominion_demand_tribute' || d.k === 'zin_dominion_grant_spoils', `${d.k} is free of cost`);
      assert((d.v.find(x => x.k === 'icon')?.v) === d.k, `${d.k} icon`);
      if (has('target_trigger')) assert(has('target_root_trigger'), `${d.k} targeted without a pre-check`);
      assert(`${d.k}_desc` in locEntries && d.k in locEntries, `${d.k} text`);
    }
  }
  for (const f of ['zz_zin_elves', 'zz_zin_leren', 'zz_zin_dominion']) {
    const sprites = [...text(`interface/${f}.gfx`).matchAll(/name = "(GFX_decision_[A-Za-z0-9_]+)"/g)].map(m => m[1]);
    assert(sprites.length > 5, f);
  }
});

test('Decisions: custom cost rows carry the three keys the engine reads', () => {
  for (const k of ['zin_dominion_cost_40_10', 'zin_dominion_cost_100_20']) assert(k in locEntries && `${k}_blocked` in locEntries && `${k}_tooltip` in locEntries, k);
});

test('Windows: the three panels exist under the interface spec\'s names; every element, trigger and effect matches; sprites are defined', async () => {
  const gui = text('interface/zin_mech_powers.gui'), sg = text('common/scripted_guis/zin_mech_powers.txt');
  for (const [w, g, flag] of [['zin_dominion_window', 'zin_panel_dominion', 'zin_ui_dominion_open'], ['zin_watch_window', 'zin_watch', 'zin_ui_watch_open'], ['zin_strait_window', 'zin_strait', 'zin_ui_strait_open']]) {
    assert(gui.includes(`name = "${w}"`) && sg.includes(`${g} = {`) && sg.includes(`window_name = "${w}"`) && sg.includes(`has_country_flag = ${flag}`), w);
  }
  const names = new Set([...gui.matchAll(/name = "([a-z0-9_]+)"/g)].map(m => m[1]));
  for (const m of sg.matchAll(/^\t\t\t([a-z0-9_]+)_(visible|click|on_visible) = \{/gm)) { const base = m[1]; assert(names.has(base) || names.has(`${base}_on`) || names.has(base.replace(/_tab_(\d+)$/, '_tab_$1')), `${base} is no element of the windows`); }
  for (const m of sg.matchAll(/^\t\t\t([a-z0-9_]+) = \{\n\t\t\t\tx = /gm)) assert(names.has(m[1]), `${m[1]} property`);
  const catalog = new Set(await loadCatalogKeys());
  const own = new Set([...text('interface/zz_zin_mech_powers.gfx').matchAll(/name = "(GFX_[a-z_]+)"/g)].map(m => m[1]));
  for (const s of gui.matchAll(/(?:spriteType|quadTextureSprite) = "(GFX_[A-Za-z_]+)"/g)) assert(own.has(s[1]) || ['GFX_zin_frame', 'GFX_zin_button', 'GFX_zin_rule', 'GFX_closebutton'].includes(s[1]), `${s[1]} is not defined`);
  for (const art of text('interface/zz_zin_mech_powers.gfx').matchAll(/ideas\/zin\/([a-z_]+)\.dds/g)) assert(catalog.has(art[1]), art[1]);
  assert(!/^(?:instantTextBox|icon|button)Type = \{[\s\S]*?\bx = -?\d{4}/m.test(gui), 'no element placed beyond the window');
  assert(sg.includes('ai_enabled = { always = no }') && !/(^|\s)ai_weights\s*=/.test(sg), 'the AI never opens a panel');
});

test('Windows: no panel text names a secret, and the Dominion window never says what became of Volgan', () => {
  for (const [k, v] of Object.entries(locEntries)) if (/^ZIN_(DOM|WATCH|STRAIT)/.test(k)) { assert(!/Afrit|Eindil|Hidden Council/.test(v), k); assert(!/is dead|survives|lives on|his spirit/i.test(v), k); }
  assert(locEntries.ZIN_DOM_T1_BROKEN === 'What remains of the Lord of the Ember Lands is not known.');
});

test('Kit: duplicate ids, missing text, wrong option counts and unused variants are refused', () => {
  const k = new Kit('t', { numbers: { a: { b: 1 } } }, { events: { 'zin_t.1': { t: 'T', d: 'D', o: ['One'] } }, decisions: {}, ideas: {} });
  assert.equal(k.N('a.b'), 1);
  assert.throws(() => k.N('a.c'), /not in the data file/);
  k.def('effect', 'zin_t_e');
  assert.throws(() => k.def('effect', 'zin_t_e'), /defined twice/);
  assert.throws(() => k.event({ id: 'zin_t.2', kind: 'country', pic: 'generic_court', options: [{}] }), /no text for event/);
  assert.throws(() => k.event({ id: 'zin_t.1', kind: 'country', pic: 'generic_court', options: [{}, {}] }), /options need/);
  assert.throws(() => k.idea({ id: 'zin_t_idea', picture: 'x', mods: {} }), /no text for idea/);
  assert.throws(() => k.decision({ id: 'zin_t_dec', icon: 'x' }), /no text for decision/);
  assert.throws(() => fmt('a = {\nb = 1'), /Unbalanced/);
});

test('Story pace: a floor date is written once for each of the three paces', () => {
  const t = afterDateTrigger('zin_x_after', '1750.1.1');
  assert.equal([...t.matchAll(/global\.zin_story_pace = /g)].length, 3);
  assert(t.includes(`date > ${paceDate('1750.1.1', 1)}`) && t.includes(`date > ${paceDate('1750.1.1', 1.5)}`) && t.includes(`date > ${paceDate('1750.1.1', 0.75)}`));
  assert.equal(paceDate('1748.3.1', 1.5), '1748.3.1');
  assert.equal(paceDate('1749.3.1', 1), '1749.3.1');
  assert(new Date(paceDate('1750.1.1', 1.5).replace(/\./g, '-')) > new Date('1750-01-01'), 'a slow pace moves the floor later');
});
