// Institutions, intrigue group (spec 03_gameplay/08_institutions.md sections 6 to 8): Seals and Codes (the 21 agency
// upgrades), the Courts of Whispers (agencies), Court Intrigue (20 operations, about 60 phases, 5 tokens), the night
// raids and the coup activity. Engine ids stay; names, effects, text and pictures are Erdae's.
import { checkMods, HEADER, block, lines, modLines, num, tab, countryKey } from './inst_util.mjs';

const Q = s => JSON.stringify(s);
const SOUND = { branch_intelligence: 'Spy_Agency_Intel_Upgrades_Confirm', branch_defense: 'Spy_Agency_Defense_Upgrades_Confirm', branch_operation: 'Spy_Agency_Operations_Upgrades_Confirm', branch_operative: 'Spy_Agency_Training_Facilities_Upgrades_Confirm', branch_crypto: 'Spy_Agency_Cryptology_Upgrades_Confirm' };

// ============================================================================================ 6.1 upgrades
export async function writeUpgrades(staged, env) {
  const { data, loc, eloc, sprites } = env, I = data.intrigue, byBranch = new Map(), seen = new Set();
  for (const u of I.upgrades) {
    if (seen.has(u.id)) throw new Error(`Duplicate agency upgrade ${u.id}`);
    seen.add(u.id);
    for (const lvl of u.levels) await checkMods(`upgrade ${u.id}`, lvl);
    const ai = u.aiBase !== undefined ? block('ai_will_do', `base = ${u.aiBase}`) : block('ai_will_do', `factor = ${u.ai}`);
    const body = lines(
      `picture = GFX_zin_agency_${u.id}`,
      `sound = ${SOUND[u.branch]}`,
      ai,
      u.sky ? block('visible', 'zin_rules_skies_present = yes') : '',
      u.avail ? block('available', u.avail) : '',
      block('modifiers_during_progress', `civilian_factory_use = ${u.use}`),
      ...u.levels.map(l => block('level', block('modifier', modLines(l)))));
    (byBranch.get(u.branch) ?? byBranch.set(u.branch, []).get(u.branch)).push(block(u.id, body, 1));
    eloc.set(u.id, u.name); eloc.set(`${u.id}_desc`, u.desc);
    sprites.use(`GFX_zin_agency_${u.id}`, u.art);
  }
  for (const [b, name] of Object.entries(I.branches)) eloc.set(b, name);
  staged.text('common/intelligence_agency_upgrades/intelligence_agency_upgrades.txt', `${HEADER}\n# Overrides the vanilla file of the same name (rule 5 of the removal spec): the engine's 5 branches, 21 upgrades and level\n# counts, with Erdae names, pictures and conditions. No vanilla tag, technology or decision is named.\n${Object.keys(I.branches).map(b => `${b} = {\n${(byBranch.get(b) ?? []).join('\n')}\n}`).join('\n')}\n`);
  return { upgrades: seen.size };
}

// ============================================================================================ 7. agencies
export function writeAgencies(staged, env) {
  const { data, sprites, countries } = env, A = data.intrigue.agencies, out = [], ids = new Set();
  for (const a of A) {
    if (ids.has(a.id)) throw new Error(`Duplicate agency record ${a.id}`);
    ids.add(a.id);
    let cond;
    if (a.country) {
      const c = countries.find(x => x.name === a.country); if (!c) throw new Error(`Agency ${a.id} names ${a.country}, which is not in the roster`);
      cond = `original_tag = ${c.tag}`;
    } else cond = `has_country_flag = zin_people_${a.people}`;
    sprites.use(`GFX_zin_agency_logo_${a.id}`, a.art);
    out.push(block('intelligence_agency', lines(`picture = GFX_zin_agency_logo_${a.id}`, `names = { ${a.names.map(Q).join(' ')} }`, a.default ? block('default', cond) : '', block('available', cond))));
  }
  staged.text('common/intelligence_agencies/zin_agencies.txt', `${HEADER}\n# One record per people, picked by the people's flag (P9), and the Worshipdom's own public record. A realm founds its agency for\n# five workshops over 30 days; none exists at the start.\n${out.join('\n\n')}\n`);
  return { agencies: A.length };
}

// ============================================================================================ 8.1 operations
const NET = 'network_national_coverage = {\n\ttarget = FROM\n\tvalue > 0\n}';
const hasTok = t => `has_operation_token = {\n\ttag = FROM\n\ttoken = ${t}\n}`;
const addTok = t => `add_operation_token = {\n\ttag = FROM\n\ttoken = ${t}\n}`;
const rmTok = t => `remove_operation_token = {\n\ttag = FROM\n\ttoken = ${t}\n}`;
const POOL = { civilian: ['add_political_power = 25', 'civilian_intel'], army: ['army_experience = 10', 'army_intel'], navy: ['navy_experience = 10', 'navy_intel'], air: ['air_experience = 10', 'airforce_intel'] };

function phasesBlock(groups, G) {
  return groups.map(g => {
    const rows = G[g]; if (!rows) throw new Error(`Unknown phase group ${g}`);
    return block('phases', rows.map(([id, w]) => `${id} = { base = ${w} }`).join('\n'));
  }).join('\n');
}
function phaseChain(op, G) {
  const parts = [];
  const infil = op.infil === 'none' ? [] : [op.infil ?? 'std'];
  const exfil = op.exfil === true ? ['exfilStd'] : op.exfil === 'short' ? ['exfilShort'] : [];
  const mids = op.mid.map(m => (m === 'regent' ? 'regent' : m === 'coup' ? 'coup' : m === 'support' ? 'support' : m === 'contacts' ? 'contacts_mid' : m));
  if (op.kind === 'coup') return phasesBlock(['std', 'coup', 'coup2'], G);
  const groups = [...infil, ...mids, ...exfil];
  return phasesBlock(groups, G);
}

