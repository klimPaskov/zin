// The crown events (docs/specs/06_events/01_golden_king_and_succession.md and 04_endings.md): the story of the Golden King's reign,
// his death, the Thirty Days, Aurevan's crowning and reign, the other roads, and the three endings with their end screen.
// Three event namespaces, one module: zin_reign (events/zin_reign.txt), zin_ending (events/zin_ending.txt) and the ending ids of
// zin_world (events/zin_world_endings.txt, ids 100 to 107 and 110 to 112; the world module keeps events/zin_world.txt).
//
//   const summary = await buildEventsCrown(staged, { countries, storyBlocks?, scheduler? })
//     countries    the roster (lib/roster.mjs) (names resolve to tags here)
//     storyBlocks  the namespaces whose runner blocks zin_story_tick calls; default ['reign', 'ending']. The integrator adds
//                  'lastwar' and 'lore' when the module that writes zin_story_tick_lastwar / zin_story_tick_lore is in the build (C6).
//     scheduler    write common/on_actions/zin_crown_story.txt, which calls zin_story_tick once a month (default true). The world
//                  module's tick calls the same effect as its step 9; the tick guards itself, so both may stay.
//
// Why not the focus compiler's event writer: it writes the events of one focus tree (namespace zin_<tree>) and has no trigger,
// no description variants, no recipient loops and no AI weights by game rule; these events need all four. Ids do not clash: the
// compiler's namespaces are tree namespaces and the Aenor mechanic's zin_aenor.
// Data: tools/content/data/events_crown_*.json (events, hooks, chronicle). Notation: lib/crown_script.mjs. Note: docs/design/stage2/events_crown.md.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { yml, assertModifiers } from '../lib/core.mjs';
import { GAME, ZIN } from '../lib/paths.mjs';
import { parse, scriptText } from '../lib/clausewitz.mjs';
import { displayText, nonCp1252 } from '../lib/loc_parse.mjs';
import { loadRuleSet, compileBanned, findBanned } from '../lib/banned.mjs';
import { loadGlossary } from '../lib/text_engine.mjs';
import { loadRegister, loadSpecNames, isKnownName } from '../lib/crown_names.mjs';
import { block, flat, num, makeEnv, effects, conds, condLines, effLines, eventsFile, HEADER, GOVERNMENTS } from '../lib/crown_script.mjs';
import { PACES, paceDate } from './focus_compiler.mjs';
import { countryTable } from '../lib/roster.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(here, '../data');
export const NAMESPACES = { zin_reign: { file: 'events/zin_reign.txt', loc: 'zin_reign', lo: 10, hi: 87 }, zin_ending: { file: 'events/zin_ending.txt', loc: 'zin_ending', lo: 1, hi: 89 }, zin_world: { file: 'events/zin_world_endings.txt', loc: 'zin_ending', ids: [[100, 107], [110, 112]] } };
export const ENDING_CODES = { lost_cause: 1, children_of_volgan: 2, ashen_throne: 3, golden_court: 4, western_crown: 5, strait_master: 6, eastern_king: 7, unfinished: 8 };
// Gates of the picture catalog (data/presentation-cells.json) in the words of `requires`.
export const GATE_WORDS = { 'hub-only events': 'hub', 'ending flag': 'zin_ending_reached' };
// Ids of other namespaces that these events fire or are fired by. Everything else an event fires must be in the three namespaces.
export const OWNER_NAMESPACES = ['zin_aenor', 'zin_afrit', 'zin_eindil', 'zin_leren', 'zin_west', 'zin_elves', 'zin_east', 'zin_lore'];
// "Chancellor" is banned in modern text (rule bw_modern_society_012) and is Merovan's canon title (shared contract, characters);
// it is the one banned word these events keep.
export const ALLOWED_WORDS = new Set(['chancellor']);
const TIMEOUT_DAYS = 30;
const SECRET_SKIP = /\.d_(hub|revealed)|\.t_(hub|revealed)/;

// ------------------------------------------------------------------------------------------------ data
export async function loadCrownData(dir = DATA_DIR) {
  const files = (await readdir(dir)).filter(n => /^events_crown_.*\.json$/.test(n)).sort();
  const data = { events: [], hooks: null, chronicle: null, files };
  for (const name of files) {
    const j = JSON.parse(await readFile(path.join(dir, name), 'utf8'));
    if (j.kind === 'events') data.events.push(...j.events.map(e => ({ ...e, _file: name })));
    else if (j.kind === 'hooks') data.hooks = j;
    else if (j.kind === 'chronicle') data.chronicle = j;
    else throw new Error(`${name}: unknown kind ${j.kind}`);
  }
  return data;
}
const nsOf = id => id.split('.')[0];
const numOf = id => Number(id.split('.')[1]);
const sortEvents = list => [...list].sort((a, b) => numOf(a.id) - numOf(b.id));
const toDays = d => { const [y, m, day] = d.split('.').map(Number); return Date.UTC(y, m - 1, day) / 86400000; };
const fromDays = n => { const d = new Date(n * 86400000); return `${d.getUTCFullYear()}.${d.getUTCMonth() + 1}.${d.getUTCDate()}`; };
const dayBefore = d => fromDays(toDays(d) - 1);

// ------------------------------------------------------------------------------------------------ catalog
let cells;
export async function pictureCatalog() {
  cells ??= JSON.parse(await readFile(path.join(DATA_DIR, 'presentation-cells.json'), 'utf8')).events;
  const evt = new Map(), news = new Map();
  for (const e of cells) {
    const gate = e.gate ? (GATE_WORDS[e.gate] ?? (/^[a-z_]+$/.test(e.gate) ? e.gate : null)) : null;
    if (e.crop !== 'news') evt.set(e.key, gate);
    if (e.crop !== 'standard') news.set(e.key, gate);
  }
  return { evt, news };
}

