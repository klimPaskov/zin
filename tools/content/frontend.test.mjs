// UI overhaul lane W6: the frontend text, the bookmark (modules/frontend.mjs) and the main-menu and country-selection layouts
// (modules/ui_frontend.mjs). Spec docs/specs/07_interface/03_main_menu_and_frontend.md, builder checks 1 to 6.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { GAME } from './lib/paths.mjs';
import { START_DATE } from './lib/calendar.mjs';
import { countryTable } from './lib/roster.mjs';
import { checkOverrides } from './checks/ui_checks.mjs';
import { topWindows } from './modules/ui_dialogs.mjs';
import { loadFrontend, loadRealmLore, loadTrees, frontendText, bookmarkModel, bookmarkText, sentencesWithin, describe, textProblems,
  definedIdeas, startIdeas, compiledFocuses, locValues, descKey } from './modules/frontend.mjs';
import { frontendOverrides, MENU_SINGLE_PLAYER, MENU_BOTTOM } from './modules/ui_frontend.mjs';

const data = loadFrontend();
const game = existsSync(`${GAME}/interface/frontendmainview.gui`);

test('Frontend: sentences are kept whole within the limit, and a description ends with the founding and the banner', () => {
  assert.equal(sentencesWithin('One two. Three four. Five six.', 20), 'One two. Three four.');
  assert.equal(sentencesWithin('A very long first sentence.', 5), 'A very long first sentence.');
  const d = describe({ today: 'It is calm. It is rich. It is old.', founded: '1A 1', banner: 'A cloak, on blue.' }, { maxChars: 60, foundedLabel: 'Founded', bannerLabel: 'Banner' });
  assert.equal(d, 'It is calm.\n\nFounded 1A 1. Banner: A cloak, on blue.');
  assert.ok(d.length <= 60);
});

test('Frontend: the scan refuses secrets, modern words and scripted text', () => {
  assert.deepEqual(textProblems('x', 'The Golden King feasts.'), []);
  assert.ok(textProblems('x', 'Afrit waits').length);
  assert.ok(textProblems('x', 'Eindil wakes').length);
  assert.ok(textProblems('x', 'the factory').length);
  assert.ok(textProblems('x', '[ROOT.GetName]').length);
});

test('Frontend: the staged-tree readers find ideas at depth two, one-line start blocks, compiled focuses and names', () => {
  const ideas = definedIdeas(['ideas = {\n\tcountry = {\n\t\ta_idea = {\n\t\t\tmodifier = { x = 1 }\n\t\t}\n\t}\n}\n']);
  assert.deepEqual([...ideas], ['a_idea']);
  const s = startIdeas(['\t\t\tAEN = { add_ideas = { zin_culture_x zin_faith_y } set_variable = { a = 1 } }\n\t\t\tAEN = { add_ideas = zin_people_men }\n\t\t\tLER = {\n']);
  assert.deepEqual(s.get('AEN'), ['zin_culture_x', 'zin_faith_y', 'zin_people_men']);
  assert.equal(s.has('LER'), false);
  assert.deepEqual([...compiledFocuses(['focus_tree = {\n\tid = zin_t\n\tfocus = {\n\t\tid = zin_t_a\n'])], ['zin_t_a']);
  assert.equal(locValues(['l_english:\n zin_t_a:0 "The A"\n']).get('zin_t_a'), 'The A');
});

test('Frontend: the menu and difficulty text is the spec text, scanned clean', () => {
  const { loc, replace } = frontendText(data, '0.1.0');
  assert.equal(loc.ZIN_MENU_VERSION, 'Version 0.1.0');
  assert.equal(replace.FE_DIFFICULTY_NORMAL, 'Man-at-arms');
  // four names replaced; Veteran is already the vanilla label (C5 forbids copying it)
  assert.equal(Object.keys(replace).filter(k => !k.endsWith('_TOOLTIP')).length, 4);
  assert.equal(replace.FE_DIFFICULTY_HARD, undefined);
  assert.equal(Object.keys(replace).filter(k => k.endsWith('_TOOLTIP')).length, 5);
  for (const [k, v] of Object.entries({ ...loc, ...replace })) assert.deepEqual(textProblems(k, v), []);
  for (const l of data.labels) assert.equal(loc[l.id], l.name);
});

// A synthetic staged tree for the whole roster: every realm starts with three spirits and every tree focus is compiled and named.
function syntheticModel(mutate = x => x) {
  const countries = countryTable(), trees = loadTrees();
  const table = new Map(countries.map(c => [c.tag, { ideology: 'neutrality' }]));
  const startIdeasByTag = new Map(countries.map(c => [c.tag, [`zin_people_${c.gamePeople}`, `zin_culture_${c.culture}`, `zin_econ_${c.region}`]]));
  const ideas = new Set([...startIdeasByTag.values()].flat());
  const focusIds = new Set(), focusNames = new Map();
  for (const t of trees.values()) for (const f of t.focuses) { focusIds.add(`zin_${t.id}_${f.key}`); focusNames.set(`zin_${t.id}_${f.key}`, f.name); }
  return bookmarkModel(mutate({ data, countries, table, lore: loadRealmLore(), trees, ideas, startIdeasByTag, focusIds, focusNames }));
}

