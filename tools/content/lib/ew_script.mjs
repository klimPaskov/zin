// Script writer of the story-event module (modules/events_world.mjs): turns the effect and trigger notation of
// data/events_world*.json into Clausewitz text. The notation is deliberately small:
//
//   effects   an array of items. An item is
//             - a Clausewitz one-liner ("add_stability = 0.02", "set_global_flag = zin_x"), several statements allowed;
//             - a macro line starting with @ (below);
//             - an object: { if: [triggers], then: [effects], else: [effects] }, { random: [[weight, [effects]], ...] },
//               { each: "group:key", limit: [triggers], do: [effects] }, { scope: "tag:Name", do: [effects] },
//               { hidden: [effects] }.
//   macros    @call <effect> [<number> | name=value ...]   temporary variables zin_arg_<name> (E1; a bare number is `value`), then the effect
//             @fire <ns.id> [days=N] [hours=N] [random_days=N] [to=<recipient>]   country_event to a recipient
//             @news <ns.id> [days=N]                      news_event
//             @flag <name> [days=N]    country flag        @gflag <name>   global flag      @clr <name>   clear country flag
//             @gclr <name>             clear global flag
//             @trait <trait> [days=N]  Eindil unit leader trait        @opinion <modifier> <recipient>
//   recipients  self | host | aenor | all | tag:Country_Name | group:key | random:group | var:<global country variable> | scope:<raw scope token>
//   triggers  an array of one-liners and objects { or: [...] }, { and: [...] }, { not: [...] }, { names: ["A", "B"] }, plus the string
//             "tag:Country_Name" (original_tag). Country names resolve to tags through the roster (lib/roster.mjs).
//
// Internal bookkeeping (flags, variables, events, log) is wrapped in hidden_effect so the option tooltip shows only what a
// player should read. Output is a list of lines without indentation; block() nests them with tabs.
import { parse } from './clausewitz.mjs';
import { codesFor } from '../checks/focus_checks.mjs';

export const block = (head, lines) => [`${head} = {`, ...lines.map(l => `\t${l}`), '}'];
const flat = lists => lists.flat();
const num = n => Number.isInteger(n) ? String(n) : String(Number(Number(n).toFixed(3)));

// Keys whose effect is bookkeeping, not something the player is told about.
export const HIDDEN_KEYS = new Set([
  'set_country_flag', 'set_global_flag', 'set_state_flag', 'clr_country_flag', 'clr_global_flag', 'clr_state_flag', 'set_variable', 'add_to_variable',
  'subtract_from_variable', 'multiply_variable', 'divide_variable', 'clamp_variable', 'set_temp_variable', 'add_to_temp_variable', 'country_event', 'news_event',
  'log', 'hidden_effect', 'save_event_target_as', 'save_global_event_target_as', 'clear_global_event_target', 'meta_effect',
]);
const CONTAINERS = new Set(['if', 'else', 'else_if', 'random_list', 'every_country', 'random_country', 'every_owned_state', 'random_owned_state', 'every_neighbor_country',
  'random_neighbor_country', 'ROOT', 'FROM', 'PREV', 'THIS', 'OVERLORD', 'capital_scope']);
const isScopeKey = k => /^[A-Z][A-Z0-9]{2}$/.test(k) || /^(event_target|var|scope):/.test(k) || /^\d+$/.test(k) || CONTAINERS.has(k) || /^zin_(eindil|varner|golbran|lorien|alleria|ilsabet)$/.test(k);

export function entryHidden(e) {
  if (HIDDEN_KEYS.has(e.k)) return true;
  // A call of a ZIN scripted effect is bookkeeping for the player; a tip line (custom_effect_tooltip) tells what matters.
  if (!Array.isArray(e.v) && /^zin_[a-z0-9_]+$/.test(e.k) && e.v === 'yes') return true;
  if (!Array.isArray(e.v) || !isScopeKey(e.k)) return false;
  const kids = e.v.filter(c => c.k !== 'limit');
  return kids.length > 0 && kids.every(entryHidden);
}

