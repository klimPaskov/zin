// Institutions, war group (spec 03_gameplay/08_institutions.md sections 1 to 3): the War Camp sub-units, the
// abilities of the standard, the nine customs of the Council of Captains, the chiefs and their traits, the commander
// traits of common/unit_leader, the Valour decisions and the leader on_actions the replaced on_actions folder lost.
import { rng, keyOf } from './core.mjs';
import { checkMods, HEADER, block, lines, modLines, num, tab, pickFrom, tierOf, countryKey } from './inst_util.mjs';

const Q = s => JSON.stringify(s);

// ============================================================================================ 1. the War Camp
const HQ_CATEGORIES = {
  support: ['category_support_battalions', 'category_divisional_support_battalions', 'category_army'],
  foot: ['category_front_line', 'category_light_infantry', 'category_all_infantry', 'category_army'],
  riders: ['category_front_line', 'category_cavalry', 'category_army'],
  knights: ['category_front_line', 'category_all_armor', 'category_army'],
  kin: ['category_front_line', 'category_all_infantry', 'category_army', 'category_zin_monsters'],
};
const HQ_COMBAT = { foot: { max_strength: 15, max_organisation: 60, default_morale: 0.3, manpower: 600, deployment_cost: 3, training_time: 90, weight: 0.5 },
  riders: { max_strength: 15, max_organisation: 60, default_morale: 0.3, manpower: 600, deployment_cost: 3, training_time: 90, weight: 0.75 },
  knights: { max_strength: 10, max_organisation: 40, default_morale: 0.1, manpower: 600, deployment_cost: 3, training_time: 180, weight: 1 },
  kin: { max_strength: 15, max_organisation: 60, default_morale: 0.3, manpower: 600, deployment_cost: 3, training_time: 90, weight: 0.75 } };

export function hqUnitText(u, common) {
  const support = u.kind === 'support', cats = [...HQ_CATEGORIES[u.kind]];
  if (support) for (const extra of u.extraCats ?? []) if (!cats.includes(extra)) cats.splice(0, 0, extra);
  const l = [];
  l.push(`abbreviation = ${Q(u.abbr)}`);
  l.push(`sprite = ${u.kind === 'riders' || u.kind === 'knights' ? 'cavalry' : 'infantry'}`);
  l.push(`map_icon_category = ${u.kind === 'knights' ? 'armored' : 'infantry'}`);
  l.push('priority = 0', 'ai_priority = 0', `active = ${u.active === false ? 'no' : 'yes'}`);
  if (support) l.push('affects_speed = no');
  if (u.kind === 'riders') l.push('cavalry = yes');
  l.push(`type = { ${u.kind === 'knights' ? 'armor' : support ? 'infantry support' : 'infantry'} }`);
  l.push(`group = ${support ? 'support' : u.kind === 'riders' ? 'mobile' : u.kind === 'knights' ? 'armor' : 'infantry'}`);
  l.push(`categories = { ${cats.join(' ')} }`);
  if (u.leader) l.push(block('deployed_leader_modifiers', modLines(u.leader)));
  if (u.ability) l.push(`enable_ability = { ${u.ability} }`);
  l.push('regimental = no', `combat_width = ${support ? 0 : 2}`, 'allow_in_army_hq = yes', 'allow_in_non_army_hq = no');
  const size = support ? common : { ...common, ...HQ_COMBAT[u.kind] };
  for (const k of ['max_strength', 'max_organisation', 'default_morale', 'manpower', 'deployment_cost', 'training_time', 'weight']) l.push(`${k} = ${num(size[k])}`);
  if (u.kind === 'riders') l.push('maximum_speed = 0.6');
  for (const [k, v] of Object.entries(u.stats ?? {})) l.push(`${k} = ${num(v)}`);
  l.push(block('need', modLines(u.need)));
  if (support) l.push(block('essential', Object.keys(u.need).join('\n')));
  if (u.model) l.push('division_3d_model_priority = 99999');
  return block(u.id, l.join('\n'), 1);
}

