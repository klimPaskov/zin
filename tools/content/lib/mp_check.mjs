// Offline checks of the power mechanics' script (docs/design/stage2/mech_powers.md): every key of an effect, trigger or event block must
// be an engine command (installed documentation), a scripted effect or trigger defined in the staged files, a name the module
// declares external, or a scope. The walk knows which blocks are containers (their children are commands again) and which are
// parameter blocks (their children are keys of that command and are not checked here).
import { readFile } from 'node:fs/promises';
import { GAME } from './paths.mjs';
import { parse } from './clausewitz.mjs';

let docs;
export async function engineVocabulary() {
  docs ??= (async () => {
    const names = async f => new Set([...(await readFile(`${GAME}/documentation/${f}`, 'utf8')).matchAll(/^## ([A-Za-z0-9_@.]+)\s*$/gm)].map(m => m[1]));
    const [effects, triggers] = await Promise.all([names('effects_documentation.md'), names('triggers_documentation.md')]);
    return { effects, triggers };
  })();
  return docs;
}

// Blocks whose children are commands (effects or triggers) again.
const CONTAINER = new Set(['if', 'else_if', 'else', 'limit', 'OR', 'AND', 'NOT', 'hidden_effect', 'random', 'while_loop_effect', 'custom_override_tooltip', 'for_each_loop', 'for_each_scope_loop', 'trigger', 'immediate', 'complete_effect', 'remove_effect', 'timeout_effect', 'option', 'available', 'visible', 'allowed', 'target_trigger', 'target_root_trigger', 'custom_cost_trigger', 'cancel_trigger', 'on_add', 'on_remove', 'effect', 'enable', 'abort', 'activation', 'allowed_civil_war']);
// Engine commands whose children are parameters, not commands.
const PARAMS = new Set(['set_variable', 'add_to_variable', 'subtract_from_variable', 'multiply_variable', 'divide_variable', 'set_temp_variable', 'add_to_temp_variable', 'subtract_from_temp_variable', 'multiply_temp_variable', 'divide_temp_variable', 'check_variable', 'clamp_variable', 'clamp_temp_variable', 'modulo_variable', 'round_variable', 'round_temp_variable', 'set_variable_to_random', 'set_temp_variable_to_random', 'has_variable', 'add_to_array', 'remove_from_array', 'is_in_array',
  'has_global_flag', 'has_country_flag', 'set_global_flag', 'set_country_flag', 'modify_global_flag', 'modify_country_flag', 'clr_global_flag', 'clr_country_flag', 'add_opinion_modifier', 'reverse_add_opinion_modifier', 'remove_opinion_modifier', 'add_timed_idea', 'swap_ideas', 'add_dynamic_modifier', 'remove_dynamic_modifier',
  'country_event', 'news_event', 'state_event', 'create_wargoal', 'declare_war_on', 'add_to_war', 'add_building_construction', 'damage_building', 'damage_units', 'diplomatic_relation', 'has_opinion', 'create_unit', 'division_template', 'delete_unit', 'add_tech_bonus', 'add_equipment_to_stockpile', 'send_equipment', 'add_country_leader_role', 'remove_country_leader_role', 'add_field_marshal_role', 'remove_unit_leader_role', 'become_exiled_in', 'transfer_state', 'set_autonomy', 'white_peace', 'add_resistance', 'create_faction_from_template', 'has_completed_focus',
  'custom_effect_tooltip', 'custom_trigger_tooltip', 'has_game_rule', 'has_template', 'has_army_size', 'has_navy_size', 'has_equipment', 'num_divisions', 'date', 'has_war_with_wargoal_against', 'has_deployed_air_force_size', 'surrender_progress', 'compare_autonomy_state', 'is_in_faction_with', 'add_ai_strategy', 'remove_ai_strategy', 'has_capitulated', 'add_trait', 'has_idea_with_trait', 'army_manpower_in_state', 'add_state_modifier', 'add_named_threat', 'unit_leader_event', 'add_unit_leader_trait', 'add_command_power', 'add_manpower', 'has_manpower', 'command_power']);
const SCOPEISH = /^(ROOT|FROM|PREV|THIS|OWNER|CONTROLLER|CAPITAL|OCCUPIED|OVERLORD|owner|controller|overlord|capital_scope|faction_leader|[A-Z][A-Z0-9]{2}|event_target:[A-Za-z0-9_]+|var:[A-Za-z0-9_.:]+|global\.[A-Za-z0-9_]+|(ROOT|FROM|PREV)(\.(ROOT|FROM|PREV|OWNER|CONTROLLER))+|[0-9]+)$/;
const LOOP = /^(every|random|any)_[a-z_]+$/;
const SKIP = new Set(['chance', 'name', 'id', 'icon', 'picture', 'title', 'is_triggered_only', 'hidden', 'fire_only_once', 'major', 'timeout_days', 'cost', 'custom_cost_text', 'days_re_enable', 'days_remove', 'ai_hint_pp_cost']);
const AI_PARAMS = new Set(['base', 'factor', 'add', 'days', 'months', 'years']);
const DECISION_BLOCKS = ['allowed', 'visible', 'available', 'target_trigger', 'target_root_trigger', 'custom_cost_trigger', 'cancel_trigger', 'complete_effect', 'remove_effect', 'timeout_effect', 'ai_will_do'];

// files: Map rel -> text. known: Set of extra accepted command names (defined scripted effects and triggers, declared externals).
export async function checkCommands(files, known) {
  const { effects, triggers } = await engineVocabulary();
  const problems = [];
  const accepted = k => CONTAINER.has(k) || PARAMS.has(k) || effects.has(k) || triggers.has(k) || known.has(k) || SCOPEISH.test(k) || LOOP.test(k);
  const walkAi = (entries, where) => {
    if (!Array.isArray(entries)) return;
    for (const e of entries) {
      if (e.k === 'modifier' && Array.isArray(e.v)) walk(e.v.filter(x => !AI_PARAMS.has(x.k)), where);
      else if (e.k && Array.isArray(e.v) && !AI_PARAMS.has(e.k)) walk([e], where);
    }
  };
  function walk(entries, where) {
    for (const e of entries) {
      if (!e.k) { if (Array.isArray(e.v)) walk(e.v, where); continue; }
      const k = e.k;
      if (k === 'ai_chance' || k === 'ai_will_do' || k === 'mean_time_to_happen') { walkAi(e.v, where); continue; }
      if (SKIP.has(k)) continue;
      if (k === 'desc') { for (const d of Array.isArray(e.v) ? e.v : []) if (d.k === 'trigger') walk(d.v, where); continue; }
      if (!accepted(k)) { problems.push(`${where}:${e.line}: unknown command ${k}`); continue; }
      if (!Array.isArray(e.v) || PARAMS.has(k)) continue;
      walk(k === 'while_loop_effect' || k === 'for_each_loop' ? e.v.filter(x => !['break', 'array', 'value', 'index'].includes(x.k)) : e.v, where);
    }
  }
  for (const [rel, text] of files) {
    let tree;
    try { tree = parse(text); } catch (err) { problems.push(`${rel}: parse error ${err.message}`); continue; }
    for (const top of tree) {
      if (!top.k || !Array.isArray(top.v)) continue;
      if (/^(country_event|news_event)$/.test(top.k)) { walk(top.v.filter(x => ['trigger', 'immediate', 'option', 'mean_time_to_happen', 'desc'].includes(x.k)), `${rel}:${top.v.find(x => x.k === 'id')?.v ?? '?'}`); continue; }
      if (/^common\/scripted_(effects|triggers)\//.test(rel)) { walk(top.v, `${rel}:${top.k}`); continue; }
      if (/^common\/decisions\/categories\//.test(rel)) continue;
      if (/^common\/decisions\//.test(rel)) { for (const dec of top.v) if (Array.isArray(dec.v)) walk(dec.v.filter(x => DECISION_BLOCKS.includes(x.k)), `${rel}:${dec.k}`); continue; }
      if (/^common\/on_actions\//.test(rel)) { for (const oa of top.v) for (const part of oa.v ?? []) if (part.k === 'effect' && Array.isArray(part.v)) walk(part.v, `${rel}:${oa.k}`); continue; }
      if (/^common\/ai_strategy\//.test(rel)) { walk(top.v.filter(x => ['allowed', 'enable', 'abort'].includes(x.k)), `${rel}:${top.k}`); continue; }
      if (/^common\/scripted_guis\//.test(rel)) { for (const g of top.v) if (Array.isArray(g.v)) for (const part of g.v) if (['visible', 'effects', 'triggers'].includes(part.k) && Array.isArray(part.v)) walk(part.k === 'visible' ? part.v : part.v.flatMap(x => (Array.isArray(x.v) ? x.v : [])), `${rel}:${g.k}`); }
    }
  }
  return problems;
}
