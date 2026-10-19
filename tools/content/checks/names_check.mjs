// Name checks (docs/specs/02_lore/06_languages.md sections 4 and 6, 08_world_in_game.md section 14, checks 1, 6 and 7).
// They run on the staged `common/names/zin_names.txt` inside buildNames, so a build with a bad name fails, and again
// from the tests and from the command line:
//   node tools/content/checks/names_check.mjs [stagedDir]      checks the language data and, with a staged tree, its names
//
//   leak          a name appears in the pools of countries that speak different languages (spec: "a name generated for
//                 one language must not appear in another country's pool"); a blend pool (the default pool and Zol's)
//                 may only hold names of its declared languages
//   near          a name within one edit of a name of another language or of an established name (five letters or more)
//   reserved      a name equal to an established name (vault, country, capital, drawn label, geography model)
//   banned        a banned substring, a modern word or a rule of banned_words.json
//   font          a character outside Windows-1252 anywhere in the file
//   form          alphabet, length, repeats, consonant runs, letters or leak markers outside the country's language
//   pool-size     a pool below the engine floor (20 male, 20 female, 40 surnames)
//   signature     a pool that does not carry the language's signature as much as its name space allows
//   batch         the reference run of the spec: 250 place names and 250 persons per language over one registry
//   relatedness   a regular word of a daughter language that its family's sound laws do not give
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NameRegistry, buildContext, carriesSignature, checkName, createNameGenerator, keyOf, loadNamingData, neutralBlend, nonWindows1252 } from '../lib/language_generator.mjs';
import { applyLaws, parseLaws } from '../lib/sound_laws.mjs';

export const POOL_FLOORS = Object.freeze({ male: 20, female: 20, surnames: 40 });
const SIGNATURE_BATCH_MIN = 0.55;
const RELATED_LANGUAGE_MIN = 0.85, RELATED_TOTAL_MIN = 0.97;

// ------------------------------------------------------------------------------------------------ file parsing
const tokens = body => (body.match(/"[^"]*"|\S+/g) ?? []).map(t => t.replace(/^"|"$/g, ''));
// The format of zin_names.txt: `<tag> = { male = { names = { ... } } female = { ... } surnames = { ... } callsigns = { ... } }`.
export function parseNamesFile(text) {
  const blocks = new Map();
  for (const m of text.matchAll(/^(\S+) = \{\n([\s\S]*?)\n\}/gm)) {
    const body = m[2], list = re => tokens(re.exec(body)?.[1] ?? '');
    blocks.set(m[1], {
      male: list(/male = \{\s*names = \{([^}]*)\}/), female: list(/female = \{\s*names = \{([^}]*)\}/),
      surnames: list(/surnames = \{([^}]*)\}/), callsigns: list(/callsigns = \{([^}]*)\}/),
    });
  }
  return blocks;
}

const KIND_OF = { male: 'given', female: 'given', surnames: 'house', callsigns: 'given' };
const strip = name => name.replace(/^of /, '');
const sample = (list, n = 5) => list.slice(0, n).join(', ');

