// Institutions, craft group (spec 03_gameplay/08_institutions.md sections 9 and 10): the nine workshops as
// military-industrial organisations with one tree shape, their policies and AI weights; the four rites as special
// project specialisations, the nine spells, their prototype rewards, the scholars' traits and the scars.
import { readFile } from 'node:fs/promises';
import { GAME } from './paths.mjs';
import { scriptText } from './clausewitz.mjs';
import { checkMods, HEADER, block, lines, modLines, num, countryKey } from './inst_util.mjs';

const POS = { m: 1, p: 3, s: 5 };
const TRAIT_ICON = { cost: 'coin_chest', speed: 'roads_paved', research: 'book_lore', size: 'guild_hall', funds: 'ledger_coins', reliability: 'forge_anvil', defence: 'sword_shield', attack: 'spear_levy', breakthrough: 'war_drums', armour: 'knight_lance', naval: 'ship_voyage', mounts: 'horse_cavalry', capstone: 'crown_witnesses', wards: 'lantern_chain', pierce: 'bow_archers' };
const statIcon = eq => {
  const k = Object.keys(eq)[0];
  return { reliability: 'reliability', defense: 'defence', soft_attack: 'attack', hard_attack: 'attack', breakthrough: 'breakthrough', armor_value: 'armour', maximum_speed: 'mounts', naval_speed: 'naval', naval_range: 'naval', max_strength: 'naval', build_cost_ic: 'cost', ap_attack: 'pierce' }[k] ?? 'attack';
};

// The people and country tests of a workshop's `allowed`. Tags are listed because the check runs at game start for every
// country, before the people flags exist; the flags stay for realms that join later (P9).
function allowedTrigger(w, env) {
  const { countries, table } = env, tags = new Set();
  if (w.coastal) return 'any_owned_state = {\n\tis_coastal = yes\n}';
  for (const c of countries) {
    const p = table.get(c.tag).people;
    if (w.peoples?.includes(p) || w.countries?.includes(c.name)) tags.add(c.tag);
  }
  const flags = (w.peoples ?? []).map(p => `has_country_flag = zin_people_${p}`);
  return block('OR', lines(...[...tags].sort().map(t => `original_tag = ${t}`), ...flags));
}

