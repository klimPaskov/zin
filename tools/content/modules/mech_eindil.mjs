// ZIN mechanic module: Eindil's journey (docs/specs/04_mechanics/eindil_journey.md). The twelve stages of the heir's road with their floors
// (three story-pace sets), hosts, renown, regard and delay, the guest rules, the battles of the return, the Host of Eindil, the palace
// decisions and the coronation hand-over. The narrative events of namespace zin_eindil (ids 10 to 169) belong to events_eindil.mjs; this module
// defines the hidden events (1 to 7), every scripted effect and trigger the spec names, the ideas, traits, decisions, opinion modifiers,
// characters, game rule, on_actions and AI strategy. Integration note: docs/design/stage2/mech_journey.md.
//
//   const result = await buildEindilJourney(staged, { countries });
//
// ctx.countries    the roster; countries are named in the data and resolved to tags here
// ctx.eindilData   optional replacement of tools/content/data/mech_journey_eindil.json (negative tests)
// ctx.eindil       optional switches: externalCharacters (ids another module defines), cosmeticFile (stage common/countries/cosmetic.txt)
//
// Returns { counts, definitions, scripts, dependencies, files, localisation, startup, tags, stageFloors }.
import { cw, raw } from '../lib/core.mjs';
import { HEADER, L, render, fileText, comment, readJson, makeRoster, Loc, ScriptSet, eventLines, num, dateAfter, paceOr, paceChoose, PACES, shiftedDays, dayNumber } from '../lib/mech_journey_lib.mjs';
import { eindilScripts } from './mech_eindil_scripts.mjs';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { ZIN } from '../lib/paths.mjs';
import { decodeRgba } from '../lib/image_codec.mjs';
import { fromRaw, tga } from '../lib/raster.mjs';

// The cosmetic flag of the Host of Eindil: the generated flag of the sworn country (Selen) graded toward ice and silver (code only converts a
// generated image; the art pipeline replaces it with a drawn flag). Returns { rel: bytes } for the three sizes, or {} when no source exists.
export async function hostFlag(tag, staged) {
  const out = {};
  for (const dir of ['gfx/flags', 'gfx/flags/medium', 'gfx/flags/small']) {
    const rel = `${dir}/${tag}.tga`;
    const bytes = staged?.files.get(rel) ?? (existsSync(`${ZIN}/${rel}`) ? await readFile(`${ZIN}/${rel}`) : null);
    if (!bytes) continue;
    const img = await decodeRgba(bytes, 'tga');
    if (!img) continue;
    const px = Buffer.from(img.data);
    for (let i = 0; i < px.length; i += 4) { const l = (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11); px[i] = Math.min(255, l * 0.72 + 60); px[i + 1] = Math.min(255, l * 0.86 + 70); px[i + 2] = Math.min(255, l * 1.0 + 80); }
    out[`${dir}/zin_host_of_eindil.tga`] = tga(fromRaw(px, img.width, img.height));
  }
  return out;
}

