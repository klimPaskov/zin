// Institutions (docs/specs/03_gameplay/08_institutions.md): the War Camp, the Council of Captains, Orders and Valour, the
// Great Fairs, Guild Licences and Sending Arms, Seals and Codes, the Courts of Whispers, Court Intrigue, Guilds and
// Orders, and Spells. One module, four internal writers (lib/inst_war, inst_trade, inst_intrigue, inst_craft); data in
// tools/content/data/institutions*.json.
//
//   await buildInstitutions(staged, { countries, table?, pools?, labels? })
//     countries  the roster of data/countries.json
//     table      Map tag -> { people, stance } (modules/countries.mjs loadCountryTable); derived from docs/design/countries.csv
//     pools      Map scan -> { male, female, surnames } (modules/names.mjs buildNames); derived from data/labels.json
//   returns a summary of what it wrote; throws on a text, id, picture or reference error.
//
// Also exported: loadInstitutions() (the data, for the politics step), equipmentRights() (the licence and lend-lease table
// for the warfare module), requiredEnumEntries() (archetypes script_enums.txt must list), defineRows() (rows for defines.json).
import { readFile } from 'node:fs/promises';
import { Staged } from '../lib/core.mjs';
import { ZIN } from '../lib/paths.mjs';
import { HEADER, Loc, Sprites, loadAllData, loadCatalogKeys, bannedIn, notCp1252, tierOf, countryKey } from '../lib/inst_util.mjs';
import { writeHq, writeAbilities, writeCustoms, writeChiefs, writeUnitLeaderTraits, writeValour, warTriggers, leaderOnActions } from '../lib/inst_war.mjs';
import { tradeStrategies, equipmentRights as rights } from '../lib/inst_trade.mjs';
import { writeUpgrades, writeAgencies, writeOperations, writePhases, tokenText, writeRaids, intrigueEvent, fakeHostUnit, intrigueStrategies } from '../lib/inst_intrigue.mjs';
import { writeWorkshops, writePolicies, writeAiWeights, writeSpells, writeScholarTraits, craftEffects, circleStrategies, scholarPlan } from '../lib/inst_craft.mjs';

export const loadInstitutions = loadAllData;
export async function equipmentRights() { return rights(await loadAllData()); }
export async function requiredEnumEntries() {
  const d = await loadAllData(), out = new Set();
  for (const w of d.craft.workshops) for (const e of w.eq) out.add(e);
  for (const e of d.core.market.forSale) out.add(e.id);
  return [...out].sort();
}
export async function defineRows() { return (await loadAllData()).core.defines; }

async function derive(ctx) {
  let { table, pools } = ctx;
  if (!table) {
    const { loadCountryTable } = await import('./countries.mjs');
    table = await loadCountryTable(ctx.countries, `${ZIN}/docs/design/countries.csv`);
  }
  if (!pools) {
    const { buildNames } = await import('./names.mjs');
    const labels = ctx.labels ?? JSON.parse(await readFile(new URL('../data/labels.json', import.meta.url), 'utf8')).labels;
    pools = buildNames(new Staged(), ctx.countries, labels);
  }
  return { table, pools };
}

// Valour at the start (section 3.1), by tier, people and name, as a list of per-country grants.
export function startValour(data, countries, table) {
  const S = data.core.startValour, { a, b } = tierOf(data.core, countries), isA = new Set(a.map(c => c.tag)), isB = new Set(b.map(c => c.tag)), none = new Set(data.core.tiers.noValour);
  return countries.map(c => {
    if (none.has(c.name)) return { tag: c.tag, name: c.name, army: 0, navy: 0, air: 0 };
    const people = table.get(c.tag).people;
    let cls;
    if (isA.has(c.tag)) cls = c.name === 'Volgan' ? S.classes.find(x => x.id === 'tier_a_dead') : S.classes.find(x => x.tier === 'a' && x.peoples.includes(people)) ?? S.classes.find(x => x.id === 'tier_a_free');
    else if (isB.has(c.tag)) cls = S.classes.find(x => x.id === 'tier_b');
    else cls = S.classes.find(x => x.id === 'tier_c');
    return { tag: c.tag, name: c.name, army: cls.army, navy: cls.navy, air: cls.air };
  });
}

