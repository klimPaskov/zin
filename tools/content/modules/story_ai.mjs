// The story AI (docs/specs/03_gameplay/06_historical_path_and_ai.md, "How the AI follows or diverges"; docs/specs/03_gameplay/05_world_tension_and_endings.md,
// "AI" and step 10 of "The world tick").
//   await buildStoryAi(staged, { countries })   after the mechanic slices (it reads their panel refreshes) and before the world tension module,
//                                                whose tick calls zin_ui_refresh once it is staged.
// Writes:
//   common/ai_strategy_plans/zin_<tree>_historical.txt   one plan per tier A tree: the focus order of the tree's historical branch (derived from the
//                                                         tree's own marks), research and law weights; enabled through the rule wrappers
//   common/ai_strategy_plans/zin_<tree>_plausible.txt    PLAUSIBLE: the historical focuses x3, then x1.5 once zin_path_divergence is 50 or more
//   common/ai_strategy/zin_path.txt                      the Gathering Dark's tier rules (tier 1: prepare_for_war -50 toward every realm without a
//                                                         cause; from tier 3: forts beside a dark power), the Grey Ford border war, Afrit's march on Parim
//   common/mtth/zin_mtth.txt                             the paced story mean time and the path's shares and focus favour (hoi4-mtth)
//   common/scripted_effects/zin_story_ai.txt             zin_story_ai_month (the peace after the false god falls), called by the magic month
//   common/scripted_effects/zin_ui.txt                   zin_ui_refresh, the world tick's step 10 for human players
//   localisation/replace/zin_gathering_dark_l_*.yml      the native world tension widget relabelled as the Gathering Dark (ten languages)
// No file here tests a per-power rule directly: plans read the zin_rules_ai_branch_* and zin_rules_ai_default_* wrappers of modules/rules.mjs.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ZIN } from '../lib/paths.mjs';
import { yml } from '../lib/core.mjs';
import { LANGUAGES } from '../lib/loc_parse.mjs';
import { parse, scriptText } from '../lib/clausewitz.mjs';
import { hdr, format, blk, list, num } from '../lib/mech_court_lib.mjs';
import { focusId } from '../lib/focus_model.mjs';

const SPEC = 'docs/specs/03_gameplay/06_historical_path_and_ai.md';
const MOD = 'story_ai';
export const STORY_AI_DATA = new URL('../data/story_ai.json', import.meta.url);
export const loadStoryAi = async () => JSON.parse(await readFile(STORY_AI_DATA, 'utf8'));
const gte = (v, n) => `check_variable = { var = ${v} value = ${num(n)} compare = greater_than_or_equals }`;

// ------------------------------------------------------------------------------------------------- the historical branch of a tree
// A focus's AI under the historical path, with every situational condition false: the tree's own marks decide. A condition is historical
// when it names the path rule's HISTORICAL option or a wrapper of data "historicalChecks"; anything else is false.
export function historicalEvaluator(H) {
  const yes = new Set(H.true), pattern = new RegExp(H.truePattern);
  const isHist = c => {
    if (c.rule) return c.rule.name === 'zin_rule_historical_path' && c.rule.option === 'HISTORICAL';
    if (c.check) return yes.has(c.check) || pattern.test(c.check);
    if (c.not) return !c.not.every(isHist);
    if (c.and) return c.and.every(isHist);
    if (c.or) return c.or.some(isHist);
    return false;
  };
  const mentionsPath = c => !!(c.rule?.name === 'zin_rule_historical_path' || (c.check && (yes.has(c.check) || pattern.test(c.check) || /^zin_rules_/.test(c.check))) || (c.not ?? c.and ?? c.or ?? []).some(mentionsPath));
  return focus => {
    const ai = focus.ai ?? { base: 1 };
    let w = ai.base ?? ai.factor ?? 1, favoured = false;
    for (const m of ai.modifiers ?? []) {
      const conds = m.if ?? [];
      if (!conds.every(isHist)) continue;
      if (m.add !== undefined) { w += m.add; if (m.add > 0 && conds.some(mentionsPath)) favoured = true; }
      if (m.factor !== undefined) { w *= m.factor; if (m.factor > 1 && conds.some(mentionsPath)) favoured = true; }
    }
    return { weight: Math.max(0, w), favoured };
  };
}

