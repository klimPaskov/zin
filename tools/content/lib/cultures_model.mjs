// The culture and faith model (docs/specs/02_lore/05_world_bible.md, 08_world_in_game.md). Pure functions over the
// data files; nothing here writes a file or reads the installed game. `modules/cultures.mjs` writes the game files,
// `checks/cultures_check.mjs` proves the data, and the politics step calls `resolveStateCulture`.
//
// Data:   data/cultures_game.json            what the game adds (spirits, modifiers, hooks, text, mappings)
//         data/world/cultures.json           the bible's cultures, faiths, tiers and palettes
//         data/world/country_cultures.json   the culture, second culture and faith of each of the 305 countries
//         data/world/languages.json          the 24 languages
//         docs/design/world/state_cultures.json   minorities and mixed lands, keyed by geography feature id
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZIN } from './paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA = path.join(here, '../data');
export const STATE_CULTURES_FILE = 'docs/design/world/state_cultures.json';
export const COVERAGE_FILE = 'docs/design/world/culture_coverage.json';
export const MAPPINGS_FILE = 'docs/design/world/culture_mappings.json';

const readJson = async file => JSON.parse(await readFile(file, 'utf8'));

// Stable JSON for the files the builder stages: sorted keys, two-space indent, trailing newline.
export function sortDeep(v) {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, sortDeep(v[k])]));
  return v;
}
export const canonicalJson = v => JSON.stringify(sortDeep(v), null, 2) + '\n';
// The state table keeps its rule order (the order is the priority), so only its objects are sorted.
export const keepOrderJson = v => JSON.stringify(v, null, 2) + '\n';

// `over` replaces a part of the model (tests use it to plant mistakes): game, world, assignments, languages, state.
export async function loadCultureModel(over = {}) {
  const game = over.game ?? await readJson(path.join(DATA, 'cultures_game.json'));
  const world = over.world ?? await readJson(path.join(DATA, 'world/cultures.json'));
  const assignments = over.assignments ?? (await readJson(path.join(DATA, 'world/country_cultures.json'))).countries;
  const languageList = over.languages ?? (await readJson(path.join(DATA, 'world/languages.json'))).languages;
  const state = over.state ?? await readJson(`${ZIN}/${STATE_CULTURES_FILE}`);
  const languageRows = Array.isArray(languageList) ? languageList : Object.values(languageList);
  const languages = Object.fromEntries(languageRows.map(l => [l.id, { id: l.id, name: l.name, family: l.family }]));
  return { game, world, assignments, languages, state, cultureKeys: Object.keys(game.cultures), faithKeys: Object.keys(game.faiths), languageKeys: Object.keys(game.language_ids) };
}

// ---------------------------------------------------------------------------------------------------- identifiers
export const cultureIdea = key => `zin_culture_${key}`;
export const cultureIdea2 = key => `zin_culture2_${key}`;
export const faithIdea = key => `zin_faith_${key}`;
export const cultureFlag = cultureIdea;                // flags carry the idea's name, as the people flags do
export const culture2Flag = cultureIdea2;
export const faithFlag = faithIdea;
export const languageFlag = id => `zin_language_${id}`;

export const cultureNumber = (model, key) => model.game.cultures[key]?.id;
export const faithNumber = (model, key) => model.game.faiths[key]?.id;
export const languageNumber = (model, id) => model.game.language_ids[id];

export const tierOf = (model, key) => model.world.cultures[key].tier;
export const peopleOf = (model, key) => model.world.cultures[key].people;
export const cultureName = (model, key) => model.world.cultures[key].name;
export const faithName = (model, key) => model.game.faiths[key]?.name ?? model.world.faiths[key].name;
export const languageOf = (model, key) => model.world.cultures[key].language;
export const faithOfCulture = (model, key) => model.world.cultures[key].faith;

