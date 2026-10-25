// Story wiring check (docs/design/alternate_history.md: SL-28, SL-29, SL-30; plan row "Check").
//   const report = storyWiring(files, { config, design, perPowerRules })   pure: files is a Map of staged path -> bytes
//   assertStoryWiring(report)                                              throws on the enforced owners' findings
// Checks over the finished staged tree (scripts under common/ and events/):
//   event_undefined     an event fired by an effect or an on_action is defined by no event file (an id defined only by the pending
//                       stand-ins of modules/pending_names.mjs counts as undefined: its stand-in does nothing)
//   flag_never_set      a global or country flag is read and never set (dynamic names such as zin_x_@ROOT match by their prefix);
//                       an allowance row of data/story_wiring.json names the owner that will set it and keeps it out of the failures
//   flag_scope          a flag is read as global and set only as a country flag, or the reverse (SL-18, SL-20)
//   trigger_as_flag     a scripted trigger's name is tested as a flag and no flag of that name is set in that scope (SL-06); a flag set
//                       beside a trigger of the same name (the contract's pairs, such as zin_dark_took_southern_gifts, or the Glo slice's
//                       zin_glo_heir_in_hall, whose trigger adds that Horos lives) is a real flag and is not reported
//   rule_unwrapped      a per-power game rule's option is tested with has_game_rule outside common/scripted_triggers/zin_rules.txt (SL-08, SL-30)
//   design              a beat of docs/design/alternate_history.json lacks a latest date (start and ending beats excepted), or a
//                       divergence lacks a successor
//   allowance_stale     an allowance row whose flag is now set (remove the row)
// Each finding names the owner of the file that reads or fires (the owner patterns of data/story_wiring.json). Only the owners in `enforce`
// (or every owner with `enforceAll`) fail the build; the others are reported so the lead sees what is missing per owner.
import { readFileSync } from 'node:fs';
import { parse, scriptText } from '../lib/clausewitz.mjs';

export const CONFIG = new URL('../data/story_wiring.json', import.meta.url);
export const loadConfig = () => JSON.parse(readFileSync(CONFIG, 'utf8'));
const EVENT_KINDS = new Set(['country_event', 'news_event', 'state_event', 'unit_leader_event', 'operative_leader_event']);
const PENDING_EVENTS = 'events/zz_zin_pending_events.txt';
const RULE_WRAPPERS = 'common/scripted_triggers/zin_rules.txt';