// The plan's focus order: the favoured focuses and the prerequisites they need, without a focus the path rules out (weight 0) and with one
// side of every mutual exclusion (the higher weight; on a tie the earlier in the tree), in prerequisite order, then by row, weight and column.
export function historicalOrder(tree, evaluate) {
  const byKey = new Map(tree.focuses.map(f => [f.key, f]));
  const score = new Map(tree.focuses.map(f => [f.key, evaluate(f)]));
  const alive = k => (score.get(k)?.weight ?? 0) > 0;
  const chosen = new Set();
  const need = (k, seen = new Set()) => {
    if (chosen.has(k)) return true;
    if (!alive(k) || seen.has(k)) return false;
    seen.add(k);
    const f = byKey.get(k), picks = [];
    for (const group of f.prerequisite ?? []) {
      const ok = group.filter(alive).sort((a, b) => (chosen.has(b) - chosen.has(a)) || score.get(b).weight - score.get(a).weight || byKey.get(a).y - byKey.get(b).y);
      if (!ok.length) return false;
      picks.push(ok[0]);
    }
    for (const p of picks) if (!need(p, seen)) return false;
    chosen.add(k);
    return true;
  };
  const favoured = tree.focuses.filter(f => score.get(f.key).favoured && alive(f.key)).sort((a, b) => a.y - b.y || score.get(b.key).weight - score.get(a.key).weight || a.x - b.x);
  for (const f of favoured) need(f.key);
  // One side of every mutual exclusion.
  for (const k of [...chosen]) {
    for (const o of byKey.get(k).mutually_exclusive ?? []) {
      if (!chosen.has(k) || !chosen.has(o)) continue;
      const [a, b] = [score.get(k).weight, score.get(o).weight];
      const drop = a > b ? o : b > a ? k : (byKey.get(k).x <= byKey.get(o).x ? o : k);
      chosen.delete(drop);
    }
  }
  // A focus whose prerequisites were dropped goes too.
  let changed = true;
  while (changed) {
    changed = false;
    for (const k of [...chosen]) if ((byKey.get(k).prerequisite ?? []).some(g => !g.some(p => chosen.has(p)))) { chosen.delete(k); changed = true; }
  }
  // Prerequisite order.
  const out = [], done = new Set();
  const ready = k => (byKey.get(k).prerequisite ?? []).every(g => g.some(p => done.has(p)));
  const rest = [...chosen].sort((a, b) => byKey.get(a).y - byKey.get(b).y || score.get(b).weight - score.get(a).weight || byKey.get(a).x - byKey.get(b).x);
  while (rest.length) {
    const i = rest.findIndex(ready);
    if (i < 0) throw new Error(`story_ai: ${tree.id}: no prerequisite order for ${rest.join(', ')}`);
    const [k] = rest.splice(i, 1); done.add(k); out.push(k);
  }
  return { order: out, favoured: favoured.map(f => f.key).filter(k => chosen.has(k)), allFavoured: favoured.map(f => f.key) };
}

// ------------------------------------------------------------------------------------------------- enable conditions
function planGates(rule) {
  const hist = [], plaus = ['NOT = { zin_rules_is_historical = yes }', 'NOT = { zin_rules_is_free = yes }'];
  if (rule.kind === 'branch') {
    hist.push(`${rule.historical} = yes`);
    if (rule.needsHistoricalPath) { hist.push('zin_rules_is_historical = yes'); plaus.push(`${rule.historical} = yes`); }
    else plaus.push(`zin_rules_ai_default_${rule.power} = yes`);
  } else if (rule.kind === 'default') {
    hist.push('zin_rules_is_historical = yes', `zin_rules_ai_default_${rule.power} = yes`);
    plaus.push(`zin_rules_ai_default_${rule.power} = yes`);
  } else if (rule.kind === 'dark') {
    hist.push('zin_rules_is_historical = yes', 'zin_zol_ai_route_appointed = yes');
    plaus.push('zin_zol_ai_route_appointed = yes');
  } else hist.push('zin_rules_is_historical = yes');
  return { hist, plaus: rule.plausibleIsFree ? null : plaus };
}

