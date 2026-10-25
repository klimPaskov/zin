// Engine-form checks over the staged tree: script forms the game parses but rejects at load or at run time, each taken from a
// group of the first integrated Linux run's error log (docs/plans/zin-errors/r3b_profile.md, fixes in r3b_fixes.md and
// powder_and_pass2_handoff.md).
//   rule_desc              a game rule carries desc only on its options ("Unexpected token: desc"; vanilla 00_game_rules.txt has none)
//   opinion_var_target     the target field of an opinion-modifier effect takes no var: token ("Malformed token: var:<name>")
//   effect_arguments       a ZIN scripted effect is called with `= yes`; a block of KEY = value arguments is read as effects
//                          ("Invalid effect 'STANCE'", then parser errors through the rest of the file; decision E1: temp variables)
//   convoy_types           one equipment of the convoy archetype ("Multiple convoy types are not supported")
//   recruit_on_actions     no recruit_character in an on_action: the game recruits a character only in history ("recruit_character should
//                          only happen in game/history files")
//   opinion_check_block    has_opinion_modifier takes a modifier name only ("Invalid trigger 'target'"); test the targeted flag that
//                          is set beside the modifier instead
//   recruit_in_game        no recruit_character anywhere outside history/ (the same log line): modules/late_characters.mjs makes every
//                          call during play a set_nationality move of a character recruited in its home realm's history
//   ship_variant           a ship of a modular hull names the variant (version_name) its country history creates ("Could not find proper
//                          equipment variant", "does not have any equipment variant for type")
//   decision_state_trigger a decision makes itself state-targeted with state_target ("Unexpected token: state_trigger"; vanilla writes
//                          state_target, the installed decisions _documentation.md misnames it)
//   trait_slot             a leader trait carries no slot ("Unknown modifier: slot"); the slot belongs to the character's advisor role
//   iterator_as_effect     an any_* iterator is a trigger and cannot run as an effect ("Invalid effect 'any_country'"); every_* or
//                          random_* with a limit is the effect
//   random_list_trigger    a random_list option takes no trigger block ("Invalid effect 'trigger'"); vanilla rules an option out with
//                          modifier = { factor = 0 ... }
//   market_strategy_id     the id of an equipment_market_* AI strategy is an equipment category of script_enum_equipment_category
//                          ("Malformed token: zin_mounts_equipment"; vanilla writes infantry, support, train)
//   tech_gridbox           a technology placed in a folder with no path parent has a gridbox <technology>_tree in that folder's window of
//                          interface/countrytechtreeview.gui ("Found no grid box for tech"; lib/tech_tree_gui.mjs writes the windows)
//   bonus_enum             script_enum_equipment_bonus_type lists exactly the equipment categories and the staged equipment keys and
//                          hull aliases ("... is in script enum ... but is not an equipment type", "... is not in script enum ...")
// Reported, not enforced: strategy_state_trigger (state_trigger on an AI strategy type the
// installed documentation does not give it; owned by the story AI slice).
// The technology names (set_technology, has_tech) are held by the C3 reference scan (checks/vanilla_refs.mjs, category technology).
import path from 'node:path';
import { parse, walk, scriptText } from '../lib/clausewitz.mjs';
import { folderGridboxes } from '../lib/tech_tree_gui.mjs';

const OPINION_EFFECTS = new Set(['add_opinion_modifier', 'reverse_add_opinion_modifier', 'remove_opinion_modifier']);
const isScript = rel => /^(common|events|history)\/.*\.txt$/.test(rel);
const child = (block, key) => Array.isArray(block) ? block.find(x => x.k === key) : undefined;
// The blocks whose body runs as effects, and the blocks whose body is read as triggers (the nearest one decides).
const EFFECT_BLOCKS = new Set(['complete_effect', 'remove_effect', 'timeout_effect', 'cancel_effect', 'immediate', 'option', 'completion_reward', 'select_effect', 'on_add', 'on_remove', 'effect', 'hidden_effect', 'effect_tooltip', 'on_complete', 'on_cancel', 'on_activate', 'on_deactivate', 'after']);
const TRIGGER_BLOCKS = new Set(['limit', 'trigger', 'available', 'visible', 'allowed', 'modifier', 'ai_will_do', 'ai_chance', 'NOT', 'OR', 'AND', 'NOR', 'NAND', 'custom_trigger_tooltip', 'hidden_trigger', 'enable', 'abort', 'bypass', 'cancel_trigger', 'cancel', 'target_trigger', 'target_root_trigger', 'count_triggers', 'is_valid', 'can_be_produced', 'can_be_lend_leased', 'potential', 'allowed_civil_war', 'activation', 'remove_trigger', 'mean_time_to_happen', 'available_if_capitulated', 'take_states', 'state_trigger', 'country_trigger', 'meta_trigger']);
// AI strategy types that read a state_trigger (installed common/ai_strategy/_documentation.md).
const STATE_TRIGGER_STRATEGIES = new Set(['front_unit_request', 'front_control', 'force_concentration_front_factor', 'force_concentration_target_weight']);

