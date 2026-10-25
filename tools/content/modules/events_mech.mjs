// The narrative events of the mechanic namespaces that the mechanic slices fire and no module wrote (docs/design/alternate_history.md,
// soft-lock audit SL-28, with SL-04, SL-05, SL-07, SL-09, SL-10 and SL-25): the story events of zin_afrit (the plot, the crowning, the
// voyage to Yeldenne, the reveal, the flight east, the return, the cliff, the palace and the hunt) and the Aenor successor events.
//
//   const summary = await buildEventsMech(staged, { countries })      // build.mjs, after the mechanic slices and the crown events
//
// Data: tools/content/data/events_mech_afrit.json and events_mech_misc.json ({ kind: "events_mech", sets: [{ namespace, file, events }] }).
// An event is { id, kind: country|news, private?, checkpoint?, title, desc (text or [{ if, text }], the default last), picture, requires?,
// named?, immediate?, options: [{ text, hist?, trigger?, ai (number or ai_chance body), aiVar?, tip?, effect? }], palaceStage?, fired_by }.
// Script lines are Clausewitz text; the macro line "@host <id>" fires zin_eindil.<id> to the Host of the heir (the country stored in
// global.zin_eindil_host, else the one that employs zin_eindil). The events reuse the court mechanics' writer (lib/mech_court_lib.mjs):
// every event has timeout_days = 30 and a picture of the event catalog (data/presentation-cells.json).
//
// Checks (the build fails on any): ids unique and not defined by another staged file; every picture in the catalog with the right crop,
// its gate required, the hub-only picture only on private events; a checkpoint event lists its non-committal option first and has a
// historical option (E2, C9); the banned words, the game font, the secrecy of the Deliverer (no public text names Afrit, the Council or
// the plot before zin_afrit_revealed), the heir's name only after zin_eindil_named, no sealed name; every command in the installed
// documentation.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Loc, writeEvent, format, list, hdr, DATA, SECRET_WORDS, wordProblems, notCp1252, readable, unknownCommands } from '../lib/mech_court_lib.mjs';
import { loadPictures } from './events_world.mjs';

const MOD = 'events_mech';
const SPEC = 'docs/design/alternate_history.md (SL-28)';
export const DATA_FILES = ['events_mech_afrit.json', 'events_mech_misc.json'];
export const LOC_NAME = 'zin_events_mech';
// Option keys <id>.a, .b, ...; the title is <id>.t and the description <id>.desc, which no option reaches.
const LETTERS = 'abcdefghijklmnopqrs';
// Names no text may carry (knowledge layers C24 to C26 and the superseded labels).
const SEALED = /\bKusven\b|\bEdvoid\b|\bEinendil\b|\bErdu\b|\bDunda\b/;
const NAMES_HEIR = /\bEindil\b/, NAMES_FATHER = /\bEin\b/;
// The keys of an event block itself, besides the documented effects and triggers.
const EVENT_KEYS = new Set(['immediate', 'is_triggered_only', 'major', 'option', 'timeout_days', 'fire_only_once', 'show_major', 'hidden', 'rule']);
const REVEALED = 'has_global_flag = zin_afrit_revealed';

export async function loadMechEvents(files = DATA_FILES) {
  const sets = [];
  for (const f of files) {
    const j = JSON.parse(await readFile(path.join(DATA, f), 'utf8'));
    if (j.kind !== 'events_mech') throw new Error(`${f}: kind must be events_mech`);
    for (const s of j.sets) sets.push({ ...s, source: f });
  }
  return sets;
}

// The Host of the heir receives a journey event (the palace and the cliff, 03_war_of_the_last_crowns.md).
const toHost = id => list('if = {', 'limit = { has_variable = global.zin_eindil_host }', `var:global.zin_eindil_host = { country_event = { id = zin_eindil.${id} } }`, '}',
  'else = {', 'random_country = {', 'limit = { has_character = zin_eindil }', `country_event = { id = zin_eindil.${id} }`, '}', '}');