// --------------------------------------------------------------------------------------------- staged names
// `tagLanguage`: Map tag -> language id, or null for a blend pool (`blend` lists its languages).
export function checkStagedNames({ text, data, ctx = buildContext(data), tagLanguage, blend = [], generator = createNameGenerator(data, { context: ctx }) }) {
  generator.nameSpace(generator.order[0]); // the name spaces claim their words first, so the registry knows every owner
  const violations = [], add = (code, detail) => violations.push({ code, detail });
  const blocks = parseNamesFile(text);
  for (const ch of new Set(nonWindows1252(text.replace(/[\t\r\n]/g, ' ')))) add('font', `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')} (${ch}) is not in Windows-1252`);
  for (const tag of tagLanguage.keys()) if (!blocks.has(tag)) add('missing', `no names block for ${tag}`);
  const registry = new NameRegistry({ nearDistance: ctx.generator.uniqueness?.near_duplicate?.within_language_edit_distance ?? 1 });
  for (const [, entry] of ctx.reserved) registry.reserve(entry.name);
  const holders = new Map(); // key -> Map(language -> [tags])
  const languageOrder = [...new Set([...tagLanguage.values()].filter(Boolean))].sort();
  const ownerOfKey = new Map();
  const stats = new Map();
  const stat = id => stats.get(id) ?? stats.set(id, { countries: 0, male: new Set(), female: new Set(), surnames: new Set(), callsigns: new Set(), entries: 0 }).get(id);

  const perLanguage = new Map(languageOrder.map(l => [l, []]));
  for (const [tag, language] of tagLanguage) if (language && blocks.has(tag)) perLanguage.get(language).push(tag);
  for (const language of languageOrder) {
    for (const tag of perLanguage.get(language)) {
      const block = blocks.get(tag), s = stat(language); s.countries++;
      for (const part of ['male', 'female', 'surnames', 'callsigns']) {
        const list = block[part];
        if (POOL_FLOORS[part] && list.length < POOL_FLOORS[part]) add('pool-size', `${tag} ${part}: ${list.length} names, floor ${POOL_FLOORS[part]}`);
        if (new Set(list).size !== list.length) add('pool-size', `${tag} ${part}: a name is listed twice`);
        for (const name of list) {
          s.entries++; s[part].add(name);
          const key = keyOf(strip(name));
          const problems = checkName(ctx, language, name, { kind: KIND_OF[part] });
          for (const p of problems) add(['banned', 'font', 'reserved'].includes(p.code) ? p.code : 'form', `${tag} (${language}) ${part} "${name}": ${p.code} ${p.detail}`);
          const verdict = registry.claim(strip(name), { language, unique: false, kind: part });
          if (!verdict.ok && verdict.reason !== 'reserved') add(verdict.reason.startsWith('near') ? 'near' : 'leak', `${tag} (${language}) ${part} "${name}" clashes with "${verdict.other}"${verdict.owner ? ` of ${verdict.owner}` : ''}`);
          if (!holders.has(key)) holders.set(key, new Map());
          const byLanguage = holders.get(key);
          if (!byLanguage.has(language)) byLanguage.set(language, []);
          byLanguage.get(language).push(tag);
          ownerOfKey.set(key, language);
        }
      }
    }
  }
  for (const [key, byLanguage] of holders) if (byLanguage.size > 1) add('leak', `"${key}" is in the pools of ${[...byLanguage].map(([l, tags]) => `${l} (${sample(tags, 2)})`).join(' and ')}`);

  // Blend pools: every name must belong to one of the declared languages.
  const blendTags = [...tagLanguage].filter(([, l]) => !l).map(([tag]) => tag);
  for (const tag of blendTags) {
    const block = blocks.get(tag); if (!block) continue;
    for (const part of ['male', 'female', 'surnames', 'callsigns']) {
      if (POOL_FLOORS[part] && block[part].length < POOL_FLOORS[part]) add('pool-size', `${tag} ${part}: ${block[part].length} names, floor ${POOL_FLOORS[part]}`);
      for (const name of block[part]) {
        const owner = ownerOfKey.get(keyOf(strip(name))) ?? generator.registry.owner(strip(name))?.language ?? null;
        if (!owner || !blend.includes(owner)) { add('leak', `${tag} (blend of ${blend.join(', ')}) ${part} "${name}" belongs to ${owner ?? 'no language'}`); continue; }
        for (const p of checkName(ctx, owner, name, { kind: KIND_OF[part] })) add(['banned', 'font', 'reserved'].includes(p.code) ? p.code : 'form', `${tag} blend ${part} "${name}": ${p.code} ${p.detail}`);
      }
    }
  }

  // Signature: a pool carries the language's signature as far as its name space allows.
  for (const language of languageOrder) {
    const info = generator.infoOf(language); if (!info.signature.length) continue;
    const space = generator.nameSpace(language);
    for (const tag of perLanguage.get(language)) {
      const block = blocks.get(tag);
      for (const [part, key] of [['male', 'male'], ['female', 'female']]) {
        const n = block[part].length, tier1 = space[key].tier1, available = tier1.filter(x => carriesSignature(info.signature, x)).length;
        const have = block[part].filter(x => carriesSignature(info.signature, x)).length, expected = Math.min(available, Math.ceil(n * 0.62));
        if (have < Math.floor(expected * 0.85)) add('signature', `${tag} (${language}) ${part}: ${have} of ${n} carry a signature, its name space allows ${expected}`);
      }
    }
  }
  return { violations, stats, blocks, ownerOfKey };
}