function operationText(op, G, sky) {
  const L = [];
  L.push(`icon = GFX_zin_op_${op.short}`, `map_icon = GFX_zin_op_${op.short}_map`, `name = zin_op_${op.short}`, `desc = zin_op_${op.short}_desc`, `priority = ${op.priority}`);
  if (op.costMult !== undefined) L.push(`cost_multiplier = ${num(op.costMult)}`);
  L.push(`days = ${op.days}`, `network_strength = ${op.net}`, `operatives = ${op.agents}`);
  const pool = op.pool, tok = op.token;
  if (op.sky) L.push(block('allowed', 'zin_rules_skies_present = yes'));
  switch (op.kind) {
    case 'infiltrate': {
      const [bonus, intel] = POOL[pool ?? 'civilian'];
      L.push(block('visible', lines(NET, block('NOT', hasTok(tok)), pool === 'navy' ? 'FROM = {\n\tany_owned_state = { is_coastal = yes }\n}' : '')));
      L.push(block('equipment', ''), block('available', ''), block('awarded_tokens', tok));
      L.push(`risk_chance = ${num(op.risk)}`, 'outcome_extra_chance = 0.25', 'risk_modifiers = { operation_infiltrate_risk operation_risk }', 'outcome_modifiers = { operation_infiltrate_outcome operation_outcome }', 'cost_modifiers = { operation_infiltrate_cost operation_cost }');
      L.push(block('outcome_execute', block('ROOT', addTok(tok))));
      L.push(block('outcome_extra_execute', block('random_list', lines(block('33', block('ROOT', lines(addTok(tok), bonus, block('add_intel', `target = FROM\n${intel} = 10`)))), block('67', block('ROOT', lines(addTok(tok), bonus)))))));
      L.push(block('outcome_potential', block('ROOT', addTok(tok))));
      break;
    }
    case 'steal': {
      const steal = (extra = '') => block('steal_random_tech_bonus', lines(...op.folders.map(f => `folder = ${f}`), 'bonus = 3.0', `name = zin_op_${op.short}`, 'target = FROM', 'dynamic = yes', 'instant = yes', extra, 'uses = 1'));
      L.push(block('visible', lines(op.agents && pool !== 'civilian' ? 'num_of_operatives > 1' : 'num_of_operatives > 0', NET, hasTok(tok))));
      L.push(block('equipment', ''), block('required_tokens', tok));
      L.push(`risk_chance = ${num(op.risk)}`, `experience = ${num(op.exp)}`, 'outcome_extra_chance = 0.25', 'risk_modifiers = { operation_steal_tech_risk operation_risk }', 'outcome_modifiers = { operation_steal_tech_outcome operation_outcome }', 'cost_modifiers = { operation_cost }');
      L.push(block('outcome_execute', block('ROOT', lines(steal(), rmTok(tok)))));
      L.push(block('outcome_extra_execute', block('random_list', lines(block('33', block('ROOT', steal('ahead_reduction = 2'))), block('67', block('ROOT', steal('ahead_reduction = 1')))))));
      L.push(block('outcome_potential', lines(block('ROOT', steal()), 'custom_effect_tooltip = zin_op_consumes_token_tt')));
      break;
    }
    case 'sabotage': {
      const v = op.var, key = v.replace('targeted_sabotage_', '');
      const eff = (n, tip) => block('FROM.FROM', lines(block('add_to_variable', `var = ${v}\nvalue = ${n}`), `custom_effect_tooltip = ${tip}`));
      L.push(block('visible', lines('num_of_operatives > 1', NET, hasTok('token_resistance_contacts'))));
      L.push(block('requirements', block('FROM', 'any_controlled_state = {\n\thas_resistance = yes\n}')));
      L.push(block('selection_target', 'targets = { FROM }'), block('selection_target_state', 'has_resistance = yes'));
      L.push(block('required_tokens', 'token_resistance_contacts'), block('equipment', ''));
      L.push(`risk_chance = ${num(op.risk)}`, `experience = ${num(op.exp)}`, 'outcome_extra_chance = 0.25', 'outcome_modifiers = { target_sabotage_factor operation_risk }', 'risk_modifiers = { target_sabotage_risk operation_outcome }', 'cost_modifiers = { target_sabotage_cost operation_cost }');
      L.push(block('outcome_execute', lines(eff(5, `zin_op_sabotage_${key}_once_tt`), block('ROOT', rmTok('token_resistance_contacts')))));
      L.push(block('outcome_extra_execute', eff(8, `zin_op_sabotage_${key}_more_tt`)));
      L.push(block('outcome_potential', lines(`custom_effect_tooltip = zin_op_sabotage_${key}_tt`, 'custom_effect_tooltip = zin_op_consumes_token_tt')));
      break;
    }
    case 'fake': {
      L.push(block('visible', lines(NET, 'FROM = {\n\thas_war_with = ROOT\n}')));
      L.push('scale_cost_independent_of_target = yes');
      L.push(block('available', block('ROOT', lines(
        'set_temp_variable = { num_max_fake_intel_unit = num_armies }',
        'multiply_temp_variable = { num_max_fake_intel_unit = 0.25 }',
        'round_temp_variable = num_max_fake_intel_unit',
        'add_to_temp_variable = { num_max_fake_intel_unit = 1 }',
        'clamp_temp_variable = {\n\tvar = num_max_fake_intel_unit\n\tmin = 24\n}',
        'multiply_temp_variable = { num_max_fake_intel_unit = 2.5 }',
        'round_temp_variable = num_max_fake_intel_unit',
        'num_fake_intel_divisions < num_max_fake_intel_unit',
        block('all_enemy_country', block('intel_level_over', 'target = PREV\narmy_intel < 0.8'))))));
      L.push(block('equipment', ''), block('required_tokens', ''), 'risk_chance = 0', 'experience = 0.5');
      L.push(block('outcome_execute', lines(block('ROOT', block('hidden_effect', lines(
        block('if', lines(block('limit', 'NOT = { has_country_flag = zin_fake_host_template_made }'), block('division_template', 'name = "Phantom Host"\nis_fake_intel_division = yes\nis_locked = yes\nregiments = {\n\tfake_intel_unit = { x = 0 y = 0 }\n}'), 'set_country_flag = zin_fake_host_template_made')),
        block('if', lines(block('limit', 'NOT = { has_variable = fake_intel_id }'), 'set_variable = { fake_intel_id = 1000 }')),
        'set_temp_variable = { id_to_set = fake_intel_id }',
        'add_to_variable = { fake_intel_id = 1 }',
        'add_to_array = {\n\tfake_intel_ids_to_delete = id_to_set\n}',
        'set_variable = { num_days_for_fake_intel_id@var:id_to_set = global.num_days }',
        'set_temp_variable = { num_to_create = num_armies }',
        'multiply_temp_variable = { num_to_create = 0.25 }',
        'round_temp_variable = num_to_create',
        'add_to_temp_variable = { num_to_create = 1 }',
        'clamp_temp_variable = {\n\tvar = num_to_create\n\tmin = 24\n}',
        block('capital_scope', block('create_unit', 'division = "division_template = \\"Phantom Host\\" start_experience_factor = 0.5"\nowner = PREV\ncount = num_to_create\nid = id_to_set')),
        'country_event = { id = zin_inst.1 days = 90 }'))), 'custom_effect_tooltip = zin_op_fake_intel_result_tt')));
      L.push(block('outcome_potential', 'custom_effect_tooltip = zin_op_fake_intel_tt'));
      break;
    }
    case 'cipher': {
      const add = r => block('add_decryption', `target = FROM\nratio = ${r}`);
      L.push(block('visible', lines(block('network_strength', 'target = FROM\nvalue > 25'), 'has_tech = zin_tech_universities', 'has_done_agency_upgrade = upgrade_form_department', block('NOT', block('ROOT', 'is_fully_decrypted = FROM')))));
      L.push(block('equipment', ''), `risk_chance = ${num(op.risk)}`, 'outcome_extra_chance = 0.25', 'is_captured_cipher = yes');
      L.push(block('outcome_execute', block('ROOT', add(0.3))));
      const intel = ['civilian_intel', 'army_intel', 'navy_intel', 'airforce_intel'].map(k => block('25', block('add_intel', `target = FROM\n${k} = 10`)));
      L.push(block('outcome_extra_execute', block('random_list', lines(block('33', block('ROOT', lines(add(0.5), block('random_list', lines(...intel))))), block('67', block('ROOT', add(0.5)))))));
      L.push(block('outcome_potential', block('ROOT', add(0.3))));
      break;
    }
    case 'coup': {
      L.push('is_staged_coup = yes');
      L.push(block('visible', lines(block('network_strength', 'target = FROM\nvalue > 35'))));
      L.push(block('equipment', 'zin_arms_equipment = 12000'));
      L.push(block('selection_target_state', 'is_capital = no'), block('selection_target', 'targets = { FROM }'));
      L.push(block('allowed', block('NOT', 'has_game_rule = {\n\trule = allow_coups\n\toption = BLOCKED\n}')));
      L.push(block('available', lines(block('FROM', lines('has_civil_war = no', 'NOT = {\n\thas_government = var:PREV.ROOT.current_party_ideology_group\n}', COUP_PARTY, 'OR = {\n\tAND = {\n\t\tis_major = no\n\t\thas_war = no\n\t\thas_stability < 0.7\n\t}\n\tAND = {\n\t\thas_war = no\n\t\thas_stability < 0.5\n\t}\n\thas_stability < 0.35\n}')), 'OR = {\n\thas_game_rule = {\n\t\trule = allow_coups\n\t\toption = FREE\n\t}\n\tAND = {\n\t\thas_game_rule = {\n\t\t\trule = allow_coups\n\t\t\toption = AI_ONLY\n\t\t}\n\t\tFROM = { is_ai = yes }\n\t}\n}')));
      L.push(block('on_start', block('FROM', 'set_variable = { coup_operation_party@ROOT = PREV.ROOT.current_party_ideology_group }')));
      L.push(`risk_chance = ${num(op.risk)}`, `experience = ${num(op.exp)}`, 'cost_modifiers = { operation_coup_cost }');
      L.push(block('outcome_execute', COUP_EXECUTE));
      L.push(block('outcome_potential', block('FROM', lines(block('if', lines(block('limit', 'has_variable = coup_operation_party@ROOT'), 'set_temp_variable = { civil_war_party = coup_operation_party@ROOT }')), block('else', 'set_temp_variable = { civil_war_party = PREV.ROOT.current_party_ideology_group }'), block('start_civil_war', 'ideology = var:civil_war_party')))));
      break;
    }
    case 'boost': {
      const res = (n, extra = '') => lines(block('add_resistance_target', `amount = ${n}\ntooltip = zin_op_resistance_boost_tt`), extra);
      L.push(block('visible', lines(NET, hasTok('token_resistance_contacts'))));
      L.push(block('selection_target', 'targets = { FROM }'), block('selection_target_state', 'has_resistance = yes'), block('equipment', ''), block('required_tokens', 'token_resistance_contacts'));
      L.push(`risk_chance = ${num(op.risk)}`, `experience = ${num(op.exp)}`, 'outcome_extra_chance = 0.25', 'outcome_modifiers = { boost_resistance_factor }');
      L.push(block('outcome_execute', block('FROM.FROM', lines(res(10), 'subtract_from_variable = { boost_resistance_chance = 10 }'))));
      L.push(block('outcome_extra_execute', block('random_list', lines(block('33', lines(block('FROM.FROM', lines(res(20), 'subtract_from_variable = { boost_resistance_chance = 10 }')), block('FROM.FROM', 'add_compliance = -10'))), block('67', block('FROM.FROM', lines(res(20), 'subtract_from_variable = { boost_resistance_chance = 10 }')))))));
      L.push(block('outcome_potential', block('FROM.FROM', res(10))));
      L.push(TARGET_WEIGHT);
      break;
    }
    case 'contacts': {
      L.push(block('visible', lines(NET, block('FROM', 'any_controlled_state = {\n\thas_resistance = yes\n}'), block('NOT', hasTok('token_resistance_contacts')))));
      L.push(block('equipment', ''), block('selection_target', 'targets = { FROM }'), block('selection_target_state', 'has_resistance = yes'), block('available', ''), block('awarded_tokens', 'token_resistance_contacts'));
      L.push(`risk_chance = ${num(op.risk)}`, 'outcome_extra_chance = 0.25', 'risk_modifiers = { operation_infiltrate_risk operation_risk }', 'outcome_modifiers = { operation_infiltrate_outcome operation_outcome }', 'cost_modifiers = { operation_infiltrate_cost operation_cost }');
      L.push(block('outcome_execute', block('ROOT', addTok('token_resistance_contacts'))));
      const boost = d => block('FROM.FROM', lines(block('add_resistance_target', `amount = 10\ntooltip = zin_op_resistance_boost_tt\ndays = ${d}`), 'subtract_from_variable = { boost_resistance_chance = 10 }'));
      L.push(block('outcome_extra_execute', block('random_list', lines(block('33', lines(block('ROOT', addTok('token_resistance_contacts')), boost(180))), block('67', lines(block('ROOT', addTok('token_resistance_contacts')), boost(60)))))));
      L.push(block('outcome_potential', block('ROOT', addTok('token_resistance_contacts'))));
      L.push(TARGET_WEIGHT);
      break;
    }
    case 'regent': {
      const add = v => block('ROOT', block('add_collaboration', `target = FROM\nvalue = ${v}`));
      L.push(block('visible', block('network_strength', 'target = FROM\nvalue > 25')));
      L.push(block('equipment', 'zin_camp_equipment = 200\nzin_arms_equipment = 1000\ncivilian_factories = {\n\tamount = 10\n\tdays = 60\n}'));
      L.push(block('allowed', 'has_rule = can_create_collaboration_government'), block('available', block('has_collaboration', 'target = FROM\nvalue < 1.0')));
      L.push(`risk_chance = ${num(op.risk)}`, `experience = ${num(op.exp)}`, 'outcome_extra_chance = 0.33');
      L.push(block('outcome_execute', add(0.3)), block('outcome_extra_execute', add(0.45)), block('outcome_potential', add(0.3)));
      break;
    }
    case 'strike': {
      L.push(block('visible', lines(block('network_strength', 'target = FROM\nvalue > 35'), block('NOT', 'has_war_with = FROM'))));
      L.push(block('equipment', 'civilian_factories = {\n\tamount = 15\n\tdays = 5\n}'));
      L.push(block('available', lines(block('NOT', 'has_war_with = FROM'), 'has_wargoal_against = FROM', 'can_declare_war_on = FROM')));
      L.push('target_type = strategic_region', block('selection_target', 'targets = { FROM }'), 'will_lead_to_war_with = yes');
      L.push(`risk_chance = ${num(op.risk)}`, `experience = ${num(op.exp)}`);
      L.push(block('outcome_execute', lines(block('ROOT', 'declare_war_on = {\n\ttarget = FROM\n\ttype = annex_everything\n}'), block('execute_operation_coordinated_strike', 'amount = 12'))));
      L.push(block('outcome_potential', 'custom_effect_tooltip = zin_op_coordinated_strike_tt'));
      break;
    }
    case undefined: {
      if (op.id === 'operation_rescue_operative') {
        L.push('prevent_captured_operative_to_die = yes');
        L.push(block('visible', block('FROM', 'has_captured_operative = ROOT')), block('available', ''), block('requirements', block('FROM', 'has_captured_operative = ROOT')), block('equipment', ''));
        L.push(`risk_chance = ${num(op.risk)}`, 'experience = 2', 'cost_multiplier = 0');
        L.push(block('outcome_execute', lines(block('ROOT', block('free_random_operative', 'captured_by = FROM\nall = yes')), block('ROOT', block('hidden_effect', 'set_country_flag = just_freed_operative_flag')))));
        L.push(block('outcome_potential', block('ROOT', block('free_random_operative', 'captured_by = FROM\nall = yes'))));
      } else {
        L.push(block('visible', 'has_any_general_captured_by = FROM'), block('available', ''), block('requirements', 'has_any_general_captured_by = FROM'), block('equipment', ''));
        L.push(`risk_chance = ${num(op.risk)}`, 'experience = 2', 'cost_multiplier = 0');
        L.push(block('outcome_execute', block('FROM', 'release_captured_generals_from = ROOT')), block('outcome_potential', block('FROM', 'release_captured_generals_from = ROOT')));
      }
      break;
    }
    default: throw new Error(`Unknown operation kind ${op.kind}`);
  }
  L.push(phaseChain(op, G));
  return L.join('\n');
}