// ------------------------------------------------------------------------------------------------ formatting
const quote = v => `"${v}"`;
const scalar = e => e.quoted ? quote(e.v) : e.v;
export function entryLines(e) {
  if (e.k === null) {
    if (Array.isArray(e.v)) return block('', e.v.flatMap(entryLines)).map((l, i) => (i === 0 ? '{' : l));
    return [scalar(e)];
  }
  const op = e.op ?? '=';
  if (!Array.isArray(e.v)) return [`${e.k} ${op} ${scalar(e)}`];
  if (!e.v.length) return [`${e.k} ${op} { }`];
  // A short list of bare values, or up to three plain `key = value` pairs, stays on one line: `tags = { a b c }`, `set_variable = { x = 1 }`.
  if (e.v.length <= 3 && e.v.every(c => c.k !== null && !Array.isArray(c.v)) && e.k !== 'limit') { const one = `${e.k} ${op} { ${e.v.map(c => `${c.k} ${c.op ?? '='} ${scalar(c)}`).join(' ')} }`; if (one.length <= 90) return [one]; }
  if (e.v.every(c => c.k === null && !Array.isArray(c.v))) return [`${e.k} ${op} { ${e.v.map(scalar).join(' ')} }`];
  return block(e.k, e.v.flatMap(entryLines)).map((l, i) => (i === 0 && op !== '=' ? `${e.k} ${op} {` : l));
}
export const parseLines = text => parse(text).flatMap(entryLines);

// ------------------------------------------------------------------------------------------------ context
// W: { tags: Map name -> tag, groups: { key: { limit: [...] } }, problems: [], used: { events:Set, effects:Set, triggers:Set } }
export function tagOf(W, name) {
  const real = name.replace(/_/g, ' ');
  const tag = W.tags.get(real);
  if (!tag) { W.problems.push(`unknown country "${real}"`); return 'ZZZ'; }
  return tag;
}

// A keyword argument becomes the number code of the effect's owner (decision E1); numbers and variable names pass through.
function argCode(W, effect, name, v) {
  if (/^-?[0-9.]+$/.test(v) || /^(global|var):/.test(v)) return v;
  const table = W.codes ? codesFor(W.codes, effect, name) : null;
  if (table && v in table) return String(table[v]);
  W.problems.push(`${effect}: argument ${name}=${v} has no number code`);
  return '0';
}

// {{tag:Country Name}} inside a one-liner becomes the country's tag (data files name countries, never tags).
export function subst(str, W) {
  return str.replace(/{{tag:([^}]+)}}/g, (_, name) => tagOf(W, name.trim().replace(/ /g, '_')));
}

function words(str) {
  const out = []; let cur = '', q = false;
  for (const ch of str) { if (ch === '"') { q = !q; continue; } if (!q && /\s/.test(ch)) { if (cur) { out.push(cur); cur = ''; } continue; } cur += ch; }
  if (cur) out.push(cur);
  return out;
}
function kv(args) {
  const o = {};
  for (const a of args) { const m = a.match(/^([a-z_]+)=(.*)$/); if (m) o[m[1]] = m[2]; else (o._ ??= []).push(a); }
  return o;
}

// ------------------------------------------------------------------------------------------------ triggers
export function trigger(items, W) {
  const out = [];
  for (const it of items ?? []) out.push(...triggerItem(it, W));
  return out;
}
function triggerItem(it, W) {
  if (typeof it === 'string') {
    const t = it.trim();
    if (t.startsWith('tag:')) return [`original_tag = ${tagOf(W, t.slice(4))}`];
    if (t.startsWith('group:')) return groupLimit(W, t.slice(6));
    if (t.startsWith('capital_of:')) return [`any_owned_state = { state = ${W.capitals.get(t.slice(11).replace(/_/g, ' '))} }`];
    return parseLines(subst(t, W));
  }
  const [k] = Object.keys(it);
  switch (k) {
    case 'or': return block('OR', trigger(it.or, W));
    case 'and': return block('AND', trigger(it.and, W));
    case 'not': return block('NOT', trigger(it.not, W));
    case 'names': return it.names.length === 1 ? [`original_tag = ${tagOf(W, it.names[0].replace(/ /g, '_'))}`] : block('OR', it.names.map(n => `original_tag = ${tagOf(W, n.replace(/ /g, '_'))}`));
    default: throw new Error(`unknown trigger item ${k}`);
  }
}
function groupLimit(W, key) {
  const g = W.groups[key];
  if (!g) { W.problems.push(`unknown group "${key}"`); return ['always = no']; }
  return trigger(g.limit, W);
}

