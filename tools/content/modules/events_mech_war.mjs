// The narrative events of the war-side mechanics that the slices fire and no slice defines (docs/design/alternate_history.md, soft-locks
// SL-12 to SL-17 and SL-28): Zol's Mistake and Kusven (zin_mistake), Volgan and Mirolon (zin_dominion), Lerendor (zin_leren) and Lorien's
// ride and the steward of Gala (zin_sun); and the story events the other slices fire and left to the events engineers (SL-28, the story
// wiring check): the elves (zin_elves), the eastern kings (zin_east), the Dark Lands (zin_dark), and the Lost Cause and the Refusal (zin_diplo).
// The Gods' Gift (zin_world.45) is the world magic module's (modules/world_magic.mjs).
//   const r = await buildEventsMechWar(staged, { countries })
//   returns { counts, definitions: { events }, loc }; throws on a text, picture or reference error.
//
// Data: data/events_mech_mistake.json, events_mech_dominion.json, events_mech_leren.json, events_mech_sun.json, events_mech_elves.json,
// events_mech_east.json, events_mech_dark.json, events_mech_diplo.json. One file per namespace; each writes
// events/<namespace>_war.txt, and all of them one English localisation file (the builder writes event text in English only).
// In the effect and trigger strings {{TAG}} is a realm of the file's "realms" table (resolved through the roster); {{leren:<path>}},
// {{volgan:<path>}}, {{elves:<path>}}, {{east:<path>}} or {{dark:<path>}} a number of the mechanic's data (mech_powers_lerendor.json,
// mech_powers_volgan.json, mech_powers_elves.json, mech_regions_east.json, mech_regions_dark.json), and {{n:<path>}} a number of the event
// file's own "numbers" block, so the tuning stays in data.
// Kusven is named as a known legend from the start (owner answer Q-70, K55), and as he is in events gated on his coming forth.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Loc, DATA, loadJson, hdr, format, writeEvent, wordProblems, notCp1252, dedent } from '../lib/mech_court_lib.mjs';

const MOD = 'events_mech_war';
const SPEC = 'docs/specs/06_events/03_war_of_the_last_crowns.md';
export const WAR_EVENT_FILES = ['events_mech_mistake.json', 'events_mech_dominion.json', 'events_mech_leren.json', 'events_mech_sun.json',
  'events_mech_elves.json', 'events_mech_east.json', 'events_mech_dark.json', 'events_mech_diplo.json'];
// Names that no player text of these events may carry: superseded spellings, Afrit's secret before the reveal (not a war-side matter),
// and the glyph the game font lacks. The heir appears only through [zin_loc_eindil] or as "the heir".
const FORBIDDEN = /\bEdvoid\b|\bEinendil\b|\bAfrit\b|\bDeliverer\b|Hidden Council|\bEindil\b|ō|Šodolôrō|\bOld God's victory/;

export async function loadWarEvents(files = WAR_EVENT_FILES) {
  return Promise.all(files.map(async f => ({ file: f, ...JSON.parse(await readFile(path.join(DATA, f), 'utf8')) })));
}

const dig = (obj, keyPath) => keyPath.split('.').reduce((o, k) => (o && k in o ? o[k] : undefined), obj);