export function writeHq(staged, env) {
  const { data, loc, sprites } = env, hq = data.core.hq;
  const ids = new Set();
  for (const u of hq.units) {
    if (ids.has(u.id)) throw new Error(`Duplicate camp sub-unit ${u.id}`);
    ids.add(u.id);
    loc.set(u.id, u.name); loc.set(`${u.id}_desc`, u.desc);
  }
  staged.text('common/units/zin_hq.txt', `${HEADER}\n# The War Camp (army headquarters): the companies and household battalions that fill a camp. All \`allow_in_army_hq\`.\n# Needs name the equipment archetypes of docs/specs/03_gameplay/01_warfare.md section 3.\nsub_units = {\n${hq.units.map(u => hqUnitText(u, hq.common)).join('\n')}${env.extraUnits?.length ? `\n${env.extraUnits.join('\n')}` : ''}\n}\n`);
  return { subUnits: hq.units.length, roles: new Set(hq.units.map(u => u.role)).size };
}

// ============================================================================================ 3. abilities
const AI_BLOCKS = {
  offensive: 'ai_will_do = {\n\tfactor = -1\n\tmodifier = {\n\t\tFROM = {\n\t\t\thas_war_support > 0.1\n\t\t\tcommand_power > 1.5\n\t\t}\n\t\tcheck_variable = { num_units_offensive_combats > 6 }\n\t\tset_temp_variable = { temp = avg_offensive_combat_status }\n\t\tcheck_variable = { temp > 0.45 }\n\t\tcheck_variable = { ai_random > temp }\n\t\tadd = 2\n\t}\n}',
  defensive: 'ai_will_do = {\n\tfactor = -1\n\tmodifier = {\n\t\tFROM = {\n\t\t\thas_war_support > 0.4\n\t\t}\n\t\tcheck_variable = { num_units_defensive_combats > 6 }\n\t\tset_temp_variable = { temp = avg_defensive_combat_status }\n\t\tcheck_variable = { temp < 0.40 }\n\t\tcheck_variable = { ai_random > temp }\n\t\tadd = 2\n\t}\n}',
  planning: 'ai_will_do = {\n\tfactor = -1\n\tmodifier = {\n\t\tFROM = {\n\t\t\tcommand_power > 2.0\n\t\t}\n\t\tcheck_variable = { num_units > 6 }\n\t\tcheck_variable = { unit_ratio_ready_for_plan > 0.55 }\n\t\tcheck_variable = { avg_unit_planning_ratio < 0.4 }\n\t\tadd = 2\n\t}\n}',
  siege: 'ai_will_do = {\n\tfactor = -1\n\tmodifier = {\n\t\tFROM = {\n\t\t\tcommand_power > 1.5\n\t\t}\n\t\tset_temp_variable = { temp = num_units_offensive_combats }\n\t\tcheck_variable = { temp > 6 }\n\t\tset_temp_variable = { temp2 = num_units_offensive_combats_against@fort }\n\t\tdivide_temp_variable = { temp2 = temp }\n\t\tcheck_variable = { temp2 > 0.5 }\n\t\tadd = 2\n\t}\n}',
  river: 'ai_will_do = {\n\tfactor = -1\n\tmodifier = {\n\t\tFROM = {\n\t\t\tcommand_power > 2.0\n\t\t}\n\t\tcheck_variable = { num_units_crossing_river > 5 }\n\t\tadd = 2\n\t}\n}',
  medics: 'ai_will_do = {\n\tfactor = -1\n\tmodifier = {\n\t\tFROM = {\n\t\t\thas_war_support < 0.2\n\t\t\tcommand_power > 2\n\t\t}\n\t\tcheck_variable = { num_units_offensive_combats > 6 }\n\t\tset_temp_variable = { temp = avg_offensive_combat_status }\n\t\tcheck_variable = { temp > 0.2 }\n\t\tcheck_variable = { ai_random > temp }\n\t\tadd = 2\n\t}\n}',
  dig: 'ai_will_do = {\n\tfactor = -1\n\tmodifier = {\n\t\tFROM = {\n\t\t\tcommand_power > 2.0\n\t\t}\n\t\tcheck_variable = { num_units > 6 }\n\t\tcheck_variable = { unit_ratio_ready_for_plan > 0.6 }\n\t\tcheck_variable = { avg_unit_entrenchment_ratio < 0.4 }\n\t\tadd = 2\n\t}\n}',
  reserves: 'ai_will_do = {\n\tfactor = -1\n\tmodifier = {\n\t\tFROM = {\n\t\t\tcommand_power > 6.0\n\t\t}\n\t\tcheck_variable = { num_units > 6 }\n\t\tcheck_variable = { num_units_in_combat > 4 }\n\t\tcheck_variable = { avg_combat_status > 0.7 }\n\t\tadd = 2\n\t}\n}',
};