export async function writeWorkshops(staged, env) {
  const { data, loc, sprites } = env, C = data.craft, out = [], ids = new Set();
  for (const [col, , label] of C.tree.columns) loc.set(`zin_mio_head_${col}`, label);
  loc.set('zin_mio_head_capstone', 'Capstone');
  for (const w of C.workshops) {
    if (ids.has(w.id)) throw new Error(`Duplicate workshop ${w.id}`);
    ids.add(w.id);
    sprites.use(`GFX_${w.id}`, w.art);
    loc.set(w.id, w.name); loc.set(`${w.id}_desc`, w.desc);
    const traits = [];
    const bonuses = [{ token: 'm1', ...C.tree.methods[0], col: 'm', row: 0 }, { token: 'm2', ...C.tree.methods[1], col: 'm', row: 1, parent: ['m1'] }, { token: 'm3', ...C.tree.methods[2], col: 'm', row: 2, parent: ['m2'] },
      ...w.p.map((p, i) => ({ token: `p${i + 1}`, name: p.name, desc: p.desc, eq: p.eq, col: 'p', row: i, parent: i ? [`p${i}`] : undefined })),
      { token: 's1', ...C.tree.standing[0], col: 's', row: 0 }, { token: 's2', ...C.tree.standing[1], col: 's', row: 1, parent: ['s1'] }, { token: 's3', ...C.tree.standing[2], col: 's', row: 2, parent: ['s2'] }];
    for (const b of bonuses) {
      for (const m of [b.eq, b.prod, b.org]) if (m) await checkMods(`workshop ${w.id} ${b.token}`, Object.fromEntries(Object.entries(m).filter(([k]) => !EQUIP_STATS.has(k))));
      const gate = w.gates?.[b.token] ?? (b.token === 's2' ? C.tree.standing[1].tech : b.token === 's3' ? C.tree.standing[2].tech : undefined);
      const iconKind = b.icon ?? statIcon(b.eq ?? {});
      sprites.use(`GFX_zin_mio_${iconKind}`, TRAIT_ICON[iconKind]);
      traits.push(block('trait', lines(`token = ${b.token}`, `name = ${w.id}_${b.token}`, `icon = GFX_zin_mio_${iconKind}`,
        b.parent ? `any_parent = { ${b.parent.join(' ')} }` : '', b.eq ? block('equipment_bonus', modLines(b.eq)) : '', b.prod ? block('production_bonus', modLines(b.prod)) : '', b.org ? block('organization_modifier', modLines(b.org)) : '',
        gate ? block('available', `FROM = {\n\thas_tech = ${gate}\n}`) : '', block('position', `x = ${POS[b.col]} y = ${b.row}`), block('ai_will_do', 'factor = 1'))));
      loc.set(`${w.id}_${b.token}`, b.name); loc.set(`${w.id}_${b.token}_desc`, b.desc);
    }
    // the capstone
    await checkMods(`workshop ${w.id} capstone`, Object.fromEntries(Object.entries({ ...w.cap.eq, ...w.cap.prod }).filter(([k]) => !EQUIP_STATS.has(k))));
    sprites.use('GFX_zin_mio_capstone', TRAIT_ICON.capstone);
    traits.push(block('trait', lines('token = cap', `name = ${w.id}_cap`, 'icon = GFX_zin_mio_capstone', 'special_trait_background = yes', `all_parents = { m3 p3 s3 }`,
      block('equipment_bonus', modLines(w.cap.eq)), Object.keys(w.cap.prod).length ? block('production_bonus', modLines(w.cap.prod)) : '',
      block('available', `FROM = {\n\thas_tech = ${C.tree.capstoneTech}\n}`), 'position = { x = 3 y = 3 }', block('ai_will_do', 'factor = 1'))));
    loc.set(`${w.id}_cap`, w.cap.name); loc.set(`${w.id}_cap_desc`, w.cap.desc);
    const initial = block('initial_trait', lines(`name = ${w.id}_initial`, block('equipment_bonus', modLines(w.initial.eq))));
    loc.set(`${w.id}_initial`, w.initial.name); loc.set(`${w.id}_initial_desc`, `Every ${w.name.replace(/^The /, '')} item starts with this.`);
    out.push(block(w.id, lines(`name = ${w.id}`, `icon = GFX_${w.id}`, block('allowed', allowedTrigger(w, env)),
      block('equipment_type', w.eq.join('\n')), block('research_categories', w.cats.join('\n')), 'task_capacity = 3', block('ai_will_do', `factor = ${w.ai ?? 1}`),
      ...C.tree.columns.map(([col, x]) => block('tree_header_text', `text = zin_mio_head_${col}\nx = ${x}`)), block('tree_header_text', 'text = zin_mio_head_capstone\nx = 3'),
      initial, ...traits), 0));
  }
  staged.text('common/military_industrial_organization/organizations/zin_workshops.txt', `${HEADER}\n# The nine Erdae workshops (guilds, a lodge, a stud and orders). One tree shape: Methods, Patterns, Standing, then the capstone.\n# \`allowed\` lists the realms of the peoples that may found each (tags, because the check runs before the people flags exist).\n${out.join('\n\n')}\n`);
  return { workshops: ids.size, workshopTraits: ids.size * 10 };
}
// Names that are equipment stats or production stats of the MIO scripts, not country modifiers.
const EQUIP_STATS = new Set(['reliability', 'build_cost_ic', 'soft_attack', 'hard_attack', 'defense', 'breakthrough', 'armor_value', 'maximum_speed', 'naval_speed', 'naval_range', 'max_strength', 'ap_attack', 'production_cost_factor', 'production_efficiency_gain_factor', 'production_efficiency_cap_factor', 'production_capacity_factor', 'production_resource_need_factor', 'military_industrial_organization_research_bonus', 'military_industrial_organization_task_capacity', 'military_industrial_organization_funds_gain']);