// ------------------------------------------------------------------------------------------------ recipients
function eventCall(kind, id, o) {
  const extra = ['hours', 'days', 'random_days'].filter(k => o[k] !== undefined).map(k => `${k} = ${o[k]}`);
  return extra.length ? block(kind, [`id = ${id}`, ...extra]) : [`${kind} = ${id}`];
}
export function fire(id, o, W) {
  W.used.events.add(id);
  const call = eventCall('country_event', id, o), to = o.to ?? 'self';
  if (to === 'self') return call;
  if (to === 'all') return block('every_country', call);
  if (to === 'host') return block('if', [...block('limit', ['zin_eindil_has_host = yes']), ...block('var:global.zin_eindil_host', call)]);
  if (to === 'aenor') return ['zin_aenor_event_for_parim = yes', ...block('event_target:zin_aenor_parim_realm', call)];
  if (to.startsWith('var:')) { const v = to.slice(4); return block('if', [...block('limit', [`has_variable = global.${v}`]), ...block(`var:global.${v}`, block('if', [...block('limit', ['exists = yes']), ...call]))]); }
  if (to.startsWith('tag:')) { const tag = tagOf(W, to.slice(4)); return block('if', [...block('limit', [`country_exists = ${tag}`]), ...block(tag, call)]); }
  if (to.startsWith('group:')) return block('every_country', [...block('limit', groupLimit(W, to.slice(6))), ...call]);
  if (to.startsWith('random:')) return block('random_country', [...block('limit', groupLimit(W, to.slice(7))), ...call]);
  if (to.startsWith('scope:')) return block(to.slice(6), call);
  W.problems.push(`unknown recipient ${to}`);
  return call;
}

// ------------------------------------------------------------------------------------------------ effects
function macro(line, W) {
  const w = words(line), name = w[0], o = kv(w.slice(1));
  switch (name) {
    case '@call': {
      const effect = w[1], rest = kv(w.slice(2)), args = [];
      W.used.effects.add(effect);
      if (rest._) args.push(['value', rest._[0]]);
      for (const [a, v] of Object.entries(rest)) if (a !== '_') args.push([a, argCode(W, effect, a, v)]);
      return [...args.map(([a, v]) => `set_temp_variable = { zin_arg_${a} = ${v} }`), `${effect} = yes`];
    }
    case '@fire': return fire(w[1], o, W);
    case '@news': { W.used.events.add(w[1]); return eventCall('news_event', w[1], o); }
    case '@flag': return o.days ? block('set_country_flag', [`flag = ${w[1]}`, `days = ${o.days}`]) : [`set_country_flag = ${w[1]}`];
    case '@gflag': return [`set_global_flag = ${w[1]}`];
    case '@clr': return [`clr_country_flag = ${w[1]}`];
    case '@gclr': return [`clr_global_flag = ${w[1]}`];
    case '@trait': return block('zin_eindil', o.days ? block('add_timed_unit_leader_trait', [`trait = ${w[1]}`, `days = ${o.days}`]) : [`add_unit_leader_trait = ${w[1]}`]);
    case '@opinion': {
      const to = w[2];
      if (to === 'aenor') return ['zin_aenor_event_for_parim = yes', ...block('add_opinion_modifier', ['target = event_target:zin_aenor_parim_realm', `modifier = ${w[1]}`])];
      const target = to.startsWith('tag:') ? tagOf(W, to.slice(4)) : to;
      return block('add_opinion_modifier', [`target = ${target}`, `modifier = ${w[1]}`]);
    }
    case '@opinion_of': {
      // The opinion the named country has of ROOT.
      const to = w[2], mod = `add_opinion_modifier = { target = ROOT modifier = ${w[1]} }`;
      if (to === 'aenor') return ['zin_aenor_event_for_parim = yes', ...block('event_target:zin_aenor_parim_realm', [mod])];
      if (to === 'host') return block('if', [...block('limit', ['zin_eindil_has_host = yes']), ...block('var:global.zin_eindil_host', [mod])]);
      const tag = tagOf(W, to.slice(4));
      return block('if', [...block('limit', [`country_exists = ${tag}`]), ...block(tag, [mod])]);
    }
    default: throw new Error(`unknown macro ${name}`);
  }
}