export async function writeAbilities(staged, env) {
  const { data, loc, sprites } = env, out = [], ids = new Set();
  for (const a of data.core.abilities) {
    if (ids.has(a.id)) throw new Error(`Duplicate ability ${a.id}`);
    ids.add(a.id);
    await checkMods(`ability ${a.id}`, a.mods);
    const l = [`name = ${a.id}`, `desc = ${a.id}_desc`];
    if (a.sound) l.push(`sound_effect = ${a.sound}`);
    l.push('type = army_leader');
    if (a.hq) l.push('requires_deployed_hq = yes');
    const allowed = [a.noGroup || a.id === 'zin_ab_healers_afield' ? 'is_leading_army_group = no' : '', a.trait ? `has_ability = ${a.id}` : '', 'is_border_war = no'].filter(Boolean);
    l.push(block('allowed', allowed.join('\n')));
    if (a.ai) l.push(AI_BLOCKS[a.ai]);
    if (a.cancelable) l.push('cancelable = yes');
    l.push(`cost = ${num(a.cost)}`, `duration = ${a.duration}`);
    if (a.cooldown) l.push(`cooldown = ${a.cooldown}`);
    l.push(block('unit_modifiers', modLines(a.mods)));
    if (a.oneTime) l.push(block('one_time_effect', a.oneTime));
    out.push(block(a.id, l.join('\n'), 1));
    loc.set(a.id, a.name); loc.set(`${a.id}_desc`, a.desc);
    sprites.use(`GFX_ability_${a.id}`, a.art);
  }
  staged.text('common/abilities/zin_abilities.txt', `${HEADER}\n# The thirteen abilities of the standard (section 3.2). Effects keep the values of the engine's generic abilities.\nability = {\n${out.join('\n')}\n}\n`);
  return { abilities: ids.size };
}

// ============================================================================================ 2.3 customs
const LEDGER = c => (c.startsWith('naval') || c.startsWith('navy') ? 'navy' : c.startsWith('air') ? 'air' : 'army');
export async function writeCustoms(staged, env) {
  const { data, loc, sprites } = env, byCat = new Map(), ids = new Set();
  for (const c of data.core.customs) {
    if (ids.has(c.id)) throw new Error(`Duplicate custom ${c.id}`);
    ids.add(c.id);
    await checkMods(`custom ${c.id}`, c.modifier);
    const id = `zin_oc_${c.id}`, l = [`ledger = ${LEDGER(c.category)}`];
    if (c.sky) l.push('visible = { zin_rules_skies_present = yes }');
    l.push(block('modifier', modLines(c.modifier)));
    const w = c.stance === 'defend' ? 'has_government = democratic' : c.stance === 'attack' ? 'OR = {\n\thas_government = fascism\n\thas_government = neutrality\n}' : '';
    l.push(block('ai_will_do', lines('factor = 1', w ? block('modifier', `factor = 3\n${w}`) : '', block('modifier', 'factor = 3\nhas_war = yes'), block('modifier', 'factor = 0.25\nhas_war = no'))));
    (byCat.get(c.category) ?? byCat.set(c.category, []).get(c.category)).push(block(id, l.join('\n'), 2));
    loc.set(id, c.name); loc.set(`${id}_desc`, c.desc);
    sprites.use(`GFX_idea_${id}`, c.art);
  }
  const cats = Object.keys(data.core.customCategoryLabels);
  staged.text('common/ideas/zin_officer_corps.txt', `${HEADER}\n# The 27 customs of the Council of Captains (nine slots, three each for host, fleet and wings). Costs come from the\n# kept idea-tag file. The six air customs show only while the sky rule is on.\nideas = {\n${cats.map(c => `\t${c} = {\n${(byCat.get(c) ?? []).join('\n')}\n\t}`).join('\n')}\n}\n`);
  for (const [cat, label] of Object.entries(data.core.customCategoryLabels)) loc.set(`zin_oc_group_${cat}`, label);
  return { customs: ids.size };
}