test('Frontend: the bookmark resolves eight great realms, the regional realms by land, and every check passes', () => {
  const m = syntheticModel();
  assert.deepEqual(m.problems, []);
  assert.equal(m.great.length, 8);
  assert.equal(m.great[0].key, data.bookmark.defaultCountry);
  assert.ok(m.minors.length >= 70, `${m.minors.length} realms in the list`);
  const tags = [...m.great, ...m.minors].map(e => e.tag);
  assert.equal(new Set(tags).size, tags.length, 'every realm once');
  for (const e of [...m.great, ...m.minors]) {
    assert.equal(e.focuses.length, 3, e.name);
    assert.ok(e.desc.length <= data.description.maxChars, e.name);
    assert.match(e.desc, /Banner: /, e.name);
  }
  const text = bookmarkText(m, data);
  assert.match(text, new RegExp(`date = ${START_DATE.replace(/\./g, '\\.')}\\n`));
  assert.match(text, /default_country = "AEN"/);
  assert.equal((text.match(/minor = yes/g) ?? []).length, m.minors.length);
  assert.match(text, /"---" = \{\n\t\t\thistory = "ZIN_OTHER_FOURTH_AGE_DESC"/);
  assert.equal(descKey('zols_mistake'), 'ZIN_FOURTH_AGE_DESC_ZOLS_MISTAKE');
  // the Worshipdom's two-faced focuses and the one gated description never reach the frontend
  assert.ok(!m.great.find(e => e.key === 'puvulan').desc.includes('King of Demons'));
});

test('Frontend negative: a missing focus, a missing idea, a secret in a description and a ninth great realm all fail', () => {
  const m = syntheticModel(o => {
    o.focusIds.delete('zin_aenor_the_golden_court');
    o.ideas.delete([...o.startIdeasByTag.get('LER')][0]);
    return { ...o, data: { ...o.data, great: [...o.data.great, { key: 'coldor', focuses: ['winter_crown', 'iron_and_furs', 'northern_accord'] }], descriptionOverrides: { ...o.data.descriptionOverrides, nether: 'Afrit lives here.' } } };
  });
  const all = m.problems.join('\n');
  assert.match(all, /zin_aenor_the_golden_court is not compiled/);
  assert.match(all, /Lerendor: idea .* is not defined/);
  assert.match(all, /Nether: description: gated: Afrit/);
  assert.match(all, /9 great realms; the row holds 8/);
});

test('Frontend overrides: every vanilla element name kept, hidden controls below their windows, the stacks closed up', { skip: !game && 'no installed game' }, () => {
  const files = frontendOverrides();
  const r = checkOverrides({ files: new Map([...files].map(([k, v]) => [k, Buffer.from(v, 'latin1')])) });
  assert.deepEqual(r.problems.map(p => p.message), []);
  assert.equal(r.notes.checked, 2);
  for (const name of ['sp_tutorial_button']) assert.match(MENU_SINGLE_PLAYER, new RegExp(`name = "${name}"[\\s\\S]*?y = 2000[\\s\\S]*?hide = yes`));
  for (const name of ['career_profile_button', 'nudge_button', 'subscription_widget', 'subscription_widget_subscribed', 'subscription_widget_simp_chinese']) assert.match(MENU_BOTTOM, new RegExp(`name = "${name}"[\\s\\S]*?y = 2000[\\s\\S]*?hide = yes`));
  const menu = files.get('interface/frontendmainview.gui');
  for (const w of ['mainmenu_dlc_ownership', 'mainmenu_achievement_button']) {
    const b = topWindows(menu).find(x => x.name === w);
    assert.match(menu.slice(b.start, b.end), /hide = yes/, w);
  }
  // the visible buttons sit on the 40 px step of the vanilla stack with no gap
  const ys = s => [...s.matchAll(/name = "([a-z_]+_button)"\s*\n\s*position = \{ x = 16 y = (\d+) \}/g)].filter(m => m[2] !== '2000').map(m => Number(m[2]));
  assert.deepEqual(ys(MENU_SINGLE_PLAYER), [18, 58, 98, 138]);
  assert.deepEqual(ys(MENU_BOTTOM), [18, 58, 98, 138, 178, 218]);
  const setup = files.get('interface/frontendgamesetupview.gui');
  assert.match(setup, /name = "country_filter"\s*\n\s*size = \{ width = 104/);
  const sel = topWindows(setup).find(x => x.name === 'gamesetup_interesting_countries_window');
  assert.doesNotMatch(setup.slice(sel.start, sel.end), /hoi4_typewriter/, 'no black ink on the woad body');
  assert.match(setup, /name = "history"\s*\n\s*position = \{ x = 808 y = 496 \}[\s\S]*?maxWidth = 388\s*\n\s*maxHeight = 176/);
});
