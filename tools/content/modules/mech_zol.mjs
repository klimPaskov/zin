// Zol's Mistake (docs/specs/04_mechanics/zols_mistake.md).
//   await buildZol(staged, { countries })
// Writes the scripted triggers and effects, ideas, dynamic modifiers, the Presence's decisions and its mission, the mechanic's own
// events (the ids that 06_events does not carry), on_actions, AI strategies, the Presence panel, the text, and Kusven: Zol's most loyal
// servant, the Great Spirit who comes forth in the War of the Last Crowns in Zol's stead (character zin_kusven, his trait and Kusven's
// Host; owner corrections K4, K11, K29). Kusven is named only in text shown after he has come forth; nothing names a keeper of
// Furviatlon or what feeding is.
import { assertModifiers } from '../lib/core.mjs';
import { zolScripts } from '../lib/mech_zol_script.mjs';
import { zolGui, definedText } from '../lib/mech_court_gui.mjs';
import { Loc, Sprites, loadJson, loadCatalogKeys, hdr, format, list, blk, writeEvent, writeDecision, category, call, wordProblems, secrecyLeaks, notCp1252 } from '../lib/mech_court_lib.mjs';
import { allStates } from './mech_aenor.mjs';

const SPEC = 'docs/specs/04_mechanics/zols_mistake.md';
const MOD = 'mech_zol';

