// Names for every ZIN country, drawn from the languages of Erdae (docs/specs/02_lore/06_languages.md). Each country's
// culture has a language; its male, female, surname and callsign pools come from that language's own name space, so a
// Cold Lands town and a Sunhot town can never share a name. Without these pools the game cannot name the characters it
// generates for ZIN countries (and the 75 dynamic tags of civil wars need the `default` pool).
//
// buildNames(staged, countries, labels)   stages common/names/zin_names.txt and docs/design/names_report.json, runs the name
//                                         checks (checks/names_check.mjs) and returns the pools by tag, by drawn sheet and as
//                                         'zin:all-erdae' (the default pool), as before.
// placeNames(target, kind, n, options)    n place names for a country, culture, language or region, from the generator's
//                                         registry shared with the persons (for the map and politics steps).
// resolveName(request)                    the NameRequest of the spec for one entity.
import { rng } from '../lib/core.mjs';
import {
  PLACE_KINDS, PERSON_KINDS, BANNED_SUBSTRINGS, blendShares, buildContext, createNameGenerator, layerPlan, loadNamingData, neutralBlend,
} from '../lib/language_generator.mjs';
import { assertNoViolations, checkLanguageBatches, checkRelatedness, checkStagedNames, POOL_FLOORS } from '../checks/names_check.mjs';

// The substring list this module has always applied; the generator merges it with languages.json and banned_words.json.
export const BANNED = [...BANNED_SUBSTRINGS];
export const POOL_SIZES = Object.freeze({ male: 60, female: 50, surnames: 90, callsigns: 12 });
const DEFAULT_SCAN = 'zin:all-erdae';

// ------------------------------------------------------------------------------------------------ shared state
// One generator (and one registry) serves the persons of buildNames and the places of placeNames in a run.
let shared = null;
function createShared(data) {
  const ctx = buildContext(data), generator = createNameGenerator(data, { context: ctx });
  const byName = new Map(), byTag = new Map(), regions = new Map();
  for (const c of data.countryCultures.countries) {
    byName.set(c.country, c); byTag.set(c.tag, c);
    if (c.language) { const r = regions.get(c.region) ?? regions.set(c.region, new Map()).get(c.region); r.set(c.language, (r.get(c.language) ?? 0) + 1); }
  }
  generator.nameSpace(generator.order[0]);
  return { data, ctx, generator, byName, byTag, regions, blend: neutralBlend(data) };
}
function ensureShared() { return (shared ??= createShared(loadNamingData())); }
// Forget the shared generator (a test or a second build in one process starts from an empty registry).
export function resetNaming() { shared = null; }

// ------------------------------------------------------------------------------------------------- the pools
function blendPool(state, seed, kind, n) {
  const names = [];
  for (const { language, n: count } of blendShares(state.blend, n)) if (count) names.push(...state.generator.pool(language, kind === 'surnames' ? 'house' : kind, count, `${seed}:${language}`));
  return names.sort();
}
function makePool(state, seed, language) {
  const part = (kind, n) => (language ? state.generator.pool(language, kind === 'surnames' ? 'house' : kind, n, seed, POOL_FLOORS[kind] ?? 0) : blendPool(state, seed, kind, n));
  return { male: part('male', POOL_SIZES.male), female: part('female', POOL_SIZES.female), surnames: part('surnames', POOL_SIZES.surnames), callsigns: part('callsign', POOL_SIZES.callsigns) };
}