const COUP_PARTY = ['fascism', 'communism', 'democratic', 'neutrality'].map(g => `if = {\n\tlimit = {\n\t\tPREV.ROOT = { has_government = ${g} }\n\t}\n\t${g} > 0.2\n}`).join('\n');
const TARGET_WEIGHT = block('target_weight', lines('base = 100', block('modifier', 'add = boost_resistance_chance'), block('modifier', lines('set_temp_variable = { t = distance_to@ROOT.capital }', 'divide_temp_variable = { t = 600 }', 'clamp_temp_variable = {\n\tvar = t\n\tmin = 0\n\tmax = 1\n}', 'multiply_temp_variable = { t = -40 }', 'add = t'))));
const COUP_EXECUTE = lines(
  block('FROM', lines(
    block('if', lines(block('limit', 'controls_state = FROM.FROM'), 'set_temp_variable = { coup_civil_war_capital = FROM.FROM }')),
    block('else', block('random_controlled_state', block('FROM', 'set_temp_variable = { coup_civil_war_capital = PREV }'))),
    block('if', lines(block('limit', 'has_government = var:coup_operation_party@ROOT'), 'set_variable = { coup_operation_party@ROOT = PREV.ROOT.current_party_ideology_group }')),
    'set_temp_variable = { ideology = coup_operation_party@ROOT }',
    'set_temp_variable = { civil_war_size = party_popularity@var:ideology }',
    'clamp_temp_variable = {\n\tvar = civil_war_size\n\tmin = 0.1\n}',
    'set_temp_variable = { civil_war_airforce_fraction = civil_war_size }',
    'set_temp_variable = { civil_war_navy_fraction = civil_war_size }',
    'set_temp_variable = { civil_war_army_fraction = civil_war_size }',
    ...[['token_airforce', 'civil_war_airforce_fraction'], ['token_army', 'civil_war_army_fraction'], ['token_navy', 'civil_war_navy_fraction']].map(([t, v]) => block('if', lines(block('limit', block('ROOT', hasTok(t))), `add_to_temp_variable = { ${v} = 0.15 }`))),
    block('start_civil_war', 'capital = coup_civil_war_capital\nsize = civil_war_size\nideology = var:coup_operation_party@ROOT\narmy_ratio = civil_war_army_fraction\nnavy_ratio = civil_war_navy_fraction\nair_ratio = civil_war_airforce_fraction'),
    'clear_variable = coup_operation_party@ROOT')),
  block('hidden_effect', block('ROOT', 'add_to_variable = {\n\tvar = total_coups\n\tvalue = 1\n}')));