function plan(name, { tag, enable, focuses, factors, research, ideas, weight, desc }) {
  return blk(name, list(
    `name = "${name}"`, `desc = "${desc}"`,
    blk('allowed', `original_tag = ${tag}`),
    blk('enable', enable.join('\n')),
    blk('abort', 'always = no'),
    focuses?.length ? blk('ai_national_focuses', focuses.join('\n')) : '',
    research && Object.keys(research).length ? blk('research', Object.entries(research).map(([k, v]) => `${k} = ${num(v)}`).join('\n')) : '',
    ideas && Object.keys(ideas).length ? blk('ideas', Object.entries(ideas).map(([k, v]) => `${k} = ${num(v)}`).join('\n')) : '',
    blk('weight', `factor = ${num(weight)}`),
    factors?.length ? blk('focus_factors', factors.map(([k, v]) => `${k} = ${num(v)}`).join('\n')) : '',
  ));
}

// The world tick's step 10 (05 spec; 07_interface/01_interface.md "zin_ui_refresh"): in a human player's scope, raise the dirty tick of the
// panels and recompute the panel of every mechanic that country plays. Pure formatting: it never changes a mechanic variable.
function uiRefresh(D, defined) {
  const calls = D.uiRefresh.filter(r => defined.effects.has(r.effect) && defined.triggers.has(r.when));
  const body = list('add_to_variable = { zin_ui_tick = 1 }', 'add_to_variable = { global.zin_ui_tick = 1 }',
    calls.map(r => `if = {\nlimit = { ${r.when} = yes }\n${r.effect} = yes\n}`));
  return { text: blk('zin_ui_refresh', `# Step 10 of the world tick, once a month for every human player; also safe from any panel. Pure formatting: it never changes a\n# mechanic variable. Panels redraw on zin_ui_tick (dirty = zin_ui_tick).\n${body}`), calls: calls.map(r => r.effect) };
}

function stagedDefinitions(staged) {
  const out = { effects: new Set(), triggers: new Set() };
  for (const [rel, bytes] of staged.files) {
    const kind = rel.startsWith('common/scripted_effects/') ? 'effects' : rel.startsWith('common/scripted_triggers/') ? 'triggers' : null;
    if (!kind || !rel.endsWith('.txt')) continue;
    for (const e of parse(scriptText(bytes))) if (e.k && Array.isArray(e.v)) out[kind].add(e.k);
  }
  return out;
}