// ------------------------------------------------------------------------------------------------ validation
// Returns the problems of the data (strings). `ctx`: { pictures, register, specNames, roster }.
export function validateCrown(data, ctx) {
  const P = [], ids = new Set(), byId = new Map();
  const fired = new Set();
  const note = (e, msg) => P.push(`${e.id ?? '?'}: ${msg}`);
  for (const e of data.events) {
    if (!/^zin_(reign|ending|world)\.\d+$/.test(e.id ?? '')) { note(e, 'the id is not zin_reign.N, zin_ending.N or zin_world.N'); continue; }
    if (ids.has(e.id)) note(e, 'the id is defined twice');
    ids.add(e.id); byId.set(e.id, e);
    const ns = NAMESPACES[nsOf(e.id)], n = numOf(e.id);
    const inRange = ns.ids ? ns.ids.some(([a, b]) => n >= a && n <= b) : n >= ns.lo && n <= ns.hi;
    if (!inRange) note(e, 'the number is outside the range of its namespace');
    if (!e.title?.trim()) note(e, 'no title');
    else if (ctx.vanillaTitles?.has(e.title.trim().toLowerCase())) note(e, `the title "${e.title}" is a vanilla event title`);
    if (!e.desc?.trim()) note(e, 'no description');
    const kind = e.kind ?? 'country';
    if (!['country', 'news', 'hidden'].includes(kind)) note(e, `unknown kind ${kind}`);
    if (e.once && kind === 'news') note(e, 'fire_only_once removes major: a news event is guarded by flags instead');
    if (kind !== 'hidden') {
      const pic = kind === 'news' ? ctx.pictures.news : ctx.pictures.evt;
      if (!pic.has(e.picture)) note(e, `the picture ${e.picture} is not in the ${kind === 'news' ? 'news' : 'event'} list of presentation-cells.json`);
      else { const gate = pic.get(e.picture); if (gate && !(e.requires ?? []).includes(gate)) note(e, `the picture ${e.picture} is gated on ${gate}, which is not among requires`); }
    }
    if (!['runner', 'hook', 'chain', 'owner'].includes(e.source)) note(e, 'source must be runner, hook, chain or owner');
    if (e.source === 'owner' && !e.external) note(e, 'an event fired by another module names its firing source in external');
    const opts = e.options ?? [];
    if (kind !== 'hidden' && !opts.length && !(kind === 'news')) note(e, 'no option');
    opts.forEach((o, i) => {
      if (!o.text?.trim()) note(e, `option ${i + 1} has no text`);
      if (!Array.isArray(o.do)) note(e, `option ${i + 1} has no effect list`);
      if (o.free !== undefined && (typeof o.free !== 'number' || o.free < 0)) note(e, `option ${i + 1} has a bad FREE weight`);
    });
    if (e.checkpoint !== undefined && opts[0]?.hist) note(e, 'a checkpoint event must not write its historical option first (C9)');
    if (kind === 'news' && e.spirit !== undefined && e.spirit !== null && !(e.holder ?? []).length) note(e, 'an ending spirit needs a holder condition');
    for (const o of opts) if (o.hist && typeof o.hist !== 'boolean' && !o.hist.when && !o.hist.unless) note(e, 'hist is true, { when } or { unless }');
    // text
    const texts = [e.title, e.desc, ...(e.variants ?? []).map(v => v.text), ...opts.map(o => o.text)];
    for (const t of texts) {
      const bad = nonCp1252(t); if (bad.length) note(e, `characters outside Windows-1252: ${bad.join('')}`);
      if (/TODO|lorem|placeholder|XXX/i.test(t)) note(e, `unfinished text: ${t.slice(0, 40)}`);
    }
    // the secret and the phrase scan (C1, C3, C4, acceptance 3 and 4)
    const nsName = nsOf(e.id);
    const secretTexts = [['t', e.title], ['d', e.desc], ...opts.map((o, i) => [`o${i}`, o.text])];
    const variants = (e.variants ?? []).map(v => [v.suffix, v.text]);
    if (nsName === 'zin_reign' || ['zin_ending.40', 'zin_ending.1', 'zin_ending.2', 'zin_world.103', 'zin_world.110', 'zin_world.111', 'zin_world.112'].includes(e.id)) {
      for (const [k, t] of [...secretTexts, ...variants.filter(([s]) => !/^(hub|revealed)/.test(s))]) {
        if (/\bAfrit\b|\bdemon|Hidden Council|Aurevan/i.test(t) && !/\[zin_loc_deliverer\]/.test(t)) note(e, `the secret: ${k} names ${t.match(/Afrit|demon|Hidden Council|Aurevan/i)[0]}`);
        else if (/\bAfrit\b|\bdemon|Hidden Council/i.test(t)) note(e, `the secret: ${k} names ${t.match(/Afrit|demon|Hidden Council/i)[0]}`);
      }
    }
    if (nsName === 'zin_reign') for (const t of [...secretTexts.map(x => x[1]), ...variants.map(x => x[1])]) {
      const m = t.match(/poison|murder|Afrit killed/i); if (m) note(e, `the phrase scan: ${m[0]}`);
    }
    // fire targets
    const seen = (list, f) => { for (const x of list ?? []) f(x); };
    const walkFx = list => seen(list, x => {
      if (x.fire) { fired.add(x.fire); if (!NAMESPACES[nsOf(x.fire)] && !OWNER_NAMESPACES.includes(nsOf(x.fire))) note(e, `fires ${x.fire}, of a namespace this module does not know`); }
      for (const k of ['do', 'then', 'else']) if (Array.isArray(x[k])) walkFx(x[k]);
    });
    walkFx(e.immediate); opts.forEach(o => walkFx(o.do));
  }
  // hooks, runner and epilogue fire events too
  const hooks = data.hooks ?? { hooks: {}, epilogue: {}, runner: { reign: [] } };
  const walkAll = list => { for (const x of list ?? []) { if (x.fire) fired.add(x.fire); for (const k of ['do', 'then', 'else']) if (Array.isArray(x[k])) walkAll(x[k]); } };
  for (const h of Object.values(hooks.hooks ?? {})) walkAll(h.effects);
  for (const [k, v] of Object.entries(hooks.epilogue ?? {})) if (Array.isArray(v)) walkAll(v);
  for (const r of hooks.runner?.reign ?? []) walkAll(r.fire);
  for (const id of ['zin_ending.1', 'zin_ending.2', 'zin_ending.3', 'zin_ending.4', 'zin_world.110']) fired.add(id);
  for (const id of fired) if (NAMESPACES[nsOf(id)] && !ids.has(id)) P.push(`${id}: fired but not defined`);
  for (const e of data.events) if (!fired.has(e.id) && e.source !== 'owner') P.push(`${e.id}: never fired by this module and not marked as fired by an owner`);
  for (const e of data.events) if (e.source === 'owner' && fired.has(e.id)) { /* both is allowed: an owner may also fire it */ }
  return { problems: P, ids, fired };
}

