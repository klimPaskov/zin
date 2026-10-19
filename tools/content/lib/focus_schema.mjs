// Strict schema of a focus tree file (docs/specs/05_focus_trees/00_format_and_compiler.md). Every external input is
// validated here before anything is compiled: an unknown field is an error, a missing field is an error, and every
// error names the path of the value. The validator reads the file's data only; it never changes it.
//
//   validateTree(data, ctx) -> [{ path, message }]
//   ctx = { countries: Set of roster names, regions: Set of roster scan names, people: Set of people keys }

export const TIERS = ['major', 'regional', 'shared'];
// Ideology keys of the trees and the engine keys they stand for (CONVENTIONS "Countries and identifiers").
export const IDEOLOGY_KEYS = { light: 'democratic', dominion: 'fascism', shadow: 'communism', wild: 'neutrality' };
export const COUNTRY_TOKENS = ['ROOT', 'FROM', 'OVERLORD'];
// Search filters of a focus and the vanilla filter tokens (wiki "National focus modding").
export const FILTER_TOKENS = {
  political: 'FOCUS_FILTER_POLITICAL', research: 'FOCUS_FILTER_RESEARCH', industry: 'FOCUS_FILTER_INDUSTRY',
  stability: 'FOCUS_FILTER_STABILITY', war_support: 'FOCUS_FILTER_WAR_SUPPORT', manpower: 'FOCUS_FILTER_MANPOWER',
  annexation: 'FOCUS_FILTER_ANNEXATION', army: 'FOCUS_FILTER_ARMY_XP', navy: 'FOCUS_FILTER_NAVY_XP', air: 'FOCUS_FILTER_AIR_XP',
};
// AI strategies that take a country as their id; area_priority takes an area name (docs: common/ai_strategy/_documentation.md).
export const COUNTRY_STRATEGIES = ['befriend', 'alliance', 'antagonize', 'conquer', 'protect', 'support', 'prepare_for_war', 'dont_join_wars_with', 'ignore_claim', 'declare_war', 'contain', 'invade', 'force_defend_ally_borders', 'influence', 'consider_weak'];
export const AREA_STRATEGIES = ['area_priority'];
// State buildings are built in a state; province buildings in a province of it (wiki "add_building_construction").
export const STATE_BUILDINGS = ['industrial_complex', 'arms_factory', 'dockyard', 'infrastructure', 'air_base', 'anti_air_building', 'radar_station', 'rocket_site', 'nuclear_reactor', 'fuel_silo', 'synthetic_refinery', 'supply_node'];
export const PROVINCE_BUILDINGS = ['bunker', 'coastal_bunker', 'naval_base'];
export const WHERE_FIXED = ['capital', 'random_owned', 'random_coastal'];
export const STRATEGY_FIELDS = ['country', 'type', 'target', 'value', 'if'];

export const RE = {
  id: /^[a-z][a-z0-9_]*$/,                 // tree ids, keys, flags, variables
  full: /^zin_[a-z0-9_]+$/,                // a full ZIN id
  eventFull: /^[a-z][a-z0-9_]*\.\d+$/,     // a mechanic's event id
  date: /^\d{4}\.\d{1,2}\.\d{1,2}$/,
  prefix: /^zin_[a-z0-9_]+_$/,
  moduleTag: /^[A-Za-z][A-Za-z0-9_]*$/,
};

const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const isInt = v => Number.isInteger(v);