// ------------------------------------------------------------------------------------------- countries to cultures
// Rows come from country_cultures.json by country name (tags follow the politics step and can change). `table` may
// override a tag or a name: { culture, culture2, faith, language }, as the owner's countries.csv will once it gains
// the three columns. Returns { rows: Map(tag -> row), missing: [country names without a row], problems: [...] }.
export function resolveCountryCultures(model, countries, table = new Map()) {
  const byName = new Map(model.assignments.map(a => [a.country, a]));
  const rows = new Map(), missing = [], problems = [];
  for (const c of countries) {
    const base = byName.get(c.name.replace(/,/g, ' ')) ?? byName.get(c.name);
    const over = table.get(c.tag) ?? table.get(c.name) ?? {};
    if (!base && !over.culture) { missing.push(c.name); continue; }
    const row = {
      tag: c.tag, country: c.name, region: base?.region ?? null,
      culture: over.culture ?? base.culture,
      culture2: over.culture2 !== undefined ? over.culture2 : (base?.culture_secondary ?? null),
      faith: over.faith ?? base?.faith,
      language: over.language !== undefined ? over.language : (base?.language ?? null),
      dialect: base?.dialect ?? null,
    };
    if (!model.world.cultures[row.culture]) problems.push(`${c.name}: unknown culture ${row.culture}`);
    if (row.culture2 && !model.world.cultures[row.culture2]) problems.push(`${c.name}: unknown second culture ${row.culture2}`);
    if (row.culture2 && row.culture2 === row.culture) problems.push(`${c.name}: the second culture equals the first (${row.culture})`);
    if (!model.world.faiths[row.faith]) problems.push(`${c.name}: unknown faith ${row.faith}`);
    if (row.language && !model.languages[row.language]) problems.push(`${c.name}: unknown language ${row.language}`);
    rows.set(c.tag, row);
  }
  return { rows, missing, problems };
}

// ---------------------------------------------------------------------------------------------------- modifiers
// A second culture counts at `secondary_factor` strength. Values that round to zero, and the integer skill level,
// are dropped (half a skill level does nothing).
const INTEGER_MODIFIERS = new Set(['army_leader_start_level']);
export function scaleModifiers(mods, factor) {
  const out = {};
  for (const [k, v] of Object.entries(mods)) {
    if (INTEGER_MODIFIERS.has(k)) continue;
    const s = Math.round(v * factor * 1000) / 1000;
    if (s !== 0) out[k] = s;
  }
  return out;
}
export const secondaryModifiers = (model, key) => scaleModifiers(model.game.cultures[key].modifier, model.game.limits.secondary_factor);

// Which idea category a culture idea lives in (data: idea_category).
export function ideaCategory(model, key, secondary = false) {
  const cat = model.game.idea_category;
  return secondary ? cat.secondary : cat[`tier${tierOf(model, key)}`];
}

// -------------------------------------------------------------------------------------- mappings for other modules
export function portraitPoolFor(model, key) {
  const p = model.game.portrait_pools, tier = tierOf(model, key);
  const perSex = p.per_sex_overrides[key] ?? p.per_sex_by_tier[tier];
  return { pool: key, kit: peopleOf(model, key), tier, per_sex: perSex, total: perSex * 2, unique: tier < 3 };
}
export function flagStyleFor(model, key) {
  const f = model.game.cultures[key].flag, shapes = model.game.flag_shapes;
  return { motif: f.motif, alt: [...(f.alt ?? [])], shape: shapes[key] ?? shapes.default, palette: [...model.world.cultures[key].palette] };
}
export const buildingStyleFor = (model, key) => model.game.cultures[key].building;
export const musicMoodFor = (model, key) => model.game.cultures[key].music;
export const unitGroupFor = (model, key) => model.game.cultures[key].unit_group;
// The graphical culture of a culture's units: `zin_<group>_gfx`, or the people's `zin_<people>_gfx` (the one units3d
// defines today) while the group's own culture is not in `available`. Pass the set modules/units3d.mjs defines.
export function graphicalCultureFor(model, key, available = null) {
  const group = `zin_${unitGroupFor(model, key)}_gfx`, fallback = `zin_${peopleOf(model, key)}_gfx`;
  return { key: available && !available.has(group) ? fallback : group, group, fallback };
}
export const musicMoods = model => [...new Set(model.cultureKeys.map(k => musicMoodFor(model, k)))].sort();
export const buildingStyles = model => [...new Set(model.cultureKeys.map(k => buildingStyleFor(model, k)))].sort();
export const unitGroups = model => [...new Set(model.cultureKeys.map(k => unitGroupFor(model, k)))].sort();

export function cultureMappings(model) {
  const out = {};
  for (const key of model.cultureKeys) {
    const c = model.game.cultures[key];
    out[key] = {
      people: peopleOf(model, key), tier: tierOf(model, key), language: languageOf(model, key), faith: faithOfCulture(model, key),
      portrait_pool: portraitPoolFor(model, key), flag: flagStyleFor(model, key), building_style: c.building, music_mood: c.music,
      unit_group: c.unit_group, graphical_culture: graphicalCultureFor(model, key), icon: c.icon, magic: c.magic,
    };
  }
  return out;
}