// -------------------------------------------------------------------------------------------- reference batches
// Spec section 4, "Reference run": 250 place names and 250 personal names per language over one registry, no
// duplicate and no failure; section 6: the names of a language carry its signature. Kinds with a signature the
// dictionary cannot produce (the generator's quota gave up on them) do not count toward the share; they are listed.
const BATCH_KINDS = ['settlement', 'region', 'river', 'lake', 'mountain', 'sea', 'forest', 'strait', 'state', 'city'];
export function checkLanguageBatches(data, { places = 250, persons = 250, ctx = buildContext(data), generator = createNameGenerator(data, { context: ctx }) } = {}) {
  const violations = [], report = {};
  const seen = new Set();
  for (const language of generator.languages()) {
    const info = generator.infoOf(language), row = { places: 0, persons: 0, failures: 0, duplicates: 0, signatureShare: null, infeasibleKinds: [] };
    const carried = new Map(BATCH_KINDS.map(k => [k, { n: 0, carry: 0 }]));
    for (let i = 0; i < places; i++) {
      const kind = BATCH_KINDS[i % BATCH_KINDS.length];
      let name;
      try { name = generator.place({ language, kind, entityId: `batch:${language}:${i}` }); } catch (error) { row.failures++; violations.push({ code: 'batch', detail: `${language} ${kind} ${i}: ${error.message}` }); continue; }
      row.places++;
      if (seen.has(name.key)) { row.duplicates++; violations.push({ code: 'batch', detail: `duplicate ${name.text} (${language})` }); }
      seen.add(name.key);
      for (const p of checkName(ctx, language, name.text, { kind: 'place' })) violations.push({ code: p.code === 'banned' ? 'banned' : 'batch', detail: `${language} ${name.text}: ${p.code} ${p.detail}` });
      const c = carried.get(kind); c.n++; if (info.signature.length && carriesSignature(info.signature, name.text)) c.carry++;
    }
    for (let i = 0; i < persons; i++) {
      let person;
      try { person = generator.person({ language, sex: i % 2 ? 'f' : 'm', entityId: `batch:${language}:${i}`, epithet: i % 4 === 0 }); } catch (error) { row.failures++; violations.push({ code: 'batch', detail: `${language} person ${i}: ${error.message}` }); continue; }
      row.persons++;
      if (seen.has(`p:${person.key}`)) { row.duplicates++; violations.push({ code: 'batch', detail: `duplicate person ${person.text} (${language})` }); }
      seen.add(`p:${person.key}`);
    }
    // Kinds the quota gave up on (the dictionary cannot carry the signature there) are listed, not counted.
    let carry = 0, counted = 0;
    for (const [kind, c] of carried) { if (!info.signature.length) break; if (generator.signatureQuota(language, kind).infeasible) row.infeasibleKinds.push(kind); else { counted += c.n; carry += c.carry; } }
    row.signatureShare = counted ? Math.round((carry / counted) * 1000) / 1000 : null;
    if (counted >= 20 && row.signatureShare < SIGNATURE_BATCH_MIN) violations.push({ code: 'signature', detail: `${language}: ${(row.signatureShare * 100).toFixed(0)}% of ${counted} place names carry a signature, minimum ${SIGNATURE_BATCH_MIN * 100}%` });
    report[language] = row;
  }
  return { violations, report };
}