// Titles of the installed game's events (read only, never copied): a ZIN title must not equal one.
let vanillaT;
export async function vanillaTitles() {
  if (vanillaT) return vanillaT;
  vanillaT = new Set();
  const dir = `${GAME}/localisation/english`;
  if (!existsSync(dir)) return vanillaT;
  for (const f of (await readdir(dir)).filter(n => /(event|news).*_l_english\.yml$/.test(n))) {
    for (const m of (await readFile(`${dir}/${f}`, 'utf8')).matchAll(/^\s+[A-Za-z0-9_.\-]+\.t:\d*\s+"(.*)"\s*$/gm)) vanillaT.add(m[1].trim().toLowerCase());
  }
  return vanillaT;
}

// Banned modern words of the text sweep (data/banned_words.json, severity error) in the displayed text of every key. The one
// kept word is ALLOWED_WORDS. Returns "key: word (rule)" lines.
export async function textProblems(texts, ruleSet) {
  const compiled = ruleSet ?? compileBanned(await loadRuleSet({ glossary: await loadGlossary() }));
  const out = [];
  for (const [key, value] of Object.entries(texts)) {
    for (const h of findBanned(displayText(value), compiled, ['error'])) if (!ALLOWED_WORDS.has(h.word.toLowerCase())) out.push(`${key}: "${h.word}" (${h.id})`);
    const bad = nonCp1252(value); if (bad.length) out.push(`${key}: characters outside Windows-1252 ${bad.join('')}`);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ pieces
function dateTrigger(name, date) {
  const alt = (p, d) => block('AND', [`check_variable = { global.zin_story_pace = ${num(p)} }`, `date > ${dayBefore(d)}`]);
  return [`# ${date} at the standard pace, scaled by zin_story_pace (R2); true from the day before, so the monthly tick on the 1st fires it.`, ...block(name, block('OR', [
    ...flat(PACES.map(p => alt(p, paceDate(date, p)))),
    ...block('AND', [...block('NOT', ['check_variable = { global.zin_story_pace > 0 }']), `date > ${dayBefore(date)}`]) ]))].join('\n');
}
const text = lines => `${lines.join('\n')}\n`;
const definedText = (name, entries, env) => block('defined_text', [`name = ${name}`, ...flat(entries.map(e => block('text', [...(e.cond?.length ? block('trigger', conds(e.cond, env)) : []), `localization_key = ${e.key}`])))]);

function runnerBlocks(items, env) {
  return flat(items.map(r => {
    const L = [];
    const when = r.when?.length ? conds(r.when, env) : [];
    const fire = effects(r.fire, env);
    const body = when.length ? block('if', [...block('limit', when), ...fire]) : fire;
    if (r.date) {
      L.push(`# ${r.event}${r.key.includes('_') ? ` (${r.key})` : ''}: ${r.date} at the standard pace.`);
      L.push(...block('if', [...block('limit', [`NOT = { has_global_flag = ${r.done} }`, `zin_reign_date_${r.key} = yes`]), `set_global_flag = ${r.done}`, ...body]));
    } else if (r.done) {
      L.push(`# ${r.event}: checked every month, scheduled once.`);
      L.push(...block('if', [...block('limit', [`NOT = { has_global_flag = ${r.done} }`, ...when]), `set_global_flag = ${r.done}`, ...fire]));
    } else {
      L.push(`# ${r.event}: checked every month; the event guards itself and sets its own timed country flag.`);
      L.push(...body);
    }
    return L;
  }));
}

// The lead-up events of 04_endings.md (zin_ending.1 to .4) and the two bookkeeping flags the Chronicle reads.
function endingRunner(env) {
  const humans = (id, extra = []) => block('every_country', [...block('limit', ['is_ai = no', ...extra]), `country_event = ${id}`]);
  const dated = (n, key) => block('if', [...block('limit', [`NOT = { has_global_flag = zin_story_done_ending_${n} }`, `zin_ending_date_${key} = yes`]), `set_global_flag = zin_story_done_ending_${n}`, ...block('if', [...block('limit', ['NOT = { has_global_flag = zin_ending_reached }']), ...humans(`zin_ending.${n}`)])]);
  const volganTag = env.tags.get('Puvulan');
  env.used.triggers.add('zin_volgan_children_ready'); env.used.triggers.add('zin_is_volgan'); env.used.triggers.add('zin_afrit_holds_parim'); env.used.triggers.add('zin_afrit_ashen_throne_ready'); env.used.triggers.add('zin_afrit_rules_here'); env.used.triggers.add('zin_world_date_children'); env.used.triggers.add('zin_world_date_last_crowns');
  env.used.variables.add('zin_footholds');
  return [
    '# zin_ending.1 and .2: one and two years before the judgement date, to every human player while no ending is reached.',
    ...dated(1, 'lead_1'), ...dated(2, 'lead_2'),
    '# zin_ending.3: Volgan\'s readiness at two monthly checks in a row (the first sets zin_ending_volgan_near), before the date from which the world module reaches the ending at once.',
    ...block('if', [...block('limit', ['NOT = { has_global_flag = zin_ending_reached }', 'NOT = { has_global_flag = zin_story_done_ending_3 }', 'NOT = { zin_world_date_children = yes }']),
      ...block('if', [...block('limit', [...block('any_country', ['zin_is_volgan = yes', 'zin_volgan_children_ready = yes'])]),
        ...block('if', [...block('limit', ['has_global_flag = zin_ending_volgan_near']), 'set_global_flag = zin_story_done_ending_3', ...humans('zin_ending.3', [`has_war_with = ${volganTag}`])]),
        ...block('else', ['set_global_flag = zin_ending_volgan_near'])]),
      ...block('else', ['clr_global_flag = zin_ending_volgan_near'])]),
    '# zin_ending.4: the name is out, Afrit holds Parim, twelve crowns owe him a hearing, and the Ashen Throne is not yet ready.',
    ...block('if', [...block('limit', ['NOT = { has_global_flag = zin_ending_reached }', 'NOT = { has_global_flag = zin_story_done_ending_4 }', 'has_global_flag = zin_afrit_revealed', 'zin_afrit_holds_parim = yes', ...block('NOT', ['zin_afrit_ashen_throne_ready = yes'])]),
      'set_temp_variable = { zin_t_deep = 0 }',
      ...block('every_country', [...block('limit', ['check_variable = { var = zin_footholds value = 4 compare = greater_than_or_equals }']), 'add_to_temp_variable = { zin_t_deep = 1 }']),
      ...block('if', [...block('limit', ['check_variable = { zin_t_deep > 11 }']), 'set_global_flag = zin_story_done_ending_4',
        ...humans('zin_ending.4', [...block('any_enemy_country', ['zin_afrit_rules_here = yes'])])])]),
    '# The Chronicle says whether the great war began early or late; it is told the first month the flag is seen.',
    ...block('if', [...block('limit', ['has_global_flag = zin_war_of_last_crowns', 'NOT = { has_global_flag = zin_ending_cp11_known }']), 'set_global_flag = zin_ending_cp11_known',
      ...block('if', [...block('limit', [...block('NOT', ['zin_world_date_last_crowns = yes'])]), 'set_global_flag = zin_ending_cp11_early']),
      ...block('else', ['set_global_flag = zin_ending_cp11_late'])]),
  ];
}

// ------------------------------------------------------------------------------------------------ the engine documentation
let docNames;
export async function engineNames() {
  if (docNames) return docNames;
  const names = new Set();
  for (const f of ['effects_documentation.md', 'triggers_documentation.md']) {
    const file = `${GAME}/documentation/${f}`;
    if (existsSync(file)) for (const m of (await readFile(file, 'utf8')).matchAll(/^## ([A-Za-z0-9_]+)$/gm)) names.add(m[1]);
  }
  // keys of an event, an option, an AI block and the arguments of the engine effects this module writes
  for (const k of 'id title desc picture major hidden fire_only_once is_triggered_only timeout_days trigger immediate option name ai_chance base modifier factor add text limit else if else_if days random_days hours random_hours target flag value idea country relation active var compare tooltip add_namespace NOT OR AND always defined_text localization_key picture allowed allowed_civil_war removal_cost ideas country modifier opinion_modifiers decay years months ruling_only character on_actions on_monthly effect option rule'.split(' ')) names.add(k);
  docNames = names;
  return names;
}

// Every key of a parsed script is an engine name, a ZIN scripted name or a variable; unknown plain words are reported.
export async function checkEngine(files, register, own, spec) {
  const engine = await engineNames(), problems = [];
  const zinOk = n => isKnownName(register, n, own) || spec.has(n);
  for (const [rel, body] of files) {
    if (!rel.endsWith('.txt')) continue;
    const seenWords = new Set();
    const walkEntries = (list, parentKey) => {
      for (const e of list) {
        if (e.k && parentKey === 'modifier' && rel.startsWith('common/ideas/')) continue;      // modifier keys are checked against the modifier documentation
        if (e.k) {
          if (e.k.startsWith('zin_') || e.k.startsWith('GFX_') || e.k.startsWith('event_target:') || e.k.startsWith('global.') || /^[A-Z]{3}$/.test(e.k) || /^Y[0-9A-Z]{2}$/.test(e.k) || /^(ROOT|THIS|PREV|FROM)$/.test(e.k) || /^\d/.test(e.k) || e.k.startsWith('var:')) {
            if (e.k.startsWith('zin_') && !zinOk(e.k) && !/^zin_(reign|ending|world)\./.test(e.k) && !seenWords.has(e.k)) { seenWords.add(e.k); problems.push(`${rel}:${e.line}: ${e.k} is not a known ZIN name`); }
          } else if (!engine.has(e.k) && !seenWords.has(e.k) && !/^(zin_[a-z0-9_]+)$/.test(e.k)) { seenWords.add(e.k); problems.push(`${rel}:${e.line}: ${e.k} is not an engine effect or trigger of 1.19.3`); }
        }
        if (Array.isArray(e.v)) walkEntries(e.v, e.k);
        else if (typeof e.v === 'string' && /^zin_[a-z0-9_]+$/.test(e.v) && e.k && !['name', 'text', 'localization_key', 'title', 'desc', 'id', 'idea', 'picture', 'modifier', 'flag', 'effect'].includes(e.k) && !zinOk(e.v) && !seenWords.has(e.v)) { seenWords.add(e.v); problems.push(`${rel}:${e.line}: ${e.v} is not a known ZIN name`); }
      }
    };
    walkEntries(parse(scriptText(body)), null);
  }
  return problems;
}

// ------------------------------------------------------------------------------------------------ build
export async function buildEventsCrown(staged, ctx = {}) {
  const data = ctx.data ?? await loadCrownData();
  const roster = ctx.countries ?? countryTable();
  const tags = new Map(roster.map(c => [c.name, c.tag]));
  const pictures = ctx.pictures ?? await pictureCatalog();
  const register = ctx.register ?? await loadRegister(), spec = ctx.specNames ?? await loadSpecNames();
  const { problems, ids } = validateCrown(data, { pictures, register, specNames: spec, roster, vanillaTitles: ctx.vanillaTitles ?? await vanillaTitles() });
  if (problems.length) throw new Error(`Crown events: ${problems.length} problem(s):\n  ${problems.slice(0, 25).join('\n  ')}`);

  const codesFile = JSON.parse(await readFile(path.join(DATA_DIR, 'focus_arg_codes.json'), 'utf8'));
  const codes = (effect, arg, value) => {
    if (effect === 'zin_ending_start_epilogue' && arg === 'ending') return ENDING_CODES[value];
    const owner = codesFile.owners.filter(o => o.prefixes.some(p => effect.startsWith(p))).sort((a, b) => Math.max(...b.prefixes.map(p => p.length)) - Math.max(...a.prefixes.map(p => p.length)))[0];
    return owner?.args?.[arg]?.[value];
  };
  const env = makeEnv({ tags, codes, kinds: new Map(data.events.map(e => [e.id, e.kind ?? 'country'])) });
  const locs = { zin_reign: new Map(), zin_ending: new Map() };
  const mkLoc = which => ({ set(key, value) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Empty localisation value for ${key}`);
    const m = locs[which];
    if (m.has(key) && m.get(key) !== value) throw new Error(`Localisation key ${key} defined twice with different text`);
    m.set(key, value);
  } });
  const loc = { zin_reign: mkLoc('zin_reign'), zin_ending: mkLoc('zin_ending') };
  const files = new Map();
  const put = (rel, body) => { if (staged) staged.text(rel, body); files.set(rel, Buffer.from(body.endsWith('\n') ? body : `${body}\n`)); };

  // events
  const byNs = new Map();
  for (const e of data.events) {
    let ev = e;
    if (e.kind === 'news' && (e.spirit !== undefined)) {
      const ok = e.ok ?? 'So ends the Fourth Age.';
      ev = { ...e, options: e.spirit && (e.holder ?? []).length
        ? [ { text: ok, show: e.holder, do: [ { if: [`!idea:${e.spirit}`], then: [ { add_idea: e.spirit } ] } ] }, { text: ok, show: [ { not: e.holder } ], do: [] } ]
        : [ { text: ok, do: [] } ] };
    }
    (byNs.get(nsOf(e.id)) ?? byNs.set(nsOf(e.id), []).get(nsOf(e.id))).push(ev);
  }
  for (const [ns, list] of byNs) {
    const meta = NAMESPACES[ns];
    put(meta.file, eventsFile(ns, sortEvents(list), loc[meta.loc], env));
  }

  // hooks
  const hooks = data.hooks;
  const effectDefs = new Map();
  const defEffect = (name, comment, lines) => effectDefs.set(name, [...(comment ? [`# ${comment}`] : []), ...block(name, lines)].join('\n'));
  env.tips = () => { throw new Error('a hook cannot carry a tooltip'); };
  for (const [name, h] of Object.entries(hooks.hooks)) defEffect(name, h.doc, effects(h.effects, env));
  const epilogue = [
    'set_temp_variable = { zin_t_ending = zin_arg_ending }',
    ...block('if', [...block('limit', ['check_variable = { zin_t_ending = 0 }']), 'set_temp_variable = { zin_t_ending = global.zin_world_ending }']),
    ...flat(Object.values(ENDING_CODES).map(code => { const list = hooks.epilogue[String(code)] ?? []; return list.length ? block('if', [...block('limit', [`check_variable = { zin_t_ending = ${code} }`]), ...effects(list, env)]) : []; })),
    ...effects([ { loop: 'every_country', limit: ['human'], do: [ { fire: 'zin_world.110', days: 14 } ] } ], env),
  ];
  env.used.variables.add('zin_world_ending');
  defEffect('zin_ending_start_epilogue', 'Argument: zin_arg_ending (1 lost_cause, 2 children_of_volgan, 3 ashen_throne, 4 golden_court, 5 western_crown, 6 strait_master, 7 eastern_king, 8 unfinished; 0 reads global.zin_world_ending). Fires the aftermath of the ending and, fourteen days on, the Chronicle for every human player. It sets and clears no ending flag.', epilogue);
  const reignHooks = ['zin_reign_on_king_dead', 'zin_reign_on_thirty_days', 'zin_reign_on_crowning'];
  put('common/scripted_effects/zin_reign.txt', text([HEADER, ...flat(reignHooks.map(n => [effectDefs.get(n), '']))]));
  put('common/scripted_effects/zin_ending.txt', text([HEADER, effectDefs.get('zin_ending_start_epilogue'), '', effectDefs.get('zin_ending_heir_lost')]));

  // the runner
  const blocks = ctx.storyBlocks ?? ['reign', 'ending'];
  put('common/scripted_effects/zin_reign_story.txt', text([HEADER, '# Monthly checks of the Golden King\'s story (convention C6). Called by zin_story_tick.', ...block('zin_story_tick_reign', runnerBlocks(hooks.runner.reign, env))]));
  put('common/scripted_effects/zin_ending_story.txt', text([HEADER, '# Monthly checks of the endings\' lead-up (convention C6). Called by zin_story_tick.', ...block('zin_story_tick_ending', endingRunner(env))]));
  put('common/scripted_effects/zin_story.txt', text([HEADER, '# The story runner (convention C6, decision R5): step 9 of the world tick. The guard lets whichever caller comes first in a month run the blocks; a second caller finds the flag.',
    ...block('zin_story_tick', block('if', [...block('limit', ['NOT = { has_global_flag = zin_story_tick_guard }']), 'set_global_flag = { flag = zin_story_tick_guard days = 25 }', ...blocks.map(b => `zin_story_tick_${b} = yes`)]))]));
  if (ctx.scheduler !== false) put('common/on_actions/zin_crown_story.txt', text([HEADER, '# Calls the story runner once a month, so the dated events fire even before the world tick exists.', ...block('on_actions', block('on_monthly', block('effect', ['zin_story_tick = yes'])))]));

  // dates
  const dateRows = [...hooks.runner.reign.filter(r => r.date).map(r => [`zin_reign_date_${r.key}`, r.date]), ...Object.entries(hooks.ending_dates).map(([k, d]) => [`zin_ending_date_${k}`, d])];
  put('common/scripted_triggers/zin_crown_dates.txt', text([HEADER, ...dateRows.map(([n, d]) => dateTrigger(n, d)).flatMap(s => [s, ''])]));

  // opinion modifiers, ideas
  const opinionBlock = (prefix, header) => {
    const rows = Object.entries(hooks.opinion_modifiers).filter(([k]) => k.startsWith(prefix)).sort(([a], [b]) => a.localeCompare(b, 'en'));
    return text([HEADER, ...block('opinion_modifiers', flat(rows.map(([k, m]) => block(k, [`value = ${m.value}`, `years = ${m.years}`, `decay = ${m.decay}`]))))]);
  };
  put('common/opinion_modifiers/zin_reign.txt', opinionBlock('zin_reign_'));
  put('common/opinion_modifiers/zin_ending.txt', opinionBlock('zin_ending_'));
  for (const [k, m] of Object.entries(hooks.opinion_modifiers)) loc[k.startsWith('zin_reign_') ? 'zin_reign' : 'zin_ending'].set(k, m.name);
  const ideas = Object.entries(hooks.ideas);
  for (const [k, i] of ideas) await assertModifiers(k, i.modifier);
  put('common/ideas/zin_reign.txt', text([HEADER, ...block('ideas', block('country', flat(ideas.map(([k, i]) => block(k, [`picture = ${i.picture.startsWith('zin_') ? i.picture : `zin_${i.picture}`}`, 'allowed = { always = no }', 'allowed_civil_war = { always = yes }', 'removal_cost = -1', ...block('modifier', Object.entries(i.modifier).map(([a, v]) => `${a} = ${num(v)}`))]))))) ]));
  for (const [k, i] of ideas) { loc.zin_reign.set(k, i.name); loc.zin_reign.set(`${k}_desc`, i.desc); }

  // scripted localisation: the camps
  const chr = data.chronicle, camps = [];
  for (const [name, c] of Object.entries(chr.camps)) {
    const sec = `${name}_public`, tru = `${name}_revealed`;
    loc.zin_reign.set(sec, c.secret); loc.zin_reign.set(tru, c.true);
    const cond = name === 'zin_loc_camp_faithful' ? [ { or: ['zin_afrit_is_hub', '!zin_afrit_secret_kept'] } ] : ['zin_eindil_known_by_name'];
    camps.push(definedText(name, [ { cond, key: tru }, { key: sec } ], env).join('\n'));
  }
  put('common/scripted_localisation/zin_reign.txt', text([HEADER, ...camps.flatMap(c => [c, ''])]));

  // scripted localisation: the Chronicle and the lists of the endings
  const L = loc.zin_ending, sl = [];
  const NONE = 'zin_chronicle_none';
  L.set(NONE, '§!');
  for (const [num2, line] of Object.entries(chr.lines).sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    const var1 = `global.zin_path_cp${num2}`;
    const entries = [], textFor = (state, v, key) => (typeof v === 'string' ? { text: v, variants: [] } : v);
    const emit = (state, spec, keyBase, extraCond = []) => {
      const state1 = [`gvar:zin_path_cp${num2}=${state}`];
      for (const v of spec.variants ?? []) { const key = `${keyBase}_${v.suffix}`; L.set(key, v.text); entries.push({ cond: [...state1, ...extraCond, ...v.if], key }); }
      L.set(keyBase, spec.text); entries.push({ cond: [...state1, ...extraCond], key: keyBase });
    };
    for (const state of ['1', '2', '3']) {
      const spec = line[state]; if (!spec) continue;
      const s = textFor(state, spec);
      if (state === '1' && s.needs) {
        emit(1, { text: s.text, variants: [] }, `zin_chronicle_cp${num2}_1`, s.needs.map(x => x));
        const alt = line['2'] ? textFor('2', line['2']) : null;
        if (alt) {
          // the historical state without the reveal reads as the diverged line, which does not name the god-king
          for (const v of alt.variants ?? []) { const key = `zin_chronicle_cp${num2}_1_${v.suffix}`; L.set(key, v.text); entries.push({ cond: [`gvar:zin_path_cp${num2}=1`, ...v.if], key }); }
          const key = `zin_chronicle_cp${num2}_1_plain`; L.set(key, alt.text); entries.push({ cond: [`gvar:zin_path_cp${num2}=1`], key });
        }
        continue;
      }
      emit(Number(state), s, `zin_chronicle_cp${num2}_${state}`);
    }
    entries.push({ key: NONE });
    sl.push(definedText(`zin_loc_chronicle_cp${num2}`, entries, env).join('\n'));
  }
  for (const [p, list] of Object.entries(chr.paragraphs)) { L.set(`zin_chronicle_${p}`, list.map(n => `[zin_loc_chronicle_cp${n}]`).join(' ')); sl.push(definedText(`zin_loc_chronicle_${p}`, [ { key: `zin_chronicle_${p}` } ], env).join('\n')); }
  {
    const heads = Object.entries(chr.endings).map(([code, e]) => { const key = `zin_chronicle_heading_${code}`; L.set(key, e.heading); return { cond: [`gflag:${e.flag}`], key }; });
    L.set('zin_chronicle_heading_0', 'The Fourth Age ended on [GetDateText].');
    sl.push(definedText('zin_loc_chronicle_heading', [...heads, { key: 'zin_chronicle_heading_0' }], env).join('\n'));
    for (const e of Object.values(chr.endings)) env.used.gflags.add(e.flag);
    L.set('zin_chronicle_meter', chr.meter); sl.push(definedText('zin_loc_chronicle_meter', [ { key: 'zin_chronicle_meter' } ], env).join('\n'));
    const u = chr.unknown;
    const combos = [ [true, true], [true, false], [false, true], [false, false] ];
    const parts = combos.map(([v, z]) => {
      const key = `zin_chronicle_unknown_${v ? 'v' : ''}${z ? 'z' : ''}`, bits = [v && u.volgan, z && u.zol, u.tail].filter(Boolean);
      const joined = bits.length === 1 ? bits[0] : bits.length === 2 ? `${bits[0]}, and ${bits[1]}` : `${bits[0]}, ${bits[1]}, and ${bits[2]}`;
      L.set(key, joined[0].toUpperCase() + joined.slice(1));
      return { cond: [v ? 'gflag:zin_volgan_body_destroyed' : '!gflag:zin_volgan_body_destroyed', z ? 'gflag:zin_kusven_withdrawn' : '!gflag:zin_kusven_withdrawn'], key };
    });
    sl.push(definedText('zin_loc_chronicle_unknown', parts, env).join('\n'));
    // The whole Chronicle of the Age in one call: the last page of the codex entries 627 to 630 (07_interface/04_chronicle_codex.md).
    L.set('zin_chronicle_pages', ['[zin_loc_chronicle_heading]', ...Object.keys(chr.paragraphs).map(p => `[zin_loc_chronicle_${p}]`), '[zin_loc_chronicle_meter]', '[zin_loc_chronicle_unknown]'].join('\n\n'));
    sl.push(definedText('zin_loc_chronicle_pages', [ { key: 'zin_chronicle_pages' } ], env).join('\n'));
    const part = chr.your_part.map(p => { const key = `zin_your_part_${p.key}`; L.set(key, p.text); return { cond: p.if, key }; });
    sl.push(definedText('zin_loc_your_part', part, env).join('\n'));
    // lists of the lead-up events
    const listLoc = (name, items, none) => {
      const subs = items.map(i => { L.set(`zin_list_${name}_${i.key}`, i.text); sl.push(definedText(`zin_loc_list_${name}_${i.key}`, [ { cond: i.if, key: `zin_list_${name}_${i.key}` }, { key: NONE } ], env).join('\n')); return `[zin_loc_list_${name}_${i.key}]`; });
      return subs;
    };
    const pos = listLoc('possible', chr.possible), out = listLoc('outcome', chr.outcomes);
    L.set('zin_list_possible', pos.join('')); sl.push(definedText('zin_loc_endings_possible', [ { key: 'zin_list_possible' } ], env).join('\n'));
    L.set('zin_list_outcomes_none', chr.outcomes_none);
    sl.push(definedText('zin_loc_list_outcome_none', [ { cond: chr.outcomes.map(o => o.if).length ? [ { not: [ { or: chr.outcomes.map(o => ({ and: o.if })) } ] } ] : [], key: 'zin_list_outcomes_none' }, { key: NONE } ], env).join('\n'));
    L.set('zin_list_outcomes', `${out.join('')}[zin_loc_list_outcome_none]`); sl.push(definedText('zin_loc_outcomes_possible', [ { key: 'zin_list_outcomes' } ], env).join('\n'));
    // the cost of the Lost Cause
    const dead = chr.cost.dead_names, subsets = [];
    for (let mask = 15; mask >= 1; mask--) {
      const inc = dead.filter((_, i) => mask & (1 << i)), key = `zin_cost_dead_${mask}`;
      const names = inc.map(d => d.name), listed = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
      L.set(key, ` ${listed} ${chr.cost.dead_tail}`);
      subsets.push({ cond: dead.map((d, i) => (mask & (1 << i) ? `gflag:${d.flag}` : `!gflag:${d.flag}`)), key });
    }
    sl.push(definedText('zin_loc_cost_dead', [...subsets, { key: NONE }], env).join('\n'));
    for (const [n, flag] of [['zol', 'zin_kusven_withdrawn'], ['volgan', 'zin_volgan_body_destroyed'], ['necklace', 'zin_eindil_wears_necklace']]) { L.set(`zin_cost_${n}`, chr.cost[n]); sl.push(definedText(`zin_loc_cost_${n}`, [ { cond: [`gflag:${flag}`], key: `zin_cost_${n}` }, { key: NONE } ], env).join('\n')); }
    L.set('zin_cost_all', '[zin_loc_cost_dead][zin_loc_cost_zol][zin_loc_cost_volgan][zin_loc_cost_necklace]');
    sl.push(definedText('zin_loc_ending_lost_cause_cost', [ { key: 'zin_cost_all' } ], env).join('\n'));
  }
  put('common/scripted_localisation/zin_ending.txt', text([HEADER, ...sl.flatMap(s => [s, ''])]));

  // text files
  const entriesOf = m => Object.fromEntries([...m].sort(([a], [b]) => a.localeCompare(b, 'en')));
  for (const [name, m] of Object.entries(locs)) { const rel = `localisation/english/${name}_l_english.yml`; const bytes = yml(entriesOf(m)); if (staged) staged.add(rel, bytes); files.set(rel, bytes); }

  // names: every zin_ identifier written must be defined here, listed in the register or named by a spec
  const own = new Set([...effectDefs.keys(), 'zin_story_tick', 'zin_story_tick_reign', 'zin_story_tick_ending', ...dateRows.map(r => r[0]), ...Object.keys(hooks.opinion_modifiers), ...Object.keys(hooks.ideas),
    'zin_story_tick_guard', 'zin_ending_volgan_near', 'zin_ending_cp11_known', 'zin_ending_cp11_early', 'zin_ending_cp11_late', ...blocks.map(b => `zin_story_tick_${b}`), 'zin_ending_t_eindil_aenor', 'zin_ending_t_afrit_realm', 'zin_ending_t_united_crown',
    'zin_t_deep', 'zin_t_ending', 'zin_arg_ending', 'zin_t_weak', 'zin_t_weak_code', 'zin_t_best', 'zin_t_best_code', 'zin_reign_mourner']);
  for (const code of [1, 2, 3, 4]) own.add(`zin_t_camp_${code}`);
  const problems2 = await checkEngine(files, register, own, spec);
  if (problems2.length) throw new Error(`Crown events: ${problems2.length} unresolved name(s):\n  ${problems2.slice(0, 25).join('\n  ')}`);
  // a retired name of the register anywhere in the script or the text
  const retired = [];
  for (const [rel, body] of files) for (const m of body.toString('utf8').matchAll(/(?<![A-Za-z0-9_])(zin_[a-z0-9_.]+)/g)) if (register.retired.has(m[1])) retired.push(`${rel}: ${m[1]}`);
  if (retired.length) throw new Error(`Crown events use retired names:\n  ${retired.slice(0, 10).join('\n  ')}`);
  const tp = await textProblems({ ...entriesOf(locs.zin_reign), ...entriesOf(locs.zin_ending) }, ctx.ruleSet);
  if (tp.length) throw new Error(`Crown events: ${tp.length} text problem(s):\n  ${tp.slice(0, 25).join('\n  ')}`);

  const used = env.used;
  const defined = new Set([...own]);
  const depend = (kind, set) => [...set].filter(n => n.startsWith('zin_') && !defined.has(n)).map(name => ({ name, kind, owner: register.names.get(name)?.owner ?? '' }));
  const dependencies = [...depend('trigger', used.triggers), ...depend('effect', used.effects), ...depend('flag', new Set([...used.gflags, ...used.cflags])), ...depend('variable', used.variables), ...depend('idea', used.ideas), ...depend('character', used.characters)]
    .filter((d, i, a) => a.findIndex(x => x.name === d.name && x.kind === d.kind) === i).sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name, 'en'));
  const count = ns => data.events.filter(e => nsOf(e.id) === ns).length;
  const options = data.events.reduce((n, e) => n + (e.options?.length ?? (e.kind === 'news' ? 2 : 0)), 0);
  return {
    counts: { events: data.events.length, reign: count('zin_reign'), ending: count('zin_ending'), world: count('zin_world'), news: data.events.filter(e => e.kind === 'news').length, options, hooks: Object.keys(hooks.hooks).length + 1, runnerItems: hooks.runner.reign.length + 4, dateTriggers: dateRows.length, opinionModifiers: Object.keys(hooks.opinion_modifiers).length, scriptedLoc: sl.length + camps.length, chronicleLines: Object.values(chr.lines).reduce((n, l) => n + Object.keys(l).length, 0), textKeys: locs.zin_reign.size + locs.zin_ending.size, rawBlocks: env.raw.n },
    files: [...files.keys()].sort(), dependencies, definitions: { effects: [...effectDefs.keys(), 'zin_story_tick', 'zin_story_tick_reign', 'zin_story_tick_ending'].sort(), triggers: dateRows.map(r => r[0]).sort(), scriptedLocalisation: sl.length + camps.length },
    used: Object.fromEntries(Object.entries(used).map(([k, v]) => [k, [...v].sort()])), texts: { zin_reign: entriesOf(locs.zin_reign), zin_ending: entriesOf(locs.zin_ending) }, scripts: files,
  };
}