export async function buildEventsMechWar(staged, ctx = {}) {
  const roster = ctx.countries;
  const byName = new Map(roster.map(c => [c.name, c]));
  const sets = ctx.sets ?? await loadWarEvents();
  const numbers = { leren: (await loadJson('mech_powers_lerendor.json')).numbers, volgan: (await loadJson('mech_powers_volgan.json')).numbers,
    elves: (await loadJson('mech_powers_elves.json')).numbers, east: (await loadJson('mech_regions_east.json')).numbers, dark: (await loadJson('mech_regions_dark.json')).numbers };
  const cells = await loadJson('presentation-cells.json');
  const pictures = new Map(cells.events.map(e => [e.key, e]));
  const loc = new Loc(), problems = [], defined = [], written = [];

  for (const set of sets) {
    const ns = set.namespace;
    const tags = Object.fromEntries(Object.entries(set.realms ?? {}).map(([k, name]) => {
      const c = byName.get(name);
      if (!c) throw new Error(`${MOD}: ${set.file} names the realm ${name}, which is not in the roster`);
      return [k, c.tag];
    }));
    const resolve = s => (s === undefined ? s : String(s).replace(/\{\{([A-Za-z]+)(?::([a-z0-9_.]+))?\}\}/g, (m, k, p) => {
      if (p) { const v = dig(k === 'n' ? set.numbers : numbers[k], p); if (typeof v !== 'number') throw new Error(`${MOD}: ${set.file}: no number ${k}:${p}`); return String(v); }
      if (!tags[k]) throw new Error(`${MOD}: ${set.file}: no realm ${k}`);
      return tags[k];
    }));
    const texts = [];
    for (const e of set.events) {
      const id = `${ns}.${e.id}`;
      const where = `${set.file} ${id}`;
      if (defined.includes(id)) problems.push(`${where}: defined twice`);
      defined.push(id);
      if (e.kind !== 'hidden') {
        const pic = pictures.get(e.picture);
        if (!pic) problems.push(`${where}: picture ${e.picture} is not in presentation-cells.json`);
        else {
          if (e.kind === 'news' && !['both', 'news'].includes(pic.crop)) problems.push(`${where}: news picture ${e.picture} has no news crop`);
          if (e.kind === 'country' && !['both', 'standard'].includes(pic.crop)) problems.push(`${where}: event picture ${e.picture} is news-only`);
          if (typeof pic.gate === 'string' && /^zin_[a-z_]+$/.test(pic.gate) && !(e.requires ?? []).includes(pic.gate)) problems.push(`${where}: picture ${e.picture} is gated on ${pic.gate}, which the event does not require`);
        }
        if (!e.options?.length) problems.push(`${where}: no option`);
        if (e.checkpoint !== undefined && (e.options[0]?.hist || !e.options.some(o => o.hist))) problems.push(`${where}: a checkpoint event lists its non-committal option first and has a historical one (C9)`);
      }
      // Kusven is a known legend from the start (owner answer Q-70, K55): before he comes forth a text names him only as the winter
      // tales tell him; after it (requires or trigger on his coming forth) as he is.
      const gated = (e.requires ?? []).includes('zin_kusven_forth') || /zin_kusven_(?:is_)?forth/.test(e.trigger ?? '');
      const shown = [e.title, ...(Array.isArray(e.desc) ? e.desc.map(d => (d.trigger?.includes('zin_kusven_forth') ? '' : d.text)) : [e.desc]), ...(e.options ?? []).flatMap(o => [o.text, o.tip])].filter(Boolean);
      if (!gated && shown.some(t => /\bKusven\b/.test(t) && !/winter tale/.test(t))) problems.push(`${where}: names Kusven but is not gated on zin_kusven_forth`);
      const options = (e.options ?? []).map(o => {
        const tip = o.tip ? `${id}.${o.key}.tt` : null;
        if (tip) loc.set(tip, o.tip);
        const effect = [tip ? `custom_effect_tooltip = ${tip}` : '', resolve(o.effect) ?? ''].filter(Boolean).join('\n');
        return { key: o.key, text: o.text, ai: typeof o.ai === 'string' ? resolve(o.ai) : o.ai, trigger: resolve(o.trigger), effect: effect || undefined };
      });
      const ev = {
        id: e.id, kind: e.kind, title: e.title, picture: e.picture, timeout: e.timeout,
        desc: Array.isArray(e.desc) ? e.desc.map(d => ({ trigger: resolve(d.trigger), text: d.text })) : e.desc,
        trigger: resolve(e.trigger), immediate: resolve(e.immediate), options: e.kind === 'hidden' ? undefined : options,
      };
      const w = writeEvent(ns, ev, loc, { hiddenOk: 'The court decides.' });
      // Every event here is fired by script: a trigger is the condition checked when it is fired (the shared writer marks only
      // trigger-less events as triggered-only, because its trigger blocks belong to mean-time-to-happen events).
      const text = e.trigger ? w.text.replace(/^(id = [a-z_]+\.\d+)$/m, '$1\nis_triggered_only = yes') : w.text;
      texts.push(`# ${dedent(e.note ?? '').replace(/\n/g, ' ')}\n${text}`);
      written.push(w.meta);
    }
    for (const [k, v] of Object.entries(set.localisation ?? {})) loc.set(k, v);
    staged.text(set.file, format(`${hdr(MOD, SPEC, `Namespace ${ns}: the story events its mechanic fires (${set.file.replace('events/', '')}, data/${set.file.replace(/^events\/zin_([a-z]+)_war\.txt$/, 'events_mech_$1.json')}).`)}\nadd_namespace = ${ns}\n${texts.join('\n\n')}\n`));
  }

  const entries = loc.entries();
  problems.push(...await wordProblems(entries), ...notCp1252(entries));
  for (const [k, v] of Object.entries(entries)) if (FORBIDDEN.test(v.replace(/\[[^\]]*\]/g, ' '))) problems.push(`${k}: a forbidden name or glyph (${v.match(FORBIDDEN)[0]})`);
  if (problems.length) throw new Error(`${MOD}: ${problems.length} problems:\n  ${problems.slice(0, 40).join('\n  ')}`);
  staged.add('localisation/english/zin_events_mech_war_l_english.yml', loc.bytes());
  const byNs = defined.reduce((m, id) => ({ ...m, [id.split('.')[0]]: (m[id.split('.')[0]] ?? 0) + 1 }), {});
  return { counts: { events: defined.length, ...byNs, locKeys: loc.size }, definitions: { events: defined }, loc: entries, eventMeta: written };
}
