// Tests of the Cold Lands mechanic (docs/specs/04_mechanics/cold_lands.md; note docs/design/stage2/mech_cold.md). They call the
// builder directly with the roster of data/countries.json and assert on the staged files; nothing needs a prior build. The values
// the spec gives are written here, apart from the data file, so a wrong number in the data is caught. Each rule is a check
// function that returns its problems: it must find none in the real output and at least one in a mutated input or build.
// The installed game is read for engine vocabulary (effects, triggers, modifiers).
// Run: cd tools && node --test content/mech_cold.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { parse, tokenize } from './lib/clausewitz.mjs';
import { checkCommands } from './lib/mp_check.mjs';
import { paceDate, PACES, Texts, renderIdea, renderDynamicModifier } from './lib/mech_kit.mjs';
import { readable, notCp1252, checkMods } from './lib/inst_util.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { loadGlossary } from './lib/text_engine.mjs';
import { buildMechCold, loadColdData, COLD_DEPENDENCIES, coldExternals, numberWord, resolveText } from './modules/mech_cold.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const json = async f => JSON.parse(await readFile(path.join(here, 'data', f), 'utf8'));
const { countries } = await json('countries.json');
const DATA = await loadColdData();
const clone = v => JSON.parse(JSON.stringify(v));
const tagOf = n => countries.find(c => c.name === n).tag;
const COL = tagOf('Coldor'), ISE = tagOf('Isengard'), YEL = tagOf('Yeldenne'), HOR = tagOf('Horidor'), WIN = tagOf('Windwaith'), GUN = tagOf('Gunwaith');
const COLD = countries.filter(c => c.scan === 'Cold Lands');