export async function buildStoryAi(staged, ctx) {
  const D = ctx.data ?? await loadStoryAi();
  const roster = ctx.countries;
  const byName = new Map(roster.map(c => [c.name, c]));
  const need = n => { const c = byName.get(n); if (!c) throw new Error(`story_ai: ${n} is not in the roster`); return c; };
  const evaluate = historicalEvaluator(D.historicalChecks);
  const counts = { plans: 0, focuses: 0, strategies: 0 }, orders = {};

  // ------------------------------------------------------------------------------------------- plans
  for (const [treeId, t] of Object.entries(D.trees)) {
    const tree = JSON.parse(await readFile(path.join(ctx.zin ?? ZIN, `docs/design/focus/${treeId}.json`), 'utf8'));
    if (!tree.countries.includes(t.realm)) throw new Error(`story_ai: the ${treeId} tree is not ${t.realm}'s (${tree.countries.join(', ')})`);
    const tag = need(t.realm).tag;
    const { order, favoured } = historicalOrder(tree, evaluate);
    if (!order.length) throw new Error(`story_ai: the ${treeId} tree marks no historical focus`);
    orders[treeId] = order.length;
    const gates = planGates(t.rule);
    const ids = order.map(k => focusId(tree, k));
    const head = h => hdr(MOD, SPEC, h);
    staged.text(`common/ai_strategy_plans/zin_${treeId}_historical.txt`, format(`${head(`The historical plan of ${t.realm} (tier A): the focus order of the tree's historical branch (${order.length} focuses, from the tree's own marks), research and laws.`)}\n${plan(`zin_${treeId}_historical`, { tag, enable: gates.hist, focuses: ids, research: t.research, ideas: t.ideas, weight: D.planWeight, desc: `${t.realm} follows the course of the age` })}\n`));
    counts.plans++; counts.focuses += ids.length;
    if (gates.plaus) {
      const fav = favoured.map(k => focusId(tree, k));
      const early = plan(`zin_${treeId}_plausible`, { tag, enable: [...gates.plaus, `check_variable = { global.zin_path_divergence < ${D.plausible.driftAt} }`], factors: fav.map(f => [f, D.plausible.favour]), research: t.research, ideas: t.ideas, weight: D.planWeight, desc: `${t.realm} leans toward the course of the age` });
      const late = plan(`zin_${treeId}_plausible_drift`, { tag, enable: [...gates.plaus, gte('global.zin_path_divergence', D.plausible.driftAt)], factors: fav.map(f => [f, D.plausible.drift]), research: t.research, ideas: t.ideas, weight: D.planWeight, desc: `${t.realm} plays the age as it has turned` });
      staged.text(`common/ai_strategy_plans/zin_${treeId}_plausible.txt`, format(`${head(`The plausible plans of ${t.realm}: its historical focuses weigh x${D.plausible.favour}, then x${D.plausible.drift} once the world has drifted (zin_path_divergence ${D.plausible.driftAt} or more).`)}\n${early}\n${late}\n`));
      counts.plans += 2;
    }
  }

  // ------------------------------------------------------------------------------------------- standing strategies
  const S = [];
  const T = D.tiers;
  const realms = roster.map(c => c.tag).sort();
  for (const tag of realms) {
    S.push(blk(`zin_path_peace_${tag.toLowerCase()}`, list(
      `# Seeming Peace (the Gathering Dark below ${T.peaceAt}): no preparing for war against ${tag} without a cause.`,
      'allowed = { always = yes }',
      blk('enable', list(`check_variable = { global.zin_gathering_dark < ${T.peaceAt} }`, `NOT = { tag = ${tag} }`, `country_exists = ${tag}`, `NOT = { has_war_with = ${tag} }`, `NOT = { has_wargoal_against = ${tag} }`)),
      'abort = { always = no }',
      blk('ai_strategy', `type = prepare_for_war\nid = ${tag}\nvalue = ${T.prepareForWar}`),
    )));
  }
  S.push(blk('zin_path_dark_forts', list(
    `# From the Gathering Dark's third tier (${T.fortsAt}): realms bordering a dark power build more stone forts.`,
    'allowed = { always = yes }',
    blk('enable', list(gte('global.zin_gathering_dark', T.fortsAt), 'NOT = { zin_diplo_is_dark_power = yes }', 'any_neighbor_country = { zin_diplo_is_dark_power = yes }')),
    'abort = { always = no }',
    blk('ai_strategy', `type = build_building\nid = ${T.fortBuilding}\nvalue = ${T.fortWeight}`),
  )));
  const [fa, fb] = D.greyFord.realms.map(n => need(n).tag);
  for (const [a, b] of [[fa, fb], [fb, fa]]) S.push(blk(`zin_path_grey_ford_${a.toLowerCase()}`, list(
    '# CP03: the Grey Ford feud is a border war; neither side tries to conquer the other before the War of the Last Crowns.',
    `allowed = { original_tag = ${a} }`,
    blk('enable', list('has_global_flag = zin_west_truce_broken', 'NOT = { has_global_flag = zin_war_of_last_crowns }')),
    'abort = { has_global_flag = zin_war_of_last_crowns }',
    blk('ai_strategy', `type = conquer\nid = ${b}\nvalue = ${D.greyFord.conquer}`),
  )));
  const parimState = need('Aenor').capitalState;
  for (const n of D.parim.holders) {
    const tag = need(n).tag;
    S.push(blk(`zin_path_afrit_parim_${tag.toLowerCase()}`, list(
      `# CP24: the false god's realm, returned from the east, marches on the holder of Parim (${n}).`,
      'allowed = { always = yes }',
      blk('enable', list('OR = {\nzin_afrit_rules_here = yes\nzin_afrit_is_hub = yes\n}', 'has_global_flag = zin_afrit_returned', 'NOT = { has_global_flag = zin_afrit_dead }', `NOT = { tag = ${tag} }`,
        `any_state = {\nOR = {\nzin_is_site_parim = yes\nstate = ${parimState}\n}\ncontroller = { tag = ${tag} }\n}`)),
      'abort = { has_global_flag = zin_afrit_dead }',
      blk('ai_strategy', `type = conquer\nid = ${tag}\nvalue = ${D.parim.afritConquer}`),
    )));
  }
  counts.strategies = S.length;
  staged.text('common/ai_strategy/zin_path.txt', format(`${hdr(MOD, SPEC, 'Standing strategies of the story: the tier rules of the Gathering Dark (05 spec, AI), the Grey Ford border war (CP03) and the march on Parim (CP24). The other war checkpoints are their owners\' (zin_west, zin_east, zin_dominion, zin_mistake, zin_eindil).')}\n${S.join('\n')}\n`));

  // ------------------------------------------------------------------------------------------- MTTH
  const pace = (factor, cond) => `modifier = {\nfactor = ${num(factor)}\n${cond}\n}`;
  const plausible = 'NOT = { zin_rules_is_historical = yes }\nNOT = { zin_rules_is_free = yes }';
  const drift = gte('global.zin_path_divergence', D.plausible.driftAt);
  const sh = D.shares, ff = D.focusFavour;
  staged.text('common/mtth/zin_mtth.txt', format(`${hdr(MOD, SPEC, 'Story mean times and the path\'s AI shares (hoi4-mtth). Read as mtth:<name>, for example set_temp_variable = { x = mtth:zin_story_mean_time }.')}
# A story mean time in days, stretched by zin_story_pace (A Slow Age 1.5, A Swift Age 0.75; R2).
zin_story_mean_time = {
base = ${D.storyMeanTime}
${pace(1.5, 'check_variable = { global.zin_story_pace > 1.25 }')}
${pace(0.75, 'check_variable = { global.zin_story_pace > 0 }\ncheck_variable = { global.zin_story_pace < 0.875 }')}
}
# The weight of an event's historical option out of 100 (06 spec, Events): HISTORICAL ${sh.historical}, PLAUSIBLE ${sh.plausible} then ${sh.plausibleDrift} once
# zin_path_divergence is ${D.plausible.driftAt} or more, FREE ${sh.free} (the owner's situational weights decide).
zin_story_ai_hist_share = {
base = ${sh.free}
modifier = {
add = ${sh.historical - sh.free}
zin_rules_is_historical = yes
}
modifier = {
add = ${sh.plausible - sh.free}
${plausible}
}
modifier = {
add = ${sh.plausibleDrift - sh.plausible}
${plausible}
${drift}
}
}
# The other options' weight out of 100: the rest of the share.
zin_story_ai_alt_share = {
base = ${100 - sh.free}
modifier = {
add = ${sh.free - sh.historical}
zin_rules_is_historical = yes
}
modifier = {
add = ${sh.free - sh.plausible}
${plausible}
}
modifier = {
add = ${sh.plausible - sh.plausibleDrift}
${plausible}
${drift}
}
}
# The factor of a historical focus (06 spec, Focus trees): HISTORICAL ${ff.historical}, PLAUSIBLE ${ff.plausible} then ${ff.plausibleDrift}, FREE ${ff.free}.
zin_story_ai_focus_favour = {
base = ${ff.free}
modifier = {
factor = ${ff.historical}
zin_rules_is_historical = yes
}
modifier = {
factor = ${ff.plausible}
${plausible}
NOT = { ${drift} }
}
modifier = {
factor = ${ff.plausibleDrift}
${plausible}
${drift}
}
}
`));

  // ------------------------------------------------------------------------------------------- monthly rules and the interface refresh
  staged.text('common/scripted_effects/zin_story_ai.txt', format(`${hdr(MOD, SPEC, 'The story AI\'s monthly rules, called by the magic month (zin_world_magic_month), never per country.')}
${blk('zin_story_ai_month', `# Peace (06 spec): once the false god is dead, every AI realm still at war with his realm makes a white peace with it.
if = {
limit = {
has_global_flag = zin_afrit_dead
NOT = { has_global_flag = zin_story_ai_afrit_peace }
}
set_global_flag = zin_story_ai_afrit_peace
every_country = {
limit = {
OR = {
zin_afrit_rules_here = yes
zin_afrit_is_hub = yes
}
has_war = yes
}
every_enemy_country = {
limit = { is_ai = yes }
white_peace = { tag = PREV }
}
}
}`)}
`));
  const ui = uiRefresh(D, stagedDefinitions(staged));
  staged.text('common/scripted_effects/zin_ui.txt', format(`${hdr(MOD, 'docs/specs/07_interface/01_interface.md', 'The interface refresh of the world tick (step 10). The Chronicle\'s zin_chr_count_unread joins it when the Chronicle module stages it.')}\n${ui.text}\n`));

  // The native world tension widget, relabelled (01_interface.md: WORLD_TENSION_NAME and its tooltip; the window keeps its layout). Each value
  // keeps the vanilla key's placeholders, colour and icon codes (text scan X9), in all ten languages like the text sweep's files.
  const labels = D.widget.labels;
  for (const lang of LANGUAGES) staged.add(`localisation/replace/zin_gathering_dark_l_${lang}.yml`, yml(labels, lang));

  return { counts: { ...counts, uiRefreshPanels: ui.calls.length, widgetKeys: Object.keys(labels).length }, orders };
}