// The identifiers of a top-level block of a script_enums text (one identifier per line).
export function enumIdentifiers(text, key) {
  const m = new RegExp(`^${key}\\s*=\\s*\\{`, 'm').exec(text);
  if (!m) return null;
  let depth = 0, i = m.index + m[0].length - 1;
  for (; i < text.length; i++) { const c = text[i]; if (c === '#') { while (i < text.length && text[i] !== '\n') i++; continue; } if (c === '{') depth++; else if (c === '}' && --depth === 0) break; }
  return text.slice(m.index + m[0].length, i).split('\n').map(l => l.replace(/#.*/, '').trim()).filter(l => /^[A-Za-z0-9_]+$/.test(l));
}

// Is the entry at the end of `ancestors` in effect context? The nearest effect or trigger block decides; a scripted effect's body is an
// effect, a scripted trigger's a trigger.
function context(rel, ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const k = ancestors[i].k;
    if (TRIGGER_BLOCKS.has(k)) return 'trigger';
    if (EFFECT_BLOCKS.has(k)) return 'effect';
  }
  const dir = path.posix.dirname(rel);
  if (dir === 'common/scripted_effects') return 'effect';
  return null;
}

// files: Map<rel, Buffer> (the staged tree). Returns { errors: [{ rule, rel, line, message }], reported: { rule: [ 'rel:line' ] } }.
export function checkEngineForms(files) {
  const errors = [], reported = { strategy_state_trigger: [] };
  const err = (rule, rel, line, message) => errors.push({ rule, rel, line, message });
  const parsed = new Map();
  for (const [rel, bytes] of files) if (isScript(rel)) parsed.set(rel, parse(scriptText(bytes)));

  // ZIN scripted effects, by name (the targets of effect_arguments).
  const effects = new Set();
  for (const [rel, ents] of parsed) if (path.posix.dirname(rel) === 'common/scripted_effects') for (const e of ents) if (e.k && Array.isArray(e.v)) effects.add(e.k);

  // Modular hulls (an archetype with module_slots) and their types; the variants each country history creates; every equipment key and
  // hull alias (the bonus enum).
  const modular = new Set(), archetypeOf = new Map(), created = new Map(), equipmentKeys = new Set(), aliases = new Set();
  for (const [rel, ents] of parsed) {
    if (!rel.startsWith('common/units/equipment/') || rel.includes('/modules/') || rel.includes('/upgrades/')) continue;
    for (const top of ents) if (top.k === 'equipments' && Array.isArray(top.v)) for (const eq of top.v) {
      if (!eq.k || !Array.isArray(eq.v)) continue;
      equipmentKeys.add(eq.k);
      if (child(eq.v, 'module_slots')) modular.add(eq.k);
      const a = child(eq.v, 'archetype')?.v;
      if (typeof a === 'string') archetypeOf.set(eq.k, a);
      const al = child(eq.v, 'alias')?.v;
      if (typeof al === 'string') aliases.add(al);
    }
  }
  const convoys = [...archetypeOf].filter(([, a]) => a === 'convoy').map(([k]) => k);
  if (convoys.length > 1) err('convoy_types', 'common/units/equipment', 0, `${convoys.length} convoy types (${convoys.join(', ')}); the game supports one`);
  const isModular = type => modular.has(type) || modular.has(archetypeOf.get(type));

  // The equipment categories and the bonus enum of the staged script_enums.txt.
  const enumsBytes = files.get('common/script_enums.txt');
  const enumsText = enumsBytes ? scriptText(enumsBytes) : null;
  const categories = enumsText ? new Set(enumIdentifiers(enumsText, 'script_enum_equipment_category') ?? []) : null;
  if (enumsText && equipmentKeys.size) {
    const listed = new Set(enumIdentifiers(enumsText, 'script_enum_equipment_bonus_type') ?? []);
    const want = new Set([...categories, ...equipmentKeys, ...aliases]);
    const extra = [...listed].filter(k => !want.has(k)), missing = [...want].filter(k => !listed.has(k));
    if (extra.length) err('bonus_enum', 'common/script_enums.txt', 0, `${extra.length} entries of script_enum_equipment_bonus_type are neither a category nor a staged equipment (${extra.slice(0, 6).join(', ')})`);
    if (missing.length) err('bonus_enum', 'common/script_enums.txt', 0, `${missing.length} staged equipment keys or aliases are missing from script_enum_equipment_bonus_type (${missing.slice(0, 6).join(', ')})`);
  }

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
      if (e.k === 'has_opinion_modifier' && Array.isArray(e.v)) err('opinion_check_block', rel, e.line, 'has_opinion_modifier takes a modifier name only; test the targeted flag set beside the modifier');
      if (e.k && a.length && effects.has(e.k) && Array.isArray(e.v) && e.v.some(x => x.k && /^[A-Z][A-Z0-9_]*$/.test(x.k))) err('effect_arguments', rel, e.line, `${e.k} is called with a block of arguments (${e.v.filter(x => x.k).map(x => x.k).join(', ')}); set zin_arg_* temp variables and call it with = yes`);
      if (e.k === 'recruit_character') {
        if (dir === 'common/on_actions') err('recruit_on_actions', rel, e.line, `recruit_character = ${e.v} in an on_action: recruit it in the country history`);
        else if (!rel.startsWith('history/')) err('recruit_in_game', rel, e.line, `recruit_character = ${e.v} during play: recruit it in a history and move it with set_nationality (modules/late_characters.mjs)`);
      }
      if (e.k === 'state_trigger' && rel.startsWith('common/decisions/') && a.length === 2) err('decision_state_trigger', rel, e.line, `decision ${a[1].k} writes state_trigger; the key is state_target`);
      if (e.k === 'state_trigger' && rel.startsWith('common/ai_strategy/') && a.at(-1)?.k === 'ai_strategy' && !STATE_TRIGGER_STRATEGIES.has(child(a.at(-1).v, 'type')?.v)) reported.strategy_state_trigger.push(`${rel}:${e.line}`);
      if (e.k === 'slot' && rel.startsWith('common/country_leader/') && a.length === 2) err('trait_slot', rel, e.line, `leader trait ${a[1].k} carries slot = ${e.v}`);
      if (e.k && /^any_[a-z_]+$/.test(e.k) && Array.isArray(e.v) && context(rel, a) === 'effect') err('iterator_as_effect', rel, e.line, `${e.k} runs as an effect; use every_${e.k.slice(4)} or random_${e.k.slice(4)} with a limit`);
      if (e.k === 'trigger' && a.length > 1 && a.at(-2).k === 'random_list' && a.at(-1).k !== 'random_list') err('random_list_trigger', rel, e.line, 'a random_list option has a trigger block; rule it out with modifier = { factor = 0 ... }');
      if (categories && e.k === 'ai_strategy' && Array.isArray(e.v) && /^equipment_market_/.test(child(e.v, 'type')?.v ?? '')) {
        const id = child(e.v, 'id')?.v;
        if (typeof id === 'string' && !categories.has(id)) err('market_strategy_id', rel, e.line, `${child(e.v, 'type').v} names ${id}, which is not an equipment category`);
      }
    });
  }
  // Technology roots (placed in a folder, no path parent) and the gridboxes of the tree window.
  const placed = new Map(), children = new Set();
  for (const [rel, ents] of parsed) {
    if (!rel.startsWith('common/technologies/')) continue;
    for (const top of ents) if (top.k === 'technologies' && Array.isArray(top.v)) for (const te of top.v) {
      if (!te.k || !Array.isArray(te.v)) continue;
      for (const f of te.v.filter(x => x.k === 'folder' && Array.isArray(x.v))) { const n = child(f.v, 'name')?.v; if (n) (placed.get(te.k) ?? placed.set(te.k, []).get(te.k)).push({ folder: n, rel, line: te.line }); }
      for (const pth of te.v.filter(x => x.k === 'path' && Array.isArray(x.v))) { const to = child(pth.v, 'leads_to_tech')?.v; if (to && child(pth.v, 'ignore_for_layout')?.v !== 'yes') children.add(to); }
    }
  }
  if (placed.size) {
    const gui = files.get('interface/countrytechtreeview.gui');
    const boxes = gui ? folderGridboxes(scriptText(gui)) : new Map();
    for (const [tech, fs] of placed) {
      if (children.has(tech)) continue;
      for (const f of fs) if (!boxes.get(f.folder)?.has(`${tech}_tree`)) err('tech_gridbox', f.rel, f.line, `${tech} is a root of ${f.folder} with no gridbox ${tech}_tree in interface/countrytechtreeview.gui`);
    }
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