// The names the Chronicle prints for a culture, a faith and a language (codex entries of 07_interface/04).
export function chronicleNames(model) {
  return {
    cultures: Object.fromEntries(model.cultureKeys.map(k => [k, { name: cultureName(model, k), adjective: model.game.cultures[k].adjective, spirit: model.game.cultures[k].spirit, summary: model.game.cultures[k].text }])),
    faiths: Object.fromEntries(model.faithKeys.map(k => [k, { name: faithName(model, k), short: model.game.faiths[k].name ?? model.world.faiths[k].short, clergy: model.game.faiths[k].clergy ?? null, summary: model.game.faiths[k].text }])),
    languages: Object.fromEntries(model.languageKeys.map(k => [k, { name: model.languages[k]?.name ?? k }])),
  };
}

// ------------------------------------------------------------------------------------------------ state cultures
const sameKin = (model, a, b) => a === b || model.game.kin.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
export const culturesAreKin = sameKin;

const ownerMatches = (rule, ownerCulture) => {
  if (rule.when_owner && !rule.when_owner.includes(ownerCulture)) return false;
  if (rule.unless_owner && rule.unless_owner.includes(ownerCulture)) return false;
  return true;
};

// The culture, faith, minorities and holy sites of one state. The politics step calls this once per state after it
// knows the state's owner and which geography features cover the state:
//
//   resolveStateCulture(model, { owner: { culture, culture2?, faith? }, features: ['forest_kilinti', 'region_middle_lands'] })
//     -> { culture, faith, language, minorities: [{ culture, faith, share }], holy_sites: [faith keys],
//          resistance: { target, level, explicit }, rules: [rule ids that applied] }
//
// Never keyed by state number. Rules apply in file order: the first matching `enclave` rule fixes the state's
// culture; every matching `mixed` rule adds minorities (the larger share wins); the owner's own second culture adds
// `owner_second_share`. Minorities never exceed `max_minority_total` of the state together.
export function resolveStateCulture(model, input) {
  const { game, world, state } = model, owner = input.owner, features = new Set(input.features ?? []);
  if (!owner?.culture || !world.cultures[owner.culture]) throw new Error(`resolveStateCulture: unknown owner culture ${owner?.culture}`);
  const ownerFaith = owner.faith ?? faithOfCulture(model, owner.culture);
  let culture = owner.culture, faith = ownerFaith, enclave = null;
  const minority = new Map(), applied = [], explicit = [];
  for (const rule of state.rules) {
    if (!features.has(rule.feature) || !ownerMatches(rule, owner.culture)) continue;
    if (rule.kind === 'enclave') {
      if (enclave) continue;
      enclave = rule; culture = rule.culture; faith = rule.faith ?? faithOfCulture(model, rule.culture);
    } else if (rule.kind === 'mixed') {
      for (const m of rule.minorities) minority.set(m.culture, Math.max(minority.get(m.culture) ?? 0, m.share));
    } else continue;
    applied.push(rule.id);
    const level = rule.owner_resistance?.[owner.culture] ?? rule.owner_resistance?.['*'];
    if (level) explicit.push(level);
  }
  if (owner.culture2 && input.include_owner_second !== false && owner.culture2 !== culture) minority.set(owner.culture2, Math.max(minority.get(owner.culture2) ?? 0, game.limits.owner_second_share));
  minority.delete(culture);
  let total = [...minority.values()].reduce((a, b) => a + b, 0);
  const scale = total > game.limits.max_minority_total ? game.limits.max_minority_total / total : 1;
  const minorities = [...minority].map(([c, share]) => ({ culture: c, faith: faithOfCulture(model, c), share: Math.round(share * scale * 1000) / 1000 }))
    .sort((a, b) => b.share - a.share || a.culture.localeCompare(b.culture, 'en'));
  const holy = Object.entries(game.faiths).filter(([, f]) => f.holy_sites.some(s => features.has(s))).map(([k]) => k).sort();

  // Resistance (demography spec section 6): another culture +20%, Great Folk under Common Folk +10%, another faith +5%;
  // a rule may name a level for the owner's culture (Aenor over the Cursed Lands is total).
  const r = game.resistance_rules, levels = game.resistance_levels;
  let computed = 0;
  if (!sameKin(model, culture, owner.culture)) computed += r.other_culture;
  if (game.great_folk_peoples.includes(peopleOf(model, culture)) && game.common_folk_peoples.includes(peopleOf(model, owner.culture))) computed += r.great_folk_under_common_folk;
  if (faith !== ownerFaith) computed += r.other_faith;
  const named = explicit.length ? explicit.reduce((a, b) => (levels[b] > levels[a] ? b : a)) : null;
  const target = Math.round(Math.max(computed, named ? levels[named] : 0) * 1000) / 1000;
  const level = named ?? (target === 0 ? 'none' : target < 0.175 ? 'low' : target < 0.325 ? 'medium' : target < 0.5 ? 'strong' : 'total');
  return { culture, faith, language: languageOf(model, culture), minorities, holy_sites: holy, resistance: { target, level, explicit: named }, rules: applied };
}

