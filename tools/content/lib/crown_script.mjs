// Script writer of the crown events (docs/design/stage2/events_crown.md). The event data of tools/content/data/events_crown*.json
// describes conditions, effects and AI weights in a small typed language; this file turns it into Clausewitz lines. It knows
// nothing about the story: modules/events_crown.mjs feeds it the data and the roster.
//
// Conditions (a list means "all of"):
//   "name"                  scripted or engine trigger, written `name = yes`          "!name"  its negation
//   "gflag:x" "flag:x"      has_global_flag / has_country_flag                         "idea:x" has_idea   "char:x" has_character
//   "var:x>=25" "gvar:x<3"  check_variable on a country / global variable (> < >= <= =)
//   "tag:Selen"             original_tag of a roster country (resolved to its tag)     "gov:light|dominion|shadow|wild"
//   "rule:zin_rule_x=OPT"   has_game_rule                                              "ai" "human"
//   { or: [..] } { and: [..] } { not: [..] }   (not = none of the listed)
//   { any: "any_other_country", limit: [..] }  a scope trigger                           { target: "event_target:x", is: [..] }
//   { raw: ["line", ..] }   counted escape hatch
// Effects:
//   { pp: -50 } { stability: 0.02 } { war_support: 0.03 }       { idea: "id", days: 180 } timed idea       { add_idea: "id" }
//   { call: "zin_x", value: 3, camp: "faithful" }              scripted effect with temporary-variable arguments (E1)
//   { fire: "zin_reign.12", days: 3, random_days: 4, to: "parim" | "tag:Selen" | "target:name" }
//   { loop: "every_country", limit: [..], do: [..] }            { in: "parim" | "tag:Selen" | "target:name", do: [..] }
//   { if: [conds], then: [..], else: [..] }                    { flag: "x", days: 365, tip: "text" } { gflag: "x" } { clear_flag: "x" }
//   { opinion: "modifier", target: "ROOT" | "tag:X" | "target:name", reverse: true }
//   { pact: "target:name" }  { white_peace_by: "target:name" }  { state: "resistance" | "compliance", value: 10, site: "zin_is_site_parim" }
//   { recruit: "id" } { promote: "id" } { save: "name" } { tip: "text" } { macro: "...", value: n } { raw: ["line"] }
import { keyOf } from './core.mjs';

export const num = n => Number.isInteger(n) ? String(n) : String(Number(n.toFixed(3)));
export const block = (head, lines) => [`${head} = {`, ...lines.map(l => `\t${l}`), '}'];
export const flat = lists => lists.flat();
export const GOVERNMENTS = { light: 'democratic', dominion: 'fascism', shadow: 'communism', wild: 'neutrality' };
export const PARIM_REALM = 'zin_aenor_parim_realm';
// A camp's variable, by the code of the Aenor spec (court 1, faithful 2, dominions 3, host 4).
export const CAMPS = { court: 1, faithful: 2, dominions: 3, host: 4 };
const CAMP_VAR = c => `zin_aenor_camp_${c}`;
const MAX_NEST = 40;

// env: { tags: Map name -> tag, codes: (effect, arg, value) -> number, used: { triggers, effects, flags, variables }, raw: counter, tips: (text) -> key, kinds: Map id -> kind }
export function makeEnv(opts) {
  const used = { triggers: new Set(), effects: new Set(), gflags: new Set(), cflags: new Set(), variables: new Set(), events: new Set(), rules: new Set(), ideas: new Set(), characters: new Set(), targets: new Set() };
  return { tags: new Map(), codes: () => undefined, kinds: new Map(), tips: () => { throw new Error('no tip collector'); }, raw: { n: 0 }, ...opts, used };
}
const tagOf = (env, name) => { const t = env.tags.get(name); if (!t) throw new Error(`The roster has no country named ${name}`); return t; };
function target(env, t) {
  if (t === 'ROOT' || t === 'THIS' || t === 'PREV' || t === 'FROM') return t;
  if (t.startsWith('tag:')) return tagOf(env, t.slice(4));
  if (t.startsWith('target:')) { env.used.targets.add(t.slice(7)); return `event_target:${t.slice(7)}`; }
  throw new Error(`Unknown target ${t}`);
}