const half = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Number((v / 2).toFixed(4))]));
export function writePolicies(staged, env) {
  const { data, loc, sprites } = env, C = data.craft, out = [];
  for (const p of C.policies) {
    sprites.use(`GFX_${p.id}`, p.art); loc.set(p.id, p.name); loc.set(`${p.id}_desc`, p.desc);
    out.push(block(p.id, lines(`icon = GFX_${p.id}`, 'cost = 10', 'cooldown = 60', block('allowed', 'always = yes'), block('available', 'has_mio_size > 1'),
      p.eq ? block('equipment_bonus', block('same_as_mio', modLines(p.eq))) : '', p.prod ? block('production_bonus', block('same_as_mio', modLines(p.prod))) : '', block('ai_will_do', 'factor = 1'))));
  }
  for (const w of C.workshops) {
    const id = `zin_mio_${w.short}_sign`;
    sprites.use(`GFX_${id}`, w.art); loc.set(id, w.sign.name); loc.set(`${id}_desc`, `The ${w.name.replace(/^The /, '')} lend their ${w.cap.name.replace(/^The /, '')} at half strength, and take a cost in return.`);
    const eq = half(w.cap.eq), prod = half(w.cap.prod ?? {});
    const penaltyEq = Object.fromEntries(Object.entries(w.sign.penalty).filter(([k]) => k === 'build_cost_ic')), penaltyProd = Object.fromEntries(Object.entries(w.sign.penalty).filter(([k]) => k !== 'build_cost_ic'));
    const eqAll = { ...eq, ...penaltyEq }, prodAll = { ...prod, ...penaltyProd };
    out.push(block(id, lines(`icon = GFX_${id}`, 'cost = 10', 'cooldown = 60',
      block('allowed', block('OR', w.eq.map(e => `has_mio_equipment_type = ${e}`).join('\n'))), block('available', 'has_mio_size > 1'),
      block('equipment_bonus', block('same_as_mio', modLines(eqAll))), Object.keys(prodAll).length ? block('production_bonus', block('same_as_mio', modLines(prodAll))) : '', block('ai_will_do', 'factor = 1'))));
  }
  staged.text('common/military_industrial_organization/policies/zin_workshop_policies.txt', `${HEADER}\n# Twelve policies: three generic (Guild Charters, Master's Marks, Royal Warrants) and one signature policy per workshop.\n${out.join('\n\n')}\n`);
  return { policies: out.length };
}

export function writeAiWeights(staged, env) {
  const A = env.data.craft.aiWeights;
  const bl = (name, o) => block(name, modLines(o));
  staged.text('common/military_industrial_organization/ai_bonus_weights/zin_ai_bonus_weights.txt', `${HEADER}\n# What the AI wants from a workshop's traits (the default block must name every stat a trait uses).\n${Object.entries(A.types).map(([k, v]) => bl(k, v)).join('\n\n')}\n\n${bl('default', A.default)}\n`);
  return { weightTypes: Object.keys(A.types).length };
}

// ============================================================================================ 10. spells
const LOW = { low: 'constant:sp_scientist_xp_gain.low', medium: 'constant:sp_scientist_xp_gain.medium', high: 'constant:sp_scientist_xp_gain.high' };
const darkWeight = base => lines(`base = ${num(base)}`, block('modifier', lines('set_temp_variable = { zin_inst_dark = global.zin_gathering_dark }', `multiply_temp_variable = { zin_inst_dark = ${num(base / 100)} }`, 'add = zin_inst_dark')),
  block('modifier', 'factor = 0.5\nvar:scientist = { has_trait = zin_sch_steady_hand }'), block('modifier', 'factor = 0.5\nvar:scientist = { has_trait = zin_sch_cautious }'), block('modifier', 'factor = 1.5\nvar:scientist = { has_trait = zin_sch_restless }'));
const lvl = (spec, body) => block('if', lines(block('limit', `has_scientist_level = {\n\tlevel < 5\n\tspecialization = ${spec}\n}`), body));