async function build(mutate) {
  const data = clone(DATA);
  if (mutate) mutate(data);
  const staged = new Staged();
  const result = await buildMechCold(staged, { countries, data });
  return { staged, result, view: view(staged) };
}
function view(staged) {
  const scripts = new Map([...staged.files].filter(([k]) => k.endsWith('.txt')).map(([k, v]) => [k, v.toString('utf8')]));
  const locBytes = staged.files.get('localisation/english/zin_cold_l_english.yml');
  const loc = Object.fromEntries([...(locBytes ?? Buffer.alloc(0)).toString('utf8').matchAll(/^ ([A-Za-z0-9_.@-]+):0 "(.*)"$/gm)].map(m => [m[1], m[2].replace(/\\"/g, '"')]));
  const f = rel => { const t = scripts.get(rel); assert(t, `missing staged file ${rel}`); return t; };
  return { scripts, locBytes, loc, f, all: [...scripts.values()].join('\n') };
}
const base = await build();
const { result: R, view: V } = base;
const EF = V.f('common/scripted_effects/zin_cold.txt'), TR = V.f('common/scripted_triggers/zin_cold.txt'), EV = V.f('events/zin_cold.txt');
const DEC = V.f('common/decisions/zin_cold.txt'), OA = V.f('common/on_actions/zin_cold.txt');

/** The text of a top-level block `name = {` (its braces matched), or '' when absent. */
function block(text, name) {
  const m = new RegExp(`^\\t*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} = \\{`, 'm').exec(text);
  if (!m) return '';
  let depth = 0;
  for (let i = m.index + m[0].length - 1; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) return text.slice(m.index, i + 1);
  }
  return text.slice(m.index);
}
const eventBlock = (text, id) => {
  const i = text.indexOf(`\tid = ${id}\n`);
  if (i < 0) return '';
  const s = Math.max(text.lastIndexOf('\ncountry_event = {', i), text.lastIndexOf('\nnews_event = {', i)) + 1, rest = text.slice(s);
  return block(rest, rest.startsWith('news') ? 'news_event' : 'country_event');
};
const events = text => parse(text).filter(e => /^(country|news)_event$/.test(e.k)).map(e => ({ kind: e.k, entries: e.v, get: k => e.v.find(x => x.k === k)?.v, all: k => e.v.filter(x => x.k === k) }));

// ------------------------------------------------------------------------------------------------ the spec's values (cold_lands.md)
const SPEC = {
  coldCountries: 31, clanRealms: 28,
  defiance: 70, swear: 30, court: 80, marchDark: 15, marchDefiance: 80, reachDefiance: 40,
  reach: { crown: 1.5, member: 1, divisor: 150, pp: 400, winter: 500 },
  drift: { reach: 0.3, war: 0.3, bread: 0.5, court: 0.5 },
  march: { width: 80, days: 45, provinces: 4, coldorWin: -25, isengardWin: 15, warSupport: 0.05, stability: 0.05 },
  leans: { Horidor: 60, Holdon: 10, Wonderland: 5, Fearno: 0, Windwaith: -5, 'Yeti Lands': 0, Titanos: 0 }, borderLean: -20, otherLean: 5,
  dates: { march_open: [1751, 3, 1], march_historical: [1752, 3, 1], timber_1: [1753, 3, 1], timber_2: [1754, 3, 1] },
  winters: { 1748: 1, 1749: 0, 1750: 1, 1751: 2, 1752: 1, 1753: 0, 1754: 1, 1755: 2, 1756: 1, 1757: 0, 1758: 1, 1759: 0 },
  odds: [40, 40, 20], hard: [0.1, -0.02, -0.05], bitter: [0.25, -0.05, -0.1],
  seasons: { mistfall: 245, moot: 306, thaw: 120, year: 365 },
  decisions: {
    zin_cold_send_envoys: { cost: 25, days: 120, lean: 10 }, zin_cold_send_envoys_cheap: { cost: 15, days: 120, lean: 10 },
    zin_cold_feed_the_steadings: { cost: 50 }, zin_cold_feed_the_steadings_cheap: { cost: 25 },
    zin_cold_invite_to_accord: { cost: 25, days: 180, lean: 50 }, zin_cold_offer_protection: { cost: 100, days: 365, lean: 80, reach: 40 },
    zin_cold_bread_for_isengard: { cost: 75, idea_days: 90 }, zin_cold_winter_gifts: { cost: 25, days: 120, lean: -10 }, zin_cold_isengard_feeds: { cost: 50 },
    zin_cold_sell_timber_west: { days: 180 }, zin_cold_renew_old_pact: { cost: 50 },
  },
  feed: { lean: 15, stability: 0.03, isengardLean: 15 }, moot: 5,
  raiders: { mtth: 60, cost: 25, xp: 5, lean: 10 }, forts: 365,
  spirits: {
    zin_cold_bread_from_fandanar: { stability_factor: 0.03 }, zin_cold_sworn_to_the_accord: { stability_factor: 0.05, army_core_defence_factor: 0.05 },
    zin_cold_neck_road_trade: { consumer_goods_factor: -0.02, political_power_gain: 0.05 }, zin_cold_harbour_compact: { consumer_goods_factor: -0.01, naval_speed_factor: 0.05 },
    zin_cold_hall_guard: { political_power_gain: -0.05, army_core_defence_factor: 0.03 },
  },
  opinions: { zin_cold_accord_kin: [15], zin_cold_fed_us: [15, 1], zin_cold_hall_friend: [20], zin_cold_temple_swords: [-10, 0.5] },
  farIce: { local_supplies: -0.3, attrition: 0.1 },
  charter: { refused: 5, offered: -5 }, marriage: { defiance: 60, accepted: -15, refused: 5 },
  invite: { decline: -10 }, protect: { refuse: -20 }, pacts: { lean: 10, refused: -5, renew: 180 }, compact: { accept: 20, refuse: -10 },
  timber: { pp: 40, fleet: 5 }, neck: 730, wardens: { regard: 10, renown: 2 }, chart: 5, guard: 5,
  white: { manpower: 30000, equipment: 3000, divisions: 3, regard: 15, infantry: 6, archers: 2, cavalry: 1 },
  ai: { befriendHoridor: 50, antagonizeIsengard: 20, isengardAntagonize: 30, feedMinPp: 100, feedLean: [-20, 50], inviteLean: 60 },
};
const has = (text, s) => text.includes(s);

/** Every place the staged output disagrees with the spec's values; [] when it follows them. */
function specProblems(v) {
  const p = [];
  const need = (ok, what) => { if (!ok) p.push(what); };
  const ef = v.f('common/scripted_effects/zin_cold.txt'), tr = v.f('common/scripted_triggers/zin_cold.txt'), ev = v.f('events/zin_cold.txt'), dec = v.f('common/decisions/zin_cold.txt');
  const startup = block(ef, 'zin_cold_startup'), monthly = block(ef, 'zin_cold_monthly'), reach = block(ef, 'zin_cold_update_reach');
  // Start values (section "The situation on 1 Thaw 4A 1748", section 2)
  need(has(startup, `set_variable = { zin_cold_isengard_defiance = ${SPEC.defiance} }`), 'start defiance');
  for (const [n, l] of Object.entries(SPEC.leans)) need(has(startup, `${tagOf(n)} = { set_variable = { zin_cold_lean = ${l} } }`), `start lean of ${n}`);
  const others = COLD.filter(c => ![COL, ISE, YEL].includes(c.tag) && !(c.name in SPEC.leans));
  for (const c of others) need(has(startup, `${c.tag} = {\n\t\tset_variable = { zin_cold_lean = ${SPEC.otherLean} }\n\t\tif = {\n\t\t\tlimit = { is_neighbor_of = ${ISE} }\n\t\t\tset_variable = { zin_cold_lean = ${SPEC.borderLean} }`), `start lean of ${c.name}`);
  need([COL, ISE, YEL].every(t => !has(startup, `${t} = { set_variable = { zin_cold_lean`) && !has(startup, `${t} = {\n\t\tset_variable = { zin_cold_lean`)), 'Coldor, Isengard and Yeldenne hold no lean');
  for (const [a, b] of [[COL, ISE], [ISE, COL]]) need(has(startup, `${a} = { add_opinion_modifier = { target = ${b} modifier = zin_opinion_cold_rivalry } }`), `rivalry ${a} -> ${b}`);
  need(has(startup, 'add_ideas = zin_coldor_ports_against_interior') && has(startup, 'add_dynamic_modifier = { modifier = zin_cold_reach_mod }'), 'Coldor start spirit and reach modifier');
  need(has(startup, 'add_dynamic_modifier = { modifier = zin_cold_far_ice }') && has(startup, 'zin_is_region_far_northwest = yes'), 'far ice on the far north-west');
  need(has(startup, 'zin_cold_schedule_seasons = yes') && has(block(ef, 'zin_cold_schedule_seasons'), `= ${SPEC.seasons.mistfall} }`) && has(block(ef, 'zin_cold_schedule_seasons'), `= ${SPEC.seasons.moot} }`), 'first Mistfall and Deepwinter');
  // The Accord's reach and Isengard's defiance (section 1)
  need(has(reach, `zin_cold_weight = ${SPEC.reach.crown} }`) && has(reach, `zin_cold_weight = ${SPEC.reach.member} }`) && has(reach, `divide_temp_variable = { zin_cold_weight = ${SPEC.reach.divisor} }`), 'reach weights');
  need(has(reach, `divide_variable = { zin_cold_reach_pp = ${SPEC.reach.pp} }`) && has(reach, `divide_variable = { zin_cold_reach_winter = -${SPEC.reach.winter} }`), 'reach modifier divisors');
  need(has(reach, 'NOT = { zin_is_site_yeldenne = yes }') && has(reach, `NOT = { is_owned_by = ${COL} }`), "reach leaves out Mp'E and Coldor's own states");
  need(has(monthly, `zin_cold_accord_reach > ${SPEC.reachDefiance - 0.01}`) && has(monthly, `zin_cold_drift = -${SPEC.drift.reach} }`), 'defiance falls with reach');
  need(has(monthly, `zin_cold_drift = ${SPEC.drift.war} }`) && has(monthly, `zin_cold_drift = -${SPEC.drift.bread} }`), 'defiance drift: foreign war and bread');
  need(has(monthly, `zin_cold_isengard_defiance > ${SPEC.court - 0.01}`) && has(monthly, `zin_arg_value = -${SPEC.drift.court} }`) && has(monthly, `is_neighbor_of = ${ISE}`), 'Isengard courts its neighbours');
  need(has(tr, `zin_cold_isengard_defiance < ${SPEC.swear + 0.01}`), 'swear threshold');
  need(has(block(tr, 'zin_cold_march_war_allowed'), `global.zin_gathering_dark > ${SPEC.marchDark - 0.01}`) && has(block(tr, 'zin_cold_march_war_allowed'), `zin_cold_isengard_defiance > ${SPEC.marchDefiance - 0.01}`), 'March Forts gate');
  const border = block(ef, 'zin_cold_start_march_war');
  for (const s of ['change_state_after_war = no', `combat_width = ${SPEC.march.width}`, `minimum_duration_in_days = ${SPEC.march.days}`, `num_provinces = ${SPEC.march.provinces}`]) need(has(border, s), `border war ${s}`);
  const end = block(ef, 'zin_cold_end_march_war');
  need(has(end, `zin_arg_value = ${SPEC.march.coldorWin} }`) && has(end, `zin_arg_value = ${SPEC.march.isengardWin} }`) && has(end, `add_war_support = ${SPEC.march.warSupport}`) && has(end, `add_stability = -${SPEC.march.stability}`) && has(end, 'news_event = { id = zin_cold.32 }'), 'March Forts results');
  // Winters (section 3)
  const roll = block(ef, 'zin_cold_roll_winter');
  for (const [y, s] of Object.entries(SPEC.winters)) need(has(roll, `global.year = ${y} }`) && has(roll.slice(roll.indexOf(`global.year = ${y} }`), roll.indexOf(`global.year = ${y} }`) + 120), `global.zin_cold_winter = ${s} }`), `historical winter ${y}`);
  need(has(roll, `${SPEC.odds[0]} = { set_variable = { global.zin_cold_winter = 0 } }`) && has(roll, `${SPEC.odds[1]} = { set_variable = { global.zin_cold_winter = 1 } }`) && has(roll, `${SPEC.odds[2]} = { set_variable = { global.zin_cold_winter = 2 } }`), 'winter odds');
  const wv = block(ef, 'zin_cold_set_winter_values');
  for (const [i, k] of ['zin_cold_winter_attr', 'zin_cold_winter_stab', 'zin_cold_winter_pop'].entries()) need(has(wv, `${k} = ${SPEC.hard[i]} }`) && has(wv, `${k} = ${SPEC.bitter[i]} }`) && has(wv, `multiply_variable = { ${k} = 0.5 }`), `winter value ${k}`);
  need(has(block(ef, 'zin_cold_next_mistfall'), `= ${SPEC.seasons.thaw} }`) && has(block(ef, 'zin_cold_next_mistfall'), `= ${SPEC.seasons.year} }`), 'the Thaw and the next Mistfall');
  // Feeding, the moot and the raiders (sections 2 and 3)
  need(has(block(ef, 'zin_cold_feed'), `zin_arg_value = ${SPEC.feed.lean} }`) && has(block(ef, 'zin_cold_feed'), `add_stability = ${SPEC.feed.stability}`), 'feeding');
  need(has(block(ef, 'zin_cold_feed_by_isengard'), `zin_arg_value = -${SPEC.feed.isengardLean} }`), 'Isengard feeding');
  const moot = eventBlock(ev, 'zin_cold.20');
  need(has(moot, `zin_arg_value = ${SPEC.moot} }`) && has(moot, `zin_arg_value = -${SPEC.moot} }`) && has(moot, 'clr_country_flag = zin_cold_fed_by_fandanar'), 'the moot');
  const raid = eventBlock(ev, 'zin_cold.12');
  need(has(raid, `days = ${SPEC.raiders.mtth}`) && has(raid, `add_political_power = -${SPEC.raiders.cost}`) && has(raid, `army_experience = ${SPEC.raiders.xp}`) && has(raid, `zin_arg_value = -${SPEC.raiders.lean} }`), 'raiders');
  need(has(eventBlock(ev, 'zin_cold.31'), `days = ${SPEC.forts}`), 'Isengard rides to the forts after a year on average');
  // Decisions (section 2, 4, 7)
  for (const [id, d] of Object.entries(SPEC.decisions)) {
    const b = block(dec, id);
    need(b, `decision ${id}`);
    if (d.cost !== undefined) need(has(b, `cost = ${d.cost}\n`), `${id} cost ${d.cost}`);
    if (d.cost === undefined) need(!/\bcost = /.test(b), `${id} costs nothing`);
    if (d.days !== undefined) need(has(b, `days_re_enable = ${d.days}\n`), `${id} cooldown ${d.days}`);
    if (d.lean !== undefined && /envoys|gifts/.test(id)) need(has(b, `zin_arg_value = ${d.lean} }`), `${id} lean ${d.lean}`);
    if (d.lean !== undefined && /invite|protection/.test(id)) need(has(b, `zin_cold_lean > ${d.lean - 0.01}`), `${id} needs lean ${d.lean}`);
    if (d.reach !== undefined) need(has(b, `zin_cold_accord_reach > ${d.reach - 0.01}`), `${id} needs reach ${d.reach}`);
    if (d.idea_days !== undefined) need(has(b, `days = ${d.idea_days}`), `${id} lasts ${d.idea_days} days`);
  }
  need(has(block(dec, 'zin_cold_send_envoys_cheap'), 'has_country_flag = zin_coldor_cheap_envoys') && has(block(dec, 'zin_cold_feed_the_steadings_cheap'), 'has_country_flag = zin_cold_winter_stores'), 'the cheap variants follow the tree flags');
  need(has(block(dec, 'zin_cold_invite_to_accord'), 'is_in_faction = no') && has(block(dec, 'zin_cold_invite_to_accord'), 'zin_coldor_accord_open'), 'invite needs Open the Accord and no faction');
  need(has(block(dec, 'zin_cold_bread_for_isengard'), 'has_country_flag = zin_cold_open_hand') && has(block(dec, 'zin_cold_bread_for_isengard'), 'zin_cold_winter_is_hard = yes'), 'bread on the Open Hand in a hard winter');
  const feedAi = block(block(dec, 'zin_cold_feed_the_steadings'), 'ai_will_do');
  need(has(feedAi, `has_political_power > ${SPEC.ai.feedMinPp - 1}`) && has(feedAi, `zin_cold_lean > ${SPEC.ai.feedLean[0] - 0.01}`) && has(feedAi, `zin_cold_lean < ${SPEC.ai.feedLean[1] + 0.01}`) && has(feedAi, `is_guaranteed_by = ${ISE}`), 'feeding AI');
  need(has(block(block(dec, 'zin_cold_invite_to_accord'), 'ai_will_do'), `zin_cold_lean > ${SPEC.ai.inviteLean - 0.01}`), 'invite AI');
  // Events (sections 1, 2, 4, 6, 7)
  const charter = eventBlock(ev, 'zin_cold.30');
  need(has(charter.slice(0, charter.indexOf('option = {')), `zin_arg_value = ${SPEC.charter.offered} }`) && has(charter, `zin_arg_value = ${SPEC.charter.refused} }`) && has(charter, 'zin_cold_isengard_swears = yes'), 'the Winter Charter');
  const marriage = eventBlock(ev, 'zin_cold.33');
  need(has(marriage, `zin_cold_isengard_defiance < ${SPEC.marriage.defiance + 0.01}`) && has(marriage, `zin_arg_value = ${SPEC.marriage.accepted} }`) && has(marriage, `zin_arg_value = ${SPEC.marriage.refused} }`), 'the marriage');
  need(has(eventBlock(ev, 'zin_cold.40'), `zin_arg_value = ${SPEC.invite.decline} }`) && has(eventBlock(ev, 'zin_cold.40'), 'add_to_faction = ROOT'), 'the invitation');
  need(has(eventBlock(ev, 'zin_cold.41'), `zin_arg_value = ${SPEC.protect.refuse} }`) && has(eventBlock(ev, 'zin_cold.41'), 'FROM = { puppet = ROOT }') && has(eventBlock(ev, 'zin_cold.41'), 'factor = 2'), 'the protection');
  for (const id of ['zin_cold.51', 'zin_cold.52']) need(has(eventBlock(ev, id), `zin_arg_value = ${SPEC.pacts.refused} }`) && has(eventBlock(ev, id), `days = ${SPEC.pacts.renew} }`), `${id} refusal`);
  for (const k of ['yeti', 'giant']) need(has(block(ef, `zin_cold_add_${k}_pact`), `zin_arg_value = ${SPEC.pacts.lean} }`) && has(block(ef, `zin_cold_add_${k}_pact`), 'relation = non_aggression_pact active = yes'), `${k} pact level 1`);
  need(has(eventBlock(ev, 'zin_cold.71'), `zin_arg_value = ${SPEC.compact.accept} }`) && has(eventBlock(ev, 'zin_cold.71'), `zin_arg_value = ${SPEC.compact.refuse} }`), 'the Harbour Compact');
  need(has(eventBlock(ev, 'zin_cold.61'), `zin_arg_value = ${SPEC.guard} }`) && has(eventBlock(ev, 'zin_cold.61'), 'give_guarantee = ROOT'), 'the guard outside the hall');
  need(has(block(ef, 'zin_cold_open_neck_road'), `days = ${SPEC.neck} }`), 'the Neck Road spirit');
  need(has(block(ef, 'zin_cold_sell_timber'), `add_political_power = ${SPEC.timber.pp}`) && has(block(ef, 'zin_cold_sell_timber'), `zin_arg_value = ${SPEC.timber.fleet} }`), 'timber sale');
  need(has(block(ef, 'zin_cold_send_wardens'), `zin_arg_value = ${SPEC.wardens.regard} }`) && has(block(ef, 'zin_cold_send_wardens'), `zin_arg_value = ${SPEC.wardens.renown} }`), 'wardens');
  need(has(block(ef, 'zin_cold_chart_far_ice'), `zin_arg_value = ${SPEC.chart} }`), 'charting the far ice');
  const white = block(ef, 'zin_cold_sail_white_companies');
  need(has(white, `add_manpower = -${SPEC.white.manpower}`) && has(white, `amount = -${SPEC.white.equipment}`) && has(white, `count = ${SPEC.white.divisions}`) && has(white, `zin_arg_value = ${SPEC.white.regard} }`), 'White Companies costs');
  need((white.match(/zin_men_infantry = \{/g) ?? []).length === SPEC.white.infantry && (white.match(/zin_men_archers = \{/g) ?? []).length === SPEC.white.archers && (white.match(/zin_men_cavalry = \{/g) ?? []).length === SPEC.white.cavalry, 'White Company template');
  // Spirits, modifiers, opinions
  const ideas = v.f('common/ideas/zin_cold.txt');
  for (const [id, mods] of Object.entries(SPEC.spirits)) for (const [k, val] of Object.entries(mods)) need(has(block(ideas, id), `${k} = ${val}\n`), `${id} ${k} ${val}`);
  const dyn = v.f('common/dynamic_modifiers/zin_cold.txt');
  need(has(block(dyn, 'zin_cold_far_ice'), `local_supplies = ${SPEC.farIce.local_supplies}`) && has(block(dyn, 'zin_cold_far_ice'), `attrition = ${SPEC.farIce.attrition}`), 'far ice modifier');
  need(has(block(dyn, 'zin_cold_reach_mod'), 'political_power_gain = zin_cold_reach_pp') && has(block(dyn, 'zin_cold_winter_mod'), 'monthly_population = zin_cold_winter_pop'), 'dynamic values');
  const op = v.f('common/opinion_modifiers/zin_cold.txt');
  for (const [id, [val, decay]] of Object.entries(SPEC.opinions)) need(has(block(op, id), `value = ${val}`) && (decay === undefined || has(block(op, id), `decay = ${decay}`)), `opinion ${id}`);
  // AI strategies
  const ai = v.f('common/ai_strategy/zin_cold.txt');
  need(has(block(ai, 'zin_cold_coldor_stance'), `id = "${HOR}"\n\t\tvalue = ${SPEC.ai.befriendHoridor}`) && has(block(ai, 'zin_cold_coldor_stance'), `id = "${ISE}"\n\t\tvalue = ${SPEC.ai.antagonizeIsengard}`) && has(block(ai, 'zin_cold_isengard_stance'), `id = "${COL}"\n\t\tvalue = ${SPEC.ai.isengardAntagonize}`), 'startup strategies');
  return p;
}

// ------------------------------------------------------------------------------------------------ the rules as checks
function balanceProblems(files) {
  const out = [];
  for (const [f, t] of files) {
    let depth = 0, min = 0;
    for (const tk of tokenize(t)) { if (tk.t === '{') depth++; if (tk.t === '}') { depth--; min = Math.min(min, depth); } }
    if (depth !== 0 || min < 0) out.push(`${f}: unbalanced`);
    try { parse(t); } catch (e) { out.push(`${f}: ${e.message}`); }
  }
  return out;
}
const operatorProblems = files => [...files].flatMap(([f, t]) => t.split('\n').map((l, i) => [l.replace(/#.*$/, '').replace(/"[^"]*"/g, ''), i + 1]).filter(([l]) => /<=|>=/.test(l)).map(([, i]) => `${f}:${i}`));
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
const bomProblems = bytes => (bytes && bytes.subarray(0, 3).equals(BOM) ? [] : ['no byte order mark']);
const compiledBanned = compileBanned(await loadRuleSet({ glossary: await loadGlossary() }));
function textProblems(entries) {
  const out = [];
  for (const [k, v] of Object.entries(entries)) {
    if (!String(v).trim()) out.push(`${k}: empty`);
    for (const h of findBanned(readable(v), compiledBanned, ['error'])) out.push(`${k}: banned ${h.word} (${h.id})`);
    if (/\bErdae\b|\bArda\b/.test(v)) out.push(`${k}: former setting name`);
    if (/waith/i.test(readable(v))) out.push(`${k}: a -waith name (K27)`);
    if (/\{(tag|n|w|month):/.test(v)) out.push(`${k}: unresolved placeholder`);
  }
  return [...out, ...notCp1252(entries).map(b => `font ${b}`)];
}
// Secrecy (D3, D4; cold_lands.md "Kept open", acceptance 3): no Afrit, Council, Eindil or a sleeper in the ice; Glo is never named.
const SECRET = /Afrit|Hidden Council|Eindil|Einendil|Lorien|King of Demons|\bGlo\b|\bsleep(s|er|ing)?\b|\bslept\b|\bslumber|\bwak(e|es|ing)\b|\bwoke\b/i;
const secretProblems = entries => Object.entries(entries).filter(([, v]) => SECRET.test(readable(v))).map(([k, v]) => `${k}: ${v.slice(0, 60)}`);
function locKeyProblems(scripts, loc) {
  const need = new Set();
  for (const [f, t] of scripts) {
    for (const m of t.matchAll(/\b(?:title|desc|name|text|custom_effect_tooltip) = (zin_[A-Za-z0-9_.]+)/g)) need.add(m[1]);
    if (/^common\/(decisions|ideas|dynamic_modifiers|opinion_modifiers)\//.test(f)) {
      const tree = parse(t);
      const tops = f.includes('/ideas/') ? tree[0].v.flatMap(g => g.v) : f.includes('opinion_modifiers') ? tree[0].v : f.includes('/categories/') || f.includes('dynamic_modifiers') ? tree : tree.flatMap(c => c.v);
      for (const e of tops) if (e.k?.startsWith('zin_')) { need.add(e.k); if (/decisions|ideas/.test(f)) need.add(`${e.k}_desc`); }
    }
  }
  return [...need].filter(k => !(k in loc));
}
function expandForVocabulary(text) {
  // meta_effect: its text block is checked as script (placeholders become 1); start_border_war: its children are parameters.
  let out = text;
  for (;;) {
    const i = out.search(/^\t*meta_effect = \{/m); if (i < 0) break;
    const b = block(out.slice(i), 'meta_effect'), inner = block(b, 'text');
    out = out.slice(0, i) + inner.replace(/^\t*text = \{/, '').replace(/\}$/, '').replace(/\[[A-Z_]+\]/g, '1') + out.slice(i + b.length);
  }
  for (const name of PARAM_BLOCKS) {
    let from = 0;
    for (;;) {
      const i = out.slice(from).search(new RegExp(`\\b${name} = \\{`)); if (i < 0) break;
      const at = from + i, open = out.indexOf('{', at);
      let depth = 0, close = open;
      for (; close < out.length; close++) { if (out[close] === '{') depth++; else if (out[close] === '}' && --depth === 0) break; }
      out = `${out.slice(0, open + 1)} ${out.slice(close)}`;
      from = open + 2;
    }
  }
  return out;
}
// Engine commands whose children are parameters, which lib/mp_check.mjs does not list.
const PARAM_BLOCKS = ['start_border_war', 'has_dynamic_modifier'];
async function vocabularyProblems(scripts, known) {
  return checkCommands(new Map([...scripts].map(([k, t]) => [k, expandForVocabulary(t)])), known);
}
function referenceProblems(v, res) {
  const out = [], all = v.all, ext = coldExternals();
  const callable = new Set([...res.definitions.effects, ...res.definitions.triggers, ...ext]);
  for (const c of new Set([...all.matchAll(/\b(zin_[a-z0-9_]+) = (?:yes|no)\b/g)].map(m => m[1]))) if (!callable.has(c)) out.push(`call ${c}`);
  for (const e of new Set([...all.matchAll(/\bid = (zin_[a-z]+\.\d+)/g)].map(m => m[1]))) if (!res.definitions.events.includes(e)) out.push(`event ${e}`);
  for (const i of new Set([...all.matchAll(/\b(?:add_ideas|remove_ideas|has_idea|idea) = (zin_[a-z0-9_]+)/g)].map(m => m[1]))) if (!res.definitions.ideas.includes(i) && !ext.has(i)) out.push(`idea ${i}`);
  for (const o of new Set([...all.matchAll(/\bmodifier = (zin_[a-z0-9_]+)/g)].map(m => m[1]))) if (![...res.definitions.opinions, ...res.definitions.dynamicModifiers].includes(o) && !ext.has(o)) out.push(`modifier ${o}`);
  const set = new Set([...all.matchAll(/\bset_(?:country|global)_flag = (?:\{ flag = )?(zin_[a-z0-9_]+)/g)].map(m => m[1]));
  for (const fl of new Set([...all.matchAll(/\bhas_(?:country|global)_flag = (?:\{ flag = )?(zin_[a-z0-9_]+)/g)].map(m => m[1]))) if (!set.has(fl) && !ext.has(fl)) out.push(`flag ${fl} is read, never set, and not declared`);
  const setVars = new Set([...all.matchAll(/\b(?:set_variable|add_to_variable) = \{ (?:global\.)?(zin_[a-z0-9_]+) =/g)].map(m => m[1]));
  for (const gv of new Set([...all.matchAll(/global\.(zin_[a-z0-9_]+)/g)].map(m => m[1]))) if (!setVars.has(gv) && !ext.has(gv)) out.push(`global variable ${gv} is read, never set, and not declared`);
  for (const name of ext) if (!all.includes(name)) out.push(`declared external ${name} is never used`);
  return out;
}
function eventProblems(text, cells) {
  const pics = new Map(cells.events.map(e => [e.key, e])), out = [];
  for (const e of events(text)) {
    const id = e.get('id');
    if (e.get('hidden') === 'yes') { if (!e.all('immediate').length) out.push(`${id}: hidden without effects`); if (e.all('option').length) out.push(`${id}: hidden with options`); continue; }
    if (e.get('timeout_days') !== '30') out.push(`${id}: timeout_days is not 30 (E2)`);
    const m = /^GFX_zin_(evt|news)_(.+)$/.exec(e.get('picture') ?? '');
    const cell = m && pics.get(m[2]);
    if (!cell) out.push(`${id}: picture ${e.get('picture')} is not a catalog key`);
    else {
      if (e.kind === 'news_event' && !['both', 'news'].includes(cell.crop)) out.push(`${id}: no news crop`);
      if (e.kind === 'country_event' && m[1] !== 'evt') out.push(`${id}: a country event with a news picture`);
      if (cell.gate && !/^—/.test(cell.gate)) out.push(`${id}: picture ${m[2]} is gated (${cell.gate})`);
    }
    if (!e.all('option').length) out.push(`${id}: no option`);
  }
  return out;
}
const PULSE = /^\ton_(daily|weekly|monthly)\s*=/m;
const pulseProblems = text => (PULSE.test(text) ? ['an every-country on_daily, on_weekly or on_monthly'] : []);
const WAR = /\b(start_border_war|create_wargoal|declare_war_on)\b/;
function peaceGateProblems(scripts) {
  const out = [], EFF = 'common/scripted_effects/zin_cold.txt';
  for (const [f, t] of scripts) {
    const march = f === EFF ? block(t, 'zin_cold_start_march_war') : '', from = march ? t.indexOf(march) : -1, to = from + march.length;
    for (const m of t.matchAll(new RegExp(WAR.source, 'g'))) {
      if (f === EFF && m[1] === 'start_border_war' && m.index > from && m.index < to) continue;
      out.push(`${f}: ${m[1]} at line ${t.slice(0, m.index).split('\n').length}`);
    }
  }
  const march = block(scripts.get('common/scripted_effects/zin_cold.txt') ?? '', 'zin_cold_start_march_war');
  if (march && !/^zin_cold_start_march_war = \{\n\tif = \{\n\t\tlimit = \{ zin_cold_march_war_allowed = yes \}/.test(march)) out.push('the border war is not behind its peace gate');
  return out;
}
const RULE_TRIGGERS = ['zin_rules_ai_branch_cold_historical'];
function ruleProblems(v) {
  const out = [];
  if (/has_game_rule/.test(v.all)) out.push('a rule is read with has_game_rule, not through the rules wrappers');
  if (!block(v.f('common/scripted_triggers/zin_cold.txt'), 'zin_cold_historical').includes('zin_rules_ai_branch_cold_historical = yes')) out.push('zin_cold_historical does not read the wrapper');
  // A rule never acts on a player's country: in decisions it weighs the AI only; in events it sits with is_ai or in AI chances.
  for (const d of parse(v.f('common/decisions/zin_cold.txt')).flatMap(c => c.v)) for (const part of d.v) if (part.k !== 'ai_will_do' && JSON.stringify(part.v).includes('zin_cold_historical')) out.push(`${d.k}.${part.k} reads the rule outside its AI weight`);
  for (const e of events(v.f('events/zin_cold.txt'))) { const tr = JSON.stringify(e.all('trigger')); if (tr.includes('zin_cold_historical') && !tr.includes('"is_ai"')) out.push(`${e.get('id')} reads the rule for a player`); }
  return out;
}
function dateProblems(text, dates) {
  const out = [];
  for (const [key, [y, m, d]] of Object.entries(dates)) {
    const b = block(text, `zin_cold_date_${key}`);
    if (!b) { out.push(`zin_cold_date_${key} missing`); continue; }
    for (const pace of ['standard', 'slow', 'fast']) if (!b.includes(`date > ${paceDate(y, m, d, PACES[pace])} }`)) out.push(`zin_cold_date_${key}: no ${pace} date ${paceDate(y, m, d, PACES[pace])}`);
    if ((b.match(/global\.zin_story_pace/g) ?? []).length < 3) out.push(`zin_cold_date_${key}: the pace is not read`);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ tests
test('Counts: what the module writes matches the spec\'s tables', () => {
  assert.equal(COLD.length, SPEC.coldCountries);
  assert.equal(R.tags.clanRealms, SPEC.clanRealms, 'every Cold Lands country but Coldor, Isengard and Yeldenne holds a lean');
  assert.deepEqual(R.definitions.categories, ['zin_cold_accord', 'zin_cold_isengard', 'zin_cold_trade']);
  assert.deepEqual([...R.definitions.decisions].sort(), Object.keys(SPEC.decisions).sort(), 'nine decisions of the spec and the two cost variants');
  assert.deepEqual([...R.definitions.ideas].sort(), [...Object.keys(SPEC.spirits), 'zin_cold_far_ice_charted_idea'].sort());
  assert.deepEqual([...R.definitions.dynamicModifiers].sort(), ['zin_cold_far_ice', 'zin_cold_reach_mod', 'zin_cold_winter_mod']);
  assert.deepEqual([...R.definitions.opinions].sort(), [...Object.keys(SPEC.opinions), 'zin_cold_marriage_kin', 'zin_cold_road_refused'].sort());
  const specEvents = [1, 10, 11, 12, 13, 20, 21, 30, 31, 32, 33, 40, 41, 50, 51, 52, 60, 61, 70, 71].map(n => `zin_cold.${n}`);
  assert.deepEqual([...R.definitions.events].sort(), [...specEvents, 'zin_cold.34', 'zin_cold.35', 'zin_cold.36'].sort(), 'the spec\'s twenty events and the three border-war results');
  for (const e of ['zin_cold_add_lean', 'zin_cold_add_lean_all', 'zin_cold_add_defiance', 'zin_cold_update_reach', 'zin_cold_start_march_war', 'zin_cold_end_march_war', 'zin_cold_isengard_swears', 'zin_cold_add_yeti_pact', 'zin_cold_add_giant_pact', 'zin_cold_roll_winter', 'zin_cold_feed', 'zin_cold_open_neck_road', 'zin_cold_sell_timber', 'zin_cold_sail_white_companies', 'zin_cold_chart_far_ice', 'zin_cold_reward_ice_host', 'zin_cold_send_wardens', 'zin_cold_join_crossing', 'zin_cold_monthly']) assert(R.definitions.effects.includes(e), `spec effect ${e}`);
  for (const t of ['zin_cold_is_cold', 'zin_cold_is_clan_realm', 'zin_cold_march_war_allowed', 'zin_cold_isengard_may_swear', 'zin_cold_isengard_settled', 'zin_cold_winter_is_hard', 'zin_cold_historical', ...Object.keys(SPEC.dates).map(k => `zin_cold_date_${k}`)]) assert(R.definitions.triggers.includes(t), `spec trigger ${t}`);
  assert.deepEqual(R.counts, { effects: 27, triggers: 12, events: 23, decisions: 11, categories: 3, ideas: 6, opinions: 6, dynamicModifiers: 3, aiStrategies: 4, textKeys: Object.keys(V.loc).length });
});

test('Spec values: start values, thresholds, costs, results, winters and AI stances follow the spec', () => {
  assert.deepEqual(specProblems(V), []);
});

test('Negative: a wrong number in the data is refused by the spec check', async () => {
  const cases = [
    ['start defiance', d => { d.numbers.defiance_start = 60; }],
    ['a start lean', d => { d.roster.leans.Horidor = 50; }],
    ['the border lean', d => { d.roster.borderLean = -10; }],
    ['a historical winter', d => { d.numbers.historical_winters['1751'] = 1; }],
    ['a decision cost', d => { d.numbers.protect_cost = 80; }],
    ['a cooldown', d => { d.numbers.envoys_cooldown = 90; }],
    ['a border-war result', d => { d.numbers.march_defiance_coldor_win = -20; }],
    ['the reach divisor', d => { d.numbers.reach_divisor = 120; }],
    ['a winter modifier', d => { d.numbers.winter_modifiers.bitter[0] = 0.2; }],
    ['the first Mistfall', d => { d.seasons.mistfall = [10, 1]; }],
    ['the charter', d => { d.numbers.charter_offered = 0; }],
    ['the White Companies', d => { d.numbers.white_manpower = 20000; }],
    ['an opinion', d => { d.numbers.opinion_hall_friend = 10; }],
    ['the feeding AI', d => { d.ai.feed.min_pp = 60; }],
  ];
  for (const [what, mutate] of cases) {
    const { view: mv } = await build(mutate);
    assert(specProblems(mv).length > 0, `the check misses a wrong ${what}`);
  }
});

test('Determinism: a second build yields the same bytes; a changed number changes them', async () => {
  const again = await build();
  assert.deepEqual([...again.staged.files.keys()], [...base.staged.files.keys()]);
  for (const [k, v] of base.staged.files) assert(v.equals(again.staged.files.get(k)), `${k} differs between builds`);
  const other = await build(d => { d.numbers.timber_pp = 41; });
  assert(![...base.staged.files].every(([k, v]) => v.equals(other.staged.files.get(k))), 'a different number must change the output');
});

test('Files: the spec\'s file table is staged, nothing else; the text is UTF-8 with a byte order mark', () => {
  const want = ['common/scripted_effects/zin_cold.txt', 'common/scripted_triggers/zin_cold.txt', 'common/ideas/zin_cold.txt', 'common/dynamic_modifiers/zin_cold.txt', 'common/opinion_modifiers/zin_cold.txt', 'common/decisions/categories/zin_cold.txt', 'common/decisions/zin_cold.txt', 'events/zin_cold.txt', 'common/on_actions/zin_cold.txt', 'common/ai_strategy/zin_cold.txt', 'localisation/english/zin_cold_l_english.yml'];
  assert.deepEqual([...base.staged.files.keys()].sort(), want.sort());
  assert.deepEqual(R.files, want.sort());
  assert(![...base.staged.files.keys()].some(k => k.startsWith('common/game_rules/')), 'the rule zin_rule_cold_isengard is the rules module\'s');
  assert.deepEqual(bomProblems(V.locBytes), []);
  assert.doesNotThrow(() => new TextDecoder('utf-8', { fatal: true }).decode(V.locBytes));
  for (const [k, b] of base.staged.files) assert(!b.includes(Buffer.from('\r\n')), `${k} has CRLF line ends`);
});

test('Negative: a text file without its byte order mark is refused', () => {
  assert.equal(bomProblems(V.locBytes.subarray(3)).length, 1);
});

test('Script: every staged file parses with balanced braces and uses no <= or >=', () => {
  assert.deepEqual(balanceProblems(V.scripts), []);
  assert.deepEqual(operatorProblems(V.scripts), []);
});

test('Negative: an unbalanced block and a <= operator are refused', () => {
  assert.equal(balanceProblems(new Map([['x.txt', 'a = {\n\tb = { c = yes\n}\n']])).length > 0, true);
  assert.equal(balanceProblems(new Map([['x.txt', 'a = { }\n}\n']])).length > 0, true);
  assert.deepEqual(operatorProblems(new Map([['x.txt', 'a = {\n\tcheck_variable = { v >= 1 }\n\tb = "x <= y" # c <= d\n}\n']])), ['x.txt:2']);
});

test('Engine vocabulary: every command is an engine effect or trigger, a scripted name defined here, or a declared external', async () => {
  const known = new Set([...R.definitions.effects, ...R.definitions.triggers, ...coldExternals()]);
  assert.deepEqual(await vocabularyProblems(V.scripts, known), []);
  const meta = block(EF, 'zin_cold_schedule_seasons');
  assert(meta.includes('meta_effect = {') && meta.includes('days = [DAYS]') && meta.includes('DAYS = "[?global.zin_cold_delay|0]"'), 'the season queue builds its delay through meta_effect');
});

test('Negative: the vocabulary check finds an unknown trigger, an unknown effect, a wrong command inside a meta_effect and an undefined helper', async () => {
  const bad = new Map([
    ['common/scripted_triggers/zin_x.txt', 'zin_x_t = {\n\tthis_trigger_does_not_exist = yes\n}\n'],
    ['common/scripted_effects/zin_x.txt', 'zin_x_e = {\n\tif = {\n\t\tlimit = { always = yes }\n\t\tadd_political_powerr = 5\n\t}\n\tzin_x_helper_that_nobody_wrote = yes\n\tmeta_effect = {\n\t\ttext = {\n\t\t\tcountry_eventt = { id = x.1 days = [D] }\n\t\t}\n\t\tD = "1"\n\t}\n}\n'],
  ]);
  const problems = await vocabularyProblems(bad, new Set(['zin_x_t', 'zin_x_e']));
  assert.equal(problems.length, 4, problems.join('; '));
  for (const w of ['this_trigger_does_not_exist', 'add_political_powerr', 'zin_x_helper_that_nobody_wrote', 'country_eventt']) assert(problems.some(p => p.includes(w)), w);
});

test('Modifiers: every key of every spirit and dynamic modifier is in the installed modifier documentation', async () => {
  for (const [f, t] of V.scripts) if (/common\/(ideas|dynamic_modifiers)\//.test(f)) {
    const mods = {};
    const tops = f.includes('/ideas/') ? parse(t)[0].v.flatMap(g => g.v) : parse(t);
    for (const e of tops) for (const x of e.v) {
      if (x.k === 'modifier') for (const m of x.v) mods[m.k] = 1;
      else if (!Array.isArray(x.v) && !/^(picture|removal_cost|icon)$/.test(x.k)) mods[x.k] = 1;
    }
    assert(Object.keys(mods).length > 0, f);
    await checkMods(f, mods);
  }
});

test('Negative: an unknown modifier is refused by the documentation check and by the builder\'s renderers', async () => {
  await assert.rejects(() => checkMods('bad', { winter_attrition_factorr: 0.1 }), /Unknown modifier/);
  const T = new Texts({ zin_x: 'X', zin_x_desc: 'Y' });
  await assert.rejects(() => renderIdea({ id: 'zin_x', picture: 'zin_granary', modifier: { stability_factorr: 0.1 } }, T), /Unknown modifier/);
  await assert.rejects(() => renderDynamicModifier({ id: 'zin_x', modifier: { winter_attritionn: 'v' } }, T), /Unknown modifier/);
});

test('Localisation: every key the script names exists; no empty text, banned or modern word, former setting name, -waith name or undrawable character', () => {
  assert.deepEqual(locKeyProblems(V.scripts, V.loc), []);
  assert.deepEqual(textProblems(V.loc), []);
  assert.equal(Object.keys(V.loc).length, Object.keys(DATA.text).length + 4, 'every data text and the two aliased decision texts');
  assert(V.loc['zin_cold.71.t'].includes(`[${WIN}.GetName]`) && V.loc['zin_cold.70.d'].includes(`[${GUN}.GetName]`), 'renamed countries are named as the game names them (K27)');
  assert(V.loc['zin_cold_send_envoys_desc'].includes('rises by ten') && V.loc['zin_cold_sell_timber_west_desc'].includes('forty Authority') && V.loc['zin_cold_tt_feed'].includes('§Y15§!'), 'numbers in the text follow the data');
});

test('Negative: a missing key, a modern word, a banned unit, a former setting name, a -waith name and a font character are refused', () => {
  const loc = { ...V.loc }; delete loc['zin_cold.12.b'];
  assert.deepEqual(locKeyProblems(V.scripts, loc), ['zin_cold.12.b']);
  const hits = textProblems({ a: 'The tank division moves with its manpower', b: 'Forty kilometres of road', c: 'Erdae is far', d: 'The Windwaith fleet', e: 'Šodolôrō', f: '' });
  for (const k of ['a', 'b', 'c', 'd', 'e', 'f']) assert(hits.some(h => h.startsWith(`${k}:`) || h.includes(`${k}: `)), `${k} passes: ${hits.join('; ')}`);
});

test('Negative: the builder refuses a banned word, an unknown placeholder and unused text in the data file', async () => {
  await assert.rejects(() => build(d => { d.text['zin_cold.11.a'] = 'The tanks will hold.'; }), /text problems/);
  await assert.rejects(() => build(d => { d.text['zin_cold.11.a'] = 'We hold {tag:Nowhere}.'; }), /does not resolve/);
  await assert.rejects(() => build(d => { d.text['zin_cold.11.a'] = 'We hold {n:no_such_number}.'; }), /lacks/);
  await assert.rejects(() => build(d => { d.text.zin_cold_never_used = 'Snow.'; }), /text nothing uses/);
});

test('Placeholders: number words and month names resolve; anything else is refused', () => {
  assert.deepEqual([5, 10, 15, 40, 90, 21, 100, 365].map(numberWord), ['five', 'ten', 'fifteen', 'forty', 'ninety', 'twenty-one', 'one hundred', 'three hundred and sixty-five']);
  assert.throws(() => numberWord(1.5)); assert.throws(() => numberWord(-1));
  assert.equal(resolveText('{month:1} and {month:11}', { tags: new Map(), numbers: {} }), 'Glernaen and Gaelor');
  assert.equal(resolveText('{n:a} {w:a}', { tags: new Map(), numbers: { a: 15 } }), '15 fifteen');
  assert.throws(() => resolveText('{month:13}', { tags: new Map(), numbers: {} }), /No month/);
});

test('Secrets: no text names Afrit, the Hidden Council, Eindil or Glo, or hints at a sleeper in the ice (D3, D4, acceptance 3)', () => {
  assert.deepEqual(secretProblems(V.loc), []);
  const party = V.loc['zin_cold.60.d'];
  assert(/temple grey/.test(party) && /did not send a name/.test(party), 'the temple party has no master');
});

test('Negative: the secrecy check catches each secret', () => {
  for (const s of ['Afrit waits', 'the Hidden Council', 'Eindil wakes', 'a man asleep... the sleeper', 'Glo shines', 'he woke in the ice', 'Einendil']) assert.equal(secretProblems({ k: s }).length, 1, s);
});

test('Events: every visible event takes 30 days, has a catalog picture with the crop it needs and is ungated; hidden events only act', async () => {
  const cells = await json('presentation-cells.json');
  assert.deepEqual(eventProblems(EV, cells), []);
  const options = Object.fromEntries(events(EV).map(e => [e.get('id'), e.all('option').length]));
  assert.deepEqual(options, { 'zin_cold.1': 0, 'zin_cold.10': 0, 'zin_cold.11': 1, 'zin_cold.12': 3, 'zin_cold.13': 0, 'zin_cold.20': 0, 'zin_cold.21': 1, 'zin_cold.30': 2, 'zin_cold.31': 1, 'zin_cold.32': 1, 'zin_cold.33': 2, 'zin_cold.34': 0, 'zin_cold.35': 0, 'zin_cold.36': 0, 'zin_cold.40': 2, 'zin_cold.41': 2, 'zin_cold.50': 2, 'zin_cold.51': 2, 'zin_cold.52': 2, 'zin_cold.60': 2, 'zin_cold.61': 2, 'zin_cold.70': 2, 'zin_cold.71': 2 });
  assert.equal(events(EV).find(e => e.get('id') === 'zin_cold.32').kind, 'news_event');
  assert.equal(events(EV).find(e => e.get('id') === 'zin_cold.61').get('picture'), 'GFX_zin_evt_yeldenne_hall');
  // E2: the first option commits to nothing, so a timeout keeps the checkpoint open.
  const committal = /zin_cold_isengard_swears|add_to_faction|"puppet"|add_to_war|zin_cold_add_(yeti|giant)_pact|give_guarantee|zin_cold_open_neck_road|zin_cold_harbour_compact|zin_yeldenne_forewarned|zin_cold_start_march_war/;
  for (const id of ['zin_cold.30', 'zin_cold.33', 'zin_cold.40', 'zin_cold.41', 'zin_cold.50', 'zin_cold.51', 'zin_cold.52', 'zin_cold.60', 'zin_cold.61', 'zin_cold.70', 'zin_cold.71']) {
    const opts = events(EV).find(e => e.get('id') === id).all('option');
    assert(!committal.test(JSON.stringify(opts[0].v)), `${id}: the first option commits`);
    assert(committal.test(JSON.stringify(opts[1].v)) || id === 'zin_cold.33', `${id}: the second option does not act`);
  }
});

test('Negative: the event check refuses a missing timeout, an unknown picture, a gated picture and a news picture without its crop', async () => {
  const cells = await json('presentation-cells.json');
  const bad = 'country_event = {\n\tid = zin_x.1\n\ttitle = a\n\tdesc = b\n\tpicture = GFX_zin_evt_snow_owls\n\toption = { name = c }\n}\ncountry_event = {\n\tid = zin_x.2\n\ttitle = a\n\tdesc = b\n\tpicture = GFX_zin_evt_man_in_ice\n\ttimeout_days = 30\n\toption = { name = c }\n}\nnews_event = {\n\tid = zin_x.3\n\ttitle = a\n\tdesc = b\n\tpicture = GFX_zin_news_generic_wilds\n\ttimeout_days = 30\n\toption = { name = c }\n}\ncountry_event = {\n\tid = zin_x.4\n\thidden = yes\n}\n';
  const p = eventProblems(bad, cells);
  for (const s of ['zin_x.1: timeout', 'zin_x.1: picture', 'zin_x.2: picture man_in_ice is gated', 'zin_x.3: no news crop', 'zin_x.4: hidden without effects']) assert(p.some(x => x.startsWith(s)), `${s} not found in ${p.join('; ')}`);
});

test('References: every call, event, idea, modifier, flag and global variable resolves here or is a declared external, and every declared external is used', () => {
  assert.deepEqual(referenceProblems(V, R), []);
  const owners = new Set(COLD_DEPENDENCIES.map(d => d.owner));
  assert(owners.size >= 10 && COLD_DEPENDENCIES.every(d => d.spec.startsWith('docs/specs/') && d.names.length), 'each dependency names its owner and spec');
  for (const id of ['zin_opinion_cold_rivalry', 'zin_coldor_ports_against_interior', 'zin_rule_cold_isengard']) assert(!new RegExp(`^${id} = \\{`, 'm').test(V.all), `${id} belongs to another slice`);
});

test('Negative: an undeclared call, a read-only flag and an unused external are refused by the reference check', () => {
  const mutated = { ...V, all: `${V.all}\nzin_x_not_written = yes\nhas_country_flag = zin_x_never_set\nid = zin_cold.99\n` };
  const p = referenceProblems(mutated, R);
  assert(p.includes('call zin_x_not_written') && p.some(x => x.startsWith('flag zin_x_never_set')) && p.includes('event zin_cold.99'), p.join('; '));
  const stripped = { ...V, all: V.all.replaceAll('zin_regional_titanos_apart', 'x') };
  assert(referenceProblems(stripped, R).includes('declared external zin_regional_titanos_apart is never used'));
});

test('Peace gates: the only cause of war is the March Forts border war, behind zin_cold_march_war_allowed (acceptance 2)', () => {
  assert.deepEqual(peaceGateProblems(V.scripts), []);
  const gate = block(TR, 'zin_cold_march_war_allowed');
  assert(gate.includes('zin_cold_date_march_open = yes') && gate.includes('zin_cold_historical = yes\n\t\t\tzin_cold_date_march_historical = yes'), 'the two dated gates');
  assert(gate.includes(`NOT = { ${COL} = { has_country_flag = zin_cold_march_war_fought } }`), 'fought once');
  assert(block(EF, 'zin_cold_start_march_war').includes('state = event_target:zin_cold_march_attacker') && block(EF, 'zin_cold_start_march_war').includes('state = event_target:zin_cold_march_defender'), 'states by event target, as vanilla FRA does');
  const ev31 = eventBlock(EV, 'zin_cold.31');
  assert(ev31.includes('zin_cold_historical = no') && ev31.includes('is_ai = yes'), 'Isengard starts it only off the historical rule and only as AI');
});

test('Negative: a war outside the gate is refused', () => {
  const s = new Map(V.scripts);
  s.set('common/decisions/zin_cold.txt', `${s.get('common/decisions/zin_cold.txt')}\nzin_x = {\n\tzin_x_d = {\n\t\tcomplete_effect = { create_wargoal = { type = annex_everything target = ${ISE} } }\n\t}\n}\n`);
  assert.equal(peaceGateProblems(s).length, 1);
  const ungated = new Map(V.scripts);
  ungated.set('common/scripted_effects/zin_cold.txt', EF.replace('limit = { zin_cold_march_war_allowed = yes }', 'limit = { always = yes }'));
  assert(peaceGateProblems(ungated).includes('the border war is not behind its peace gate'));
});

test('Rules: zin_rule_cold_isengard is read through the rules wrappers, and never against a player (R1)', async () => {
  assert.deepEqual(ruleProblems(V), []);
  const rules = await json('game_rules.json');
  const rule = rules.rules.find(r => r.id === 'zin_rule_cold_isengard');
  assert(rule && rule.perPower && rule.power === 'cold', 'the rule row lives in the rules data');
  assert.deepEqual(rule.options.map(o => o.key), ['DEFAULT', 'HISTORICAL', 'OPEN_HAND', 'CONQUEST', 'FREE']);
  assert.equal(rule.branch.HISTORICAL, 'HISTORICAL');
  for (const t of RULE_TRIGGERS) assert.equal(t, `zin_rules_ai_branch_${rule.power}_historical`, 'the wrapper name rules.mjs writes');
  assert.equal(rules.path_rule, 'zin_rule_historical_path');
  assert(block(EF, 'zin_cold_roll_winter').includes('zin_rules_is_historical = yes'), 'the fixed winters follow the path rule');
  const timber = block(block(DEC, 'zin_cold_sell_timber_west'), 'ai_will_do');
  assert((timber.match(/zin_cold_historical = yes/g) ?? []).length === 3 && timber.includes('zin_cold_date_timber_1 = yes') && timber.includes('zin_cold_date_timber_2 = yes'), 'twice on the historical path');
});

test('Negative: a direct has_game_rule and a rule read in a decision\'s availability are refused', () => {
  const v1 = { ...V, all: `${V.all}\nhas_game_rule = { rule = zin_rule_cold_isengard option = FREE }` };
  assert(ruleProblems(v1).length > 0);
  const bread = block(DEC, 'zin_cold_bread_for_isengard');
  const dec = DEC.replace(bread, bread.replace('available = {\n', 'available = {\n\t\t\tzin_cold_historical = yes\n'));
  assert.notEqual(dec, DEC);
  const v2 = { ...V, f: rel => (rel === 'common/decisions/zin_cold.txt' ? dec : V.f(rel)) };
  assert(ruleProblems(v2).some(p => p.includes('zin_cold_bread_for_isengard.available')));
});

// A decision requirement the player reads names no raw flag, variable or scripted trigger (CLAUDE.md, localisation rule 7).
function tooltipProblems(decisionsText, loc) {
  const out = [];
  const walk = (entries, where) => { for (const e of entries) {
    if (e.k === 'custom_trigger_tooltip') { const key = e.v.find(x => x.k === 'tooltip')?.v; if (!(key in loc)) out.push(`${where}: tooltip ${key} has no text`); continue; }
    if (/^(has_country_flag|has_global_flag|check_variable)$/.test(e.k) || /^zin_/.test(e.k ?? '')) out.push(`${where}: raw ${e.k}`);
    else if (Array.isArray(e.v)) walk(e.v, where);
  } };
  for (const d of parse(decisionsText).flatMap(c => c.v)) for (const part of d.v) if (part.k === 'available') walk(part.v, d.k);
  return out;
}

test('Tooltips: every decision requirement the player reads has its own text', () => {
  assert.deepEqual(tooltipProblems(DEC, V.loc), []);
  for (const k of ['zin_cold_tt_hard_winter', 'zin_cold_tt_invite_lean', 'zin_cold_tt_protect_reach', 'zin_cold_tt_west_ready', 'zin_cold_tt_pact_waiting']) assert(DEC.includes(`tooltip = ${k}`), k);
  assert(V.loc.zin_cold_tt_invite_lean.includes('§Y50§!') && V.loc.zin_cold_tt_protect_reach.includes('§Y40§!'));
});

test('Negative: a raw flag in a requirement, or a tooltip without text, is refused', () => {
  const raw = DEC.replace('available = {\n\t\t\tcustom_trigger_tooltip = {\n\t\t\t\ttooltip = zin_cold_tt_room_to_lean', 'available = {\n\t\t\thas_country_flag = zin_cold_open_hand\n\t\t\tcustom_trigger_tooltip = {\n\t\t\t\ttooltip = zin_cold_tt_room_to_lean');
  assert.notEqual(raw, DEC);
  assert(tooltipProblems(raw, V.loc).some(p => p.includes('raw has_country_flag')));
  const loc = { ...V.loc }; delete loc.zin_cold_tt_west_ready;
  assert(tooltipProblems(DEC, loc).some(p => p.includes('zin_cold_tt_west_ready')));
});

test('Story pace: each of the four dates is written for the standard, slow and fast pace (V4, acceptance 11)', () => {
  assert.deepEqual(dateProblems(TR, SPEC.dates), []);
  assert.equal(paceDate(1752, 3, 1, PACES.slow), '1754.3.1', 'a slow pace starts the historical March Forts in Thaw 4A 1754');
  assert.deepEqual(R.definitions.dateTriggers, Object.keys(SPEC.dates).map(k => `zin_cold_date_${k}`));
});

test('Negative: a date written at one pace only, or a wrong date in the data, is refused', async () => {
  const one = 'zin_cold_date_march_open = {\n\tdate > 1751.3.1\n}\n';
  assert(dateProblems(one, { march_open: [1751, 3, 1] }).length >= 3);
  const { view: mv } = await build(d => { d.numbers.dates.timber_2 = [1755, 3, 1]; });
  assert(dateProblems(mv.f('common/scripted_triggers/zin_cold.txt'), SPEC.dates).length > 0);
});

test('Seasons: the startup schedules Mistfall and Deepwinter; each season queues the next from its due day; the runner fires a lost one', () => {
  const ev10 = eventBlock(EV, 'zin_cold.10'), ev20 = eventBlock(EV, 'zin_cold.20'), ev13 = eventBlock(EV, 'zin_cold.13');
  assert(ev10.includes('zin_cold_roll_winter = yes') && ev10.includes('id = zin_cold.11') && ev10.includes('zin_cold_next_mistfall = yes'));
  assert(ev20.includes('zin_cold_next_moot = yes') && ev20.includes('id = zin_cold.21') && ev13.includes('zin_cold_end_winter = yes') && ev13.includes('clear_variable = global.zin_cold_due_thaw'));
  const next = block(EF, 'zin_cold_next_mistfall');
  assert(next.indexOf('global.zin_cold_due_thaw = global.zin_cold_due_mistfall') < next.indexOf('add_to_variable = { global.zin_cold_due_mistfall = 365 }'), 'the Thaw counts from this Mistfall');
  assert(next.includes('id = zin_cold.10 days = [DAYS]') && next.includes('id = zin_cold.13 days = [DAYS]'));
  const monthly = block(EF, 'zin_cold_monthly');
  for (const k of ['mistfall', 'moot', 'thaw']) assert(monthly.includes(`zin_cold_t_late = global.zin_cold_due_${k}`), `catch-up ${k}`);
  assert(block(TR, 'zin_cold_winter_is_hard').includes('global.zin_cold_winter > 0.99') && block(TR, 'zin_cold_winter_is_hard').includes('has_global_flag = zin_cold_winter_season'));
  const end = block(EF, 'zin_cold_end_winter');
  assert(end.includes('clr_global_flag = zin_cold_winter_season') && end.includes('remove_dynamic_modifier = { modifier = zin_cold_winter_mod }'), 'no winter modifier remains after the Thaw (acceptance 13)');
});

test('Monthly runner: no every-country pulse; a per-tag hook for each Cold Lands country; the layouts refresh last (E4, acceptance 15)', () => {
  assert.deepEqual(pulseProblems(OA), []);
  for (const c of COLD) assert(OA.includes(`\ton_monthly_${c.tag} = {\n\t\teffect = {\n\t\t\tif = {\n\t\t\t\tlimit = { zin_cold_is_runner = yes }`), c.name);
  assert.equal((OA.match(/on_monthly_/g) ?? []).length, SPEC.coldCountries);
  assert(OA.includes(`${COL} = { country_event = { id = zin_cold.1 } }`) && OA.includes('zin_cold_on_declare_war = yes'));
  const monthly = block(EF, 'zin_cold_monthly');
  assert(monthly.trimEnd().endsWith('every_country = {\n\t\tlimit = { zin_cold_is_cold = yes }\n\t\tmark_focus_tree_layout_dirty = yes\n\t}\n}'), 'layouts last');
  assert(monthly.startsWith('zin_cold_monthly = {\n\tset_global_flag = { flag = zin_cold_month_ran days = '), 'a tie runs once a month');
  assert(block(TR, 'zin_cold_is_runner').includes('NOT = { has_global_flag = zin_cold_month_ran }'));
  assert(monthly.includes(`has_guaranteed = ${YEL}`) && monthly.includes('remove_ideas = zin_cold_hall_guard'), 'the hall guard lasts while the guarantee stands');
});

test('Negative: an every-country on_monthly is refused', () => {
  assert.equal(pulseProblems(`on_actions = {\n\ton_monthly = {\n\t\teffect = { }\n\t}\n}\n`).length, 1);
  assert.equal(pulseProblems(`on_actions = {\n\ton_weekly = { effect = { } }\n}\n`).length, 1);
});

test('Accord and Isengard: swearing, the Iron Hand charter, the counter-decisions', () => {
  const swear = block(EF, 'zin_cold_isengard_swears');
  for (const s of ['set_global_flag = zin_cold_isengard_sworn', 'remove_opinion_modifier = { target = ' + COL + ' modifier = zin_opinion_cold_rivalry }', 'add_ideas = zin_cold_sworn_to_the_accord', `add_to_faction = ${ISE}`, 'modifier = zin_cold_accord_kin']) assert(swear.includes(s), s);
  const monthly = block(EF, 'zin_cold_monthly');
  assert(monthly.includes('has_country_flag = zin_cold_iron_hand') && monthly.includes('has_country_flag = zin_cold_march_war_fought') && monthly.includes('set_global_flag = zin_cold_charter_sent') && monthly.includes('id = zin_cold.30'), 'the charter at the sword\'s point, once');
  for (const id of ['zin_cold_winter_gifts', 'zin_cold_isengard_feeds']) assert(block(DEC, id).includes(`original_tag = ${ISE}`) && block(DEC, id).includes('FROM = { is_neighbor_of = ROOT }'), `${id} is Isengard's and aims at neighbours`);
  assert(block(TR, 'zin_cold_is_clan_realm').includes(`original_tag = ${YEL}`) && block(TR, 'zin_cold_is_clan_realm').includes('has_variable = zin_cold_lean'));
});

test('Old pacts: level one by answer, AI 60 + lean / 2, doubled when open, nil when apart; renewal after 180 days, never against an apart people', () => {
  for (const [id, open, apart] of [['zin_cold.51', 'zin_regional_yeti_lands_open_to_truce', 'zin_regional_yeti_lands_apart'], ['zin_cold.52', 'zin_regional_titanos_open_to_pacts', 'zin_regional_titanos_apart']]) {
    const e = events(EV).find(x => x.get('id') === id), accept = e.all('option')[1];
    const ai = accept.v.find(x => x.k === 'ai_chance').v;
    const baseW = Number(ai.find(x => x.k === 'base').v), steps = ai.filter(x => x.k === 'modifier' && x.v.some(y => y.k === 'add'));
    const weightAt = lean => baseW + steps.filter(m => lean > Number(m.v.find(y => y.k === 'check_variable').v[0].v)).reduce((a, m) => a + Number(m.v.find(y => y.k === 'add').v), 0);
    assert.deepEqual([-100, 0, 40, 100].map(weightAt), [10, 60, 80, 110], 'AI chance 60 + lean / 2');
    const flags = JSON.stringify(ai);
    assert(flags.includes(open) && flags.includes(apart), `${id} reads the regional flags`);
    assert(eventBlock(EV, id).includes('factor = 2') && eventBlock(EV, id).includes('factor = 0'));
  }
  const renew = block(DEC, 'zin_cold_renew_old_pact');
  assert(renew.includes(`targets = { ${tagOf('Yeti Lands')} ${tagOf('Titanos')} }`) && renew.includes('NOT = { has_country_flag = zin_regional_titanos_apart }') && renew.includes('has_country_flag = zin_cold_giant_waiting'), 'renewal');
  const hearth = block(EF, 'zin_cold_on_declare_war');
  assert(hearth.includes('zin_cold_yeti_pact > 2.99') && hearth.includes('zin_cold_giant_pact > 2.99') && hearth.includes('FROM = { original_tag = ' + COL + ' }') && hearth.includes('zin_cold_is_cold = no'), 'Hearth and Height answers an outsider\'s attack on Coldor');
});

test('The far north-west, the silent castle, the Neck Road, Windwaith and the final war follow sections 5 to 8', () => {
  const ev60 = eventBlock(EV, 'zin_cold.60');
  for (const s of ['has_country_flag = zin_cold_watch_fires', 'has_global_flag = zin_afrit_at_yeldenne', 'NOT = { has_global_flag = zin_horos_dead }', 'fire_only_once = yes', 'set_global_flag = zin_yeldenne_forewarned', 'zin_is_site_parim = yes', 'modifier = zin_cold_temple_swords']) assert(ev60.includes(s), s);
  const ev61 = eventBlock(EV, 'zin_cold.61');
  assert(ev61.includes('has_country_flag = zin_cold_hall_respected') && ev61.includes('NOT = { has_country_flag = zin_glo_petitioned }') && ev61.includes('add_ideas = zin_cold_hall_guard'), 'Horos accepts a respectful, unpetitioning crown');
  const ev71 = events(EV).find(e => e.get('id') === 'zin_cold.71');
  assert(JSON.stringify(ev71.all('trigger')).includes('zin_cold_harbour_compact'), 'nothing happens with a compact already signed');
  const refuseAi = JSON.stringify(ev71.all('option')[0].v.find(x => x.k === 'ai_chance').v), acceptAi = JSON.stringify(ev71.all('option')[1].v.find(x => x.k === 'ai_chance').v);
  assert(refuseAi.includes('zin_regional_windwaith_free_harbours') && acceptAi.includes('"factor","op":"=","v":"0"') && acceptAi.includes('zin_regional_windwaith_free_harbours'), 'the free harbours always refuse');
  const timber = block(DEC, 'zin_cold_sell_timber_west');
  for (const f of ['zin_west_council', 'zin_west_route_divided', 'zin_west_route_crossing', 'zin_west_route_relief', 'zin_west_route_hold']) assert(timber.includes(`has_global_flag = ${f}`), f);
  assert(block(EF, 'zin_cold_join_crossing').includes('set_global_flag = zin_cold_joins_crossing') && block(EF, 'zin_cold_sail_white_companies').includes('zin_eindil_join_coalition = yes'));
  assert(block(EF, 'zin_cold_reward_ice_host').includes('zin_is_site_eindil_ice = yes') && block(EF, 'zin_cold_chart_far_ice').includes('set_country_flag = zin_cold_far_ice_charted'));
});

test('Warfare: the White Company uses sub-units, equipment and a names group the warfare data defines', async () => {
  const ids = await json('warfare_ids.json');
  const land = JSON.stringify(ids.landSubUnits), all = JSON.stringify(ids);
  for (const u of ['zin_men_infantry', 'zin_men_archers', 'zin_men_cavalry', 'zin_support_scouts', 'zin_support_healers', 'zin_support_quartermasters']) assert(land.includes(`"${u}"`), u);
  assert(all.includes('"zin_arms_equipment"') && all.includes('ZIN_HOSTS'));
});

test('Roster: the builder refuses a data file that names a missing or misplaced country or miscounts the region (acceptance 12)', async () => {
  await assert.rejects(() => build(d => { d.roster.expectedCountries = 30; }), /expects 30/);
  await assert.rejects(() => build(d => { d.roster.leans.Narnia = 10; }), /not in countries.json/);
  await assert.rejects(() => build(d => { d.roster.core.push('Gunwaith'); }), /Cold Lands country/);
  await assert.rejects(() => build(d => { d.roster.leans.Coldor = 10; }), /lean-holding/);
});

test('Catalog: the builder refuses an event picture or an icon outside the catalog', async () => {
  const mod = await readFile(path.join(here, 'modules', 'mech_cold.mjs'), 'utf8');
  assert(mod.includes('is not in the catalog') && mod.includes('is not in the icon catalog'), 'the guards exist');
  const { knownPictures, knownIcons } = await import('./lib/mech_kit.mjs');
  const pics = await knownPictures(), icons = await knownIcons();
  for (const e of events(EV)) if (e.get('picture')) assert(pics.has(e.get('picture')), e.get('picture'));
  assert(!pics.has('GFX_zin_evt_steading_winter') && !pics.has('GFX_zin_evt_isengard_walls'), 'the requested Cold Lands pictures are not in the catalog yet (the note lists them)');
  for (const m of DEC.matchAll(/icon = (GFX_[a-z_]+)/g)) assert(icons.has(m[1]), m[1]);
});

test('Zol: the slice adds nothing for Zol and names no Zol manifestation', () => {
  assert(!/zin_zol|zol_manifested|\bZol\b/i.test(V.all) && !Object.values(V.loc).some(t => /\bZol\b/.test(t)));
});