export function writeOperations(staged, env) {
  const { data, loc, eloc, sprites } = env, I = data.intrigue, G = I.phaseGroups, ops = [], ids = new Set();
  const phaseIds = new Set(I.phases.map(p => p.id));
  for (const op of I.operations) {
    if (ids.has(op.id)) throw new Error(`Duplicate operation ${op.id}`);
    ids.add(op.id);
    ops.push(block(op.id, operationText(op, G), 0));
    loc.set(`zin_op_${op.short}`, op.name); loc.set(`zin_op_${op.short}_desc`, op.desc);
    sprites.use(`GFX_zin_op_${op.short}`, op.art); sprites.use(`GFX_zin_op_${op.short}_map`, op.art);
  }
  // Every phase an operation names must exist, and every phase must be named by an operation.
  const used = new Set();
  for (const op of I.operations) for (const g of [op.infil === 'none' ? null : op.infil ?? 'std', ...op.mid.map(m => (m === 'contacts' ? 'contacts_mid' : m)), op.exfil === true ? 'exfilStd' : op.exfil === 'short' ? 'exfilShort' : null, ...(op.kind === 'coup' ? ['coup', 'coup2'] : [])].filter(Boolean))
    for (const [pid] of G[g] ?? (() => { throw new Error(`Operation ${op.id} names unknown phase group ${g}`); })()) { if (!phaseIds.has(pid)) throw new Error(`Operation ${op.id} names unknown phase ${pid}`); used.add(pid); }
  for (const pid of phaseIds) if (!used.has(pid)) throw new Error(`Phase ${pid} is used by no operation`);
  for (const t of ['zin_op_consumes_token_tt', 'zin_op_fake_intel_tt', 'zin_op_fake_intel_result_tt', 'zin_op_coordinated_strike_tt', 'zin_op_resistance_boost_tt']) loc.set(t, OP_TIPS[t]);
  for (const k of ['industry', 'infrastructure', 'resources']) { loc.set(`zin_op_sabotage_${k}_tt`, OP_TIPS[`sabotage_${k}`]); loc.set(`zin_op_sabotage_${k}_once_tt`, OP_TIPS[`sabotage_${k}_once`]); loc.set(`zin_op_sabotage_${k}_more_tt`, OP_TIPS[`sabotage_${k}_more`]); }
  staged.text('common/operations/zin_operations.txt', `${HEADER}\n# The 20 operations of the engine, kept under their ids, as the deeds of court intrigue. Cost in Erdae goods; no vanilla tag,\n# decision or technology is named. Outcome effects use the engine's own effects.\n${ops.join('\n')}\n`);
  return { operations: ids.size };
}
const OP_TIPS = {
  zin_op_consumes_token_tt: 'The token is spent when the scheme succeeds.',
  zin_op_fake_intel_tt: 'Phantom hosts appear near our capital. The enemy will count them.',
  zin_op_fake_intel_result_tt: 'Phantom hosts appear near our capital, and fade after 90 days.',
  zin_op_coordinated_strike_tt: 'Our hosts begin the war with the gates already open.',
  zin_op_resistance_boost_tt: 'The hidden in this holding grow bolder.',
  sabotage_industry: 'The rival\'s workshops suffer fire and ruin.', sabotage_industry_once: 'The workshops of this holding will suffer several fires.', sabotage_industry_more: 'The workshops of this holding will suffer many fires.',
  sabotage_infrastructure: 'The rival\'s roads and bridges are cut.', sabotage_infrastructure_once: 'The roads of this holding will be cut in several places.', sabotage_infrastructure_more: 'The roads of this holding will be cut in many places.',
  sabotage_resources: 'The rival\'s mines and stores are ruined.', sabotage_resources_once: 'The mines and stores of this holding will suffer several blows.', sabotage_resources_more: 'The mines and stores of this holding will suffer many blows.',
};