export async function writeSpells(staged, env) {
  const { data, loc, eloc, sprites, countries } = env, C = data.craft, R = C.rites, rite = id => R.find(r => r.id === id), out = [], ideas = [];
  const tagOf = n => { const c = countries.find(x => x.name === n); if (!c) throw new Error(`Spells name ${n}, which is not in the roster`); return c.tag; };
  // specialisations and tags
  staged.text('common/special_projects/specialization/zin_spells.txt', `${HEADER}\n# The four rites. The keys are the engine's: the facility buildings name them.\n${R.map(r => {
    sprites.use(`GFX_zin_sp_rite_${r.id}`, r.art); sprites.use(`GFX_zin_sp_rite_${r.id}_blueprint`, r.art);
    eloc.set(r.spec, r.name);
    return block(r.spec, lines(`icon = GFX_zin_sp_rite_${r.id}`, `blueprint_image = GFX_zin_sp_rite_${r.id}_blueprint`, 'program_background = "GFX_sp_facility_card_bg"', `color = { ${r.color.join(' ')} }`));
  }).join('\n')}\n`);
  staged.text('common/special_projects/project_tags/zin_spells.txt', `${HEADER}\nproject_tags = {\n${R.map(r => `\t${r.tag}`).join('\n')}\n}\n`);
  for (const r of R) loc.set(r.tag, r.name);
  // rewards
  const rewards = [], rewardIds = new Set(), rewardsOf = new Map(R.map(r => [r.id, []]));
  const addReward = (rid, body, name, desc, art, optName) => {
    if (rewardIds.has(rid)) throw new Error(`Duplicate reward ${rid}`);
    rewardIds.add(rid); loc.set(rid, name); loc.set(`${rid}_desc`, desc); loc.set(`${rid}_option`, optName ?? name); sprites.use(`GFX_${rid}`, art);
    rewards.push(block(rid, lines(block('narrative', `name = ${rid}\ndesc = ${rid}_desc`), `icon = GFX_${rid}`, body), 0));
  };
  const rewardOutput = (rw, r) => {
    const spec = r?.spec;
    if (rw.xp) return block('scientist_effects', lvl(spec, block('add_scientist_xp', `experience = ${LOW[rw.xp]}\nspecialization = ${spec}`)));
    if (rw.id === 'insight') return block('country_effects', block('add_tech_bonus', `name = zin_sp_reward_insight_${r.id}_bonus\nbonus = 0.5\nuses = 1\ncategory = ${C.insightCategories[r.id]}`));
    if (rw.gain) return block('country_effects', block('FROM', 'add_project_progress_ratio = constant:sp_progress.gain.medium'));
    if (rw.nothing) return '';
    if (rw.injure) return lines(block('scientist_effects', `injure_scientist_for_days = ${rw.injure}`), block('country_effects', block('FROM', `add_project_progress_ratio = ${rw.loss}`)));
    if (rw.scar) return block('facility_state_effects', block('if', lines(block('limit', SCAR_FREE), block('add_dynamic_modifier', `modifier = ${C.scars.find(s => s.rite === r.id).id}\ndays = 365`))));
    if (rw.marked) return block('scientist_effects', block('add_dynamic_modifier', `modifier = ${C.marked.id}`));
    if (rw.surge) return block('country_effects', block('add_timed_idea', `idea = ${C.ideas.wildSurge.id}\ndays = 90`));
    if (rw.loss) return block('country_effects', block('FROM', `add_project_progress_ratio = ${rw.loss}`));
    throw new Error(`Reward ${rw.id} has no effect`);
  };
  for (const rw of C.rewards) {
    for (const r of (rw.xp || rw.perRite) ? R : [null]) {
      const rid = r ? `zin_sp_reward_${rw.id}_${r.id}` : `zin_sp_reward_${rw.id}`, out_ = rewardOutput(rw, r);
      if (rw.id === 'insight') loc.set(`${rid}_bonus`, `${r.name}: a clearer sight of the craft`);
      let weight = `base = ${num(rw.weight)}`;
      if (rw.bad) weight = rw.scar ? lines(darkWeight(rw.weight), block('modifier', `factor = 0\nvar:facility_state = { ${SCAR_ANY} }`)) : darkWeight(rw.weight);
      addReward(rid, lines(rw.once ? 'fire_only_once = yes' : '', 'threshold = { min = 0 max = 100 }', block('weight', weight), block('option', lines(`token = ${rid}_option`, block('narrative', `name = ${rid}_option`), out_ ? block('iteration_output', out_) : ''))), rw.name, rw.desc, r ? r.art : 'book_lore');
      for (const x of r ? [r] : R) rewardsOf.get(x.id).push(rid);
    }
  }
  staged.text('common/special_projects/prototype_rewards/zin_spells.txt', `${HEADER}\n# What a prototype iteration can bring (section 10): steady work and insight, a clear morning or a wasted night, and the five\n# backlashes (burned hands, scarred ground, a mark on the scholar, a wild surge, lost notes).\n${rewards.join('\n\n')}\n`);

  // projects
  const sp_ids = new Set();
  for (const s of C.spells) {
    if (sp_ids.has(s.id)) throw new Error(`Duplicate spell ${s.id}`);
    sp_ids.add(s.id);
    const r = rite(s.rite);
    if (s.idea) { await checkMods(`spell ${s.id}`, Object.fromEntries(Object.entries(s.idea).filter(([k]) => !k.startsWith('country_resource_')))); }
    const who = [];
    if (s.who) who.push(`OR = {\n${s.who.map(p => `\thas_country_flag = zin_people_${p}`).join('\n')}\n}`);
    if (s.coastal) who.push('any_owned_state = {\n\tis_coastal = yes\n}');
    if (s.except) who.push(...s.except.map(n => `NOT = { original_tag = ${tagOf(n)} }`));
    if (s.only) who.push(`OR = {\n${s.only.map(n => `\toriginal_tag = ${tagOf(n)}`).join('\n')}\n}`);
    if (s.dragons) who.push('check_variable = { zin_dragon_flights > 0 }');
    if (s.sky || s.rite === 'sky') who.push('zin_rules_skies_present = yes');
    let output = '';
    const parts = [];
    if (s.idea) { parts.push(block('country_effects', `add_ideas = zin_sp_out_${s.key}`)); ideas.push(block(`zin_sp_out_${s.key}`, lines('allowed = { always = no }', `picture = zin_${s.art}`, 'removal_cost = -1', block('modifier', modLines(s.idea))), 2)); loc.set(`zin_sp_out_${s.key}`, s.name); loc.set(`zin_sp_out_${s.key}_desc`, `Won by the rite of ${s.name}.`); }
    if (s.eqBonus) parts.push(block('equipment_bonus', lines(...Object.entries(s.eqBonus).map(([k, v]) => block(k, lines(modLines(v), 'instant = yes'))))));
    if (s.stateMod) parts.push(block('facility_state_effects', block('add_dynamic_modifier', `modifier = ${s.stateMod}`)));
    if (s.lifting) {
      const clear = scope => lines(...C.scars.map(sc => block('if', lines(block('limit', `has_dynamic_modifier = { modifier = ${sc.id} }`), `remove_dynamic_modifier = { modifier = ${sc.id} }`))));
      parts.push(block('facility_state_effects', lines(clear(), block('every_neighbor_state', clear()))));
      parts.push(block('country_effects', block('every_scientist', block('if', lines(block('limit', `has_dynamic_modifier = { modifier = ${C.marked.id} }`), `remove_dynamic_modifier = { modifier = ${C.marked.id} }`)))));
    }
    output = parts.join('\n');
    const rids = rewardsOf.get(r.id);
    const sprite = `GFX_${s.id}`; sprites.use(sprite, s.art);
    loc.set(s.id, s.name); loc.set(`${s.id}_desc`, s.desc);
    out.push(block(s.id, lines(`specialization = ${r.spec}`, `project_tags = ${r.tag}`, block('ai_will_do', `base = ${s.ai}`), block('allowed', 'always = yes'),
      block('available', `FROM = {\n\thas_tech = ${s.tech}\n}`), who.length ? block('visible', block('FROM', who.join('\n'))) : '',
      block('breakthrough_cost', `${r.spec} = ${s.bt}`), `prototype_time = sp_time.prototype.${s.time}`, `complexity = sp_complexity.${s.cx}`, `icon = ${sprite}`,
      block('narrative', `name = ${s.id}\ndesc = ${s.id}_desc`), output ? block('project_output', output) : '', block('generic_prototype_rewards', rids.join('\n'))), 0));
  }
  staged.text('common/special_projects/projects/zin_spells.txt', `${HEADER}\n# The nine spells: research with failure, ending in a permanent gain, and sometimes a scar. None of them is potent magic (the\n# six rules of magic): they lift no piercing, make no dragon and explain nothing.\n${out.join('\n\n')}\n`);

  // scars, hallowing, marked scholar (dynamic modifiers), wild surge and spell outputs (ideas)
  const dyn = [];
  for (const sc of C.scars) { await checkMods(`scar ${sc.id}`, sc.mod); sprites.use(`GFX_modifiers_${sc.id}`, sc.art); loc.set(sc.id, sc.name); loc.set(`${sc.id}_desc`, sc.desc); dyn.push(block(sc.id, lines(`icon = GFX_modifiers_${sc.id}`, modLines(sc.mod)))); }
  { const h = C.hallowed; await checkMods('hallowed', h.mod); sprites.use(`GFX_modifiers_${h.id}`, h.art); loc.set(h.id, h.name); loc.set(`${h.id}_desc`, h.desc); dyn.push(block(h.id, lines(`icon = GFX_modifiers_${h.id}`, modLines(h.mod)))); }
  { const m = C.marked; await checkMods('marked', m.mod); sprites.use(`GFX_modifiers_${m.id}`, m.art); loc.set(m.id, m.name); loc.set(`${m.id}_desc`, m.desc); dyn.push(block(m.id, lines(`icon = GFX_modifiers_${m.id}`, modLines(m.mod)))); }
  staged.text('common/dynamic_modifiers/zin_scars.txt', `${HEADER}\n# Scars of a failed working (365 days, one per state), the hallowed ground of a finished rite, and the mark on a scholar.\n${dyn.join('\n')}\n`);
  const w = C.ideas.wildSurge; await checkMods('wild surge', w.mod); loc.set(w.id, w.name); loc.set(`${w.id}_desc`, w.desc);
  ideas.push(block(w.id, lines('allowed = { always = no }', `picture = zin_${w.art}`, 'removal_cost = -1', block('modifier', modLines(w.mod))), 2));
  staged.text('common/ideas/zin_institutions.txt', `${HEADER}\n# Outputs of the spells (country spirits) and the timed spirit of a wild surge.\nideas = {\n\tcountry = {\n${ideas.join('\n')}\n\t}\n}\n`);
  return { spells: sp_ids.size, rewards: rewards.length, scars: C.scars.length };
}
const SCAR_ANY = 'OR = { ' + ['hollow', 'wrecked', 'scorched', 'blighted'].map(k => `has_dynamic_modifier = { modifier = zin_inst_scar_${k} }`).join(' ') + ' }';
const SCAR_FREE = `NOT = { ${SCAR_ANY} }`;