export async function buildEindilJourney(staged, ctx = {}) {
  const data = ctx.eindilData ?? await readJson('mech_journey_eindil.json');
  const opt = ctx.eindil ?? {};
  const roster = makeRoster(ctx.countries);
  const TAG = Object.fromEntries(Object.entries(data.countries).map(([k, name]) => [k, roster.tag(name)]));
  const C = data.constants, ch = data.characters;
  const loc = new Loc('zin_eindil_mech');
  const scripts = new ScriptSet();
  const files = [];
  const put = (rel, text) => { if (Buffer.isBuffer(text)) staged.add(rel, text); else staged.text(rel, text); files.push(rel); };
  const defs = { events: [], effects: [], triggers: [], ideas: [], decisions: [], categories: [], traits: [], opinions: [], characters: [], rules: [] };

  // ---------------------------------------------------------------------------------------------- constants
  put('common/script_constants/zin_eindil_constants.txt', `${HEADER}\n# Tuning of Eindil's journey (tools/content/data/mech_journey_eindil.json).\nzin_eindil = {\n\tschema = {\n\t\tany_key = yes\n\t\tdata = int\n\t}\n\n${Object.entries(C).map(([k, v]) => `\t${k} = ${v}`).join('\n')}\n}\n`);

  // ---------------------------------------------------------------------------------------------- spirits and traits
  const ideas = {};
  for (const s of data.spirits) { ideas[s.id] = { picture: `zin_${s.icon}`, allowed: raw('{ always = no }'), allowed_civil_war: raw('{ always = yes }'), removal_cost: -1, modifier: s.modifier }; loc.add(s.id, s.name); loc.add(`${s.id}_desc`, s.desc); defs.ideas.push(s.id); }
  put('common/ideas/zin_eindil.txt', `${HEADER}\nideas = {\n\tcountry = {\n${cw(ideas, 2)}\t}\n}\n`);
  const unitTraits = {};
  for (const t of data.unitLeaderTraits) {
    unitTraits[t.id] = { type: 'land', trait_type: t.trait_type ?? 'personality_trait', ...t.skills, ...(Object.keys(t.modifier).length ? { modifier: t.modifier } : {}) };
    loc.add(t.id, t.name); loc.add(`${t.id}_desc`, t.desc); defs.traits.push(t.id);
  }
  put('common/unit_leader/zin_eindil.txt', `${HEADER}\nleader_traits = {\n${cw(unitTraits, 1)}}\n`);
  const leaderTraits = {};
  for (const t of data.countryLeaderTraits) { leaderTraits[t.id] = { random: false, ...t.modifier }; loc.add(t.id, t.name); loc.add(`${t.id}_desc`, t.desc); defs.traits.push(t.id); }
  put('common/country_leader/zin_eindil.txt', `${HEADER}\nleader_traits = {\n${cw(leaderTraits, 1)}}\n`);
  const opin = {};
  for (const o of data.opinionModifiers) { opin[o.id] = { value: o.value, ...(o.decay ? { decay: o.decay } : {}) }; loc.add(o.id, o.name); defs.opinions.push(o.id); }
  put('common/opinion_modifiers/zin_eindil.txt', `${HEADER}\nopinion_modifiers = {\n${cw(opin, 1)}}\n`);

  // ---------------------------------------------------------------------------------------------- characters
  const ext = opt.externalCharacters ?? [];
  const portrait = { civilian: { large: ch.portrait }, army: { large: ch.portrait } };
  const chars = {};
  for (const id of [ch.eindil, ch.varner, ch.golbran, ch.companion1, ch.companion2]) if (!ext.includes(id)) chars[id] = { name: id, portraits: portrait };
  if (Object.keys(chars).length) put('common/characters/zin_eindil.txt', `${HEADER}\ncharacters = {\n${cw(chars, 1)}}\n`);
  defs.characters.push(...Object.keys(chars));
  for (const [k, v] of Object.entries(data.locExtra)) if (!(ext.includes(k) && ['zin_eindil', 'zin_varner', 'zin_golbran'].includes(k))) loc.add(k, v);

  // ---------------------------------------------------------------------------------------------- stage floors and the scripts
  const floors = data.stages.filter(s => s.floor).map(s => ({ n: s.n, key: s.key, date: s.floor, sets: Object.fromEntries(PACES.map(p => [p.key, shiftedDays(s.floor, p.value)])) }));
  for (const s of data.stages) { loc.add(`zin_eindil_stage_${s.n}`, s.name); loc.add(`zin_eindil_stage_${s.n}_desc`, s.desc); }
  loc.add('zin_eindil_stage_0', 'Asleep'); loc.add('zin_eindil_stage_0_desc', 'Nothing in Aoaz stirs that the chronicles know of.');
  const S = eindilScripts({ data, TAG, C, floors, roster, dep: (n, k, o) => scripts.depend(n, k, o) });
  for (const t of S.triggers) { scripts.add(t.name, 'trigger', t.body); defs.triggers.push(t.name); }
  for (const e of S.effects) { scripts.add(e.name, 'effect', e.body); defs.effects.push(e.name); }
  put('common/scripted_triggers/zin_eindil.txt', fileText(comment('Triggers of Eindil\'s journey. The floor trigger holds the three story-pace date sets as day offsets from the start date.'), ...S.triggers.map(d => render(L(d.name, ...d.body)))));
  put('common/scripted_effects/zin_eindil.txt', fileText(comment('Effects of Eindil\'s journey. Arguments are temporary variables zin_arg_<name> set just before the call (E1).'), ...S.effects.map(d => render(L(d.name, ...d.body)))));

  // ---------------------------------------------------------------------------------------------- hidden events
  const events = [];
  const addEvent = e => { events.push(e); defs.events.push(`zin_eindil.${e.id}`); };
  addEvent({ id: 1, hidden: true, immediate: [
    '# Journey setup: the clock, the stage table, the waking floor; then the pulse.',
    'zin_eindil_setup = yes', 'zin_eindil_arm_pulse = yes'] });
  addEvent({ id: 2, hidden: true, immediate: ['zin_eindil_arm_pulse = yes', 'zin_eindil_pulse = yes'] });
  for (const e of events) scripts.add(`zin_eindil.${e.id}`, 'event', eventLines({ ns: 'zin_eindil', ...e }));
  put('events/zin_eindil_mech.txt', fileText('add_namespace = zin_eindil', ...events.map(e => render(eventLines({ ns: 'zin_eindil', ...e })))));

  // ---------------------------------------------------------------------------------------------- decisions
  for (const [k, v] of Object.entries(data.tooltips)) loc.add(k, v);
  for (const c of data.categories) { loc.add(c.id, c.name); loc.add(`${c.id}_desc`, c.desc); defs.categories.push(c.id); }
  const cats = {};
  for (const d of S.decisions) {
    const t = data.decisions[d.id];
    if (!t) throw new Error(`No text for decision ${d.id}`);
    loc.add(d.id, t.name); loc.add(`${d.id}_desc`, t.desc); defs.decisions.push(d.id);
    (cats[t.cat] ??= []).push(d); scripts.add(d.id, 'decision', L(d.id, `icon = zin_${t.icon}`, ...d.body));
  }
  put('common/decisions/categories/zin_eindil.txt', fileText(...data.categories.map(c => render(L(c.id, 'allowed = { always = yes }', `icon = zin_${c.icon}`, 'priority = 6')))));
  put('common/decisions/zin_eindil.txt', fileText(...Object.entries(cats).map(([c, ds]) => render(L(c, ...ds.map(d => L(d.id, `icon = zin_${data.decisions[d.id].icon}`, ...d.body)))))));

  // ---------------------------------------------------------------------------------------------- game rule
  const r = data.rules.journey;
  put('common/game_rules/zin_eindil.txt', fileText(render(L(r.id, `name = "${r.id.toUpperCase().replace('ZIN_RULE_', 'ZIN_RULE_')}"`, `desc = "${r.id.toUpperCase()}_DESC"`, 'group = "RULE_GROUP_ZIN"',
    ...r.options.map((o, i) => L(i === 0 ? 'default' : 'option', `name = ${o.id}`, `text = "${r.id.toUpperCase()}_${o.id}"`, `desc = "${r.id.toUpperCase()}_${o.id}_DESC"`))))));
  loc.add(r.id.toUpperCase(), r.name); loc.add(`${r.id.toUpperCase()}_DESC`, r.desc);
  for (const o of r.options) { loc.add(`${r.id.toUpperCase()}_${o.id}`, o.name); loc.add(`${r.id.toUpperCase()}_${o.id}_DESC`, o.desc); }
  defs.rules.push(r.id);

  // ---------------------------------------------------------------------------------------------- on actions and AI
  put('common/on_actions/zin_eindil.txt', fileText(render(L('on_actions',
    L('on_startup', L('effect', ...S.startup)),
    L('on_annex', L('effect', L('if', 'limit = { has_global_flag = zin_eindil_awake has_variable = global.zin_eindil_host FROM = { zin_eindil_is_host = yes } check_variable = { global.zin_eindil_stage < 9 } }', 'zin_eindil_host_lost = yes'))),
    L('on_capitulation', L('effect', L('if', 'limit = { has_global_flag = zin_eindil_awake has_variable = global.zin_eindil_host zin_eindil_is_host = yes check_variable = { global.zin_eindil_stage < 9 } }', 'zin_eindil_host_lost = yes')))))));
  scripts.add('on_actions', 'on_action', [...S.startup, 'if = { limit = { has_global_flag = zin_eindil_awake has_variable = global.zin_eindil_host FROM = { zin_eindil_is_host = yes } check_variable = { global.zin_eindil_stage < 9 } } zin_eindil_host_lost = yes }']);
  put('common/ai_strategy/zin_eindil.txt', fileText(comment('The Host of Eindil fights the dead first, then the south, then the realm the false god rules, and protects Parim when it is friendly.'), ...S.aiStrategies.map(a => render(a))));

  // ---------------------------------------------------------------------------------------------- cosmetic tag, interface
  if (opt.cosmeticFile) put('common/countries/cosmetic.txt', `${HEADER}\n# Cosmetic tag of the Host of Eindil (the name of the sworn country that raises the heir's host).\nzin_host_of_eindil = {\n\tcolor = rgb { 188 214 224 }\n\tcolor_ui = rgb { 214 232 240 }\n}\n`);
  if (opt.hostFlag !== false) { const sw = roster.tag(data.countries.selen); for (const [rel, bytes] of Object.entries(await hostFlag(sw, staged))) put(rel, bytes); }
  const sprites = [], seen = new Set();
  const addSprite = (name, tex) => { if (seen.has(name)) return; seen.add(name); sprites.push(`\tspriteType = {\n\t\tname = "${name}"\n\t\ttexturefile = "gfx/interface/ideas/zin/${tex}.dds"\n\t}`); };
  for (const d of Object.values(data.decisions)) addSprite(`GFX_decision_zin_${d.icon}`, d.icon);
  for (const c of data.categories) addSprite(`GFX_decision_category_zin_${c.icon}`, c.icon);
  put('interface/zin_eindil.gfx', `spriteTypes = {\n${sprites.join('\n')}\n}\n`);
  staged.loc('zin_eindil_mech', loc.entries);
  files.push('localisation/english/zin_eindil_mech_l_english.yml');

  return {
    counts: { events: defs.events.length, effects: defs.effects.length, triggers: defs.triggers.length, ideas: defs.ideas.length, decisions: defs.decisions.length, categories: defs.categories.length, traits: defs.traits.length, characters: defs.characters.length, files: files.length, loc: Object.keys(loc.entries).length },
    definitions: defs, scripts: scripts.items, dependencies: [...scripts.depends.values()].sort((a, b) => a.name.localeCompare(b.name)), files: files.sort(), localisation: loc.entries,
    startup: S.startup, tags: TAG, stageFloors: floors, firedEvents: S.firedEvents,
  };
}