// ------------------------------------------------------------------------------------------------ conditions
const VAR = /^(g?var):([A-Za-z0-9_.]+)(>=|<=|>|<|=)(-?[0-9.]+)$/;
function varLines(global, name, op, value) {
  const full = global ? `global.${name}` : name;
  if (op === '>=' || op === '<=') return block('check_variable', [`var = ${full}`, `value = ${value}`, `compare = ${op === '>=' ? 'greater_than_or_equals' : 'less_than_or_equals'}`]);
  return [`check_variable = { ${full} ${op} ${value} }`];
}
function strCond(c, env, depth) {
  if (c.startsWith('!')) return block('NOT', strCond(c.slice(1), env, depth + 1));
  let m;
  if ((m = VAR.exec(c))) { env.used.variables.add(m[2]); return varLines(m[1] === 'gvar', m[2], m[3], m[4]); }
  const i = c.indexOf(':');
  if (i > 0) {
    const k = c.slice(0, i), v = c.slice(i + 1);
    switch (k) {
      case 'gflag': env.used.gflags.add(v); return [`has_global_flag = ${v}`];
      case 'flag': env.used.cflags.add(v); return [`has_country_flag = ${v}`];
      case 'idea': env.used.ideas.add(v); return [`has_idea = ${v}`];
      case 'char': env.used.characters.add(v); return [`has_character = ${v}`];
      case 'tag': return [`original_tag = ${tagOf(env, v)}`];
      case 'subject_of': return [`is_subject_of = ${v.startsWith('target:') ? target(env, v) : tagOf(env, v)}`];
      case 'war': return [`has_war_with = ${tagOf(env, v)}`];
      case 'faction_with': return [`is_in_faction_with = ${target(env, v)}`];
      case 'gov': if (!GOVERNMENTS[v]) throw new Error(`Unknown government ${v}`); return [`has_government = ${GOVERNMENTS[v]}`];
      case 'rule': { const [rule, option] = v.split('='); env.used.rules.add(rule); return block('has_game_rule', [`rule = ${rule}`, `option = ${option}`]); }
      default: throw new Error(`Unknown condition ${c}`);
    }
  }
  if (c === 'ai') return ['is_ai = yes'];
  if (c === 'human') return ['is_ai = no'];
  if (!/^[a-z][a-z0-9_]*$/.test(c)) throw new Error(`Not a trigger name: ${c}`);
  env.used.triggers.add(c);
  return [`${c} = yes`];
}
export function condLines(c, env, depth = 0) {
  if (depth > MAX_NEST) throw new Error('Condition nesting is too deep');
  if (typeof c === 'string') return strCond(c, env, depth);
  if (Array.isArray(c)) return flat(c.map(x => condLines(x, env, depth + 1)));
  const [k] = Object.keys(c);
  switch (k) {
    case 'or': return block('OR', flat(c.or.map(x => condLines(x, env, depth + 1))));
    case 'and': return block('AND', flat(c.and.map(x => condLines(x, env, depth + 1))));
    case 'not': return block('NOT', flat(c.not.map(x => condLines(x, env, depth + 1))));
    case 'any': return block(c.any, flat((c.limit ?? []).map(x => condLines(x, env, depth + 1))));
    case 'target': env.used.targets.add(c.target.replace('event_target:', '')); return block(c.target, flat(c.is.map(x => condLines(x, env, depth + 1))));
    case 'opinion': return block('has_opinion', [`target = ${target(env, c.opinion)}`, `value ${c.op ?? '>'} ${c.value}`]);
    case 'opinion_modifier': return block('has_opinion_modifier', [`target = ${target(env, c.target)}`, `modifier = ${c.opinion_modifier}`]);
    case 'raw': env.raw.n++; return c.raw;
    case 'faction_with': case 'subject_of': case 'war': case 'tag': case 'flag': case 'gflag': case 'idea': return strCond(`${k}:${c[k]}`, env, depth);
    default: throw new Error(`Unknown condition ${JSON.stringify(c)}`);
  }
}
export const conds = (list, env) => flat((list ?? []).map(c => condLines(c, env)));
const orGroup = (alts, env) => {
  // alts: array of condition lists; empty list = always true
  if (alts.some(a => !a.length)) return [];
  const parts = alts.map(a => (a.length === 1 ? condLines(a[0], env) : block('AND', conds(a, env))));
  return parts.length === 1 ? parts[0] : block('OR', flat(parts));
};