// The engine constants of special projects (sp_time, sp_complexity, sp_scientist_xp_gain, sp_progress, ...). Stage 1 bridged
// them in zin_constants.txt; from stage 2 the spells are their only user, so they live here, generated from the installed
// file (removal rule 5: engine data that holds only identifiers and numbers).
export async function writeSpecialProjectConstants(staged) {
  const raw = scriptText(await readFile(`${GAME}/common/script_constants/special_project_constants.txt`)).replace(/\r\n/g, '\n').trim();
  staged.text('common/script_constants/zin_special_projects.txt', `${HEADER}\n# Engine constants of the special projects, generated from the installed file. They replace the stage-1 bridge of the same groups.\n${raw}\n`);
}

export async function writeScholarTraits(staged, env) {
  const { data, loc, sprites } = env, C = data.craft, out = [];
  for (const t of C.scholarTraits) {
    await checkMods(`scholar trait ${t.id}`, t.mod);
    sprites.use(`GFX_${t.id}`, t.art); loc.set(t.id, t.name); loc.set(`${t.id}_desc`, t.desc);
    out.push(block(t.id, lines(`icon = GFX_${t.id}`, block('modifier', modLines(t.mod)), t.elvesOnly ? block('available', 'OR = {\n\thas_country_flag = zin_people_elves\n\thas_country_flag = zin_people_sun_elves\n}') : '')));
  }
  staged.text('common/scientist_traits/zin_scholar_traits.txt', `${HEADER}\n# Scholar traits. They apply to special projects only. The Marked scholar is a dynamic modifier (zin_scars.txt).\n${out.join('\n')}\n`);
  return { scholarTraits: out.length };
}

