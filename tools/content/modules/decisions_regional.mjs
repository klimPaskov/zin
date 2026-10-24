// Regional decisions (docs/specs/05_focus_trees/regional/west_lands.md, Buldor's "The Company Books"). The focus compiler
// writes no decisions, so the decisions that a regional tree spec asks for are data in data/decisions_regional.json and
// are compiled here to common/decisions/categories/zin_<group>.txt, common/decisions/zin_<group>.txt and
// localisation/english/zin_decisions_regional_l_english.yml. Deterministic: the output is a pure function of the data and
// the roster. A fragment of the data is Clausewitz script; this module indents it and checks that its braces balance.
//
//   const out = await buildDecisionsRegional(staged, { countries, known });   // build.mjs, any time before the text scan
//
// ctx.countries: roster rows { name, tag } (default data/countries.json); ctx.known: optional Set of the scripted effect
// and trigger ids the fragments may name (the tree files' declarations); a zin_regional_ name outside it fails the build.
import { readFile } from 'node:fs/promises';
import { isCp1252 } from '../checks/focus_checks.mjs';

export const DATA_FILE = new URL('../data/decisions_regional.json', import.meta.url);
const ID = /^zin_regional_[a-z0-9_]+$/;
const GROUP = /^regional_[a-z0-9_]+$/;
const SPRITE = /^GFX_[A-Za-z0-9_]+$/;
const TEXT_FIELDS = ['name', 'desc'];

async function loadRoster() { return JSON.parse(await readFile(new URL('../data/countries.json', import.meta.url), 'utf8')).countries; }

// Brace balance of a fragment, ignoring text inside quotes and after a comment mark.
function balanced(fragment) {
  let depth = 0, quoted = false;
  for (const line of String(fragment).split('\n')) {
    for (const ch of line) {
      if (ch === '"') quoted = !quoted;
      else if (!quoted && ch === '#') break;
      else if (!quoted && ch === '{') depth++;
      else if (!quoted && ch === '}') { depth--; if (depth < 0) return false; }
    }
  }
  return depth === 0 && !quoted;
}

// Returns the problems of the data as { code, message } objects; nothing is written.
export function validateDecisionData(data, { countries, known = null, banned = null } = {}) {
  const out = [], add = (code, message) => out.push({ code, message });
  if (!data || data.schema !== 1 || !Array.isArray(data.groups)) { add('schema', 'the data needs schema 1 and a groups list'); return out; }
  const names = new Set(countries.map(c => c.name)), ids = new Set();
  const text = (where, v) => {
    if (typeof v !== 'string' || !v.trim()) return add('text_empty', `${where} is empty`);
    if (!isCp1252(v)) add('text_charset', `${where} holds a character outside Windows-1252`);
    for (const hit of banned?.(v) ?? []) add('banned_word', `${where} uses the banned word "${hit}"`);
  };
  const fragments = (where, list, { required = false } = {}) => {
    if (list === undefined) { if (required) add('fragment_missing', `${where} is required`); return; }
    if (!Array.isArray(list) || !list.length || list.some(f => typeof f !== 'string' || !f.trim())) return add('fragment_shape', `${where} must be a non-empty list of script fragments`);
    for (const f of list) {
      if (!balanced(f)) add('fragment_braces', `${where} has unbalanced braces: ${JSON.stringify(f.slice(0, 60))}`);
      // A scripted effect or trigger is called as `name = yes`; flags, variables and ideas are not checked here.
      if (known) for (const [, name] of f.matchAll(/\b(zin_regional_[a-z0-9_]+)\s*=\s*yes\b/g)) {
        if (!known.has(name)) add('unresolved', `${where} calls ${name}, which no tree declares`);
      }
    }
  };
  for (const [gi, g] of data.groups.entries()) {
    const gw = `groups[${gi}]`;
    if (!GROUP.test(g.id ?? '')) add('group_id', `${gw}.id must look like regional_<name>`);
    if (!names.has(g.country)) add('country_unknown', `${gw}.country ${JSON.stringify(g.country)} is not a country of the roster`);
    const cats = new Set();
    for (const c of g.categories ?? []) {
      const w = `${gw} category ${c.id}`;
      if (!ID.test(c.id ?? '')) { add('id_shape', `${w}: the id must start with zin_regional_`); continue; }
      if (ids.has(c.id)) add('id_duplicate', `${w}: the id is used twice`);
      ids.add(c.id); cats.add(c.id);
      if (!SPRITE.test(c.icon ?? '')) add('icon_shape', `${w}: icon must be a sprite name`);
      TEXT_FIELDS.forEach(f => text(`${w}.${f}`, c[f]));
      fragments(`${w}.visible`, c.visible);
    }
    if (!cats.size) add('category_missing', `${gw} has no category`);
    for (const d of g.decisions ?? []) {
      const w = `${gw} decision ${d.id}`;
      if (!ID.test(d.id ?? '')) { add('id_shape', `${w}: the id must start with zin_regional_`); continue; }
      if (ids.has(d.id)) add('id_duplicate', `${w}: the id is used twice`);
      ids.add(d.id);
      if (!cats.has(d.category)) add('category_unknown', `${w}: category ${JSON.stringify(d.category)} is not declared in the group`);
      if (!SPRITE.test(d.icon ?? '')) add('icon_shape', `${w}: icon must be a sprite name`);
      TEXT_FIELDS.forEach(f => text(`${w}.${f}`, d[f]));
      if (!Number.isInteger(d.cost) || d.cost < 0) add('cost', `${w}: cost must be a whole number from 0`);
      fragments(`${w}.complete_effect`, d.complete_effect, { required: true });
      fragments(`${w}.ai_will_do`, d.ai_will_do, { required: true });
      for (const k of ['available', 'visible', 'target_trigger', 'target_root_trigger']) fragments(`${w}.${k}`, d[k]);
      if (d.target_array !== undefined && !/^(global\.)?[a-z_]+$/.test(d.target_array)) add('target_array', `${w}: target_array ${JSON.stringify(d.target_array)} is not an array name`);
      if (d.target_trigger && d.target_array === undefined) add('target_array', `${w}: target_trigger needs a target_array`);
    }
  }
  return out;
}