// ------------------------------------------------------------------------------------------------ effects
function argValue(env, effect, name, value) {
  if (typeof value === 'number') return num(value);
  if (typeof value === 'string') {
    if (value.startsWith('@')) { env.used.variables.add(value.slice(1)); return value.slice(1); }
    if (['ROOT', 'THIS', 'PREV', 'FROM'].includes(value)) return value;
    const code = env.codes(effect, name, value);
    if (code === undefined) throw new Error(`${effect}: no number code for ${name} = ${value}`);
    return String(code);
  }
  throw new Error(`${effect}: argument ${name} must be a number, a keyword or @variable`);
}
const eventCall = (env, id, o) => {
  env.used.events.add(id);
  const kind = env.kinds.get(id) === 'news' ? 'news_event' : 'country_event';
  const delay = ['days', 'random_days', 'hours', 'random_hours'].filter(k => o[k] !== undefined);
  return delay.length ? block(kind, [`id = ${id}`, ...delay.map(k => `${k} = ${o[k]}`)]) : [`${kind} = ${id}`];
};
// The strongest non-ruling camps: temporary variables hold each camp's support (the ruling camp is out of the race).
function campRace(value, count) {
  const L = [];
  for (const [name, code] of Object.entries(CAMPS)) {
    L.push(...block('if', [...block('limit', [`check_variable = { zin_aenor_ruling_camp = ${code} }`]), `set_temp_variable = { zin_t_camp_${code} = -1 }`]));
    L.push(...block('else', [`set_temp_variable = { zin_t_camp_${code} = ${CAMP_VAR(name)} }`]));
  }
  if (count === 2) {
    // the weakest candidate is skipped; the ruling camp holds -1 and is never counted
    L.push('set_temp_variable = { zin_t_weak = 999 }', 'set_temp_variable = { zin_t_weak_code = 0 }');
    for (const code of Object.values(CAMPS)) {
      L.push(...block('if', [...block('limit', [`check_variable = { zin_t_camp_${code} > -1 }`, `check_variable = { zin_t_camp_${code} < zin_t_weak }`]), `set_temp_variable = { zin_t_weak = zin_t_camp_${code} }`, `set_temp_variable = { zin_t_weak_code = ${code} }`]));
    }
  } else {
    L.push('set_temp_variable = { zin_t_best = -1 }', 'set_temp_variable = { zin_t_best_code = 0 }');
    for (const code of Object.values(CAMPS)) {
      L.push(...block('if', [...block('limit', [`check_variable = { zin_t_camp_${code} > zin_t_best }`]), `set_temp_variable = { zin_t_best = zin_t_camp_${code} }`, `set_temp_variable = { zin_t_best_code = ${code} }`]));
    }
  }
  for (const code of Object.values(CAMPS)) {
    const limit = count === 2
      ? [`check_variable = { zin_t_camp_${code} > -1 }`, ...block('NOT', [`check_variable = { zin_t_weak_code = ${code} }`])]
      : [`check_variable = { zin_t_best_code = ${code} }`];
    L.push(...block('if', [...block('limit', limit), `set_temp_variable = { zin_arg_camp = ${code} }`, `set_temp_variable = { zin_arg_value = ${num(value)} }`, 'zin_aenor_add_camp_support = yes']));
  }
  return L;
}
export function effLines(e, env, depth = 0) {
  if (depth > MAX_NEST) throw new Error('Effect nesting is too deep');
  const sub = list => flat((list ?? []).map(x => effLines(x, env, depth + 1)));
  if (typeof e === 'string') throw new Error(`An effect must be an object: ${e}`);
  const [k] = Object.keys(e);
  switch (k) {
    case 'pp': return [`add_political_power = ${num(e.pp)}`];
    case 'stability': return [`add_stability = ${num(e.stability)}`];
    case 'war_support': return [`add_war_support = ${num(e.war_support)}`];
    case 'idea': env.used.ideas.add(e.idea); return block('add_timed_idea', [`idea = ${e.idea}`, `days = ${e.days}`]);
    case 'add_idea': env.used.ideas.add(e.add_idea); return [`add_ideas = ${e.add_idea}`];
    case 'call': {
      env.used.effects.add(e.call);
      const args = Object.entries(e).filter(([n]) => n !== 'call');
      return [...args.map(([n, v]) => `set_temp_variable = { zin_arg_${n} = ${argValue(env, e.call, n, v)} }`), `${e.call} = yes`];
    }
    case 'fire': {
      // Inside an event the story chain stays out of the tooltip (env.hide); hooks and the runner are never shown.
      const wrap = lines => (env.hide ? block('hidden_effect', lines) : lines);
      const ev = eventCall(env, e.fire, e);
      if (!e.to) return wrap(ev);
      if (e.to === 'parim') { env.used.effects.add('zin_aenor_event_for_parim'); env.used.targets.add(PARIM_REALM); return wrap(['zin_aenor_event_for_parim = yes', ...block(`event_target:${PARIM_REALM}`, ev)]); }
      return wrap(block(target(env, e.to), ev));
    }
    case 'loop': return block(e.loop, [...(e.limit?.length ? block('limit', conds(e.limit, env)) : []), ...sub(e.do)]);
    case 'in': {
      if (e.in === 'parim') { env.used.effects.add('zin_aenor_event_for_parim'); env.used.targets.add(PARIM_REALM); return ['zin_aenor_event_for_parim = yes', ...block(`event_target:${PARIM_REALM}`, sub(e.do))]; }
      return block(target(env, e.in), sub(e.do));
    }
    case 'if': return [...block('if', [...block('limit', conds(e.if, env)), ...sub(e.then)]), ...(e.else ? block('else', sub(e.else)) : [])];
    case 'flag': {
      env.used.cflags.add(e.flag);
      const set = e.days ? block('set_country_flag', [`flag = ${e.flag}`, `days = ${e.days}`]) : [`set_country_flag = ${e.flag}`];
      return e.tip ? [...set, `custom_effect_tooltip = ${env.tips(e.tip)}`] : set;
    }
    case 'gflag': env.used.gflags.add(e.gflag); return [`set_global_flag = ${e.gflag}`];
    case 'clear_flag': env.used.cflags.add(e.clear_flag); return [`clr_country_flag = ${e.clear_flag}`];
    case 'opinion': {
      const t = target(env, e.target ?? 'ROOT');
      return block(e.reverse ? 'reverse_add_opinion_modifier' : 'add_opinion_modifier', [`target = ${t}`, `modifier = ${e.opinion}`]);
    }
    case 'pact': return block('diplomatic_relation', [`country = ${target(env, e.pact)}`, 'relation = non_aggression_pact', 'active = yes']);
    case 'white_peace_by': return block(target(env, e.white_peace_by), ['white_peace = ROOT']);
    case 'state': {
      const eff = e.state === 'resistance' ? 'add_resistance' : e.state === 'compliance' ? 'add_compliance' : null;
      if (!eff) throw new Error(`Unknown state effect ${e.state}`);
      env.used.triggers.add(e.site ?? 'zin_is_site_parim');
      return block('every_controlled_state', [...block('limit', [`${e.site ?? 'zin_is_site_parim'} = yes`]), `${eff} = ${num(e.value)}`]);
    }
    case 'recruit': env.used.characters.add(e.recruit); return [`recruit_character = ${e.recruit}`];
    case 'promote': env.used.characters.add(e.promote); return [`promote_character = ${e.promote}`];
    case 'leader_trait': return [`add_country_leader_trait = ${e.leader_trait}`];
    case 'save': env.used.targets.add(e.save); return [`save_global_event_target_as = ${e.save}`];
    case 'tip': return [`custom_effect_tooltip = ${env.tips(e.tip)}`];
    case 'macro': return macroLines(e, env);
    case 'raw': env.raw.n++; return e.raw;
    default: throw new Error(`Unknown effect ${JSON.stringify(e)}`);
  }
}
export const effects = (list, env) => flat((list ?? []).map(e => effLines(e, env)));