// Returns units { lines, hidden } so the caller can group bookkeeping into hidden_effect blocks.
export function effectUnits(items, W) {
  const units = [];
  for (const it of items ?? []) {
    if (typeof it === 'string') {
      const t = it.trim();
      if (t.startsWith('@')) { units.push({ lines: macro(t, W), hidden: true }); continue; }
      for (const e of parse(subst(t, W))) units.push({ lines: entryLines(e), hidden: entryHidden(e) });
      continue;
    }
    const [k] = Object.keys(it);
    switch (k) {
      case 'if': {
        const th = effectUnits(it.then, W), el = it.else ? effectUnits(it.else, W) : null;
        const hidden = th.every(u => u.hidden) && (!el || el.every(u => u.hidden));
        const lines = [...block('if', [...block('limit', trigger(it.if, W)), ...emit(th, !hidden && !W.plain)]), ...(el ? block('else', emit(el, !hidden && !W.plain)) : [])];
        units.push({ lines, hidden });
        break;
      }
      case 'random': {
        const parts = it.random.map(([w, list]) => [w, effectUnits(list, W)]);
        const hidden = parts.every(([, us]) => us.every(u => u.hidden));
        units.push({ lines: block('random_list', parts.flatMap(([w, us]) => block(String(w), emit(us, !hidden && !W.plain)))), hidden });
        break;
      }
      case 'each': {
        const body = effectUnits(it.do, W), hidden = body.every(u => u.hidden);
        const limit = it.each.startsWith('group:') ? groupLimit(W, it.each.slice(6)) : [];
        units.push({ lines: block('every_country', [...block('limit', [...limit, ...trigger(it.limit, W)]), ...emit(body, !hidden && !W.plain)]), hidden });
        break;
      }
      case 'scope': {
        const body = effectUnits(it.do, W), hidden = body.every(u => u.hidden);
        const tag = it.scope.startsWith('tag:') ? tagOf(W, it.scope.slice(4)) : it.scope;
        const inner = block(tag, emit(body, !hidden && !W.plain));
        units.push({ lines: it.scope.startsWith('tag:') ? block('if', [...block('limit', [`country_exists = ${tag}`]), ...inner]) : inner, hidden });
        break;
      }
      case 'pick': {
        const body = effectUnits(it.do, W), hidden = body.every(u => u.hidden);
        const limit = it.pick.startsWith('group:') ? groupLimit(W, it.pick.slice(6)) : [];
        units.push({ lines: block('random_country', [...block('limit', [...limit, ...trigger(it.limit, W)]), ...emit(body, !hidden && !W.plain)]), hidden });
        break;
      }
      case 'hidden': units.push({ lines: block('hidden_effect', emit(effectUnits(it.hidden, W), false)), hidden: true }); break;
      default: throw new Error(`unknown effect item ${k}`);
    }
  }
  return units;
}

// Visible units stay in place; each run of hidden units becomes one hidden_effect (unless the caller is already inside one).
export function emit(units, group = true) {
  if (!group) return units.flatMap(u => u.lines);
  const out = []; let run = [];
  const close = () => { if (run.length) { out.push(...block('hidden_effect', run.flatMap(u => u.lines))); run = []; } };
  for (const u of units) { if (u.hidden) run.push(u); else { close(); out.push(...u.lines); } }
  close();
  return out;
}
export const effects = (items, W) => emit(effectUnits(items, W), true);
// Immediate blocks and runner bodies are all bookkeeping: no hidden_effect wrapper is needed.
export const effectsPlain = (items, W) => { const was = W.plain; W.plain = true; try { return emit(effectUnits(items, W), false); } finally { W.plain = was; } };

// ------------------------------------------------------------------------------------------------ AI weights
// C8: under zin_rules_is_historical the hist option takes 100 and the others 0; under PLAUSIBLE 75/25 (60/40 once the path has
// diverged); under FREE the weight in the table. An event with no hist option uses the table weights alone.
export function aiChance(opt, hasHist, W) {
  const free = opt.ai === undefined ? 50 : (typeof opt.ai === 'number' ? opt.ai : opt.ai.free ?? 50);
  const lines = [`base = ${num(free)}`];
  if (hasHist) {
    // hist: true (always the historical option), an array of triggers (historical only where they hold) or absent.
    const conds = Array.isArray(opt.hist) ? trigger(opt.hist, W) : [];
    const isHist = opt.hist === true || Array.isArray(opt.hist);
    const to = (n, ...c) => block('modifier', [`add = ${num(n - free)}`, ...c]);
    const plain = ['zin_story_rules_plausible = yes', 'NOT = { zin_story_rules_plausible_diverged = yes }'];
    if (isHist) {
      lines.push(...to(100, 'zin_rules_is_historical = yes', ...conds));
      if (conds.length) lines.push(...block('modifier', ['factor = 0', 'zin_rules_is_historical = yes', ...block('NOT', conds)]));
      lines.push(...to(75, ...plain, ...conds), ...to(60, 'zin_story_rules_plausible_diverged = yes', ...conds));
      if (conds.length) lines.push(...to(25, ...plain, ...block('NOT', conds)), ...to(40, 'zin_story_rules_plausible_diverged = yes', ...block('NOT', conds)));
    } else {
      lines.push(...block('modifier', ['factor = 0', 'zin_rules_is_historical = yes']));
      lines.push(...to(25, ...plain), ...to(40, 'zin_story_rules_plausible_diverged = yes'));
    }
  }
  const mods = (typeof opt.ai === 'object' ? opt.ai.mods ?? [] : []).flatMap(m => typeof m === 'string' ? (W.presets?.[m] ?? (W.problems.push(`unknown ai preset ${m}`), [])) : [m]);
  for (const m of mods) {
    lines.push(...block('modifier', ['factor' in m ? `factor = ${num(m.factor)}` : `add = ${num(m.add)}`, ...trigger(m.if, W)]));
  }
  return block('ai_chance', lines);
}