// ============================================================================================ 2.2 chiefs
// Generated chiefs, marshals and masters for tier A and B realms (the characters spec's named figures replace them
// by id when they land). Names come from the country's own name pool; the portrait database serves the face by sex and country.
export function planChiefs(env) {
  const { data, countries, table } = env, { a, b } = tierOf(data.core, countries), skip = new Set(data.core.tiers.noChairs);
  const plan = [];
  for (const [tier, list] of [['a', a], ['b', b]]) for (const c of list) {
    if (skip.has(c.name)) continue;
    for (const chair of data.core.chairPlan[tier]) plan.push({ tier, country: c, chair, id: `zin_cmd_${chair}_${countryKey(c)}`, people: table.get(c.tag).people });
  }
  return plan;
}

export async function writeChiefs(staged, env) {
  const { data, loc, sprites, pools } = env, plan = planChiefs(env), core = data.core;
  const families = core.chiefFamilies, byChair = chair => families.filter(f => f.chair === (chair.startsWith('marshal') ? 'army' : chair));
  // The chief traits (country leader traits usable on advisors).
  const traitBlocks = [];
  for (const f of families) {
    const mod = { [f.modifier]: 0 };
    await checkMods(`chief family ${f.id}`, mod);
    if (f.extra) await checkMods(`chief family ${f.id}`, f.extra);
    f.tiers.forEach((v, i) => {
      const t = f.tiers.length === 1 ? 1 : i + 1, id = `zin_chief_${f.id}_${t}`;
      const body = lines(`${f.modifier} = ${num(v)}`, f.extra ? modLines(f.extra) : '', f.chair === 'master' ? '' : `max_command_power = ${10 * t}`, block('ai_will_do', 'factor = 1'));
      traitBlocks.push(block(id, body, 1));
      loc.set(id, f.tiers.length === 1 ? f.name : `${f.name} ${core.chiefTierNames[i]}`);
      loc.set(`${id}_desc`, f.desc);
    });
  }
  staged.text('common/country_leader/zin_military_traits.txt', `${HEADER}\n# Advisor traits of the chiefs of the host, fleet and wings and of the Marshals and Masters of the Council (section 2.2).\n# The ruler and councillor traits stay in 00_zin_leader_traits.txt (vanilla_removal.mjs); the ids never overlap.\nleader_traits = {\n${traitBlocks.join('\n')}\n}\n`);

  // The characters.
  const chars = [], startup = [], seen = new Set(), usedBy = new Map();
  for (const p of plan) {
    if (seen.has(p.id)) throw new Error(`Duplicate chief ${p.id}`);
    seen.add(p.id);
    const r = rng(`inst:chief:${p.id}`), pool = pools.get(p.country.scan);
    const female = r() < 0.3, given = pickFrom(female ? pool.female : pool.male, r), surname = pickFrom(pool.surnames, r);
    const chair = core.chairs[p.chair], list = byChair(p.chair);
    const used = usedBy.get(p.country.tag) ?? usedBy.set(p.country.tag, new Set()).get(p.country.tag);
    const fam = pickFrom(list.filter(f => !used.has(f.id)), r);
    used.add(fam.id);
    const tiers = fam.tiers.length === 1 ? [1] : core.chiefTierFor[p.tier];
    const tier = fam.tiers.length === 1 ? 1 : pickFrom(tiers, r);
    p.trait = `zin_chief_${fam.id}_${tier}`;
    const token = `${p.id}_adv`;
    const visible = p.chair === 'navy' ? 'visible = { any_owned_state = { is_coastal = yes } }' : p.chair === 'air' ? 'visible = { zin_rules_skies_present = yes }' : '';
    const adv = lines(`slot = ${chair.slot}`, `idea_token = ${token}`, `ledger = ${chair.ledger}`, `cost = ${core.chairCost}`, `traits = { ${p.trait} }`, visible, block('ai_will_do', 'factor = 1'));
    chars.push(block(p.id, lines(`name = ${p.id}`, `gender = ${female ? 'female' : 'male'}`, block('advisor', adv)), 1));
    loc.set(p.id, `${given} ${surname}`);
    loc.set(token, `${given} ${surname}`);
    startup.push(p);
  }
  // marshals of one realm take different families (the pick above reads p._used of each plan entry, so share it).
  staged.text('common/characters/zin_chiefs.txt', `${HEADER}\n# Generated chiefs, marshals and masters of lore for the realms of tier A and B (section 2.2). Zol has none (S4).\ncharacters = {\n${chars.join('\n')}\n}\n`);
  return { chiefs: plan.length, plan };
}