export async function buildZol(staged, ctx) {
  const D = await loadJson('mech_zol.json'), roster = ctx.countries;
  const W = await loadJson('warfare_ids.json'), economy = await loadJson('economy.json');
  const byName = new Map(roster.map(c => [c.name, c]));
  const need = n => { const c = byName.get(n); if (!c) throw new Error(`mech_zol: ${n} is not in the roster`); return c; };
  const T = { zol: need(D.realm).tag, aenor: need(D.aenor).tag, lerendor: need(D.lerendor).tag, volgan: need(D.volgan).tag, gala: need(D.gala).tag };
  T.hostGroup = W.hostGroupByCountry[D.realm];
  const loc = new Loc(), sprites = new Sprites(await loadCatalogKeys());
  const ZOL = T.zol;
  const { triggers, effects } = zolScripts(D, T);
  const dates = triggers.__dates; delete triggers.__dates;

  staged.text('common/scripted_triggers/zin_mistake.txt', format(`${hdr(MOD, SPEC, 'Triggers of Zol\'s Mistake and the pace-shifted floor dates (zin_zol_after_<name>).')}\n${Object.entries(triggers).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([n, b]) => blk(n, b)).join('\n')}\n${dates}\n`));
  staged.text('common/scripted_effects/zin_mistake.txt', format(`${hdr(MOD, SPEC, 'Effects of Zol\'s Mistake. Arguments are the temporary variables zin_arg_<name> (decision E1); -1 in zin_arg_count means all.')}\n${Object.entries(effects).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([n, b]) => blk(n, b)).join('\n')}\n${zolGui.effects()}\n`));
  staged.text('common/scripted_localisation/zin_mistake.txt', format(`${hdr(MOD, SPEC, 'Band words for the Presence panel.')}\n${zolGui.scriptedLoc(D, loc)}\n`));

  // ---------------------------------------------------------------------------------------------- ideas and dynamic modifiers
  const ideas = D.ideas;
  for (const i of ideas) { if (i.mods) await assertModifiers(i.id, i.mods); loc.set(i.id, i.name); loc.set(`${i.id}_desc`, i.desc); }
  const tag = ZOL;
  const ideaBody = i => i.targeted
    ? blk('targeted_modifier', `tag = ${tag}\n${Object.entries(i.targeted).map(([k, v]) => `${k} = ${v}`).join('\n')}`)
    : Object.entries(i.mods).map(([k, v]) => `${k} = ${v}`).join('\n');
  staged.text('common/ideas/zin_mistake.txt', format(`${hdr(MOD, SPEC, 'Mechanic ideas of Zol\'s Mistake (the tree\'s spirits live in zin_focus_zol.txt). The bane and the forewarning are targeted modifiers against Zol.')}\nideas = {\n\tcountry = {\n${ideas.map(i => blk(i.id, `picture = zin_${i.picture}\nallowed = { always = no }\nallowed_civil_war = { always = yes }\nremoval_cost = -1\n${blk('modifier', ideaBody(i))}`)).join('\n')}\n\t}\n}\n`));
  const dm = Object.entries(D.dynamicModifiers);
  for (const [id, m] of dm) { await assertModifiers(id, m.mods.political_power_gain === undefined ? Object.fromEntries(Object.keys(m.mods).map(k => [k, 0])) : { political_power_gain: 0, weekly_manpower: 0 }); loc.set(id, m.name); loc.set(`${id}_desc`, m.desc); sprites.use(`GFX_modifiers_${id}`, m.art); }
  staged.text('common/dynamic_modifiers/zin_mistake.txt', format(`${hdr(MOD, SPEC, 'The Presence (country, values refreshed monthly), the Black Wastes and the Land Made Waste (states).')}\n${dm.map(([id, m]) => blk(id, list(`icon = GFX_modifiers_${id}`, Object.entries(m.mods).map(([k, v]) => `${k} = ${v}`)))).join('\n')}\n`));

  // ---------------------------------------------------------------------------------------------- decisions
  const cat = { zin_mistake_presence: { title: 'The Presence', desc: 'What the Old God does through his servants, and what it costs him. There is little here for a ruler to buy, and a great deal to wait for.', art: 'zol_sigil', picture: 'black_isles', allowed: `original_tag = ${ZOL}`, visible: 'zin_is_zol = yes' } };
  staged.text('common/decisions/categories/zin_mistake.txt', format(`${hdr(MOD, SPEC, 'The Presence (Zol only).')}\n${Object.entries(cat).map(([id, c]) => category(id, c, loc, sprites)).join('\n')}\n`));
  const power = v => `custom_cost_trigger = { ${'check_variable = { zin_mistake_power > ' + (v - 0.01) + ' }'} }`;
  void power;
  const d = [];
  const spend = (n, id) => ({ costTrigger: `check_variable = { zin_mistake_power > ${n - 0.01} }`, costText: `${id}_power_tt`, spendEffect: `set_temp_variable = { zin_arg_value = -${n} }\nzin_zol_add_mistake_power = yes` });
  const hostile = 'base = 0';
  d.push({ id: 'zin_zol_tend_the_presence', icon: 'zol_sigil', art: 'zol_sigil', title: 'Tend the Presence', desc: 'The servants sustain him as they have always done. A ruler who attends the work adds a little to what they bring.', visible: 'zin_is_zol = yes', available: 'NOT = { has_country_flag = zin_zol_tend_cd }\nNOT = { has_country_flag = zin_zol_presence_lapsed }', cost: 50, costTrigger: null,
    effect: `set_temp_variable = { zin_arg_value = 1.5 }\nzin_zol_add_mistake_power = yes\nif = {\nlimit = { has_country_flag = zin_zol_tending }\nadd_political_power = 25\nset_country_flag = { flag = zin_zol_tend_cd days = 90 }\n}\nelse = {\nset_country_flag = { flag = zin_zol_tend_cd days = 120 }\n}`, ai: 'base = 10\nmodifier = {\n factor = 0\n NOT = { has_political_power > 49 }\n}' });
  const call3 = [['great', 75, 365, 'Call Upon the Great', 'The first order of his servants is asked for more. They answer, or they do not, and no one in Aoaz can say why.'], ['lesser', 50, 180, 'Call Upon the Lesser', 'The second order is asked for more, as it has been asked before.'], ['divine', 100, 365, 'Call Upon the Divine', 'The third order is asked for more. It is the least certain, and it answers less often than it should.']];
  for (const [o, pp, cd, title, desc] of call3) {
    const effect = o === 'divine'
      ? `random_list = {\n75 = {\n${call('zin_zol_add_bond_divine', { value: 1 })}\n}\n25 = {\nadd_political_power = ${pp / 2}\ncountry_event = { id = zin_mistake.3 }\n}\n}`
      : call(`zin_zol_add_bond_${o}`, { value: 1 });
    d.push({ id: `zin_zol_call_upon_${o}`, icon: o === 'great' ? 'order_great' : o === 'lesser' ? 'order_lesser' : 'order_divine', art: `order_${o}`, title, desc, visible: 'zin_is_zol = yes\nhas_country_flag = zin_zol_calls_open', available: `${'has_political_power > ' + (pp - 1)}\ncheck_variable = { zin_zol_bond_${o} < 5 }\nNOT = { has_country_flag = zin_zol_presence_lapsed }`, cost: pp, cooldown: cd, effect, ai: `base = 3\nmodifier = {\n factor = 0\n NOT = { has_political_power > 99 }\n}` });
  }
  d.push({ id: 'zin_zol_wake_an_island', icon: 'black_isles', art: 'black_isles', title: 'Wake an Island', desc: 'One of the black islands of the Kusmeel is told to stir. Fishermen will see lights there that are not fires, and some will say so.', visible: 'zin_is_zol = yes', stateTarget: 'any_owned_state', target: 'FROM = {\nzin_is_site_ocean_of_zol_island = yes\nNOT = { has_state_flag = zin_zol_island_stirring }\n}', available: 'has_political_power > 24\nNOT = { has_country_flag = zin_zol_presence_lapsed }', cost: 25, days: 30,
    effect: 'custom_effect_tooltip = zin_zol_wake_tt', remove: 'FROM = { zin_zol_wake_island_here = yes }', ai: 'base = 4\nmodifier = {\n factor = 0\n has_country_flag = zin_zol_wake_cd\n}' });
  loc.set('zin_zol_wake_tt', 'The island stirs in thirty days.');
  d.push({ id: 'zin_zol_raise_a_host', icon: 'grave_host', art: 'grave_host', title: 'Raise a Host', desc: 'A host of the dead stands up where the black ground is thickest. It needs two hundred of the living to fill it and a thousand bonds to hold it, and it does not tire.', visible: 'zin_is_zol = yes\nhas_country_flag = zin_zol_hosts_open', available: 'has_political_power > 9\ncheck_variable = { var = zin_mistake_power value = 2 compare = greater_than_or_equals }\ncheck_variable = { zin_zol_hosts < zin_zol_host_cap }\nNOT = { has_country_flag = zin_zol_presence_lapsed }', cost: 10, days: 15,
    effect: 'custom_effect_tooltip = zin_zol_host_tt', remove: call('zin_zol_raise_host', { count: 1, free: 0 }), ai: 'base = 5\nmodifier = {\n factor = 0\n check_variable = { zin_zol_hosts > 3 }\n NOT = { has_global_flag = zin_zol_rising }\n}\nmodifier = {\n factor = 0\n NOT = { has_global_flag = zin_zol_rising }\n NOT = { check_variable = { zin_mistake_power > 29 } }\n}' });
  loc.set('zin_zol_host_tt', 'A host of the dead is raised in fifteen days.');
  d.push({ id: 'zin_zol_call_the_rising', icon: 'bones_risen', art: 'bones_risen', title: 'The Dead Rise', desc: 'The dead are sent out of the north. The black hulls leave the islands, and the roads of the Mistake fill with ranks that do not tire.', visible: 'zin_is_zol = yes\nOR = {\nhas_country_flag = zin_zol_route_appointed\nhas_country_flag = zin_zol_route_hastened\nhas_country_flag = zin_zol_greater_hour\n}\nNOT = { has_global_flag = zin_zol_rising }', available: 'zin_zol_can_rise = yes', effect: 'zin_zol_rise = yes', ai: 'base = 1000' });
  // Zol never takes the field himself: the decision sends his most loyal servant (K4, K11; alternate_history.md section 9). Its text does not
  // name him, because it is shown before he has come forth.
  d.push({ id: 'zin_zol_send_kusven_decision', icon: 'vast_shadow', art: 'zol_sigil', title: 'Send the Servant', desc: 'His most loyal servant will go out of the black north and take the field himself. What the Presence spends to keep him there is not given back.', visible: 'zin_is_zol = yes\nhas_country_flag = zin_zol_manifest_open', available: 'zin_kusven_can_come_forth = yes', effect: 'zin_zol_send_kusven = yes', ai: 'base = 0\nmodifier = {\n add = 100\n has_global_flag = zin_volgan_body_destroyed\n}\nmodifier = {\n add = 100\n any_enemy_country = { zin_has_potent_magic = yes }\n zin_rules_is_free = yes\n}' });
  const gift = (id, icon, title, desc, n, avail, effect, ai, extra = {}) => d.push({ id, icon, art: icon, title, desc, visible: 'zin_is_zol = yes\nhas_country_flag = zin_zol_expressions_open', available: `${avail}\ncheck_variable = { zin_mistake_power > ${n - 0.01} }`, effect: `set_temp_variable = { zin_arg_value = -${n} }\nzin_zol_add_mistake_power = yes\n${effect}`, ai, ...extra });
  gift('zin_zol_shadow_on_the_land', 'banner_black', 'A Shadow on the Land of [FROM.GetName]', 'A shadow comes down on a neighbour\'s fields. The people there lose heart and no one can say why.', 4, 'has_war_with = FROM', 'FROM = {\nadd_war_support = -0.05\nadd_stability = -0.03\n}', 'base = 3', { target: 'FROM = {\nhas_war_with = ROOT\nis_neighbor_of = ROOT\n}', cooldown: 60 });
  gift('zin_zol_stillness_before_the_form', 'silent_throne', 'Stillness Before the Form', 'The hosts stand still and the islands hold their breath. The Convergence deepens.', 8, 'has_global_flag = zin_zol_rising\ncheck_variable = { zin_zol_convergence < 100 }', call('zin_zol_add_convergence', { value: 5 }), 'base = 2\nmodifier = {\n factor = 0\n NOT = { has_war = yes }\n}', { cooldown: 30 });
  gift('zin_zol_the_dead_endure', 'dead_ranks_far', 'The Dead Endure', 'A breath of the Old God\'s will goes through the host. Broken ranks stand and the fallen rise.', 6, 'has_war = yes', 'add_timed_idea = { idea = zin_zol_the_dead_endure days = 30 }', 'base = 0\nmodifier = {\n add = 50\n any_enemy_country = { any_controlled_state = { is_owned_by = ROOT } }\n}', { cooldown: 30 });
  d.push({ id: 'zin_zol_second_stirring', icon: 'zol_sigil', art: 'zol_sigil', title: 'A Second Stirring', desc: 'The age turns. The dead are called out of the north again.', visible: 'zin_is_zol = yes\nhas_country_flag = zin_zol_second_stirring_open', available: 'zin_zol_after_second_stirring = yes\ncheck_variable = { zin_mistake_power > 59 }\ncheck_variable = { zin_zol_islands_stirring > 3 }\nhas_global_flag = zin_zol_withdrawn', effect: 'zin_zol_second_rise = yes', ai: 'base = 10\nmodifier = {\n factor = 0\n NOT = { zin_rules_is_free = yes }\n}' });
  const missions = [{ id: 'zin_zol_the_form_endures', icon: 'vast_shadow', art: 'zol_sigil', title: 'The Servant Holds the Field', desc: 'Kusven can stand on the field for a few weeks and no longer. When the weeks are out he goes back into the dark of the north.' }];
  const body = [
    ...d.map(x => writeDecision({ ...x, cost: x.cost, allowed: `original_tag = ${ZOL}` }, loc, sprites)),
    ...missions.map(m => { loc.set(m.id, m.title); loc.set(`${m.id}_desc`, m.desc); sprites.use(`GFX_decision_${m.icon}`, m.art); return blk(m.id, `icon = ${m.icon}\nallowed = { always = no }\nactivation = { always = no }\nselectable_mission = no\nis_good = no\ndays_mission_timeout = ${D.formCost.missionDays}\nai_will_do = { base = 0 }\ntimeout_effect = {\nset_temp_variable = { zin_arg_cause = 1 }\nzin_kusven_withdraw = yes\n}`); }),
  ];
  staged.text('common/decisions/zin_mistake.txt', format(`${hdr(MOD, SPEC, 'The Presence: Zol\'s decisions and the mission of the manifestation.')}\nzin_mistake_presence = {\n${body.join('\n')}\n}\n`));

  // ---------------------------------------------------------------------------------------------- events (the ids 06_events does not carry)
  const states = await allStates();
  const regionOfOwner = new Map(roster.map(c => [c.tag, economy.regionByRoster[c.scan]]));
  const provLines = states.filter(s => { const r = regionOfOwner.get(s.owner); return s.owner === ZOL || r === 'middle_lands'; }).map(s => `${s.id} = { set_variable = { zin_zol_first_province = ${s.first} } }`);
  const ev = [];
  ev.push({ id: 1, kind: 'hidden', immediate: list('zin_zol_startup_values = yes', ...provLines) });
  ev.push({ id: 3, kind: 'country', title: 'Silence Among the Divine', picture: 'black_isles_lights', desc: 'The third order of his servants gave nothing, and no one in Aoaz can say why. The Presence does not thin. It waits.', options: [{ key: 'a', text: 'It is noted. The silence is part of the work.' }] });
  ev.push({ id: 4, kind: 'country', title: 'A Service Falters', picture: 'black_isles_lights', desc: 'For reasons no one in Aoaz can name, one order of his servants gives less.',
    trigger: `zin_is_zol = yes\nOR = {\n${ ['great', 'lesser', 'divine'].map(o => `check_variable = { var = zin_zol_bond_${o} value = 2 compare = greater_than_or_equals }`).join('\n') }\n}\nNOT = { has_country_flag = zin_zol_presence_lapsed }`,
    mtth: 'days = 540\nmodifier = {\n factor = 2\n has_country_flag = zin_zol_bonds_steadfast\n}',
    options: [{ key: 'a', text: 'It is given less. It will be given again.', effect: 'zin_zol_falter = yes' }] });
  ev.push({ id: 5, kind: 'country', title: 'The Presence Thins', picture: 'black_isles_lights', desc: 'The Presence is faint. If it goes lower the hosts will stand down, and the north will be quiet in a way it has not been before.', options: [{ key: 'a', text: 'Then the work must be tended.' }] });
  ev.push({ id: 6, kind: 'country', title: 'The Presence Lapses', picture: 'black_isles_lights',
    desc: [{ trigger: 'has_country_flag = zin_zol_presence_lapsed', text: 'The Presence has gone out of Aoaz for now. Whether he returns is not for us to know. The servants keep faith.' }, { text: 'The Presence has come back. It is faint, and it is there.' }],
    options: [{ key: 'a', text: 'We wait.' }] });
  ev.push({ id: 7, kind: 'hidden', immediate: 'zin_zol_restore_order = yes' });
  ev.push({ id: 30, kind: 'news', title: 'A Second Stirring', picture: 'zol_rising', requires: ['zin_zol_rising'], desc: 'The black hulls are seen among the islands again, and the dead are on the roads. The north stirs a second time.', options: [{ key: 'a', text: 'So it is.' }] });
  const written = ev.map(e => writeEvent('zin_mistake', e, loc, { okText: 'So it stands.', hiddenOk: 'The month turns.' }));
  staged.text('events/zin_mistake_mechanic.txt', format(`${hdr(MOD, SPEC, 'Namespace zin_mistake, the mechanic\'s own events. The story events of 06_events (2, 10, 11, 16, 20 to 25) are written by modules/events_mech_war.mjs.')}\nadd_namespace = zin_mistake\n${written.map(w => w.text).join('\n')}\n`));

  // ---------------------------------------------------------------------------------------------- on_actions and AI
  staged.text('common/on_actions/zin_mistake.txt', format(`${hdr(MOD, SPEC, 'Start, the monthly and weekly ticks of Zol, and capitulation (which ends the war with white peace, never an annexation).')}
on_actions = {
	on_startup = {
		effect = {
			${ZOL} = { country_event = { id = zin_mistake.1 } }
		}
	}
	on_monthly_${ZOL} = {
		effect = {
			zin_zol_monthly = yes
		}
	}
	on_weekly_${ZOL} = {
		effect = {
			zin_zol_weekly_manifest = yes
		}
	}
	on_capitulation_immediate = {
		effect = {
			if = {
				limit = { zin_is_zol = yes }
				set_temp_variable = { zin_arg_cause = 1 }
				zin_kusven_withdraw = yes
			}
		}
	}
}
`));
  const strat = (id, type, target, value) => `${id} = {\n\tenable = {\n\t\toriginal_tag = ${ZOL}\n\t\thas_global_flag = zin_zol_rising\n\t\tNOT = { has_country_flag = zin_zol_presence_lapsed }\n\t}\n\tabort = { has_global_flag = zin_zol_withdrawn }\n\tai_strategy = {\n\t\ttype = ${type}\n\t\tid = "${target}"\n\t\tvalue = ${value}\n\t}\n}`;
  staged.text('common/ai_strategy/zin_mistake.txt', format(`${hdr(MOD, SPEC, 'Zol\'s AI after the rising: Aenor first. A barred northern shore moves the weight to the other route (the strait\'s own scripts set the bar).')}\n${[strat('zin_mistake_conquer_aenor', 'conquer', T.aenor, 200), strat('zin_mistake_antagonize_aenor', 'antagonize', T.aenor, 200), strat('zin_mistake_invade_aenor', 'invade', T.aenor, 150)].join('\n')}\n`));

  // ---------------------------------------------------------------------------------------------- Kusven
  // Zol's most loyal servant, a Great Spirit (vault: Kusven). A character with no role at the start: zin_zol_send_kusven recruits him and
  // gives him the field marshal role, zin_kusven_withdraw takes it away again; he is never killed and never a country leader (S4).
  const KV = D.kusven, KT = KV.trait;
  loc.set(KV.character, KV.name);
  loc.set(KT.id, KT.name); loc.set(`${KT.id}_desc`, KT.desc);
  await assertModifiers(KT.id, KT.mods);
  staged.text('common/characters/zin_kusven.txt', format(`${hdr(MOD, SPEC, 'Kusven, Zol\'s most loyal servant (unit leader only; recruited when he comes forth).')}\ncharacters = {\n${blk(KV.character, `name = ${KV.character}\n${blk('portraits', blk('army', `large = ${KV.portrait}`))}`)}\n}\n`));
  staged.text('common/unit_leader/zin_kusven_traits.txt', format(`${hdr(MOD, SPEC, 'The trait of Kusven, the Grave-Wind.')}\nleader_traits = {\n${blk(KT.id, `type = land\ntrait_type = personality_trait\nattack_skill = ${KT.attack}\n${blk('modifier', Object.entries(KT.mods).map(([k, v]) => `${k} = ${v}`).join('\n'))}`)}\n}\n`));

  // ---------------------------------------------------------------------------------------------- the panel and the text
  const gui = zolGui.build(staged, { loc, sprites, file: 'zol_presence' });
  staged.text('interface/zz_zin_zol.gfx', sprites.text(hdr(MOD, SPEC, 'Sprites of the Presence: decision icons, the category, the modifiers and the panel. Every texture is an icon of the catalog.')));
  const entries = loc.entries();
  const problems = [...await wordProblems(entries), ...notCp1252(entries), ...secrecyLeaks(entries), ...Object.entries(entries).filter(([, v]) => /Afrit|Deliverer|Eindil|ō/.test(v)).map(([k]) => `${k}: forbidden name or letter`)];
  if (problems.length) throw new Error(`mech_zol text breaks the rules (${problems.length}):\n  ${problems.slice(0, 30).join('\n  ')}`);
  staged.add('localisation/english/zin_mistake_l_english.yml', loc.bytes());
  const defs = { triggers: [...Object.keys(triggers), ...(dates.match(/^\w+(?= = \{)/gm) ?? [])], effects: [...Object.keys(effects), ...zolGui.effectNames()], ideas: ideas.map(i => i.id), decisions: d.map(x => x.id), missions: missions.map(m => m.id), categories: Object.keys(cat), events: ev.map(e => `zin_mistake.${e.id}`), dynamicModifiers: dm.map(([id]) => id), characters: [KV.character], traits: [KT.id] };
  return { counts: Object.fromEntries(Object.entries(defs).map(([k, v]) => [k, v.length])), definitions: defs, tags: T, loc: entries, gui, eventMeta: written.map(w => w.meta), decisions: d, provinces: provLines.length };
}