// ============================================================================================ 8.2 phases and tokens
export function writePhases(staged, env) {
  const { data, loc, sprites } = env, I = data.intrigue, out = [], ids = new Set();
  for (const p of I.phases) {
    if (ids.has(p.id)) throw new Error(`Duplicate phase ${p.id}`);
    ids.add(p.id);
    const l = [`name = ${p.id}`, `desc = ${p.id}_desc`, `outcome = ${p.id}_outcome`];
    if (p.extra) l.push(`outcome_extra = ${p.id}_outcome_extra`);
    l.push(`picture = ${Q(`GFX_zin_phase_${p.id.replace('zin_ph_', '')}`)}`, `icon = ${Q(`GFX_zin_phase_${p.id.replace('zin_ph_', '')}_small`)}`);
    l.push(block('requirements', p.req ?? ''));
    l.push(block('equipment', p.eq ?? ''));
    if (p.id.includes('_in_') || p.id.includes('_out_')) l.push('return_on_complete = yes');
    out.push(block(p.id, l.join('\n'), 0));
    loc.set(p.id, p.name); loc.set(`${p.id}_desc`, p.desc); loc.set(`${p.id}_outcome`, p.outcome);
    if (p.extra) loc.set(`${p.id}_outcome_extra`, p.extra);
    sprites.use(`GFX_zin_phase_${p.id.replace('zin_ph_', '')}`, p.art); sprites.use(`GFX_zin_phase_${p.id.replace('zin_ph_', '')}_small`, p.art);
  }
  staged.text('common/operation_phases/zin_operation_phases.txt', `${HEADER}\n# The scenes inside an operation: infiltration, the task, exfiltration. Sixty in all; none names gunpowder, wire or radio.\n${out.join('\n\n')}\n`);
  return { phases: ids.size };
}