// ============================================================================================ unit leader traits
const TRAIT_TYPE = t => (t.includes(' ') ? `{ ${t} }` : t);
const adviserOf = (map, id) => map[id];

export async function writeUnitLeaderTraits(staged, env) {
  const { data, loc, eloc, sprites } = env, T = data.traits, ids = new Set(), out = [];
  const TERRAIN_BLOCKS = new Set(['desert', 'hills', 'forest', 'mountain', 'plains', 'urban', 'jungle', 'marsh', 'river', 'fort', 'water_fjords', 'water_deep_ocean', 'water_shallow_sea']);
  const flat = o => Object.fromEntries(Object.entries(o).filter(([k, v]) => typeof v !== 'object'));
  for (const t of T.traits) {
    if (ids.has(t.id)) throw new Error(`Duplicate commander trait ${t.id}`);
    ids.add(t.id);
    for (const blockName of ['mod', 'ns', 'fm', 'cc']) {
      const m = t[blockName]; if (!m) continue;
      for (const [k, v] of Object.entries(m)) if (typeof v === 'object' && !TERRAIN_BLOCKS.has(k)) throw new Error(`Trait ${t.id}: ${k} is not a terrain or combat block`);
      await checkMods(`trait ${t.id}`, flat(m));
    }
    const l = [`type = ${TRAIT_TYPE(t.type)}`];
    if (t.tt) l.push(`trait_type = ${t.tt}`);
    if (t.extra) l.push(...t.extra);
    if (t.sk) for (const [k, v] of Object.entries(t.sk)) l.push(`${k} = ${v}`);
    if (t.skf) for (const [k, v] of Object.entries(t.skf)) l.push(`${k} = ${v}`);
    if (t.cost) l.push(`cost = ${t.cost}`);
    if (t.gx) l.push(block('gain_xp', t.gx));
    if (t.gxl) l.push(block('gain_xp_leader', t.gxl));
    if (t.gxSpot) l.push(`gain_xp_on_spotting = ${t.gxSpot}`);
    if (t.gxTip) l.push(`custom_gain_xp_trigger_tooltip = ${t.gxTip}`);
    if (t.prereq) l.push(block('prerequisites', t.prereq));
    if (t.prereqTip) l.push(`custom_prerequisite_tooltip = ${t.prereqTip}`);
    if (t.mod) l.push(block('modifier', modLines(t.mod)));
    if (t.ns) l.push(block('non_shared_modifier', modLines(t.ns)));
    if (t.fm) l.push(block('field_marshal_modifier', modLines(t.fm)));
    if (t.cc) l.push(block('corps_commander_modifier', modLines(t.cc)));
    if (t.xpf) l.push(block('trait_xp_factor', modLines(t.xpf)));
    if (t.tooltip) l.push(`custom_effect_tooltip = ${t.tooltip}`);
    if (t.override) l.push(`override_effect_tooltip = ${t.override}`);
    if (t.ability) l.push(`enable_ability = ${t.ability}`);
    const ad = adviserOf(T.adviserMap, t.id);
    if (ad) l.push(`slot = ${ad[0]}`, `specialist_advisor_trait = zin_chief_${ad[1]}_1`, `expert_advisor_trait = zin_chief_${ad[1]}_2`, `genius_advisor_trait = zin_chief_${ad[1]}_3`);
    if (t.parents) l.push(t.need && t.need > 1 ? block('parent', `traits = { ${t.parents.join(' ')} }\nnum_parents_needed = ${t.need}`) : `any_parent = { ${t.parents.join(' ')} }`);
    if (t.mutex) for (const m of t.mutex) l.push(`mutually_exclusive = ${m}`);
    if (t.row !== undefined) l.push(`gui_row = ${t.row}`);
    if (t.col !== undefined) l.push(`gui_column = ${t.col}`);
    if (t.group !== 'status' && t.group !== 'op' && t.row !== undefined) l.push(block('ai_will_do', 'factor = 1'));
    if (t.raw) l.push(t.raw);
    else if (t.weight !== undefined) l.push(block('new_commander_weight', t.exclusive ? lines(`factor = ${t.weight}`, block('modifier', `has_trait = ${t.exclusive}\nfactor = 0`)) : `factor = ${t.weight}`));
    out.push(block(t.id, l.join('\n'), 1));
    eloc.set(t.id, t.name); eloc.set(`${t.id}_desc`, t.desc);
    sprites.suggest(`GFX_trait_${t.id}`, t.art);
  }
  for (const [k, v] of Object.entries(T.tooltips)) loc.set(k, v);
  // Every ability a trait enables, every chief family a trait converts to, every parent and exclusion must exist.
  const abilityIds = new Set(data.core.abilities.map(a => a.id)), familyIds = new Set(data.core.chiefFamilies.map(f => f.id));
  for (const t of T.traits) {
    if (t.ability && !abilityIds.has(t.ability)) throw new Error(`Trait ${t.id} enables unknown ability ${t.ability}`);
    for (const p of [...(t.parents ?? []), ...(t.mutex ?? [])]) if (!ids.has(p)) throw new Error(`Trait ${t.id} names unknown trait ${p}`);
  }
  for (const [tid, [slot, fam]] of Object.entries(T.adviserMap).filter(([k]) => k !== '_note')) { if (!ids.has(tid)) throw new Error(`Adviser map names unknown trait ${tid}`); if (!familyIds.has(fam)) throw new Error(`Adviser map names unknown family ${fam}`); }
  staged.text('common/unit_leader/00_traits.txt', `${HEADER}\n# Commander traits of Erdae. Overrides the vanilla file of the same name (never replace_path this folder). The engine keys\n# stay; names, text and values are Erdae's. No trait names a tank, an aeroplane or a submarine.\nleader_traits = {\n${out.join('\n')}\n}\n`);
  for (const f of T.tags) staged.text(`common/unit_leader/${f}`, `${HEADER}\n# Comment-only override: the vanilla file of this name held traits for vanilla countries that do not exist in Erdae.\nleader_traits = {\n}\n`);
  return { traits: ids.size };
}