export function expand(lines, fired) {
  const out = [];
  for (const l of [].concat(lines ?? [])) {
    const m = /^@host (\d+)$/.exec(l.trim());
    if (m) { fired.add(`zin_eindil.${m[1]}`); out.push(toHost(m[1])); continue; }
    for (const e of l.matchAll(/\b(?:country_event|news_event) = \{ id = ([a-z_]+\.\d+)/g)) fired.add(e[1]);
    for (const e of l.matchAll(/\b(?:country_event|news_event) = ([a-z_]+\.\d+)\b/g)) fired.add(e[1]);
    out.push(l);
  }
  return list(out);
}
// An AI weight read from a country variable that holds a chance of 5 to 95: 5 plus 10 for each full ten (or the rest of 100).
export function aiFromVariable({ name, inverse }) {
  const bands = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  return list(`base = ${inverse ? 95 : 5}`, bands.map(b => `modifier = {\n\tadd = ${inverse ? -10 : 10}\n\tcheck_variable = { ${name} > ${b - 1} }\n}`));
}

// The options of a palace stage (the defences, then the roll of zin_afrit_palace_roll).
function palaceOptions(set, ev) {
  const P = set.palace;
  if (!P) throw new Error(`${set.namespace}.${ev.id}: a palace stage needs the set's palace options`);
  const n = ev.palaceStage;
  return P.options.filter(o => !(o.beforeStage && n >= o.beforeStage) && !(o.onlyStage && n !== o.onlyStage)).map(o => ({
    text: o.text, ai: o.ai, tip: P.roll,
    trigger: [...(o.trigger ?? []), ...(o.flag ? [`NOT = { has_global_flag = ${o.flag} }`] : [])],
    effect: [...(o.flag ? [`hidden_effect = { set_global_flag = ${o.flag} }`] : []), ...(o.kind ? [`set_temp_variable = { zin_arg_kind = ${o.kind} }`, 'zin_afrit_palace_defend = yes'] : []),
      `set_temp_variable = { zin_arg_stage = ${n} }`, 'zin_afrit_palace_roll = yes'],
  }));
}

// One event of the data into the writer's shape. Text goes to loc through the writer; tips get <id>.<option>.tt.
function shape(set, ev, loc, fired) {
  const id = `${set.namespace}.${ev.id}`;
  const options = (ev.palaceStage ? palaceOptions(set, ev) : ev.options ?? []).map((o, i) => {
    const key = LETTERS[i];
    const effect = [];
    if (o.tip) {
      loc.set(`${id}.${key}.tt`, o.tip);
      if (!(o.effect ?? []).some(l => l.includes(`${id}.${key}.tt`))) effect.push(`custom_effect_tooltip = ${id}.${key}.tt`);
    }
    effect.push(...(o.effect ?? []));
    return {
      key, text: o.text, hist: !!o.hist,
      trigger: o.trigger?.length ? list(o.trigger) : undefined,
      ai: o.aiVar ? aiFromVariable(o.aiVar) : o.ai,
      effect: effect.length ? expand(effect, fired) : undefined,
    };
  });
  const desc = typeof ev.desc === 'string' ? ev.desc : ev.desc.map(d => ({ text: d.text, trigger: d.if }));
  return {
    id: ev.id, kind: ev.kind, title: ev.title, desc, picture: ev.picture, requires: ev.requires ?? [], checkpoint: ev.checkpoint,
    immediate: ev.immediate ? expand(ev.immediate, fired) : undefined, options, timeout: 30,
  };
}

// ------------------------------------------------------------------------------------------------ checks
export function structureProblems(sets, pictures, taken = new Set()) {
  const out = [], seen = new Set();
  for (const s of sets) for (const e of s.events) {
    const id = `${s.namespace}.${e.id}`, p = m => out.push(`${id}: ${m}`);
    if (!Number.isInteger(e.id) || e.id < 1) p('the id must be a positive whole number');
    if (seen.has(id)) p('defined twice in the data');
    seen.add(id);
    if (taken.has(id)) p('already defined by another staged event file');
    if (!['country', 'news'].includes(e.kind)) p(`kind ${e.kind} (country or news)`);
    if (!e.title || !e.desc) p('title and description are required');
    if (Array.isArray(e.desc) && (e.desc.at(-1).if || e.desc.slice(0, -1).some(d => !d.if))) p('a description with variants needs a condition on each but the last, which is the default');
    if (!e.fired_by) p('fired_by names who fires the event');
    const opts = e.palaceStage ? (s.palace?.options ?? []) : (e.options ?? []);
    if (!opts.length) p('no option');
    if (e.kind === 'news' && opts.length !== 1) p('a news event has one option');
    if (e.private && e.kind === 'news') p('a private event goes to the hub only and cannot be news');
    if (e.checkpoint !== undefined) {
      if (opts[0]?.hist) p('a checkpoint event lists its non-committal option first (E2, C9)');
      if (!opts.some(o => o.hist)) p('a checkpoint event needs a historical option');
    }
    for (const o of opts) if (o.ai === undefined && !o.aiVar) p(`option "${o.text}" has no AI weight`);
    const pic = pictures.get(e.picture);
    if (!pic) { p(`picture ${e.picture} is not in presentation-cells.json`); continue; }
    if (e.kind === 'news' && !['both', 'news'].includes(pic.crop)) p(`news picture ${e.picture} has no news crop`);
    if (e.kind === 'country' && !['both', 'standard'].includes(pic.crop)) p(`event picture ${e.picture} is news-only`);
    const gate = pic.gate;
    if (typeof gate === 'string' && /^zin_[a-z_]+$/.test(gate) && !(e.requires ?? []).includes(gate)) p(`picture ${e.picture} is gated on ${gate}, which the event does not require`);
    if (gate === 'hub-only events' && !e.private) p(`picture ${e.picture} is for the hub's private events`);
    if (typeof gate === 'string' && gate.startsWith('ending flag')) p(`picture ${e.picture} belongs to the endings`);
  }
  return out;
}

// Which texts of an event may name the secret: the private ones, and those shown only after the reveal.
function texts(s, e) {
  const id = `${s.namespace}.${e.id}`, after = e.private || (e.requires ?? []).includes('zin_afrit_revealed'), named = e.private || e.named || (e.requires ?? []).includes('zin_eindil_named');
  const out = [{ key: `${id}.t`, text: e.title, after, named }];
  [].concat(typeof e.desc === 'string' ? [{ text: e.desc }] : e.desc).forEach((d, i) => out.push({ key: `${id}.desc${i || ''}`, text: d.text, after: after || String(d.if ?? '').includes(REVEALED), named }));
  const opts = e.palaceStage ? (s.palace?.options ?? []) : (e.options ?? []);
  for (const o of opts) { out.push({ key: `${id}: "${o.text}"`, text: o.text, after, named }); if (o.tip) out.push({ key: `${id}: tip`, text: o.tip, after, named }); }
  if (e.palaceStage && s.palace?.roll) out.push({ key: `${id}: roll`, text: s.palace.roll, after, named });
  return out;
}
export async function textProblems(sets) {
  const out = [], all = {};
  for (const s of sets) for (const e of s.events) for (const t of texts(s, e)) {
    all[t.key] = t.text;
    const shown = readable(t.text);
    if (!t.after && SECRET_WORDS.test(shown)) out.push(`${t.key}: names the secret before zin_afrit_revealed (${shown.match(SECRET_WORDS)[0]})`);
    if (!t.named && NAMES_HEIR.test(shown)) out.push(`${t.key}: names the heir before zin_eindil_named`);
    if (!t.named && !t.after && NAMES_FATHER.test(shown)) out.push(`${t.key}: names Ein before the naming or the reveal`);
    if (SEALED.test(shown)) out.push(`${t.key}: a sealed or superseded name (${shown.match(SEALED)[0]})`);
    if (/\b(TODO|TBD|lorem|placeholder)\b/i.test(t.text)) out.push(`${t.key}: placeholder text`);
  }
  out.push(...await wordProblems(all), ...notCp1252(all));
  return out;
}

// ------------------------------------------------------------------------------------------------ build
export async function renderMechEvents(sets) {
  const loc = new Loc(), files = new Map(), metas = [], fired = new Set();
  for (const s of sets) {
    const written = s.events.slice().sort((a, b) => a.id - b.id).map(ev => {
      const w = writeEvent(s.namespace, shape(s, ev, loc, fired), loc, {});
      metas.push({ ...w.meta, private: !!ev.private, named: !!ev.named, palaceStage: ev.palaceStage, fired_by: ev.fired_by, proposed: !!ev.proposed });
      return w.text;
    });
    const head = hdr(MOD, SPEC, `Namespace ${s.namespace}: ${s.note ?? 'story events'}`);
    files.set(s.file, `${format([head, ...(s.declaresNamespace ? [`add_namespace = ${s.namespace}`] : []), ...written].join('\n'))}\n`);
  }
  return { loc, files, metas, fired };
}

// The ids an event file defines: the id of each top-level event block (an id inside a block fires an event, it defines none).
export function definedEventIds(fileText) {
  return [...fileText.replace(/#[^\n]*/g, '').matchAll(/^(?:country|news|state|unit_leader|operative_leader)_event\s*=\s*\{\s*id\s*=\s*([a-z_0-9]+\.\d+)/gm)].map(m => m[1]);
}

export async function buildEventsMech(staged, ctx = {}) {
  const sets = await loadMechEvents(ctx.files);
  const pictures = await loadPictures();
  const taken = new Set();
  for (const [rel, buf] of staged.files) if (rel.startsWith('events/')) for (const id of definedEventIds(buf.toString('utf8'))) taken.add(id);
  const out = await renderMechEvents(sets);
  const problems = [...structureProblems(sets, pictures, taken), ...await textProblems(sets)];
  for (const [rel, text] of out.files) for (const k of await unknownCommands(text, EVENT_KEYS)) problems.push(`${rel}: ${k} is neither documented nor a ZIN name`);
  if (problems.length) throw new Error(`Mechanic story events break the rules (${problems.length}):\n  ${problems.slice(0, 40).join('\n  ')}`);
  for (const [rel, text] of out.files) staged.text(rel, text);
  staged.loc(LOC_NAME, out.loc.entries());
  const events = out.metas.map(m => m.full);
  return { counts: { events: events.length, files: out.files.size, keys: out.loc.size, fired: out.fired.size }, definitions: { events }, fired: [...out.fired].sort(), eventMeta: out.metas };
}