// Scripted effects other specs call (section 11): grant a scholar, add a scar. Arguments follow decision E1: temporary
// variables zin_arg_<name>; the rite codes are war 1, tide 2, sky 3, deep 4.
export function craftEffects(env) {
  const R = env.data.craft.rites, scarOf = id => env.data.craft.scars.find(s => s.rite === id).id;
  const grantRows = R.map((r, i) => block('if', lines(block('limit', `check_variable = { zin_arg_rite = ${i + 1} }`), block('generate_scientist_character', block('skills', `${r.spec} = 2`)))));
  const grant = block('zin_inst_grant_scholar', lines('# Country scope. Argument rite (zin_arg_rite): war 1, tide 2, sky 3, deep 4. A scholar skilled 2 in that rite joins the court.', ...grantRows));
  const scarRows = R.map((r, i) => block('if', lines(block('limit', lines(`check_variable = { zin_arg_rite = ${i + 1} }`, SCAR_FREE)), block('add_dynamic_modifier', `modifier = ${scarOf(r.id)}\ndays = 365`))));
  const scar = block('zin_inst_add_scar', lines('# State scope. Argument rite (zin_arg_rite): war 1, tide 2, sky 3, deep 4. At most one scar per state (365 days).', ...scarRows));
  return [grant, scar];
}