// ============================================================================================ 3.1 Valour
const EXP_TRIGGER = { army: 'has_army_experience', navy: 'has_navy_experience', air: 'has_air_experience' };
export function valourDecisions(env) {
  const { data, loc, sprites } = env, V = data.core.valour, out = [];
  loc.set(V.category, V.categoryName); loc.set(`${V.category}_desc`, V.categoryDesc);
  sprites.use(`GFX_decision_category_${V.category}`, 'levy_muster');
  sprites.use(`GFX_decision_cat_picture_${V.category}`, 'levy_muster');
  for (const d of V.decisions) {
    const short = d.id.replace('zin_inst_', '');
    const pool = d.pool === 'army' ? 'army_experience' : d.pool === 'navy' ? 'navy_experience' : 'air_experience';
    const unitVar = d.pool === 'navy' ? 'num_ships' : d.pool === 'army' ? 'num_divisions' : 'zin_dragon_flights';
    const visible = d.pool === 'army' ? `has_army_size = { size > ${d.minUnits - 1} }` : d.pool === 'navy' ? `has_navy_size = { size > ${d.minUnits - 1} }` : lines('zin_rules_skies_present = yes', `check_variable = { zin_dragon_flights > ${d.minUnits - 1} }`);
    const gearTrigger = Object.entries(d.gear ?? {}).map(([e, n]) => `has_equipment = { ${e} > ${n - 1} }`);
    const gearEffects = Object.entries(d.gear ?? {}).map(([e, n]) => `add_equipment_to_stockpile = {\n\ttype = ${e}\n\tamount = -${n}\n}`);
    const wearUnit = d.pool === 'army' ? 'army = yes' : d.pool === 'navy' ? 'navy = yes' : 'air = yes';
    const calc = lines(
      `set_temp_variable = { zin_inst_gain = ${unitVar} }`,
      d.unitsPerStep > 1 ? `divide_temp_variable = { zin_inst_gain = ${d.unitsPerStep} }` : '',
      d.unitsPerStep > 1 ? 'round_temp_variable = zin_inst_gain' : '',
      d.step !== 1 ? `multiply_temp_variable = { zin_inst_gain = ${d.step} }` : '',
      `add_to_temp_variable = { zin_inst_gain = ${d.base} }`,
      `clamp_temp_variable = { var = zin_inst_gain max = ${d.cap} }`,
      `${pool} = zin_inst_gain`);
    const body = lines(
      `icon = ${short}`,
      block('allowed', 'always = yes'),
      block('visible', visible),
      block('available', lines('NOT = { has_war_with_major = yes }', ...gearTrigger)),
      `cost = ${d.authority}`,
      block('custom_cost_trigger', `command_power > ${d.orders - 1}`),
      `custom_cost_text = ${d.id}_cost_tt`,
      `days_re_enable = ${d.cooldown}`,
      block('complete_effect', lines(
        `add_command_power = -${d.orders}`,
        ...gearEffects,
        `damage_units = {\n\t${wearUnit}\n\tratio = yes\n\tstr_damage = ${num(d.wear)}\n\tlimit = { tag = ROOT }\n}`,
        `custom_effect_tooltip = ${d.id}_wear_tt`,
        calc)),
      block('ai_will_do', lines('factor = 1', block('modifier', 'factor = 0\nhas_war = yes'), block('modifier', `factor = 0\n${EXP_TRIGGER[d.pool]} > 99`), block('modifier', 'factor = 0\ncommand_power < 40'))));
    out.push(block(d.id, body, 1));
    loc.set(d.id, d.name); loc.set(`${d.id}_desc`, d.desc);
    loc.set(`${d.id}_cost_tt`, `${d.orders} Orders`);
    loc.set(`${d.id}_wear_tt`, `${Math.round(d.wear * 100)}% of the strength of the ${d.pool === 'army' ? 'hosts' : d.pool === 'navy' ? 'ships' : 'wings'} is lost to the drill`);
    sprites.use(`GFX_decision_${short}`, d.art);
  }
  return out;
}

