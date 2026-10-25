// The deep past (owner decision K64 of 25 October 2026; spec docs/specs/04_mechanics/deep_past.md; addendum
// docs/plans/deep_history/k62_fallen_realms.md sections 6.3 to 6.12): the six fallen realms of Aoaz in play. Muzerar is pieced
// together from three keepers who distrust each other, Tarkia is a crossing with two halves, the Kalioth Crown is one dangerous
// object, Gromatrak is four sealed doors, Margorodai is a dead harbour, and the Sunfields come back a find at a time out of the ice.
//
//   const deep = await buildDeepPast(staged, { countries })   // build.mjs, after the mechanic slices; zin_story_tick calls zin_story_tick_deep
//     returns { counts, definitions, fired, siteRows }
//
// Audiences follow K61: every event goes to the realm that acts, the realms a keeping or a moot links to it, and its neighbours by a
// minor report; nothing here is world news, and nothing iterates every country on a schedule (the one monthly block runs on the world
// runner and names its realms). Sites are resolved by rules at the start (lib/deep_past_script.mjs), never by state numbers, because the
// map import renumbers the states. Restorations are cosmetic identities on existing tags (no new tag; S12). The six elder arts are rows of
// the technology tree with the field `recovered` (modules/technologies.mjs); this module sets their discovery flags.
//
// Data: tools/content/data/deep_past.json (realms by roster name, tuning, every text). Script text: lib/deep_past_script.mjs.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertModifiers } from '../lib/core.mjs';
import { Loc, Sprites, loadCatalogKeys, hdr, format, blk, list, num, writeDecision, category, wordProblems, notCp1252, unknownCommands, DATA } from '../lib/mech_court_lib.mjs';
import { renderMechEvents, structureProblems, textProblems, definedEventIds } from './events_mech.mjs';
import { loadPictures } from './events_world.mjs';
import { deepScripts, deepEvents } from '../lib/deep_past_script.mjs';

const MOD = 'deep_past';
const SPEC = 'docs/specs/04_mechanics/deep_past.md';
export const DATA_FILE = 'deep_past.json';
export const LOC_NAME = 'zin_deep_past';
export const FILES = {
  constants: 'common/script_constants/zin_deep_past.txt',
  triggers: 'common/scripted_triggers/zin_deep_past.txt',
  effects: 'common/scripted_effects/zin_deep_past.txt',
  ideas: 'common/ideas/zin_deep_past.txt',
  opinions: 'common/opinion_modifiers/zin_deep_past.txt',
  dynamic: 'common/dynamic_modifiers/zin_deep_past.txt',
  categories: 'common/decisions/categories/zin_deep_past.txt',
  decisions: 'common/decisions/zin_deep_past.txt',
  onActions: 'common/on_actions/zin_deep_past.txt',
  sloc: 'common/scripted_localisation/zin_deep_past.txt',
  achievements: 'common/achievements/zin_deep_past.txt',
  events: 'events/zin_deep.txt',
  gfx: 'interface/zz_zin_deep_past.gfx',
};
// The keys of event, decision and mission blocks and the arguments of the engine effects written here, besides the documented commands.
const SCRIPT_KEYS = new Set(['immediate', 'is_triggered_only', 'option', 'timeout_days', 'hidden', 'add_namespace', 'allowed', 'available', 'visible', 'complete_effect', 'remove_effect',
  'cost', 'days_re_enable', 'days_remove', 'target_root_trigger', 'target_trigger', 'targets', 'ai_will_do', 'icon', 'activation', 'days_mission_timeout', 'is_good', 'selectable_mission',
  'timeout_effect', 'fire_only_once', 'state', 'modifier', 'value', 'random_list', 'meta_trigger', 'Y', 'array', 'break', 'remove_idea', 'add_idea', 'transfer_troops', 'instant_build',
  'level', 'province', 'capital_scope', 'controller', 'owner', 'on_actions', 'on_startup', 'effect', 'convoy', 'num_owned_states', 'west_lift', 'value_var', 'all_provinces', 'limit_to_coastal', 'building', 'bonus', 'uses', 'technology', 'scope', 'flag', 'days', 'var', 'min', 'max', 'type', 'amount', 'target', 'name']);