export function tokenText(env) {
  const { data, eloc, sprites } = env;
  for (const t of data.intrigue.tokens) {
    const key = `OPERATION_TOKEN_INFILTRATED_${t.id === 'token_civilian' ? 'CIVILIAN' : t.id === 'token_army' ? 'ARMY' : t.id === 'token_navy' ? 'NAVY' : t.id === 'token_airforce' ? 'AIRFORCE' : 'RESISTANCE_CONTACTS'}`;
    eloc.set(key, t.name); eloc.set(`${key}_DESC`, t.desc);
    sprites.use(t.bg, t.art); sprites.use(t.icon, t.art);
  }
  for (const [m, [title, action]] of Object.entries(data.intrigue.missions)) { eloc.set(`OPERATIVE_MISSION_${m}_TITLE`, title); eloc.set(`OPERATIVE_MISSION_${m}_ACTION`, action); }
  data.intrigue.operativeSkills.forEach((s, i) => eloc.set(`operative_skill_${i + 1}`, s));
}

// ============================================================================================ raids, coup activity
export function writeRaids(staged, env) {
  const { data, loc, eloc, sprites } = env, R = data.intrigue.raids, C = R.category;
  eloc.set(`raid_category_${C.id}`, C.name); eloc.set(`raid_category_header_${C.id}`, C.header); eloc.set(`tooltip_raid_category_${C.id}`, C.desc); eloc.set(`raid_category_fluff_text_${C.id}`, C.fluff);
  sprites.use(`GFX_raid_category_small_${C.id}`, C.art); sprites.use(`GFX_raid_unit_icon_${C.id}`, C.art);
  staged.text('common/raids/categories/zin_raid_categories.txt', `${HEADER}\ncategories = {\n\t${C.id} = {\n\t\tintel_source = army\n\t\tfaction_influence_score_on_success = 50\n\t}\n}\n`);
  const effects = (n, str, xp) => `raid_damage_units = {\n\torg_damage = ${n}\n\tstr_damage = ${str}\n\tratio = yes\n}\nraid_add_unit_experience = ${xp}\nadd_raid_history_entry = yes`;
  const levels = (victim, tier) => ['failure', 'limited_success', 'success', 'critical_success'].map((lv, i) => block(lv, lines(block('victim_effects', victim[i] ?? ''), block('actor_effects', effects(i === 3 ? 0.1 : 0.65, i === 3 ? 0.05 : 0.6, i === 3 ? 0.2 : 0.1)), block('division_effects', `add_divisional_commander_xp = ${i === 3 ? 75 : 50}`), block('visual_effect', `entity = "${['raid_failed_entity', 'land_raids_limited_success_entity', 'land_raids_success_entity', 'land_raids_critical_success_entity'][i]}"\nanimation = "attack"`)))).join('\n');
  const factors = (extra = '') => block('success_factors', block('success', lines('base = 0.5', block('experience', 'weight = 0.25\nstart_weight = -0.2\nreference = 1.0'), block('organisation', 'weight = 0.1\nstart_weight = -0.1\nreference = 100'), block('strength', 'weight = 0.1\nstart_weight = -0.1\nreference = 1'), block('recon', 'weight = 0.05\nreference = 10'), block('resistance', 'reference = 100\nstart_reference = 15\nweight = 0.4'), block('enemy_units', 'reference = 4\nweight = -0.4'), block('intel', 'weight = 0.2\nreference = 100'), extra)));
  const out = [];
  for (const t of R.types) {
    eloc.set(`raid_type_${t.id}`, t.name); eloc.set(`raid_type_${t.id}_desc`, t.desc);
    if (t.captive) eloc.set(`raid_type_${t.id}_captive_line`, t.captive);
    const icon = `GFX_zin_raid_${t.id.replace('zin_raid_', '')}`;
    sprites.use(icon, t.art); sprites.use(`${icon}_target`, t.art);
    const head = lines(`days_to_prepare = ${t.days}`, `days_re_enable = ${t.again}`, `speed_multiplier = ${num(t.speed)}`, t.range ? `max_distance = ${t.range}` : '', `category = ${C.id}`, `custom_map_icon = ${icon}`, `target_icon = ${icon}_target`, 'launch_sound = raid_land_launchable_sound',
      block('unit_model', 'entity = infantry_entity\ndefault_entity = zin_men_gfx_infantry_entity'), `command_power = ${t.cp}`, 'fire_only_once = no', block('arrow', 'type = land'));
    if (t.kind === 'rescue') {
      out.push(block(t.id, lines(head, block('visible', 'has_any_captured_general = yes'), block('show_target', 'is_leader_visible = var:target_leader\nvar:target_leader = { tag = ROOT }'), block('target_type', 'captured_army_leader = yes'), block('starting_point', 'building_types = { supply_node }\nallow_faction_buildings = yes'), factors(), block('success_levels', levels([ '', 'var:target_leader = { release_from_captivity = yes }', 'var:target_leader = { release_from_captivity = yes }', 'var:target_leader = { release_from_captivity = yes }']))), 1));
    } else {
      const dmg = d => `var:target_state = {\n\tdamage_building = {\n\t\ttype = ${t.building}\n\t\tdamage = ${d}\n\t\tprovince = var:ROOT.target_province\n\t}\n}`;
      const victims = [dmg(0.1), dmg(0.3), dmg(0.6), dmg(1)].map(x => x);
      out.push(block(t.id, lines(head,
        block('ai_will_do', lines('base = 2', block('modifier', 'factor = 0\nNOT = { has_war_with = FROM }'), block('modifier', 'factor = 1.5\ncommand_power > 50'))),
        block('visible', 'always = yes'), block('show_target', 'has_war_with = FROM'), block('available', ''), block('launchable', 'has_war_with = FROM'),
        block('target_type', block('building', `type = ${t.building}`)), block('starting_point', 'building_types = { supply_node }\nallow_faction_buildings = yes'), factors(), block('success_levels', levels(victims))), 1));
    }
  }
  staged.text('common/raids/zin_raids.txt', `${HEADER}\n# Night raids by land (section 15.2 of the warfare spec): ransom a captured captain, burn a depot, fire a granary. No air,\n# nuclear, paratrooper or naval commando raid exists in Erdae.\ntypes = {\n${out.join('\n')}\n}\n`);
  const T = data.intrigue.timedActivity;
  staged.text('common/timed_activities/zin_timed_activities.txt', `${HEADER}\n# The usurpation activity of the diplomacy screen needs arms from the warfare spec.\n${T.id} = {\n\tequipment_need = {\n${Object.entries(T.equipment).map(([k, v]) => `\t\t${k} = ${v}`).join('\n')}\n\t}\n}\n`);
  return { raids: R.types.length };
}