// Camp macros of the Aenor realm. They read the ruling camp (zin_aenor_ruling_camp, 1 to 4) and change support only through
// the owner's zin_aenor_add_camp_support.
function macroLines(e, env) {
  env.used.effects.add('zin_aenor_add_camp_support'); env.used.variables.add('zin_aenor_ruling_camp');
  for (const name of Object.keys(CAMPS)) env.used.variables.add(CAMP_VAR(name));
  switch (e.macro) {
    case 'strongest_two_non_ruling': return campRace(e.value, 2);
    case 'strongest_non_ruling': return campRace(e.value, 1);
    case 'ruling_camp': return block('if', [
      ...block('limit', ['check_variable = { var = zin_aenor_ruling_camp value = 1 compare = greater_than_or_equals }', 'check_variable = { var = zin_aenor_ruling_camp value = 4 compare = less_than_or_equals }']),
      'set_temp_variable = { zin_arg_camp = zin_aenor_ruling_camp }', `set_temp_variable = { zin_arg_value = ${num(e.value)} }`, 'zin_aenor_add_camp_support = yes']);
    case 'all_non_ruling': return flat(Object.values(CAMPS).map(code => block('if', [
      ...block('limit', [...block('NOT', [`check_variable = { zin_aenor_ruling_camp = ${code} }`])]),
      `set_temp_variable = { zin_arg_camp = ${code} }`, `set_temp_variable = { zin_arg_value = ${num(e.value)} }`, 'zin_aenor_add_camp_support = yes'])));
    case 'host_or_dominions': return [...block('if', [...block('limit', ['zin_aenor_host_available = yes']),
      'set_temp_variable = { zin_arg_camp = 4 }', `set_temp_variable = { zin_arg_value = ${num(e.host)} }`, 'zin_aenor_add_camp_support = yes']),
      ...block('else', ['set_temp_variable = { zin_arg_camp = 3 }', `set_temp_variable = { zin_arg_value = ${num(e.dominions)} }`, 'zin_aenor_add_camp_support = yes'])];
    default: throw new Error(`Unknown macro ${e.macro}`);
  }
}