// Rule rows for the key-sites table (decision E7, docs/specs/01_map/02_key_sites.md section 3). The module resolves them at the start with
// state flags (zin_deep_site_<key>) until modules/sites.mjs exists; then the rows move there unchanged.
export const SITE_ROWS = [
  { key: 'eldest_barrow', kind: 'state', rule: { capital: 'Cursed Lands' } },
  { key: 'eldest_cairn', kind: 'state', rule: { capital: 'Hirolon' } },
  { key: 'tide_chambers', kind: 'state', rule: { capital: 'Orohaf' } },
  { key: 'mothers_mound_shore', kind: 'state', rule: { capital: 'Orohaf' }, note: 'becomes state_name "The Mothers\' Mound" once the map import adds the islet (K64)' },
  { key: 'nimlan_banks', kind: 'list', rule: { owned: ['Orohaf', 'Hirolon'], filter: 'coastal' } },
  { key: 'gate_west', kind: 'state', rule: { capital: 'Luv-zhise' } },
  { key: 'gate_east', kind: 'state', rule: { capital: 'Delbiz' } },
  { key: 'old_roads_end', kind: 'state', rule: { capital: 'Eldafaen' } },
  { key: 'old_ditches', kind: 'state', rule: { capital: 'Noleksun' } },
  { key: 'kalioth_halls', kind: 'state', rule: { capital: 'Erco' }, note: 'becomes state_name Kalioth once the map import names an Erco state for the upland' },
  { key: 'sea_door', kind: 'list', rule: { capital: ['Kunhrim', 'Hrakbrund', 'Brundahrim', 'Gromkerm'] } },
  { key: 'cursed_square_shore', kind: 'state', rule: { capital: 'Benan', filter: 'coastal', else: 'a coastal state of Benan' } },
  { key: 'frozen_lands', kind: 'list', rule: { owned: ['Coldor'], filter: 'not coastal (the interior)' } },
  { key: 'far_ice', kind: 'list', rule: { owned: ['Kvittumm'] } },
  { key: 'river_names', kind: 'list', rule: { owned: ['Aenor'], filter: 'adjacent_to Bloody Forest' } },
  { key: 'plutondo_valley', kind: 'list', rule: { owned: ['Plutondo'] } },
  { key: 'miaed_passes', kind: 'list', rule: { owned: ['Miaed'] } },
  { key: 'pornivior_road', kind: 'list', rule: { owned: ['Pornivior'] } },
  { key: 'konorar_valley', kind: 'list', rule: { owned: ['Konori'] } },
  { key: 'free_steadings', kind: 'list', rule: { owned: ['Fearno'] } },
];

export async function loadDeepPast() {
  const D = JSON.parse(await readFile(path.join(DATA, DATA_FILE), 'utf8'));
  if (D.kind !== 'deep_past') throw new Error(`${DATA_FILE}: kind must be deep_past`);
  return D;
}

// The plan: the realm codes of the data resolved to the roster's tags by name.
export function deepPlan(countries, D) {
  const byName = new Map(countries.map(c => [c.name, c]));
  const t = {};
  for (const [code, name] of Object.entries(D.realms)) {
    const c = byName.get(name);
    if (!c) throw new Error(`deep_past: ${name} (${code}) is not in the roster`);
    t[code] = c.tag;
  }
  return { t };
}

// Names that may appear only behind their gates (6.1: a realm learns Muzerar from the Veiled, not from the narrator). Returns problems.
export function gatedNameProblems(entries, allowed, names) {
  const re = new RegExp(`\\b(${names.map(n => n.replace(/[-]/g, '\\-')).join('|')})\\b`);
  return Object.entries(entries).filter(([k, v]) => !allowed(k) && re.test(v)).map(([k, v]) => `${k}: names ${v.match(re)[1]} before its gate`);
}
// Dates before Aen show only as "long before Aen" (K64): no count of years before Aen in any text.
export function preAenProblems(entries) {
  return Object.entries(entries).filter(([, v]) => /\b\d[\d,]*\s+years before Aen\b|\b\d+\s*BA\b/.test(v)).map(([k]) => `${k}: a count of years before Aen`);
}