// ---------------------------------------------------------------------------------------------- relatedness
// A regular word of a daughter language is its family's proto-form after the language's ordered sound laws. Irregular
// and extra words are exempt by the data's own marking. Words the laws do not give are listed, not hidden.
export function checkRelatedness(data) {
  const violations = [], report = {}, exceptions = [];
  let total = 0, matched = 0;
  for (const lang of Object.values(data.languages.languages)) {
    const family = data.languages.families[lang.family];
    if (!family?.proto || lang.id === family.proto_language || !lang.sound_laws) continue;
    const nuclei = [...(lang.sound.diphthongs ?? '').split(' '), ...lang.sound.vowels.split(' ')].filter(x => x.length > 1);
    const parsed = parseLaws(lang.sound_laws, { nuclei });
    for (const u of parsed.unknown) violations.push({ code: 'relatedness', detail: `${lang.id}: sound law not understood: ${u}` });
    let t = 0, g = 0;
    for (const [key, el] of Object.entries(lang.elements)) {
      if (el.origin !== 'regular') continue;
      const proto = family.proto[key];
      if (!proto) { violations.push({ code: 'relatedness', detail: `${lang.id}: regular word "${key}" has no proto-form in ${lang.family}` }); continue; }
      t++;
      const got = applyLaws(proto, parsed);
      if (got === el.form) g++; else exceptions.push({ language: lang.id, word: key, proto, expected: el.form, got });
    }
    total += t; matched += g;
    report[lang.id] = { family: lang.family, regular: t, matched: g, rate: t ? Math.round((g / t) * 1000) / 1000 : 1 };
    if (t && g / t < RELATED_LANGUAGE_MIN) violations.push({ code: 'relatedness', detail: `${lang.id}: only ${g} of ${t} regular words follow the declared sound laws` });
  }
  if (total && matched / total < RELATED_TOTAL_MIN) violations.push({ code: 'relatedness', detail: `${matched} of ${total} regular words follow the declared sound laws` });
  return { violations, report, exceptions, total, matched };
}

// ------------------------------------------------------------------------------------------------ the sample names
// Every sample name of languages.json against the rules the generator enforces, and against its own recipe.
export function checkSamples(data, ctx = buildContext(data)) {
  const rows = [];
  for (const [id, info] of ctx.languages) for (const [bucket, kind] of [['places', 'place'], ['persons', 'full']]) for (const sample of info.data.samples[bucket]) {
    // Established names are exempt from the reserved check (a sample can be a vault name by chance).
    const problems = checkName(ctx, id, sample.name, { kind }).filter(p => p.code !== 'reserved');
    rows.push({ language: id, name: sample.name, kind: bucket, problems: problems.map(p => `${p.code}: ${p.detail}`) });
  }
  return rows;
}

// --------------------------------------------------------------------------------------------------- the report
export function assertNoViolations(violations, title = 'name checks') {
  if (!violations.length) return;
  const byCode = new Map();
  for (const v of violations) byCode.set(v.code, [...(byCode.get(v.code) ?? []), v.detail]);
  const lines = [...byCode].map(([code, list]) => `  ${code} (${list.length}): ${list.slice(0, 6).join(' | ')}${list.length > 6 ? ' ...' : ''}`);
  throw new Error(`${title} failed with ${violations.length} violation${violations.length === 1 ? '' : 's'}:\n${lines.join('\n')}`);
}

// ------------------------------------------------------------------------------------------------------- CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const data = loadNamingData(), ctx = buildContext(data), violations = [];
  const batches = checkLanguageBatches(data, { ctx }), related = checkRelatedness(data), samples = checkSamples(data, ctx);
  violations.push(...batches.violations, ...related.violations);
  const staged = process.argv[2];
  if (staged) {
    const text = await readFile(path.join(staged, 'common/names/zin_names.txt'), 'utf8');
    const tagLanguage = new Map(data.countryCultures.countries.map(c => [c.tag, c.language ?? null]));
    tagLanguage.set('default', null);
    const generator = createNameGenerator(data, { context: ctx });
    const result = checkStagedNames({ text, data, ctx, tagLanguage, blend: neutralBlend(data).map(b => b.language), generator });
    violations.push(...result.violations);
  }
  console.log(JSON.stringify({ samplesInvalid: samples.filter(s => s.problems.length).map(s => `${s.language} ${s.name} ${s.problems.join('; ')}`), relatedness: related.report, batches: batches.report, violations: violations.length }, null, 1));
  if (violations.length) { assertNoViolations(violations); }
}