// ============================================================================================ events, units and AI
export function intrigueEvent(env) {
  const { loc } = env;
  loc.set('zin_inst.1.a', 'The camp-fires burn low.');
  return `${HEADER}\nadd_namespace = zin_inst\n\n# Deletes the phantom hosts of Plant False Letters once their time is up.\ncountry_event = {\n\tid = zin_inst.1\n\thidden = yes\n\tis_triggered_only = yes\n\n\timmediate = {\n\t\tclear_temp_array = ids_to_remove\n\t\tfor_each_loop = {\n\t\t\tarray = fake_intel_ids_to_delete\n\t\t\tset_temp_variable = { passed_days = global.num_days }\n\t\t\tsubtract_from_temp_variable = { passed_days = num_days_for_fake_intel_id@var:v }\n\t\t\tif = {\n\t\t\t\tlimit = { check_variable = { passed_days > 85 } }\n\t\t\t\tadd_to_temp_array = { ids_to_remove = v }\n\t\t\t\tdelete_unit = { id = v }\n\t\t\t}\n\t\t}\n\t\tfor_each_loop = {\n\t\t\tarray = ids_to_remove\n\t\t\tremove_from_array = { fake_intel_ids_to_delete = v }\n\t\t\tclear_variable = num_days_for_fake_intel_id@var:v\n\t\t}\n\t}\n\n\toption = {\n\t\tname = zin_inst.1.a\n\t}\n}\n`;
}