export async function buildDeepPast(staged, { countries, data } = {}) {
  const D = data ?? await loadDeepPast();
  const N = D.constants;
  if (N.dive_month_a > 11 || N.dive_month_b > 11) throw new Error('deep_past: the dive months must be 1 to 11 (the window runs to the first of the next month)');
  const P = deepPlan(countries, D);
  const S = deepScripts(D, P);
  const loc = new Loc(), sprites = new Sprites(await loadCatalogKeys());
  sprites.decisionPrefix = 'zin_deep_';
  const problems = [];
  const sorted = o => Object.entries(o).sort(([a], [b]) => a.localeCompare(b, 'en'));

  // constants, triggers, effects
  staged.text(FILES.constants, format(`${hdr(MOD, SPEC, 'Tuning of the deep past (tools/content/data/deep_past.json). Fixed point. The builder writes the same numbers into the scripts.')}\ndeep_past = {\nschema = {\nany_key = yes\ndata = fixed_point\n}\n${Object.entries(N).map(([k, v]) => `${k} = ${num(v)}`).join('\n')}\n}\n`));
  staged.text(FILES.triggers, format(`${hdr(MOD, SPEC, 'Triggers of the deep past: the heirs, the keepings, the sites (state flags zin_deep_site_<key> set at the start), the windows and the gates.')}\n${sorted(S.T).map(([n, b]) => blk(n, b)).join('\n')}\n`));
  staged.text(FILES.effects, format(`${hdr(MOD, SPEC, 'Effects of the deep past. THIS is the acting realm; zin_story_tick_deep runs on the world runner. Arguments: temporary zin_arg_<name> (decision E1).')}\n${sorted(S.E).map(([n, b]) => blk(n, b)).join('\n')}\n`));

  // ideas (relics, restorations, costs)
  for (const [id, i] of Object.entries(D.ideas)) {
    await assertModifiers(id, i.mods); loc.set(id, i.name); loc.set(`${id}_desc`, i.desc);
    if (!sprites.keys.has(i.picture)) problems.push(`idea ${id}: picture ${i.picture} is not in the icon catalog`);
  }
  staged.text(FILES.ideas, format(`${hdr(MOD, SPEC, 'Spirits of the deep past: the relics (6.5), the restorations (6.6) and the costs of the loops.')}\nideas = {\ncountry = {\n${Object.entries(D.ideas).map(([id, i]) => blk(id, `picture = zin_${i.picture}\nallowed = { always = no }\nallowed_civil_war = { always = yes }\nremoval_cost = -1\n${blk('modifier', Object.entries(i.mods).map(([k, v]) => `${k} = ${num(v)}`).join('\n'))}`)).join('\n')}\n}\n}\n`));
  // opinion modifiers (6.7)
  staged.text(FILES.opinions, format(`${hdr(MOD, SPEC, 'Opinion modifiers of the deep past (6.7).')}\nopinion_modifiers = {\n${Object.entries(D.opinions).map(([id, o]) => { loc.set(id, o.name); return blk(id, list(`value = ${num(o.value)}`, o.decay ? `decay = ${num(o.decay)}` : '')); }).join('\n')}\n}\n`));
  // state modifiers (6.3)
  const dm = [];
  for (const [id, m] of Object.entries(D.dynamicModifiers)) {
    await assertModifiers(id, m.mods); loc.set(id, m.name);
    sprites.use(`GFX_modifiers_${id}`, m.art);
    dm.push(blk(id, list('enable = { always = yes }', `icon = GFX_modifiers_${id}`, Object.entries(m.mods).map(([k, v]) => `${k} = ${num(v)}`))));
  }
  staged.text(FILES.dynamic, format(`${hdr(MOD, SPEC, 'State modifiers of the deep past (6.3). Each appears only after its discovery, so the start map is unchanged.')}\n${dm.join('\n')}\n`));

  // decisions, categories, the mission
  const cats = [], decs = [];
  for (const [cat, o] of Object.entries(D.categories)) {
    cats.push(category(cat, { title: o.title, desc: o.desc, art: o.art, priority: o.priority, visible: S.catVisible[cat] ?? `has_country_flag = ${cat}_open` }, loc, sprites));
    const rows = S.decisions[cat].map(d => {
      const txt = D.decisions[d.id];
      if (!txt) { problems.push(`decision ${d.id}: no text in ${DATA_FILE}`); return ''; }
      if (txt.tip) loc.set(`${d.id}_tt`, txt.tip);
      return writeDecision({ ...d, art: d.icon, title: txt.title, desc: txt.desc }, loc, sprites);
    });
    for (const m of S.missions.filter(() => cat === 'zin_deep_sea_doors')) {
      const txt = D.missions[m.id];
      loc.set(m.id, txt.title); loc.set(`${m.id}_desc`, txt.desc);
      const icon = `zin_deep_${m.icon}`;
      sprites.use(`GFX_decision_${icon}`, m.icon);
      rows.push(blk(m.id, list(`icon = ${icon}`, 'allowed = { always = yes }', blk('available', m.available), 'activation = { always = no }', `days_mission_timeout = ${m.days}`,
        'is_good = no', 'selectable_mission = yes', blk('complete_effect', m.complete), blk('timeout_effect', m.onTimeout), 'ai_will_do = {\n\tbase = 100\n}')));
    }
    decs.push(`${cat} = {\n${rows.join('\n')}\n}`);
  }
  // A category opens with the flag <category>_open: the loops set it under their working names (zin_deep_low_country_open and so on).
  staged.text(FILES.categories, format(`${hdr(MOD, SPEC, 'The six decision categories of the deep past (6.4), each visible after the realm\'s first discovery and named by its knowledge layer.')}\n${cats.join('\n')}\n`));
  staged.text(FILES.decisions, format(`${hdr(MOD, SPEC, 'The decisions of the six loops, the restorations (6.6) and the sealing mission of the Sea-Doors.')}\n${decs.join('\n')}\n`));
  for (const [k, v] of Object.entries(D.tooltips)) loc.set(k, v);
  for (const [k, v] of Object.entries(D.categoryNames)) loc.set(k, v);
  for (const [k, v] of Object.entries(D.faction)) loc.set(k, v);
  for (const [k, v] of Object.entries(D.techBonus)) loc.set(k, v);
  for (const [k, [name, def, adj]] of Object.entries(D.cosmetic)) { loc.set(k, name); loc.set(`${k}_DEF`, def); loc.set(`${k}_ADJ`, adj); }
  staged.text(FILES.sloc, format(`${hdr(MOD, SPEC, 'The names of the six categories by knowledge layer: the heir\'s own word until the gate, the fallen realm\'s name after it (6.4).')}\n${S.sloc}\n`));

  // achievements (6.12): defined in the mod's own achievements file; the icons are pending art (docs/plans/zin-art/pending_from_integration.md)
  for (const [id, [name, desc]] of Object.entries(D.achievements)) { loc.set(`${id}_NAME`, name); loc.set(`${id}_DESC`, desc); }
  for (const id of S.achievementIds) if (!D.achievements[id]) problems.push(`achievement ${id}: no text`);
  staged.text(FILES.achievements, format(`${hdr(MOD, SPEC, 'The nine achievements of the deep past (6.12). Possible only from the start; the tracking flags are set by the loops.')}\n${S.achievements}\n`));

  // events
  const pictures = await loadPictures();
  const taken = new Set();
  for (const [rel, buf] of staged.files) if (rel.startsWith('events/')) for (const id of definedEventIds(buf.toString('utf8'))) taken.add(id);
  const weighBody = ai => typeof ai === 'number' ? ai : list(`base = ${ai.base}`, ai.mods.map(([k, v, c]) => `modifier = {\n${k} = ${num(v)}\n${c}\n}`));
  const gated = new Set();
  const events = deepEvents(D, P).map(s => {
    const x = D.events[String(s.id)];
    if (!x) { problems.push(`zin_deep.${s.id}: no text in ${DATA_FILE}`); return null; }
    if (x.o.length !== s.options.length) problems.push(`zin_deep.${s.id}: ${s.options.length} options in the script, ${x.o.length} texts`);
    const desc = Array.isArray(x.d) ? [...(s.descIf ?? []).map((c, i) => ({ if: c, text: x.d[i] })), { text: x.d.at(-1) }] : x.d;
    if (Array.isArray(x.d) && (s.descIf ?? []).length !== x.d.length - 1) problems.push(`zin_deep.${s.id}: description variants and conditions do not match`);
    if (s.gate) gated.add(`zin_deep.${s.id}`);
    return { id: s.id, kind: 'country', title: x.t, desc, picture: s.picture, requires: s.requires ?? [], fired_by: s.fired_by,
      options: s.options.map((o, i) => ({ text: x.o[i], ai: weighBody(o.ai), trigger: o.trigger, effect: o.effect })) };
  }).filter(Boolean);
  const sets = [{ namespace: D.namespace, file: FILES.events, declaresNamespace: true, note: 'the deep past (the six fallen realms, K64)', events }];
  problems.push(...structureProblems(sets, pictures, taken), ...await textProblems(sets));
  const out = await renderMechEvents(sets);
  const eventText = out.files.get(FILES.events);
  for (const [k, v] of Object.entries(out.loc.entries())) loc.set(k, v);
  const defined = new Set(events.map(e => `zin_deep.${e.id}`));
  const allScript = [...Object.values(S.E), ...Object.values(S.T), S.start, ...Object.values(S.decisions).flat().map(d => `${d.effect ?? ''}\n${d.remove ?? ''}`), ...S.missions.map(m => `${m.complete}\n${m.onTimeout}`)].join('\n');
  for (const m of allScript.matchAll(/zin_deep\.(\d+)/g)) if (!defined.has(`zin_deep.${m[1]}`)) problems.push(`zin_deep.${m[1]} is fired and not written`);
  for (const id of out.fired) if (id.startsWith('zin_deep.') && !defined.has(id)) problems.push(`${id} is fired and not written`);
  staged.text(FILES.events, eventText);

  // on_actions: the start (keepers, sites, the old blame, the cairn's count)
  staged.text(FILES.onActions, format(`${hdr(MOD, SPEC, 'on_startup: the keepers of the Low Country, the sites resolved by rule, the holds\' old grudge and the count of the Eldest Cairn.')}\non_actions = {\non_startup = {\neffect = {\n${S.start}\n}\n}\n}\n`));

  // the vocabulary of every script file
  for (const rel of [FILES.effects, FILES.triggers, FILES.decisions, FILES.onActions]) for (const k of await unknownCommands(staged.files.get(rel).toString('utf8'), SCRIPT_KEYS)) problems.push(`${rel}: ${k} is neither documented nor a ZIN name`);
  for (const k of await unknownCommands(eventText, SCRIPT_KEYS)) problems.push(`${FILES.events}: ${k} is neither documented nor a ZIN name`);

  // sprites and text
  staged.text(FILES.gfx, sprites.text(hdr(MOD, SPEC, 'Sprites of the deep past: decision icons, categories and state modifiers (catalog icons until the art pass; docs/plans/zin-art/pending_from_integration.md).')));
  const entries = loc.entries();
  const gatedKey = k => /_named$/.test(k) || /^zin_cosmetic_/.test(k) || [...gated].some(id => k.startsWith(`${id}.`)) ||
    /^zin_deep_(moot_of_mothers|bridge_kingdom|kalioth_crown|the_sea_roads)/.test(k) || ['zin_deep_cat_sea_doors_named'].includes(k);
  problems.push(...await wordProblems(entries), ...notCp1252(entries), ...gatedNameProblems(entries, gatedKey, D.gatedNames), ...preAenProblems(entries));
  if (problems.length) throw new Error(`The deep past breaks the rules (${problems.length}):\n  ${problems.slice(0, 60).join('\n  ')}`);
  staged.loc(LOC_NAME, entries);

  const definitions = { triggers: Object.keys(S.T), effects: Object.keys(S.E), ideas: Object.keys(D.ideas), opinions: Object.keys(D.opinions), dynamicModifiers: Object.keys(D.dynamicModifiers),
    categories: Object.keys(D.categories), decisions: Object.values(S.decisions).flat().map(d => d.id), missions: S.missions.map(m => m.id), events: [...defined], achievements: S.achievementIds,
    cosmeticTags: Object.keys(D.cosmetic) };
  return { counts: { ...Object.fromEntries(Object.entries(definitions).map(([k, v]) => [k, v.length])), keys: Object.keys(entries).length, sites: SITE_ROWS.length },
    definitions, fired: [...out.fired].sort(), siteRows: SITE_ROWS, eventMeta: out.metas };
}
