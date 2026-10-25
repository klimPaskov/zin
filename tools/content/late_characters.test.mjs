// Tests of modules/late_characters.mjs: characters an in-game effect brings into play wait without a role in their home realm's history,
// and the effect moves them, gives them their roles and sets their flag of entry, which every presence test also asks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Staged } from './lib/core.mjs';
import { applyLateCharacters, inPlayFlag, roleEffect } from './modules/late_characters.mjs';
import { checkEngineForms } from './checks/engine_forms.mjs';
import { parse } from './lib/clausewitz.mjs';

const countries = [{ name: 'Alpha', tag: 'ALP' }, { name: 'Beta', tag: 'BET' }];
const courts = [{ name: 'Alpha', tag: 'ALP', ruler: { id: 'ALP_zin_ruler' }, advisors: [{ id: 'zin_alpha_sage' }], commanders: [] }];
function fixture() {
  const s = new Staged();
  s.text('common/characters/x.txt', 'characters = {\n\tzin_alpha_sage = {\n\t\tname = zin_alpha_sage\n\t\tadvisor = {\n\t\t\tslot = political_advisor\n\t\t\tidea_token = zin_alpha_sage_adv\n\t\t\tallowed = { original_tag = ALP }\n\t\t\tvisible = { always = yes }\n\t\t\ttraits = { zin_t }\n\t\t\tcost = 150\n\t\t\tai_will_do = { factor = 1 }\n\t\t}\n\t}\n\tzin_wanderer = {\n\t\tname = zin_wanderer\n\t}\n\tzin_old_friend = {\n\t\tname = zin_old_friend\n\t\tcorps_commander = { traits = { } skill = 2 attack_skill = 2 defense_skill = 1 planning_skill = 1 logistics_skill = 1 }\n\t}\n}\n');
  s.text('history/countries/ALP - Alpha.txt', 'capital = 1\nrecruit_character = ALP_zin_ruler\nset_politics = { ruling_party = neutrality }\n');
  s.text('history/countries/BET - Beta.txt', 'capital = 2\nrecruit_character = zin_old_friend\nset_politics = { ruling_party = neutrality }\n');
  s.text('common/national_focus/x.txt', 'focus_tree = {\n\tfocus = {\n\t\tid = x\n\t\tcompletion_reward = {\n\t\t\trecruit_character = zin_alpha_sage # the sage comes\n\t\t\tBET = { recruit_character = zin_wanderer }\n\t\t\trecruit_character = zin_old_friend\n\t\t}\n\t}\n}\n');
  s.text('common/scripted_triggers/x.txt', 'zin_wanderer_here = {\n\tany_country = { has_character = zin_wanderer }\n\thas_character = zin_old_friend\n}\n');
  return s;
}
const homes = { zin_wanderer: { realm: 'Beta', why: 'test' } };

test('A waiting character is recruited without a role in its home history, before the politics; the call moves it and adds its roles once', async () => {
  const s = fixture();
  const r = await applyLateCharacters(s, { countries, homes, courts });
  assert.deepEqual([r.calls, r.waiting, r.ids, r.homes], [3, 2, ['zin_alpha_sage', 'zin_wanderer'], { zin_alpha_sage: 'ALP', zin_wanderer: 'BET' }]);
  const alp = s.files.get('history/countries/ALP - Alpha.txt').toString();
  assert(alp.indexOf('recruit_character = zin_alpha_sage') < alp.indexOf('set_politics'));
  assert(s.files.get('history/countries/BET - Beta.txt').toString().includes('recruit_character = zin_wanderer'));
  const chars = s.files.get('common/characters/x.txt').toString();
  assert(!/zin_alpha_sage = \{[^]*?advisor = \{[^]*?\n\t\}/.test(chars.split('zin_wanderer')[0]), 'the advisor role left the definition');
  assert(chars.includes('corps_commander'), 'a character some history recruits keeps its roles');
  const f = s.files.get('common/national_focus/x.txt').toString();
  assert(f.includes('if = { limit = { NOT = { has_character = zin_alpha_sage } } zin_alpha_sage = { set_nationality = PREV } }'));
  assert(f.includes(`if = { limit = { NOT = { has_global_flag = ${inPlayFlag('zin_alpha_sage')} } } set_global_flag = zin_in_play_alpha_sage add_advisor_role = { character = zin_alpha_sage advisor = { slot = political_advisor idea_token = zin_alpha_sage_adv allowed = { original_tag = ALP } traits = { zin_t } cost = 150 } } }`));
  assert(f.includes('# the sage comes'), 'comments stay');
  assert(f.includes('if = { limit = { NOT = { has_character = zin_old_friend } } zin_old_friend = { set_nationality = PREV } }') && !f.includes('zin_in_play_old_friend'), 'a character in a history is only moved');
  const t = s.files.get('common/scripted_triggers/x.txt').toString();
  assert(t.includes('any_country = { AND = { has_character = zin_wanderer has_global_flag = zin_in_play_wanderer } }'));
  assert(t.includes('\thas_character = zin_old_friend'), 'presence of a character recruited at the start is unchanged');
  assert.deepEqual(checkEngineForms(s.files).errors.filter(e => e.rule === 'recruit_in_game'), []);
});

test('Roles become their effects; an unknown home or a stale home row fails', async () => {
  const cl = parse('country_leader = { ideology = zin_light_wardens traits = { a } expire = "2000.1.1.1" id = -1 }')[0];
  assert.equal(roleEffect('zin_x', cl), 'add_country_leader_role = { character = zin_x country_leader = { ideology = zin_light_wardens traits = { a } expire = "2000.1.1.1" } }');
  const nl = parse('navy_leader = { traits = { } skill = 3 visible = { always = yes } }')[0];
  assert.equal(roleEffect('zin_x', nl), 'add_naval_commander_role = { character = zin_x traits = { } skill = 3 }');
  await assert.rejects(applyLateCharacters(fixture(), { countries, homes: {}, courts }), /zin_wanderer: no home realm/);
  await assert.rejects(applyLateCharacters(fixture(), { countries, homes: { ...homes, zin_nobody: { realm: 'Alpha' } }, courts }), /names zin_nobody, which no effect brings into play/);
});