const block = (head, lines) => [`${head} = {`, ...lines.map(l => `\t${l}`), '}'];
const indent = fragment => String(fragment).replace(/\r\n?/g, '\n').split('\n').map(l => l.replace(/\s+$/, ''));
const frag = (head, list) => block(head, list.flatMap(indent));

export async function buildDecisionsRegional(staged, ctx = {}) {
  const data = JSON.parse(await readFile(DATA_FILE, 'utf8'));
  const countries = ctx.countries ?? await loadRoster();
  const problems = validateDecisionData(data, { countries, known: ctx.known ?? null, banned: ctx.banned ?? null });
  if (problems.length) throw new Error(`The regional decisions data has problems (${problems.length}):\n${problems.slice(0, 40).map(p => `${p.code}: ${p.message}`).join('\n')}`);
  const tags = new Map(countries.map(c => [c.name, c.tag]));
  const loc = {}, counts = { groups: 0, categories: 0, decisions: 0, files: 0 };
  for (const g of data.groups) {
    const head = `# Generated by the ZIN content builder (modules/decisions_regional.mjs) from data/decisions_regional.json. Do not edit.`;
    const tag = tags.get(g.country);
    const cats = g.categories.map(c => {
      loc[c.id] = c.name; loc[`${c.id}_desc`] = c.desc;
      return block(c.id, [...block('allowed', [`original_tag = ${tag}`]), ...(c.visible ? frag('visible', c.visible) : []), `icon = ${c.icon}`, `priority = ${c.priority ?? 1}`, 'visible_when_empty = yes']);
    });
    staged.text(`common/decisions/categories/zin_${g.id}.txt`, [head, ...cats.flat()].join('\n'));
    const decisions = g.categories.map(c => {
      const inner = g.decisions.filter(d => d.category === c.id).map(d => {
        loc[d.id] = d.name; loc[`${d.id}_desc`] = d.desc;
        const L = [`icon = ${d.icon}`];
        if (d.target_array) L.push(`target_array = ${d.target_array}`);
        if (d.target_root_trigger) L.push(...frag('target_root_trigger', d.target_root_trigger));
        if (d.target_trigger) L.push(...frag('target_trigger', d.target_trigger));
        if (d.visible) L.push(...frag('visible', d.visible));
        if (d.available) L.push(...frag('available', d.available));
        L.push(`cost = ${d.cost}`, ...frag('complete_effect', d.complete_effect), ...frag('ai_will_do', d.ai_will_do));
        counts.decisions++;
        return block(d.id, L);
      });
      return block(c.id, inner.flat());
    });
    staged.text(`common/decisions/zin_${g.id}.txt`, [head, ...decisions.flat()].join('\n'));
    counts.groups++; counts.categories += g.categories.length; counts.files += 2;
  }
  staged.loc('zin_decisions_regional', loc);
  counts.files++;
  return counts;
}