const quote = n => (/[\s"]/.test(n) ? `"${n}"` : n);
function block(key, p) {
  return `${key} = {\n\tmale = {\n\t\tnames = { ${p.male.join(' ')} }\n\t}\n\tfemale = {\n\t\tnames = { ${p.female.join(' ')} }\n\t}\n\tsurnames = { ${p.surnames.map(quote).join(' ')} }\n\tcallsigns = { ${p.callsigns.map(n => `"${n}"`).join(' ')} }\n}`;
}

export function buildNames(staged, countries, labels) {
  resetNaming();
  const data = loadNamingData();
  // The caller's table and labels win over the files, so a test can build names for a synthetic country list.
  data.countries = countries; if (labels) data.labels = labels;
  shared = createShared(data);
  const state = shared, { generator } = state;
  const pools = new Map(), tagLanguage = new Map(), cultureOf = new Map();

  const defaultPool = makePool(state, 'default', null);
  pools.set(DEFAULT_SCAN, { ...defaultPool, language: null, culture: null, tag: 'default' });
  tagLanguage.set('default', null);
  const blocks = [block('default', defaultPool)];
  for (const c of countries) {
    const entry = state.byTag.get(c.tag) ?? state.byName.get(c.name);
    if (!entry) throw new Error(`Country ${c.name} (${c.tag}) has no culture in country_cultures.json`);
    const language = entry.language ?? null; // Zol's Mistake has no language: the neutral blend names its hosts
    const pool = { ...makePool(state, c.tag, language), language, culture: entry.culture, tag: c.tag };
    pools.set(c.tag, pool); tagLanguage.set(c.tag, language); cultureOf.set(c.tag, entry.culture);
    blocks.push(block(c.tag, pool));
  }
  // Callers that still key by drawn sheet get the pool of the first country of the sheet's most common language.
  const sheets = new Map();
  for (const c of countries) { const language = pools.get(c.tag).language ?? ''; const s = sheets.get(c.scan) ?? sheets.set(c.scan, new Map()).get(c.scan); s.set(language, [...(s.get(language) ?? []), c.tag]); }
  for (const [scan, byLanguage] of sheets) { const best = [...byLanguage].sort((a, b) => b[1].length - a[1].length || (a[0] < b[0] ? -1 : 1))[0]; pools.set(scan, pools.get(best[1][0])); }

  const text = `# Generated by the ZIN content builder: character names by language (docs/specs/02_lore/06_languages.md).\n${blocks.join('\n')}\n`;
  staged.text('common/names/zin_names.txt', text);

  // The build fails on a bad name: banned words, glyphs outside Windows-1252, leaks between languages, bad forms,
  // pools below the floor; and on a language that breaks the reference run or its own sound laws.
  const checked = checkStagedNames({ text, data, ctx: state.ctx, tagLanguage, blend: state.blend.map(b => b.language), generator });
  const batches = checkLanguageBatches(data, { ctx: state.ctx });
  const related = checkRelatedness(data);
  assertNoViolations([...checked.violations, ...batches.violations, ...related.violations], 'The name checks');

  const report = buildReport({ checked, batches, related, tagLanguage, cultureOf, state, violations: [...checked.violations, ...batches.violations, ...related.violations] });
  staged.text('docs/design/names_report.json', `${JSON.stringify(report, null, 1)}\n`);
  pools.report = report;
  return pools;
}

// The distribution report: names per language and kind, and the collisions the checks looked for (all zero when the
// build passes; the file is kept so a regression shows up in a diff).
function buildReport({ checked, batches, related, tagLanguage, cultureOf, state, violations }) {
  const count = (...codes) => violations.filter(v => codes.includes(v.code)).length;
  const languages = {};
  for (const [id, s] of [...checked.stats].sort(([a], [b]) => (a < b ? -1 : 1))) {
    languages[id] = {
      countries: s.countries, entries: s.entries, distinct: { male: s.male.size, female: s.female.size, surnames: s.surnames.size, callsigns: s.callsigns.size },
      reference: { places: batches.report[id].places, persons: batches.report[id].persons, failures: batches.report[id].failures, duplicates: batches.report[id].duplicates, signatureShare: batches.report[id].signatureShare, infeasibleKinds: batches.report[id].infeasibleKinds },
      relatedness: related.report[id] ?? null,
    };
  }
  const totals = { male: 0, female: 0, surnames: 0, callsigns: 0 }, distinct = { male: new Set(), female: new Set(), surnames: new Set(), callsigns: new Set() };
  for (const block of checked.blocks.values()) for (const k of Object.keys(totals)) { totals[k] += block[k].length; for (const n of block[k]) distinct[k].add(n); }
  return {
    schema: 'zin-names-report/1', spec: 'docs/specs/02_lore/06_languages.md',
    pools: { blocks: checked.blocks.size, entries: totals, distinct: Object.fromEntries(Object.entries(distinct).map(([k, v]) => [k, v.size])) },
    blend: state.blend.map(b => ({ language: b.language, weight: Math.round(b.weight * 1000) / 1000 })),
    collisions: { crossLanguage: count('leak'), nearDuplicates: count('near'), banned: count('banned'), reserved: count('reserved'), glyphs: count('font') },
    registrySize: state.generator.registry.size,
    languages,
    countriesWithoutLanguage: [...tagLanguage].filter(([tag, l]) => !l && tag !== 'default').map(([tag]) => tag).sort(),
    cultures: [...new Set(cultureOf.values())].sort().length,
  };
}

// ----------------------------------------------------------------------------------------------- place names
// Resolve a target to the language(s) that name it. A country (by name or tag) names its places in its culture's
// language; a culture or a language says so directly; a region mixes the languages of its countries by their number.
function resolveTarget(state, target) {
  const { byName, byTag, regions, data } = state;
  const fromEntry = e => ({ id: `country:${e.country}`, region: e.region, label: e.country, choices: [{ language: e.language, culture: e.culture, dialect: e.dialect, people: e.people, weight: 1 }] });
  const regionOf = language => { let best = null; for (const [region, langs] of regions) if (langs.has(language) && (!best || langs.get(language) > best[1])) best = [region, langs.get(language)]; return best?.[0] ?? null; };
  const fromRegion = region => {
    const langs = regions.get(region); if (!langs) return null;
    const choices = [...langs].sort(([a], [b]) => (a < b ? -1 : 1)).map(([language, weight]) => {
      const sample = data.countryCultures.countries.find(c => c.region === region && c.language === language);
      return { language, culture: sample.culture, dialect: sample.dialect, people: sample.people, weight };
    });
    return { id: `region:${region}`, region, label: region, choices };
  };
  const fromLanguage = (language, region) => {
    if (!state.ctx.languages.has(language)) throw new Error(`Unknown language "${language}"`);
    return { id: `language:${language}`, region: region ?? regionOf(language), label: language, choices: [{ language, culture: null, dialect: null, people: 'men', weight: 1 }] };
  };
  if (typeof target === 'string') {
    const entry = byName.get(target) ?? byTag.get(target);
    if (entry) return fromEntry(entry);
    const region = fromRegion(target); if (region) return region;
    if (data.cultures.cultures[target]) { const c = data.cultures.cultures[target], any = data.countryCultures.countries.find(x => x.culture === target); return { id: `culture:${target}`, region: any?.region ?? null, label: c.name, choices: [{ language: c.language, culture: target, dialect: c.dialect, people: c.people, weight: 1 }] }; }
    if (state.ctx.languages.has(target)) return fromLanguage(target);
    throw new Error(`Unknown naming target "${target}": expected a country, tag, region, culture or language`);
  }
  if (target && typeof target === 'object') {
    if (target.country) return resolveTarget(state, target.country);
    if (target.region) { const r = fromRegion(target.region); if (!r) throw new Error(`Unknown region "${target.region}"`); return r; }
    if (target.culture) return resolveTarget(state, target.culture);
    if (target.language) return fromLanguage(target.language, target.regionName);
  }
  throw new Error('placeNames needs a country, tag, region, culture or language as its first argument');
}

const wpick = (items, key, r) => { let t = r() * items.reduce((a, x) => a + key(x), 0); for (const x of items) { t -= key(x); if (t < 0) return x; } return items.at(-1); };

// placeNames('Aenor', 'city', 50): fifty city names, unique across the world (every name claims the shared registry).
// Options: size ('hamlet' to 'capital'), features (river, ford, pass, ...), layers (default true: the toponym layers of
// the spec), seed (text added to every entity id), start (index of the first name), parent (containing entity).
export function placeNames(target, kind, n, options = {}) {
  if (!PLACE_KINDS.includes(kind)) throw new Error(`Unknown place kind "${kind}": expected ${PLACE_KINDS.join(', ')}`);
  if (!Number.isInteger(n) || n < 0) throw new Error(`placeNames needs a whole number of names, got ${n}`);
  const state = ensureShared(), t = resolveTarget(state, target);
  const out = [];
  for (let i = 0; i < n; i++) {
    const entityId = `${t.id}:${options.seed ?? ''}${(options.start ?? 0) + i}`;
    const r = rng(`zin-names:layer:${kind}:${entityId}`);
    const choice = t.choices.length === 1 ? t.choices[0] : wpick(t.choices, c => c.weight, r);
    if (!choice.language) throw new Error(`${t.label} has no language (Zol's Mistake keeps its drawn names)`);
    const plan = options.layers === false ? [{ layer: 'current', language: choice.language, weight: 1 }] : layerPlan({ region: t.region, language: choice.language, kind, people: choice.people, r });
    const layer = wpick(plan, l => l.weight, r);
    out.push(state.generator.place({ language: layer.language, kind, entityId, size: options.size ?? (kind === 'city' ? 'city' : undefined), features: options.features ?? [], dialect: layer.layer === 'current' ? choice.dialect : null, parent: options.parent ?? null, layer: layer.layer, pattern: layer.pattern, suffix: layer.suffix }));
  }
  return out;
}

// The NameRequest of the spec: { kind, entityId, cultureId, size?, features?, parent? } -> a Name.
export function resolveName(request) {
  const state = ensureShared(), { kind, entityId, cultureId } = request;
  const culture = state.data.cultures.cultures[cultureId];
  if (!culture) throw new Error(`Unknown culture "${cultureId}"`);
  if (!culture.language) throw new Error(`Culture ${cultureId} has no language`);
  const language = culture.language, generator = state.generator;
  if (PLACE_KINDS.includes(kind) || kind === 'sea') return placeNames({ culture: cultureId }, kind, 1, { seed: `${entityId}#`, size: request.size, features: request.features, parent: request.parent })[0];
  if (!PERSON_KINDS.includes(kind)) throw new Error(`Unknown name kind "${kind}"`);
  return generator.generate({ language, kind, entityId, dialect: culture.dialect, role: request.role, parent: request.parent });
}
