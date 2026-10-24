// Checks of the story-event module (modules/events_world.mjs). Each function returns a list of problems (strings); the module
// throws when any list is non-empty and the tests (events_world.test.mjs) call the same functions on broken copies of the data.
import { displayText, nonCp1252 } from './loc_parse.mjs';
import { loadRuleSet, compileBanned, findBanned } from './banned.mjs';
import { loadGlossary } from './text_engine.mjs';
import { eventsOf, RANGES, NAMESPACES, RETIRED_IDS, loadPictures, eventKind } from '../modules/events_world.mjs';

const inRanges = (ns, id) => (RANGES[ns] ?? []).some(([a, b]) => id >= a && id <= b);

// ------------------------------------------------------------------------------------------------ structure
export function structureProblems(data, pictures) {
  const out = [], meta = data.meta;
  const hubEvents = new Set(meta.secret?.hubEvents ?? []);
  for (const ns of NAMESPACES) {
    const seen = new Set();
    for (const e of eventsOf(data, ns)) {
      const eid = `${ns}.${e.id}`, p = m => out.push(`${eid}: ${m}`);
      if (!Number.isInteger(e.id) || !inRanges(ns, e.id)) p(`id outside the ranges of ${ns}`);
      if (RETIRED_IDS.has(eid)) p('retired id');
      if (seen.has(e.id)) p('duplicate id');
      seen.add(e.id);
      const kind = eventKind(e);
      if (kind === 'hidden') {
        if (e.options?.length) p('a hidden event has no options');
        if (!e.immediate?.length && !e.trigger) p('a hidden event needs an immediate block');
        continue;
      }
      if (!e.title) p('missing title');
      if (!e.desc) p('missing description');
      if (!e.options?.length) p('no option');
      for (const [i, o] of (e.options ?? []).entries()) {
        if (!o.name || typeof o.name !== 'string') p(`option ${i + 1} has no text`);
        if (o.ai !== undefined && typeof o.ai !== 'number' && typeof o.ai?.free !== 'number') p(`option ${i + 1} has a bad ai weight`);
      }
      if (e.checkpoint !== undefined && e.options?.[0]?.hist) p('a checkpoint event must list its non-committal option first (C9)');
      if (e.checkpoint !== undefined && !e.options?.some(o => o.hist)) p('a checkpoint event needs a hist option');
      if (e.mtth && !(ns === 'zin_eindil' && e.hidden)) p('only the hidden journey pulse may use mean_time_to_happen (C5)');
      const pic = pictures.get(e.picture);
      if (!pic) { p(`picture ${e.picture} is not in presentation-cells.json`); continue; }
      if (kind === 'news' && !['both', 'news'].includes(pic.crop)) p(`news picture ${e.picture} has no news crop`);
      if (kind === 'country' && !['both', 'standard'].includes(pic.crop)) p(`event picture ${e.picture} is news-only`);
      const gate = pic.gate;
      if (typeof gate === 'string' && /^zin_[a-z_]+$/.test(gate) && !(e.requires ?? []).includes(gate)) p(`picture ${e.picture} is gated on ${gate}, which the event does not require`);
      if (gate === 'hub-only events' && !hubEvents.has(eid)) p(`picture ${e.picture} is for the hub-only events`);
      if (typeof gate === 'string' && gate.startsWith('ending flag')) p(`picture ${e.picture} belongs to the endings`);
    }
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ references
export function referenceProblems(data, out) {
  const probs = [...out.W.problems];
  const own = new Set(NAMESPACES.flatMap(ns => eventsOf(data, ns).map(e => `${ns}.${e.id}`)));
  const ext = new Set(data.meta.externals?.events ?? []);
  const fired = out.W.used.events;
  for (const id of fired) if (!own.has(id) && !ext.has(id)) probs.push(`${id} is fired but defined by nobody (own events and externals.events)`);
  for (const id of own) if (!fired.has(id)) {
    const [ns, n] = id.split('.'), e = eventsOf(data, ns).find(x => x.id === +n);
    if (!e.fired_by && !e.mtth) probs.push(`${id} is fired by no one`);
  }
  for (const id of ext) if (own.has(id)) probs.push(`${id} is listed as external but this module defines it`);
  const ownEffects = new Set(Object.keys(data.meta.eindil?.effects ?? {}));
  const extEffects = new Set(data.meta.externals?.effects ?? []);
  for (const f of out.W.used.effects) if (!ownEffects.has(f) && !extEffects.has(f)) probs.push(`effect ${f} is called but neither defined here nor listed in externals.effects`);
  return probs;
}

// ------------------------------------------------------------------------------------------------ text
let compiled;
async function rules() {
  compiled ??= compileBanned(await loadRuleSet({ glossary: await loadGlossary() }));
  return compiled;
}
const keyEvent = key => { const m = key.match(/^(zin_[a-z]+)\.(\d+)\.(.+)$/); return m ? { ns: m[1], id: +m[2], rest: m[3] } : null; };

export async function textProblems(data, locs) {
  const out = [], rs = await rules(), meta = data.meta, sec = meta.secret ?? {};
  const hub = new Set(sec.hubEvents ?? []), phrases = (sec.forbiddenPhrases ?? []).map(f => ({ re: new RegExp(f.re, 'i'), why: f.why }));
  const preNaming = new Set(sec.preNamingEindil ?? []);
  const byId = new Map(NAMESPACES.flatMap(ns => eventsOf(data, ns).map(e => [`${ns}.${e.id}`, e])));
  for (const [ns, loc] of Object.entries(locs)) {
    for (const [key, value] of Object.entries(loc)) {
      const text = String(value), shown = displayText(text);
      for (const h of findBanned(shown, rs)) out.push(`${key}: banned ${h.word} (${h.id})`);
      const bad = nonCp1252(text); if (bad.length) out.push(`${key}: character the game font cannot draw: ${bad.join('')}`);
      if (/\b(TODO|TBD|lorem|placeholder)\b/i.test(text)) out.push(`${key}: placeholder text`);
      if (/:0\b/.test(key)) out.push(`${key}: key with :0`);
      for (const f of phrases) if (f.re.test(shown)) out.push(`${key}: ${f.why}`);
      const k = keyEvent(key);
      if (!k) continue;
      const eid = `${k.ns}.${k.id}`, ev = byId.get(eid);
      if (!ev) { out.push(`${key}: text for an event that does not exist`); continue; }
      const privileged = hub.has(eid) || /(^|_)(hub|revealed)(_|$)/.test(k.rest);
      if (!privileged && /\bAfrit\b|\bHidden Council\b|Kingdom Behind the Throne/.test(shown)) out.push(`${key}: names Afrit or the Council where the secret holds (C1)`);
      if (!privileged && /demon/i.test(shown) && /Deliverer/i.test(shown)) out.push(`${key}: calls the Deliverer a demon`);
      const mayName = ev.named === true;
      if (!mayName && /\bEindil\b|\bEin\b/.test(shown)) out.push(`${key}: names Eindil before he is named (C2)`);
      if (mayName && k.ns === 'zin_eindil' && preNaming.has(k.id)) out.push(`${key}: ${eid} can fire before the naming and may not say Eindil`);
      if (eid === 'zin_eindil.83' && /brother/i.test(shown)) out.push(`${key}: the warning never says brother (D3)`);
      if (/\b(Ein)\b/.test(shown) && !mayName) out.push(`${key}: Ein before the naming`);
    }
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ everything
export async function check(data, out, ctx) {
  const pictures = await loadPictures();
  return [...structureProblems(data, pictures), ...referenceProblems(data, out), ...await textProblems(data, out.locs)];
}