export function writeValour(staged, env) {
  const V = env.data.core.valour, decisions = valourDecisions(env);
  staged.text('common/decisions/categories/zin_inst.txt', `${HEADER}\n${V.category} = {\n\ticon = ${V.category}\n\tpicture = GFX_decision_cat_picture_${V.category}\n\tpriority = 20\n\tallowed = { always = yes }\n\tvisible = { always = yes }\n}\n`);
  staged.text('common/decisions/zin_inst.txt', `${HEADER}\n# The three drills that pay Valour in the long peace (section 3.1): a floor on top of the engine's training.\n${V.category} = {\n${decisions.join('\n')}\n}\n`);
  return { decisions: V.decisions.length };
}

// ============================================================================================ hooks and on_actions
export function warTriggers() {
  return lines(
    '# A War Camp stands: a host built round the standard exists.',
    block('zin_inst_war_camp_deployed', 'any_country_division = {\n\tdivision_has_battalion_in_template = zin_hq_banner\n}'),
    '',
    '# Sending Arms (section 5). Scope: the lender. FROM: the receiver.',
    block('zin_inst_lend_ok', lines(
      'OR = {',
      '\tis_in_faction_with = FROM',
      '\tis_subject_of = FROM',
      '\tFROM = { is_subject_of = PREV }',
      '\thas_opinion = { target = FROM value > 49 }',
      '}',
      'NOT = {',
      '\tzin_diplo_refusal_binds = yes',
      '\tFROM = { has_country_flag = zin_people_men }',
      '}',
      'OR = {',
      '\tAND = {',
      '\t\tzin_diplo_is_dark_power = no',
      '\t\tFROM = { zin_diplo_is_dark_power = no }',
      '\t}',
      '\tAND = {',
      '\t\tzin_diplo_is_dark_power = yes',
      '\t\tFROM = { zin_diplo_is_dark_power = yes }',
      '\t}',
      '}')));
}