export function validateTree(data, ctx) {
  const errs = [];
  const err = (path, message) => errs.push({ path, message });

  // ------------------------------------------------------------------------------------------ primitives
  const str = (v, p, { re, what = 'a string', max = 4000 } = {}) => {
    if (typeof v !== 'string' || v.length === 0) { err(p, `must be ${what}`); return false; }
    if (v.length > max) { err(p, `is longer than ${max} characters`); return false; }
    if (re && !re.test(v)) { err(p, `must match ${re} (got ${JSON.stringify(v)})`); return false; }
    return true;
  };
  const num = (v, p) => { if (!isNum(v)) err(p, 'must be a finite number'); return isNum(v); };
  const int = (v, p, { min = -1e9, max = 1e9 } = {}) => { if (!isInt(v) || v < min || v > max) { err(p, `must be an integer from ${min} to ${max}`); return false; } return true; };
  const bool = (v, p) => { if (typeof v !== 'boolean') err(p, 'must be true or false'); };
  const list = (v, p, item, { min = 0, max = 100000 } = {}) => {
    if (!Array.isArray(v)) { err(p, 'must be a list'); return false; }
    if (v.length < min) err(p, `must hold at least ${min} entr${min === 1 ? 'y' : 'ies'}`);
    if (v.length > max) err(p, `must hold at most ${max} entries`);
    v.forEach((x, i) => item(x, `${p}[${i}]`));
    return true;
  };
  // An object with a strict field set: `req` must all be present, `opt` may be; anything else is an error.
  const obj = (v, p, req, opt = {}) => {
    if (!isObj(v)) { err(p, 'must be an object'); return false; }
    for (const k of Object.keys(v)) if (!(k in req) && !(k in opt)) err(`${p}.${k}`, 'is not a known field');
    for (const [k, f] of Object.entries(req)) { if (!(k in v)) err(`${p}.${k}`, 'is required'); else f(v[k], `${p}.${k}`); }
    for (const [k, f] of Object.entries(opt)) if (k in v) f(v[k], `${p}.${k}`);
    return true;
  };
  const text = (v, p) => str(v, p, { what: 'non-empty text', max: 2000 });
  const keyName = (v, p) => { if (str(v, p, { re: RE.id, what: 'a lowercase key' }) && v.startsWith('zin_')) err(p, 'must not start with zin_ (the compiler adds the prefix)'); };
  const flagName = (v, p) => str(v, p, { re: RE.id, what: 'a lowercase flag name' });
  const country = (v, p, { tokens = true } = {}) => {
    if (!str(v, p, { what: 'a country name' })) return;
    if (tokens && COUNTRY_TOKENS.includes(v)) return;
    if (!ctx.countries.has(v)) err(p, `${JSON.stringify(v)} is not a country of the roster`);
  };
  const countryNoToken = (v, p) => country(v, p, { tokens: false });
  const ideology = (v, p) => { if (!(v in IDEOLOGY_KEYS)) err(p, `must be one of ${Object.keys(IDEOLOGY_KEYS).join(', ')}`); };
  const spiritRef = (v, p) => { if (str(v, p, { what: 'a spirit key or a full zin_ idea id' }) && !RE.id.test(v)) err(p, 'must be a lowercase key or a full id'); };
  const eventRef = (v, p) => { if (str(v, p, { what: 'an event key or a namespaced event id' }) && !RE.id.test(v) && !RE.eventFull.test(v)) err(p, 'must be a lowercase key or an id such as zin_west.12'); };
  const modRef = (v, p) => { if (str(v, p, { what: 'a modifier key or a full zin_ id' }) && !RE.id.test(v)) err(p, 'must be a lowercase key or a full id'); };

  // ------------------------------------------------------------------------------------------ conditions
  const CONDITIONS = {
    flag: flagName, not_flag: flagName, global_flag: flagName,
    exists: country, at_war: bool, at_war_with: country,
    after: (v, p) => str(v, p, { re: RE.date, what: 'a date such as 1750.1.1' }),
    before: (v, p) => str(v, p, { re: RE.date, what: 'a date such as 1750.1.1' }),
    focus_done: keyName, spirit: spiritRef, ideology,
    people: (v, p) => { if (!ctx.people.has(v)) err(p, `${JSON.stringify(v)} is not a people key`); },
    rule: (v, p) => obj(v, p, { name: (x, q) => str(x, q, { re: /^[A-Za-z][A-Za-z0-9_]*$/, what: 'a game rule name' }), option: (x, q) => str(x, q, { re: /^[A-Za-z][A-Za-z0-9_]*$/, what: 'a rule option' }) }),
    is_subject: bool, subject_of: country, country: countryNoToken,
    region: (v, p) => { if (!ctx.regions.has(v)) err(p, `${JSON.stringify(v)} is not a roster region`); },
    stability_above: num,
    variable: (v, p) => {
      if (!obj(v, p, { name: (x, q) => str(x, q, { re: RE.id, what: 'a variable name' }) }, { above: num, below: num, equals: num })) return;
      const ops = ['above', 'below', 'equals'].filter(k => k in v);
      if (ops.length !== 1) err(p, 'needs exactly one of above, below, equals');
    },
    check: (v, p) => str(v, p, { re: RE.id, what: 'a scripted trigger id' }),
    not: (v, p) => condList(v, p), or: (v, p) => condList(v, p), and: (v, p) => condList(v, p),
    raw: (v, p) => str(v, p, { what: 'script text', max: 20000 }),
  };
  const condition = (v, p) => {
    if (!isObj(v)) return err(p, 'must be an object with one condition');
    const keys = Object.keys(v);
    if (keys.length !== 1) return err(p, `must hold exactly one condition (got ${keys.length})`);
    const f = CONDITIONS[keys[0]];
    if (!f) return err(`${p}.${keys[0]}`, `is not a known condition (known: ${Object.keys(CONDITIONS).join(', ')})`);
    f(v[keys[0]], `${p}.${keys[0]}`);
  };
  const condList = (v, p) => list(v, p, condition);

  // ------------------------------------------------------------------------------------------ effects
  const eventEffect = (v, p) => {
    if (typeof v === 'string') return eventRef(v, p);
    obj(v, p, { key: eventRef }, { days: (x, q) => int(x, q, { min: 0, max: 3650 }) });
  };
  const EFFECTS = {
    political_power: num, stability: num, war_support: num, army_experience: num, navy_experience: num, air_experience: num,
    manpower: (v, p) => int(v, p),
    add_spirit: spiritRef, remove_spirit: spiritRef,
    swap_spirit: (v, p) => { if (list(v, p, spiritRef) && v.length !== 2) err(p, 'must hold exactly two spirits: the old one, then the new one'); },
    timed_spirit: (v, p) => obj(v, p, { key: spiritRef, days: (x, q) => int(x, q, { min: 1, max: 36500 }) }),
    event: eventEffect,
    event_for: (v, p) => obj(v, p, { country, key: eventRef }, { days: (x, q) => int(x, q, { min: 0, max: 3650 }) }),
    flag: (v, p) => { if (typeof v === 'string') flagName(v, p); else obj(v, p, { name: flagName, days: (x, q) => int(x, q, { min: 1, max: 36500 }) }); },
    clear_flag: flagName, global_flag: flagName,
    variable: (v, p) => {
      if (!obj(v, p, { name: (x, q) => str(x, q, { re: RE.id, what: 'a variable name' }) }, { add: num, set: num })) return;
      if (['add', 'set'].filter(k => k in v).length !== 1) err(p, 'needs exactly one of add, set');
    },
    popularity: (v, p) => obj(v, p, { ideology, value: num }),
    government: ideology,
    building: (v, p) => obj(v, p, {
      type: (x, q) => str(x, q, { re: RE.id, what: 'a building type' }),
      level: (x, q) => int(x, q, { min: 1, max: 20 }),
      where: (x, q) => { if (str(x, q, { what: 'capital, random_owned, random_coastal, a site key or region:<key>' }) && !WHERE_FIXED.includes(x) && !/^(region:)?[a-z][a-z0-9_]*$/.test(x)) err(q, 'is not a place'); },
    }),
    research: (v, p) => obj(v, p, {
      categories: (x, q) => list(x, q, (c, r) => str(c, r, { re: RE.id, what: 'a research category' }), { min: 1 }),
      bonus: (x, q) => { if (num(x, q) && x <= 0) err(q, 'must be above 0'); },
      uses: (x, q) => int(x, q, { min: 1, max: 100 }),
    }),
    equipment: (v, p) => obj(v, p, { type: (x, q) => str(x, q, { re: RE.id, what: 'an equipment type' }), amount: (x, q) => int(x, q, { min: 1 }) }),
    annex: country, puppet: country, claims_on: country, cores_on: country, guarantee: country, non_aggression: country,
    wargoal: (v, p) => obj(v, p, { target: country, type: (x, q) => str(x, q, { re: RE.id, what: 'a war goal type' }) }),
    opinion: (v, p) => obj(v, p, { target: country, modifier: modRef }, { both_ways: bool }),
    faction: (v, p) => str(v, p, { re: RE.id, what: 'a faction key' }),
    invite: country, join_faction_of: country,
    for_country: (v, p) => obj(v, p, { country, effects: effectList }),
    if: (v, p) => obj(v, p, { limit: condList, then: effectList }, { else: effectList }),
    tooltip: text,
    raw: (v, p) => str(v, p, { what: 'script text', max: 20000 }),
  };
  const effect = (v, p) => {
    if (!isObj(v)) return err(p, 'must be an object with one effect');
    const keys = Object.keys(v);
    if (keys.includes('call')) {   // the one two-key effect: { "call": name, "args": {...} }
      for (const k of keys) if (k !== 'call' && k !== 'args') err(`${p}.${k}`, 'is not a known field of a call');
      str(v.call, `${p}.call`, { re: RE.id, what: 'a scripted effect id' });
      if ('args' in v) {
        if (!isObj(v.args)) err(`${p}.args`, 'must be an object');
        else for (const [name, val] of Object.entries(v.args)) {
          const q = `${p}.args.${name}`;
          if (!RE.id.test(name)) err(q, 'is not a valid argument name');
          else if (isNum(val)) continue;
          else if (typeof val === 'string' && val.length) continue;
          else if (isObj(val) && Object.keys(val).length === 1 && typeof val.variable === 'string' && RE.id.test(val.variable)) continue;
          else err(q, 'must be a number, a country, a keyword or { "variable": name }');
        }
      }
      return;
    }
    if (keys.length !== 1) return err(p, `must hold exactly one effect (got ${keys.length})`);
    const f = EFFECTS[keys[0]];
    if (!f) return err(`${p}.${keys[0]}`, `is not a known effect (known: ${Object.keys(EFFECTS).join(', ')}, call)`);
    f(v[keys[0]], `${p}.${keys[0]}`);
  };
  const effectList = (v, p) => list(v, p, effect);

  const ai = (v, p) => obj(v, p, { base: num }, {
    modifiers: (x, q) => list(x, q, (m, r) => {
      obj(m, r, {}, { factor: num, add: num, if: condList });
      if (isObj(m) && ('factor' in m) === ('add' in m)) err(r, 'needs exactly one of factor, add');
    }),
  });

  // ------------------------------------------------------------------------------------------ the tree
  if (!isObj(data)) { err('$', 'must be an object'); return errs; }
  const top = {
    id: (v, p) => str(v, p, { re: RE.id, what: 'a lowercase tree id' }),
    tier: (v, p) => { if (!TIERS.includes(v)) err(p, `must be one of ${TIERS.join(', ')}`); },
    countries: (v, p) => {
      list(v, p, countryNoToken, { min: 1 });
      if (Array.isArray(v) && new Set(v).size !== v.length) err(p, 'names a country twice');
    },
  };
  const optTop = {
    summary: text,
    event_namespace: (v, p) => str(v, p, { re: RE.full, what: 'a namespace such as zin_aenor' }),
    event_base: (v, p) => int(v, p, { min: 0, max: 100000 }),
    name_prefixes: (v, p) => list(v, p, (x, q) => str(x, q, { re: RE.prefix, what: 'a prefix such as zin_north_' }), { min: 1 }),
    spirits: (v, p) => record(v, p, spirit),
    events: (v, p) => record(v, p, event),
    scripted_effects: (v, p) => record(v, p, scriptedEffect, RE.full),
    scripted_triggers: (v, p) => record(v, p, scriptedTrigger, RE.full),
    opinion_modifiers: (v, p) => record(v, p, opinionModifier),
    ai_strategies: (v, p) => list(v, p, strategy),
    copy: (v, p) => list(v, p, copyEntry),
  };
  const record = (v, p, item, re = RE.id) => {
    if (!isObj(v)) return err(p, 'must be an object');
    for (const [k, x] of Object.entries(v)) {
      if (!re.test(k)) err(`${p}.${k}`, `is not a valid key (${re})`);
      else if (re === RE.id && k.startsWith('zin_')) err(`${p}.${k}`, 'must not start with zin_ (the compiler adds the prefix)');
      item(x, `${p}.${k}`);
    }
  };
  const moduleTag = (v, p) => str(v, p, { re: RE.moduleTag, what: 'a module tag' });
  const textGate = (v, p) => str(v, p, { re: RE.id, what: 'a global flag name' });

  const icon = (v, p) => {
    if (typeof v === 'string') return keyName(v, p);
    obj(v, p, { default: keyName }, { after: (x, q) => list(x, q, (a, r) => obj(a, r, { global_flag: flagName, icon: keyName }), { min: 1 }) });
  };
  const prerequisite = (v, p) => list(v, p, (g, q) => list(g, q, keyName, { min: 1 }));
  const focus = (v, p) => obj(v, p, {
    key: keyName, name: text, desc: text, icon, x: (x, q) => int(x, q), y: (x, q) => int(x, q), days: (x, q) => int(x, q, { min: 1, max: 100000 }),
  }, {
    prerequisite, mutually_exclusive: (x, q) => list(x, q, keyName), available: condList, bypass: condList, allow_branch: condList, ai,
    filters: (x, q) => list(x, q, (f, r) => { if (!(f in FILTER_TOKENS)) err(r, `must be one of ${Object.keys(FILTER_TOKENS).join(', ')}`); }),
    module: moduleTag, effects: effectList, relative_to: keyName, text_gate: textGate,
  });
  const spirit = (v, p) => obj(v, p, { name: text, desc: text }, {
    icon: keyName, module: moduleTag, text_gate: textGate, cancel: condList,
    modifier: (x, q) => record2(x, q, (m, r) => { if (!isNum(m) && typeof m !== 'boolean') err(r, 'must be a number or yes/no'); }),
    research_bonus: (x, q) => record2(x, q, (m, r) => num(m, r)),
    equipment_bonus: (x, q) => record2(x, q, (m, r) => record2(m, r, (n, s) => { if (!isNum(n) && typeof n !== 'boolean') err(s, 'must be a number or yes/no'); })),
  });
  const record2 = (v, p, item) => {
    if (!isObj(v) || Object.keys(v).length === 0) return err(p, 'must be a non-empty object');
    for (const [k, x] of Object.entries(v)) { if (!/^[a-z][a-z0-9_]*$/.test(k)) err(`${p}.${k}`, 'is not a valid key'); item(x, `${p}.${k}`); }
  };
  const option = (v, p) => obj(v, p, {}, { name: text, effects: effectList, ai_chance: ai });
  const event = (v, p) => {
    obj(v, p, { options: (x, q) => list(x, q, option, { min: 1, max: 26 }) }, {
      n: (x, q) => int(x, q, { min: 0, max: 99999 }), title: text, desc: text, picture: keyName, hidden: bool, news: bool, text_gate: textGate,
    });
    if (!isObj(v)) return;
    if (v.hidden === true) {
      for (const k of ['title', 'desc', 'picture', 'news']) if (k in v) err(`${p}.${k}`, 'is not allowed on a hidden event');
      if (Array.isArray(v.options)) {
        if (v.options.length !== 1) err(`${p}.options`, 'a hidden event has exactly one option, whose effects run at once');
        v.options.forEach((o, i) => { if (isObj(o) && ('name' in o || 'ai_chance' in o)) err(`${p}.options[${i}]`, 'a hidden event option holds only effects'); });
      }
    } else {
      for (const k of ['title', 'desc', 'picture']) if (!(k in v)) err(`${p}.${k}`, 'is required');
      if (Array.isArray(v.options)) v.options.forEach((o, i) => { if (isObj(o) && !('name' in o)) err(`${p}.options[${i}].name`, 'is required'); });
    }
    for (const k of ['trigger', 'mean_time_to_happen']) if (k in v) err(`${p}.${k}`, 'belongs to a mechanic-owned event file; tree events are fired by effects only');
  };
  const argKind = (v, p) => {
    if (v === 'number' || v === 'country') return;
    obj(v, p, { keyword: (x, q) => record2(x, q, (c, r) => int(c, r, { min: -1000000, max: 1000000 })) });
  };
  const scriptedEffect = (v, p) => obj(v, p, { effects: effectList }, { args: (x, q) => record2Args(x, q), module: moduleTag });
  const record2Args = (v, p) => {
    if (!isObj(v)) return err(p, 'must be an object');
    for (const [k, x] of Object.entries(v)) { if (!RE.id.test(k)) err(`${p}.${k}`, 'is not a valid argument name'); argKind(x, `${p}.${k}`); }
  };
  const scriptedTrigger = (v, p) => obj(v, p, { conditions: condList }, { module: moduleTag });
  const opinionModifier = (v, p) => obj(v, p, { value: (x, q) => int(x, q, { min: -1000, max: 1000 }) }, {
    name: text, decay: (x, q) => { if (num(x, q) && x < 0) err(q, 'must not be negative'); },
    months: (x, q) => int(x, q, { min: 0, max: 1200 }), trade: bool, module: moduleTag,
  });
  const strategy = (v, p) => {
    obj(v, p, {
      country: (x, q) => { if (x !== 'all') countryNoToken(x, q); },
      type: (x, q) => { if (![...COUNTRY_STRATEGIES, ...AREA_STRATEGIES].includes(x)) err(q, `must be one of ${[...COUNTRY_STRATEGIES, ...AREA_STRATEGIES].join(', ')}`); },
      target: (x, q) => str(x, q, { what: 'a country name or an area name' }),
      value: (x, q) => int(x, q, { min: -10000, max: 10000 }),
    }, { if: condList });
    if (isObj(v) && typeof v.target === 'string' && typeof v.type === 'string') {
      if (COUNTRY_STRATEGIES.includes(v.type)) countryNoToken(v.target, `${p}.target`);
      else if (!RE.id.test(v.target)) err(`${p}.target`, 'must be a lowercase area name');
    }
  };
  const copyEntry = (v, p) => obj(v, p, {
    from: (x, q) => str(x, q, { re: RE.id, what: 'a shared tree id' }), module: moduleTag,
    root_at: (x, q) => { if (!Array.isArray(x) || x.length !== 2 || !x.every(isInt)) err(q, 'must be [x, y]'); },
  }, { root_prerequisite: prerequisite });

  obj(data, '$', {
    ...top, focuses: (v, p) => list(v, p, focus, { min: 1 }),
  }, optTop);

  // ---------------------------------------------------------------------------------- cross-field rules
  if (isObj(data)) {
    if (typeof data.id === 'string' && TIERS.includes(data.tier)) {
      if (data.tier === 'regional' && !data.id.startsWith('regional_')) err('$.id', 'a regional tree id starts with regional_ (F4)');
      if (data.tier === 'shared' && !data.id.startsWith('shared_')) err('$.id', 'a shared tree id starts with shared_');
      if (data.tier === 'major' && /^(regional|shared)_/.test(data.id)) err('$.id', 'a major tree id has no regional_ or shared_ prefix');
    }
    if (isObj(data.events)) {
      const withN = Object.values(data.events).filter(e => isObj(e) && 'n' in e).length, total = Object.keys(data.events).length;
      if (withN !== 0 && withN !== total) err('$.events', 'either every event carries n or none does');
    }
    if (Array.isArray(data.focuses)) {
      data.focuses.forEach((f, i) => { if (isObj(f) && 'module' in f && data.tier !== 'shared') err(`$.focuses[${i}].module`, 'only a shared tree tags module focuses'); });
    }
    if (data.tier === 'shared' && 'copy' in data) err('$.copy', 'a shared tree is copied from, it does not copy');
  }
  return errs;
}
