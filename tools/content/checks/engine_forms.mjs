// Engine-form checks over the staged tree: script forms the game parses but rejects at load or at run time, each taken from a
// group of the first integrated Linux run's error log (docs/plans/zin-errors/r3b_profile.md, fixes in r3b_fixes.md).
//   rule_desc            a game rule carries desc only on its options ("Unexpected token: desc"; vanilla 00_game_rules.txt has none)
//   opinion_var_target   the target field of an opinion-modifier effect takes no var: token ("Malformed token: var:<name>")
//   effect_arguments     a ZIN scripted effect is called with `= yes`; a block of KEY = value arguments is read as effects
//                        ("Invalid effect 'STANCE'", then parser errors through the rest of the file; decision E1: temp variables)
//   convoy_types         one equipment of the convoy archetype ("Multiple convoy types are not supported")
//   recruit_on_actions   no recruit_character in an on_action: the game recruits a character only in history ("recruit_character should
//                        only happen in game/history files")
//   ship_variant         a ship of a modular hull names the variant (version_name) its country history creates ("Could not find proper
//                        equipment variant", "does not have any equipment variant for type")
// The technology names (set_technology, has_tech) are held by the C3 reference scan (checks/vanilla_refs.mjs, category technology).
// Reported, not enforced: recruit_character in other in-game effects and has_opinion_modifier with a block value (queued in r3b_fixes.md).
import path from 'node:path';
import { parse, walk, scriptText } from '../lib/clausewitz.mjs';

const OPINION_EFFECTS = new Set(['add_opinion_modifier', 'reverse_add_opinion_modifier', 'remove_opinion_modifier']);
const isScript = rel => /^(common|events|history)\/.*\.txt$/.test(rel);
const child = (block, key) => Array.isArray(block) ? block.find(x => x.k === key) : undefined;

// files: Map<rel, Buffer> (the staged tree). Returns { errors: [{ rule, rel, line, message }], reported: { rule: [ 'rel:line' ] } }.
export function checkEngineForms(files) {
  const errors = [], reported = { recruit_in_game: [], opinion_check_block: [] };
  const err = (rule, rel, line, message) => errors.push({ rule, rel, line, message });
  const parsed = new Map();
  for (const [rel, bytes] of files) if (isScript(rel)) parsed.set(rel, parse(scriptText(bytes)));

  // ZIN scripted effects, by name (the targets of effect_arguments).
  const effects = new Set();
  for (const [rel, ents] of parsed) if (path.posix.dirname(rel) === 'common/scripted_effects') for (const e of ents) if (e.k && Array.isArray(e.v)) effects.add(e.k);

  // Modular hulls (an archetype with module_slots) and their types; the variants each country history creates.
  const modular = new Set(), archetypeOf = new Map(), created = new Map();
  for (const [rel, ents] of parsed) {
    if (!rel.startsWith('common/units/equipment/') || rel.includes('/modules/') || rel.includes('/upgrades/')) continue;
    for (const top of ents) if (top.k === 'equipments' && Array.isArray(top.v)) for (const eq of top.v) {
      if (!eq.k || !Array.isArray(eq.v)) continue;
      if (child(eq.v, 'module_slots')) modular.add(eq.k);
      const a = child(eq.v, 'archetype')?.v;
      if (typeof a === 'string') archetypeOf.set(eq.k, a);
    }
  }
  const convoys = [...archetypeOf].filter(([, a]) => a === 'convoy').map(([k]) => k);
  if (convoys.length > 1) err('convoy_types', 'common/units/equipment', 0, `${convoys.length} convoy types (${convoys.join(', ')}); the game supports one`);
  const isModular = type => modular.has(type) || modular.has(archetypeOf.get(type));

  for (const [rel, ents] of parsed) {
    const dir = path.posix.dirname(rel);
    if (dir === 'common/game_rules') for (const r of ents) if (r.k && Array.isArray(r.v)) { const d = child(r.v, 'desc'); if (d) err('rule_desc', rel, d.line, `game rule ${r.k} has a rule-level desc`); }
    if (rel.startsWith('history/countries/')) {
      const tag = /^history\/countries\/([A-Z0-9]{3}) - /.exec(rel)?.[1];
      walk(ents, e => {
        if (e.k !== 'create_equipment_variant' || !Array.isArray(e.v)) return;
        const type = child(e.v, 'type')?.v, name = child(e.v, 'name')?.v;
        if (tag && type) (created.get(tag) ?? created.set(tag, new Set()).get(tag)).add(`${type}|${name}`);
      });
    }
    walk(ents, (e, a) => {
      if (OPINION_EFFECTS.has(e.k) && Array.isArray(e.v)) { const t = child(e.v, 'target'); if (typeof t?.v === 'string' && t.v.startsWith('var:')) err('opinion_var_target', rel, t.line, `${e.k} target = ${t.v}: scope to the variable's country and name the caller as PREV`); }
      if (e.k === 'has_opinion_modifier' && Array.isArray(e.v)) reported.opinion_check_block.push(`${rel}:${e.line}`);
      if (e.k && a.length && effects.has(e.k) && Array.isArray(e.v) && e.v.some(x => x.k && /^[A-Z][A-Z0-9_]*$/.test(x.k))) err('effect_arguments', rel, e.line, `${e.k} is called with a block of arguments (${e.v.filter(x => x.k).map(x => x.k).join(', ')}); set zin_arg_* temp variables and call it with = yes`);
      if (e.k === 'recruit_character') {
        if (dir === 'common/on_actions') err('recruit_on_actions', rel, e.line, `recruit_character = ${e.v} in an on_action: recruit it in the country history`);
        else if (!rel.startsWith('history/')) reported.recruit_in_game.push(`${rel}:${e.line}`);
      }
    });
  }
  // Ships of a modular hull: version_name, and the variant in the owner's history.
  for (const [rel, ents] of parsed) {
    if (!rel.startsWith('history/units/')) continue;
    walk(ents, (e, a) => {
      if (e.k !== 'equipment' || a[a.length - 1]?.k !== 'ship' || !Array.isArray(e.v)) return;
      for (const pc of e.v) {
        if (!pc.k || !Array.isArray(pc.v) || !isModular(pc.k)) continue;
        const owner = child(pc.v, 'owner')?.v, version = child(pc.v, 'version_name')?.v;
        if (!version) { err('ship_variant', rel, pc.line, `a ship of the modular hull ${pc.k} names no version_name`); continue; }
        if (!created.get(owner)?.has(`${pc.k}|${version}`)) err('ship_variant', rel, pc.line, `${owner}'s history creates no ${pc.k} variant named "${version}"`);
      }
    });
  }
  return { errors, reported };
}

export function assertEngineForms(result) {
  if (!result.errors.length) return;
  const byRule = new Map();
  for (const e of result.errors) (byRule.get(e.rule) ?? byRule.set(e.rule, []).get(e.rule)).push(e);
  throw new Error(`Engine forms: ${result.errors.length} problems\n  ${[...byRule].map(([r, es]) => `${r} (${es.length}): ${es.slice(0, 5).map(e => `${e.rel}:${e.line} ${e.message}`).join('; ')}`).join('\n  ')}`);
}