// Startup effect lines for the states of one build, in the layout of the people lines of modules/peoples.mjs:
// `\t\t\t<state> = { ... }`. `states` is [{ state: <id>, ...resolveStateCulture result, culture2?: key }] and state ids are
// supplied by the politics step (they change when the map does; nothing here depends on them). The variables are the
// ones the state triggers and scripted localisation read.
export function stateStartupLines(model, states) {
  const lines = [];
  for (const s of [...states].sort((a, b) => a.state - b.state)) {
    const parts = [`set_variable = { zin_state_culture = ${cultureNumber(model, s.culture)} }`, `set_variable = { zin_state_faith = ${faithNumber(model, s.faith)} }`];
    const second = s.minorities?.[0];
    if (second) parts.push(`set_variable = { zin_state_culture2 = ${cultureNumber(model, second.culture)} }`);
    for (const f of s.holy_sites ?? []) parts.push(`set_state_flag = zin_holy_site_${f}`);
    lines.push(`\t\t\t${s.state} = { ${parts.join(' ')} }`);
  }
  return lines.join('\n');
}

// ------------------------------------------------------------------------------------------------ localisation
// Every key of localisation/english/zin_cultures_l_english.yml, as a plain object (the builder sorts and writes it).
//   zin_cname_<culture>, zin_cadj_<culture>, zin_ctext_<culture>   name, adjective, short description
//   zin_culture_<culture>[_desc]                                    the spirit (name, tooltip)
//   zin_culture2_<culture>[_desc]                                   the same culture as a second culture of a country
//   zin_fname_<faith>, zin_ftext_<faith>, zin_fclergy_<faith>       name, short description, clergy title
//   zin_faith_<faith>[_desc]                                        the faith spirit
//   zin_festival_<faith>_<festival>                                 festival names
//   zin_lname_<language>                                            language names
//   zin_*_unknown, zin_cname_second_none                            fallbacks of the scripted localisation
export function cultureLocEntries(model) {
  const e = {}, { game } = model;
  for (const k of model.cultureKeys) {
    const c = game.cultures[k], name = cultureName(model, k);
    e[`zin_cname_${k}`] = name; e[`zin_cadj_${k}`] = c.adjective; e[`zin_ctext_${k}`] = c.text;
    e[`zin_culture_${k}`] = c.spirit; e[`zin_culture_${k}_desc`] = c.spirit_desc;
    e[`zin_culture2_${k}`] = `Kin: ${name}`;
    e[`zin_culture2_${k}_desc`] = `A lesser share of this realm keeps the ways of ${name}. Their custom counts at half strength.`;
  }
  for (const k of model.faithKeys) {
    const f = game.faiths[k];
    e[`zin_fname_${k}`] = faithName(model, k); e[`zin_ftext_${k}`] = f.text;
    if (f.spirit_desc) { e[`zin_faith_${k}`] = faithName(model, k); e[`zin_faith_${k}_desc`] = f.spirit_desc; }
    if (f.clergy) e[`zin_fclergy_${k}`] = f.clergy;
    for (const fest of f.festivals) e[`zin_festival_${k}_${fest.id}`] = fest.name;
  }
  for (const id of model.languageKeys) e[`zin_lname_${id}`] = model.languages[id]?.name ?? id;
  Object.assign(e, {
    zin_cname_unknown: 'Unrecorded', zin_cadj_unknown: 'Unrecorded', zin_ctext_unknown: 'No culture is recorded.', zin_cname_second_none: 'None',
    zin_fname_unknown: 'Unrecorded', zin_ftext_unknown: 'No faith is recorded.', zin_lname_unknown: 'None recorded',
  });
  return e;
}