function startupEffect(env, chiefs, scholars, valour) {
  const byTag = new Map(), line = (tag, s) => (byTag.get(tag) ?? byTag.set(tag, []).get(tag)).push(s);
  const chairs = env.data.core.chairs;
  for (const p of chiefs.plan) line(p.country.tag, p);
  const blocks = [];
  for (const c of env.countries) {
    const mine = (byTag.get(c.tag) ?? []), body = [];
    for (const p of mine) body.push(`recruit_character = ${p.id}`);
    if (mine.length) {
      const act = ['\t\tlimit = { is_ai = yes }'];
      const plain = mine.filter(p => p.chair !== 'navy' && p.chair !== 'air'), navy = mine.find(p => p.chair === 'navy'), air = mine.find(p => p.chair === 'air');
      for (const p of plain) act.push(`\t\tactivate_advisor = ${p.id}_adv`);
      if (navy) act.push(`\t\tif = {\n\t\t\tlimit = {\n\t\t\t\tany_owned_state = { is_coastal = yes }\n\t\t\t}\n\t\t\tactivate_advisor = ${navy.id}_adv\n\t\t}`);
      if (air) act.push(`\t\tif = {\n\t\t\tlimit = { zin_rules_skies_present = yes }\n\t\t\tactivate_advisor = ${air.id}_adv\n\t\t}`);
      body.push(`if = {\n${act.join('\n')}\n\t}`);
    }
    const sc = scholars.find(s => s.tag === c.tag);
    if (sc) for (const code of sc.codes) body.push(`set_temp_variable = { zin_arg_rite = ${code} }`, 'zin_inst_grant_scholar = yes');
    const v = valour.find(x => x.tag === c.tag);
    if (v?.army) body.push(`army_experience = ${v.army}`);
    if (v?.navy) body.push(`if = {\n\t\tlimit = {\n\t\t\tany_owned_state = { is_coastal = yes }\n\t\t}\n\t\tnavy_experience = ${v.navy}\n\t}`);
    if (v?.air) body.push(`air_experience = ${v.air}`);
    if (body.length) blocks.push(`\t\t\t${c.tag} = {\n${body.map(l => `\t\t\t\t${l.replace(/\n/g, '\n\t\t\t')}`).join('\n')}\n\t\t\t}`);
  }
  return blocks.join('\n');
}

export async function buildInstitutions(staged, ctx) {
  const { countries } = ctx, data = await loadAllData(), { table, pools } = await derive(ctx);
  const loc = new Loc(), eloc = new Loc(), sprites = new Sprites(await loadCatalogKeys());
  const env = { data, loc, eloc, sprites, countries, table, pools, tiers: tierOf(data.core, countries), extraUnits: [fakeHostUnit()] };
  const summary = {};
  Object.assign(summary, writeHq(staged, env));
  Object.assign(summary, await writeAbilities(staged, env));
  Object.assign(summary, await writeCustoms(staged, env));
  const chiefs = await writeChiefs(staged, env); summary.chiefs = chiefs.chiefs;
  Object.assign(summary, await writeUnitLeaderTraits(staged, env));
  Object.assign(summary, writeValour(staged, env));
  Object.assign(summary, await writeUpgrades(staged, env));
  Object.assign(summary, writeAgencies(staged, env));
  Object.assign(summary, writeOperations(staged, env));
  Object.assign(summary, writePhases(staged, env));
  tokenText(env);
  Object.assign(summary, writeRaids(staged, env));
  Object.assign(summary, await writeWorkshops(staged, env));
  Object.assign(summary, writePolicies(staged, env));
  Object.assign(summary, writeAiWeights(staged, env));
  Object.assign(summary, await writeSpells(staged, env));
  Object.assign(summary, await writeScholarTraits(staged, env));

  // hooks, event, on_actions, AI strategy
  const scholars = scholarPlan(env), valour = startValour(data, countries, table);
  staged.text('common/scripted_triggers/zin_inst.txt', `${HEADER}\n${warTriggers()}\n`);
  staged.text('common/scripted_effects/zin_inst.txt', `${HEADER}\n${craftEffects(env).join('\n\n')}\n`);
  staged.text('events/zin_inst.txt', intrigueEvent(env));
  staged.text('common/on_actions/zin_inst.txt', `${HEADER}\n# Start: the chiefs of the Council of Captains (hired for AI realms), the scholars of each court and the Valour each realm has\n# saved by the long peace. No camp is deployed, no spell is under way and no agency exists. The leader on_actions below\n# replace the vanilla ones (fevers, wounds, the rank penalty after a promotion, captains taken alive).\non_actions = {\n\ton_startup = {\n\t\teffect = {\n${startupEffect(env, chiefs, scholars, valour)}\n\t\t}\n\t}\n${leaderOnActions()}\n}\n`);
  const trade = tradeStrategies(data, countries);
  const strategies = [...trade.text, ...intrigueStrategies(data, countries), ...circleStrategies(env)];
  staged.text('common/ai_strategy/zin_institutions.txt', `${HEADER}\n# Strategies of the institutions: the Great Fairs, Sending Arms, the Courts of Whispers, Court Intrigue and the circles of the rites.\n${strategies.join('\n\n')}\n`);
  summary.strategies = strategies.length;

  // text: ZIN keys, and the engine-owned keys ZIN re-themes
  for (const [k, v] of Object.entries(data.core.engineText)) if (!k.startsWith('_')) eloc.set(k, v);
  const problems = [];
  for (const [label, l] of [['zin_inst', loc], ['engine', eloc]]) {
    const e = l.entries();
    for (const h of await bannedIn(e)) problems.push(`${label} ${h.key}: ${h.word} (${h.rule})`);
    for (const b of notCp1252(e)) problems.push(`${label} ${b}`);
  }
  if (problems.length) throw new Error(`Institution text breaks the text rules (${problems.length}):\n  ${problems.slice(0, 40).join('\n  ')}`);
  staged.add('localisation/english/zin_inst_l_english.yml', loc.bytes());
  staged.add('localisation/replace/zin_inst_engine_l_english.yml', eloc.bytes());
  staged.text('interface/zz_zin_institutions.gfx', sprites.text());
  Object.assign(summary, { keys: loc.size, engineKeys: eloc.size, sprites: sprites.size });
  return summary;
}