export function fakeHostUnit() {
  return `\tfake_intel_unit = {\n\t\tabbreviation = "PHN"\n\t\tsprite = infantry\n\t\tmap_icon_category = infantry\n\t\tpriority = 0\n\t\tai_priority = 0\n\t\tactive = no\n\t\ttype = { infantry }\n\t\tgroup = infantry\n\t\tcategories = { category_front_line category_light_infantry category_all_infantry category_army }\n\t\tcombat_width = 1\n\t\tmax_strength = 1\n\t\tmax_organisation = 100\n\t\tdefault_morale = 0.3\n\t\tmanpower = 0\n\t\ttraining_time = 90\n\t\tsuppression = 1\n\t\tweight = 0.5\n\t\tsupply_consumption = 0.0\n\t\tneed = {\n\t\t\tzin_arms_equipment = 1\n\t\t}\n\t}`;
}

export function intrigueStrategies(data, countries) {
  const A = data.intrigue.ai, out = [];
  const gov = { dominion_wild: 'OR = {\n\thas_government = fascism\n\thas_government = neutrality\n}', light: 'has_government = democratic' };
  out.push(block('zin_inst_agency_branches', lines('enable = { always = yes }', 'abort_when_not_enabled = yes', ...Object.entries(A.agencyBranches).map(([id, v]) => block('ai_strategy', `type = intelligence_agency_branch_desire_factor\nid = ${id}\nvalue = ${v}`)))));
  out.push(block('zin_inst_agency_major', lines(block('enable', 'is_major = yes\ndate > 1749.3.1'), 'abort_when_not_enabled = yes', block('ai_strategy', `type = intelligence_agency_usable_factories\nvalue = ${A.usableWorkshops.major}`))));
  out.push(block('zin_inst_agency_minor', lines(block('enable', 'is_major = no\ndate > 1750.3.1\nhas_war = no\nnum_of_civilian_factories > 25'), block('abort', 'OR = {\n\thas_war = yes\n\tnum_of_civilian_factories < 25\n}'), block('ai_strategy', `type = intelligence_agency_usable_factories\nvalue = ${A.usableWorkshops.default}`))));
  out.push(block('zin_inst_spymaster_major', lines(block('enable', 'is_major = yes'), 'abort_when_not_enabled = yes', block('ai_strategy', 'type = become_spymaster\nvalue = 30'))));
  out.push(block('zin_inst_spymaster_minor', lines(block('enable', 'is_major = no'), 'abort_when_not_enabled = yes', block('ai_strategy', 'type = become_spymaster\nvalue = 2'))));
  out.push(block('zin_inst_head_of_seals', lines('enable = { always = yes }', 'abort_when_not_enabled = yes', block('ai_strategy', 'type = become_head_of_crypto\nvalue = 2'))));
  out.push(block('zin_inst_head_of_deeds', lines('enable = { always = yes }', 'abort_when_not_enabled = yes', block('ai_strategy', 'type = become_head_of_operations\nvalue = 2'))));
  for (const w of A.operationWeights) {
    out.push(block(`zin_inst_op_${w.stance}_${w.operation.replace('operation_', '')}`, lines(block('enable', gov[w.stance]), 'abort_when_not_enabled = yes', block('ai_strategy', `type = operative_operation\noperation = ${w.operation}\nvalue = ${w.value}`))));
  }
  for (const m of A.missionWeights) out.push(block(`zin_inst_mission_${m.mission}`, lines(block('enable', 'has_war = no'), 'abort_when_not_enabled = yes', block('ai_strategy', `type = operative_mission\nmission = ${m.mission}\nvalue = ${m.value}`))));
  out.push(block('zin_inst_no_intrigue_against_kin', lines(block('enable', 'is_subject = yes'), 'abort_when_not_enabled = yes', block('ai_strategy', 'type = operative_operation\noperation = operation_coup_government\nvalue = -1000'))));
  out.push(block('zin_inst_no_coup_while_dark_low', lines(block('enable', `check_variable = { global.zin_gathering_dark < ${A.coupFloorDark} }`), 'abort_when_not_enabled = yes', block('ai_strategy', 'type = operative_operation\noperation = operation_coup_government\nvalue = -1000'))));
  return out;
}