const valueOf = (entry, key) => Array.isArray(entry.v) ? entry.v.find(x => x.k === key)?.v : undefined;
const flagName = entry => typeof entry.v === 'string' ? entry.v : valueOf(entry, 'flag');
const dynamicPrefix = name => { const i = name.search(/[@[]/); return i < 0 ? null : name.slice(0, i); };

export function storyWiring(files, { config = loadConfig(), design = null, perPowerRules = [] } = {}) {
  const owners = config.owners.map(o => ({ owner: o.owner, re: new RegExp(o.pattern) }));
  const ownerOf = rel => owners.find(o => o.re.test(rel))?.owner ?? `other (${(/\/zin_([a-z]+)/.exec(rel) ?? [])[1] ?? rel.split('/')[1] ?? rel})`;
  const defined = new Map(), fired = [], set = { global: new Map(), country: new Map() }, read = { global: [], country: [] }, triggers = new Set(), rules = [];
  const perPower = new Set(perPowerRules);

  for (const [rel, bytes] of files) {
    if (!rel.endsWith('.txt') || !/^(common|events|history)\//.test(rel)) continue;
    let tree;
    try { tree = parse(scriptText(bytes)); } catch { continue; }
    const isEvents = rel.startsWith('events/');
    if (rel.startsWith('common/scripted_triggers/')) for (const e of tree) if (e.k && Array.isArray(e.v)) triggers.add(e.k);
    const visit = (list, depth) => {
      for (const e of list) {
        if (!e.k) { if (Array.isArray(e.v)) visit(e.v, depth + 1); continue; }
        if (EVENT_KINDS.has(e.k)) {
          const id = typeof e.v === 'string' ? e.v : valueOf(e, 'id');
          if (isEvents && depth === 0) { if (id) (defined.get(id) ?? defined.set(id, new Set()).get(id)).add(rel); }
          else if (id && /^[a-z_]+\.\d+$/.test(id)) fired.push({ id, rel, line: e.line });
        }
        if ((e.k === 'events' || e.k === 'random_events') && Array.isArray(e.v) && rel.startsWith('common/on_actions/')) {
          for (const x of e.v) { const id = e.k === 'events' ? x.v : x.v; if (typeof id === 'string' && /^[a-z_]+\.\d+$/.test(id)) fired.push({ id, rel, line: x.line }); }
        }
        if (e.k === 'set_global_flag' || e.k === 'set_country_flag') {
          const name = flagName(e), scope = e.k === 'set_global_flag' ? 'global' : 'country';
          if (name) (set[scope].get(name) ?? set[scope].set(name, new Set()).get(name)).add(rel);
        }
        if (e.k === 'has_global_flag' || e.k === 'has_country_flag') {
          const name = flagName(e);
          if (name) read[e.k === 'has_global_flag' ? 'global' : 'country'].push({ name, rel, line: e.line });
        }
        if (e.k === 'has_game_rule' && Array.isArray(e.v)) {
          const rule = valueOf(e, 'rule');
          if (perPower.has(rule) && rel !== RULE_WRAPPERS) rules.push({ rule, option: valueOf(e, 'option'), rel, line: e.line });
        }
        if (Array.isArray(e.v)) visit(e.v, depth + 1);
      }
    };
    visit(tree, 0);
  }

  const findings = [];
  const add = (check, id, rel, detail, owner = ownerOf(rel)) => findings.push({ check, id, owner, file: rel, detail });
  // Fired events.
  const seen = new Set();
  for (const f of fired) {
    const where = defined.get(f.id);
    const real = where && [...where].some(r => r !== PENDING_EVENTS);
    const key = `${f.id}|${f.rel}`;
    if (real || seen.has(key)) continue;
    seen.add(key);
    add('event_undefined', f.id, f.rel, where ? 'only the inert pending stand-in defines it' : 'no event file defines it');
  }
  // Flags.
  const allowance = new Map((config.allowance ?? []).map(a => [a.flag, a]));
  const isSet = (scope, name) => set[scope].has(name) || [...set[scope].keys()].some(s => { const p = dynamicPrefix(s); return p && name.startsWith(p); });
  const flagSeen = new Set();
  for (const scope of ['global', 'country']) {
    const other = scope === 'global' ? 'country' : 'global';
    for (const r of read[scope]) {
      if (dynamicPrefix(r.name)) continue;
      const key = `${scope}|${r.name}|${ownerOf(r.rel)}`;
      if (flagSeen.has(key)) continue;
      flagSeen.add(key);
      if (isSet(scope, r.name)) continue;
      if (triggers.has(r.name)) { add('trigger_as_flag', r.name, r.rel, `${r.name} is a scripted trigger and no ${scope} flag of that name is set: test it as ${r.name} = yes`); continue; }
      const a = allowance.get(r.name);
      if (a && a.scope === scope) { findings.push({ check: 'flag_allowed', id: r.name, owner: a.owner, reader: ownerOf(r.rel), file: r.rel, detail: `${a.note}${isSet(other, r.name) ? ` (set only as a ${other} flag today)` : ''}`, allowed: true }); continue; }
      if (isSet(other, r.name)) { add('flag_scope', r.name, r.rel, `read as a ${scope} flag, set only as a ${other} flag`); continue; }
      add('flag_never_set', r.name, r.rel, `read as a ${scope} flag and never set`);
    }
  }
  for (const [flag, a] of allowance) if (isSet(a.scope, flag)) findings.push({ check: 'allowance_stale', id: flag, owner: a.owner, file: 'tools/content/data/story_wiring.json', detail: 'the flag is set now: remove the allowance row', allowed: true });
  // Per-power rules.
  for (const r of rules) add('rule_unwrapped', `${r.rule}.${r.option}`, r.rel, `test it through the zin_rules_ai_branch_* wrapper (line ${r.line})`);
  // The design twin.
  if (design) {
    for (const b of design.beats) {
      const exempt = b.cp === 'ENDING' || b.cp === 'CP01';
      if (!exempt && !b.dates?.latest) add('design', b.id, 'docs/design/alternate_history.json', 'no latest date', 'historical path');
      for (const d of b.divergences) if (!String(d.successor ?? '').trim()) add('design', d.id, 'docs/design/alternate_history.json', 'no successor or fallback', 'historical path');
    }
  }

  const enforced = new Set(config.enforce ?? []);
  const failures = findings.filter(f => !f.allowed && (config.enforceAll || enforced.has(f.owner)));
  const byOwner = {};
  for (const f of findings) { const o = (byOwner[f.owner] ??= {}); (o[f.check] ??= []).push(f.id); }
  for (const o of Object.values(byOwner)) for (const k of Object.keys(o)) o[k] = [...new Set(o[k])].sort();
  const counts = findings.reduce((m, f) => (m[f.check] = (m[f.check] ?? 0) + 1, m), {});
  return { counts, byOwner, findings, failures, enforced: config.enforceAll ? 'all' : [...enforced] };
}

export function summariseStoryWiring(report) {
  const lines = [`Story wiring: ${Object.entries(report.counts).map(([k, v]) => `${k} ${v}`).join(', ') || 'clean'}; enforced: ${Array.isArray(report.enforced) ? report.enforced.join(', ') : report.enforced}; failures ${report.failures.length}.`];
  for (const [owner, checks] of Object.entries(report.byOwner).sort()) lines.push(`  ${owner}: ${Object.entries(checks).map(([k, ids]) => `${k} ${ids.length}`).join(', ')}`);
  return lines.join('\n');
}

export function assertStoryWiring(report) {
  if (!report.failures.length) return;
  throw new Error(`Story wiring (checks/story_wiring.mjs): ${report.failures.length} finding(s) of an enforced owner:\n  ${report.failures.slice(0, 40).map(f => `${f.check} ${f.id} (${f.owner}, ${f.file}): ${f.detail}`).join('\n  ')}`);
}