// ------------------------------------------------------------------------------------------------ AI
// The rules of C8. Under zin_rules_is_historical the historical option takes everything; under PLAUSIBLE (neither historical nor free)
// it takes 75 percent, 60 once zin_path_divergence reaches 50, and the others share the rest in proportion to their FREE weights;
// under zin_rules_is_free the weights are the FREE ones with their situational modifiers. An event without a historical option
// uses its FREE weights under every rule. `hist` is true, or { when: [...] } / { unless: [...] } for a recipient-dependent
// choice (the conditions are those under which this option is the historical one).
const histCond = o => (o.hist === true ? [] : o.hist.when ? o.hist.when : o.hist.unless ? [{ not: o.hist.unless }] : []);
export function aiLines(options, i, env) {
  const o = options[i], free = o.free ?? 1;
  const L = [`base = ${num(free)}`];
  const hist = options.map((x, j) => ({ x, j })).filter(({ x }) => x.hist);
  const adjust = (cond, rule, divergence, weights) => {
    const delta = weights[i] - free;
    if (!delta) return;
    L.push(...block('modifier', [`add = ${num(delta)}`, ...rule, ...divergence, ...cond]));
  };
  const weightsFor = (k, histWeight, restWeight) => options.map((x, j) => {
    if (j === k) return histWeight;
    const total = options.reduce((s, y, m) => s + (m === k ? 0 : (y.free ?? 1)), 0);
    return total ? restWeight * (x.free ?? 1) / total : restWeight / Math.max(1, options.length - 1);
  });
  const NOT_HIST = ['zin_rules_is_historical = yes'];
  for (const m of o.ai ?? []) {
    const wrap = hist.length ? ['zin_rules_is_free = yes'] : [];
    const body = ['set' in m ? `add = ${num(m.set - free)}` : 'add' in m ? `add = ${num(m.add)}` : `factor = ${num(m.mult)}`, ...wrap, ...conds(m.if, env)];
    L.push(...block('modifier', body));
  }
  for (const { j: k, x } of hist) {
    const cond = conds(histCond(x), env);
    adjust(cond, NOT_HIST, [], weightsFor(k, 100, 0));
    adjust(cond, ['zin_rules_is_historical = no', 'zin_rules_is_free = no'], [`check_variable = { global.zin_path_divergence < 50 }`], weightsFor(k, 75, 25));
    adjust(cond, ['zin_rules_is_historical = no', 'zin_rules_is_free = no'], [`check_variable = { global.zin_path_divergence > 49.999 }`], weightsFor(k, 60, 40));
  }
  return block('ai_chance', L);
}