export function circleStrategies(env) {
  return env.data.craft.ai.circles.map(c => block(`zin_inst_build_${c.rite}_circle`, lines(block('enable', lines(`has_scientist_specialization = ${c.spec}`, c.extra, `${c.building} < 1`, `NOT = {\n\tany_controlled_state = {\n\t\t${c.building} > 0\n\t}\n}`)), 'abort_when_not_enabled = yes', block('ai_strategy', `type = build_building\nid = ${c.building}\nvalue = 10`))));
}

// The scholars of the court at the start: tier A three (elves four), tier B one, skills by people.
export function scholarPlan(env) {
  const { data, countries, table } = env, S = data.craft, { a, b } = env.tiers, plan = [];
  const codeOf = id => S.rites.findIndex(r => r.id === id) + 1;
  for (const [tier, list] of [['a', a], ['b', b]]) for (const c of list) {
    if (data.core.tiers.noChairs.includes(c.name)) continue;
    const people = table.get(c.tag).people, skills = S.scholarSkills[people] ?? ['war'];
    let n = tier === 'b' ? S.scholarCounts.b : (people === 'elves' || people === 'sun_elves') ? S.scholarCounts.aElves : S.scholarCounts.a;
    const rites = [];
    if (c.name === 'Volgan') { for (let i = 0; i < S.scholarCounts.volganDeep; i++) rites.push('deep'); rites.push('war'); n = 4; }
    else for (let i = 0; i < n; i++) rites.push(skills[i % skills.length]);
    plan.push({ tag: c.tag, name: c.name, tier, rites: rites.slice(0, n), codes: rites.slice(0, n).map(codeOf) });
  }
  return plan;
}