// The leader on_actions the vanilla folder carried (the folder is replaced): fevers and wounds of commanders, the
// rank penalty after a promotion, and the capture of a defeated deployed commander ("held for ransom").
export function leaderOnActions() {
  return `\ton_army_leader_daily = {
\t\teffect = {
\t\t\tif = {
\t\t\t\tlimit = {
\t\t\t\t\tcheck_variable = { random < 0.02 }
\t\t\t\t\tNOT = { has_trait = sick }
\t\t\t\t\tNOT = { has_unit_leader_flag = zin_recently_sick }
\t\t\t\t\tset_temp_variable = { temp = sum_unit_terrain_modifier@sickness_chance }
\t\t\t\t\tdivide_temp_variable = { temp = num_units }
\t\t\t\t\tcheck_variable = { temp > 0.75 }
\t\t\t\t}
\t\t\t\tadd_timed_unit_leader_trait = {
\t\t\t\t\ttrait = sick
\t\t\t\t\tdays = 30
\t\t\t\t}
\t\t\t\tset_unit_leader_flag = {
\t\t\t\t\tflag = zin_recently_sick
\t\t\t\t\tvalue = 1
\t\t\t\t\tdays = 180
\t\t\t\t}
\t\t\t}
\t\t}
\t}
\ton_army_leader_won_combat = {
\t\teffect = {
\t\t\tif = {
\t\t\t\tlimit = {
\t\t\t\t\tset_temp_variable = { chance = 0.001 }
\t\t\t\t\tset_temp_variable = { factor = 1.0 }
\t\t\t\t\tadd_to_temp_variable = { factor = leader_modifier@wounded_chance_factor }
\t\t\t\t\tmultiply_temp_variable = { chance = factor }
\t\t\t\t\tcheck_variable = { random < chance }
\t\t\t\t\tNOT = { has_trait = wounded }
\t\t\t\t}
\t\t\t\tadd_timed_unit_leader_trait = {
\t\t\t\t\ttrait = wounded
\t\t\t\t\tdays = 90
\t\t\t\t}
\t\t\t}
\t\t}
\t}
\ton_army_leader_lost_combat = {
\t\teffect = {
\t\t\tif = {
\t\t\t\tlimit = {
\t\t\t\t\tset_temp_variable = { chance = 0.005 }
\t\t\t\t\tset_temp_variable = { factor = 1.0 }
\t\t\t\t\tadd_to_temp_variable = { factor = leader_modifier@wounded_chance_factor }
\t\t\t\t\tmultiply_temp_variable = { chance = factor }
\t\t\t\t\tcheck_variable = { random < chance }
\t\t\t\t\tNOT = { has_trait = wounded }
\t\t\t\t}
\t\t\t\tadd_timed_unit_leader_trait = {
\t\t\t\t\ttrait = wounded
\t\t\t\t\tdays = 90
\t\t\t\t}
\t\t\t}
\t\t}
\t}
\ton_army_leader_promoted = {
\t\teffect = {
\t\t\tadd_timed_unit_leader_trait = {
\t\t\t\ttrait = recently_promoted
\t\t\t\tdays = 100
\t\t\t}
\t\t}
\t}
\ton_deployed_leader_defeated = {
\t\teffect = {
\t\t\tif = {
\t\t\t\tlimit = { can_be_captured = yes }
\t\t\t\tcapture_by = FROM
\t\t\t}
\t\t\telse = {
\t\t\t\tif = {
\t\t\t\t\tlimit = { NOT = { has_trait = wounded } }
\t\t\t\t\tadd_timed_unit_leader_trait = {
\t\t\t\t\t\ttrait = wounded
\t\t\t\t\t\tdays = 90
\t\t\t\t\t}
\t\t\t\t}
\t\t\t}
\t\t}
\t}`;
}