// ------------------------------------------------------------------------------------------------ events
const HEADER = '# Generated by the ZIN content builder (modules/events_crown.mjs, docs/design/stage2/events_crown.md). Do not edit.';
export { HEADER };

// ev: one event record; loc: collector with set(key, text); env: as makeEnv. Returns the event's script lines.
export function eventLines(ev, loc, env) {
  const id = ev.id, kind = ev.kind ?? 'country';
  const L = [`id = ${id}`];
  const type = kind === 'news' ? 'news_event' : 'country_event';
  if (kind === 'hidden') L.push('hidden = yes');
  else {
    loc.set(`${id}.t`, ev.title);
    L.push(`title = ${id}.t`);
    const variants = ev.variants ?? [];
    if (variants.length) {
      for (const v of variants) { loc.set(`${id}.d_${v.suffix}`, v.text); L.push(...block('desc', [`text = ${id}.d_${v.suffix}`, ...block('trigger', conds(v.if, env))])); }
      loc.set(`${id}.d`, ev.desc);
      L.push(...block('desc', [`text = ${id}.d`]));
    } else { loc.set(`${id}.d`, ev.desc); L.push(`desc = ${id}.d`); }
    L.push(`picture = ${kind === 'news' ? 'GFX_zin_news_' : 'GFX_zin_evt_'}${ev.picture}`);
  }
  if (kind === 'news' && ev.major !== false) L.push('major = yes');
  if (ev.once) L.push('fire_only_once = yes');
  L.push('is_triggered_only = yes', 'timeout_days = 30');
  if (ev.guard?.length) L.push(...block('trigger', conds(ev.guard, env)));
  if (ev.immediate?.length) {
    env.tips = text => { const key = `${id}.i_tip${++env.tipN}`; loc.set(key, text); return key; };
    env.tipN = 0;
    L.push(...block('immediate', block('hidden_effect', effects(ev.immediate, env))));
  }
  (ev.options ?? []).forEach((o, i) => {
    const key = `${id}.opt${i + 1}`;
    loc.set(key, o.text);
    env.tipN = 0;
    env.tips = text => { const k = `${key}_tip${++env.tipN}`; loc.set(k, text); return k; };
    const body = [`name = ${key}`];
    if (o.show?.length) body.push(...block('trigger', conds(o.show, env)));
    body.push(...aiLines(ev.options, i, env));
    env.hide = true;
    body.push(...effects(o.do, env));
    env.hide = false;
    L.push(...block('option', body));
  });
  return block(type, L);
}

export const eventsFile = (namespace, events, loc, env) => [HEADER, `add_namespace = ${namespace}`, '', ...flat(events.map(ev => [...eventLines(ev, loc, env), '']))].join('\n').replace(/\n+$/, '\n');
export { keyOf };
