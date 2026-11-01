// The historical path (docs/specs/03_gameplay/06_historical_path_and_ai.md; docs/design/alternate_history.md sections 4, 6 and 8).
//   await buildHistoricalPath(staged, { countries })   after every owner module whose flags the checkpoints read, and after the world tension
//                                                      module, whose monthly tick calls zin_path_tick (step 8).
//   node tools/content/modules/historical_path.mjs --write   regenerates tools/content/data/path_checkpoints.json from the design twin
// The checkpoint table (CP01 to CP26: weights, beats, dates, flags, the divergences and their magnitudes) is generated from
// docs/design/alternate_history.json by checkpointsFromDesign() into data/path_checkpoints.json; alternate_history.test.mjs compares the two.
// What resolves each checkpoint (its predecessors, its relative windows and its ordered rules) is the table RULES below: each rule names
// the design divergence that it records (way code: beat x 100 + divergence, B07.D3 = 703; 0 when historical or when no divergence applies).
// Writes:
//   common/script_constants/zin_path.txt          weights (zin_path_weight.cpNN), magnitudes (zin_path_magnitude.<class>), the measure's constants
//   common/scripted_triggers/zin_path.txt         zin_path_cpNN_ready / _historical / _diverged / _skipped / _due / _overdue (and _early, _late)
//   common/scripted_effects/zin_path.txt          zin_path_tick, zin_path_resolve (args cp, state, way, m), zin_path_measure, zin_path_close,
//                                                 the role resolvers zin_path_role_<key> (R01 to R17) and zin_path_resolve_roles
//   common/scripted_localisation/zin_path.txt     zin_path_band_name
//   events/zin_path.txt                           zin_path.1 (hidden start check) and A Duty Passes for the public roles (zin_path.10 + role number)
//   localisation/english/zin_path_l_english.yml   checkpoint names, band names, role names and the role news (no zin_loc_chronicle_cp key)
// The tick only records and resolves; it never fires an owner's event (06 spec, "The path tick").
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Loc, hdr, format, blk, list, num, writeEvent, secrecyLeaks, wordProblems, notCp1252 } from '../lib/mech_court_lib.mjs';
import { paceDate, addDays, dayBefore, shiftDays, compareDates, PACES, paceTest, afterDate } from '../lib/story_dates.mjs';

const SPEC = 'docs/specs/03_gameplay/06_historical_path_and_ai.md';
const MOD = 'historical_path';
export const DESIGN = new URL('../../../docs/design/alternate_history.json', import.meta.url);
export const CHECKPOINTS = new URL('../data/path_checkpoints.json', import.meta.url);
// The watchdog's margin after a latest date (06 spec, "The path tick" 2), and the early and late windows around a target.
export const WATCHDOG_DAYS = 30;
const MAG_CLASS = new Map([[0, 'historical'], [0.25, 'shifted'], [0.5, 'other_way'], [0.75, 'successor'], [1, 'never_or_opposite']]);

// ------------------------------------------------------------------------------------------------ the loader
// One record per checkpoint: its weight and beats from the design's checkpoint list; the target is the earliest beat target and the latest
// the last beat latest date (a checkpoint resolves only when all its beats can have happened); flags and divergences come from the beats.
export function checkpointsFromDesign(design) {
  const beats = new Map(design.beats.map(b => [b.id, b]));
  const checkpoints = design.checkpoints.map(c => {
    const bs = c.beats.map(id => { const b = beats.get(id); if (!b) throw new Error(`${c.cp}: beat ${id} is not in the design`); return b; });
    const targets = bs.map(b => b.dates?.target).filter(Boolean).sort(compareDates);
    const latests = bs.map(b => b.dates?.latest).filter(Boolean).sort(compareDates);
    const divergences = {};
    for (const b of bs) for (const d of b.divergences) divergences[d.id] = { kind: d.kind, magnitude: d.magnitude };
    return { cp: c.cp, n: Number(c.cp.slice(2)), weight: c.weight, beats: [...c.beats], target: targets[0] ?? null, latest: latests.at(-1) ?? null,
      flags: [...new Set(bs.flatMap(b => b.flags.map(f => f.split(' ')[0])))], divergences };
  });
  return { source: 'Generated from docs/design/alternate_history.json by tools/content/modules/historical_path.mjs (checkpointsFromDesign); do not edit. Run node tools/content/modules/historical_path.mjs --write after the design changes; tools/content/alternate_history.test.mjs compares this file with the design.', magnitudes: design.magnitudes, totalWeight: checkpoints.reduce((a, c) => a + c.weight, 0), checkpoints };
}
export const loadDesign = async () => JSON.parse(await readFile(DESIGN, 'utf8'));
export const loadCheckpoints = async () => JSON.parse(await readFile(CHECKPOINTS, 'utf8'));
export const wayCode = id => { if (!id) return 0; const m = /^B(\d\d)\.D(\d+)$/.exec(id); if (!m) throw new Error(`Bad divergence id ${id}`); return Number(m[1]) * 100 + Number(m[2]); };

// ------------------------------------------------------------------------------------------------ the rules
// For each checkpoint: preds (resolved before it may resolve), after ({ CPxx: days }: the latest date also waits that long after CPxx resolved,
// paced), early / late (days before or after the target for the early and late tests), name (a public name: the secret is kept), and the
// ordered rules { s: 1 historical | 2 diverged | 3 skipped, way: divergence id, when: trigger lines, due: only once the latest date passed,
// m: a magnitude class for a diverged rule without a divergence }. `due` names the divergence recorded when the latest date passes.
const g = f => `has_global_flag = ${f}`;
const ng = f => `NOT = { has_global_flag = ${f} }`;
const cpIs = (n, s) => `check_variable = { global.zin_path_cp${String(n).padStart(2, '0')} = ${s} }`;
const noCountry = t => `NOT = { any_country = { ${t} = yes } }`;
const AFRIT_REALM = 'any_country = {\nOR = {\nzin_afrit_is_hub = yes\nzin_afrit_rules_here = yes\n}\n}';
export function rules(T) {
  return {
    CP01: { name: 'The peaceful start', preds: [], noLatest: true, rules: [
      { s: 2, way: 'B01.D2', when: [g('zin_path_start_failed')] },
      { s: 1, when: ['always = yes'] } ] },
    CP02: { name: 'The man in the ice wakes', preds: [], due: 'B03.D3', rules: [
      { s: 2, way: 'B03.D1', when: [g('zin_eindil_awake'), 'has_game_rule = { rule = zin_rule_eindil_waking option = EARLY }'] },
      { s: 2, way: 'B03.D2', when: [g('zin_eindil_awake'), 'has_game_rule = { rule = zin_rule_eindil_waking option = LATE }'] },
      { s: 1, when: [g('zin_eindil_awake')] } ] },
    CP03: { name: 'The Grey Ford truce breaks', preds: [], due: 'B05.D1', rules: [
      { s: 3, way: 'B05.D3', when: [ng('zin_west_truce_broken'), `OR = {\n${g('zin_role_grey_ford_a_vacant')}\n${g('zin_role_grey_ford_b_vacant')}\n}`] },
      { s: 2, way: 'B05.D1', when: [g('zin_west_truce_permanent')] },
      { s: 2, way: 'B05.D2', when: [g('zin_west_truce_broken'), ng('zin_eindil_awake')] },
      { s: 1, when: [g('zin_west_truce_broken')] } ] },
    CP04: { name: 'A war-king of the West makes peace', preds: [], due: 'B06.D1', rules: [
      { s: 3, when: [g('zin_eindil_lost')] },
      { s: 1, when: [g('zin_eindil_war_king')] },
      { s: 2, way: 'B06.D3', when: [g('zin_eindil_stage_3_done')] } ] },
    CP05: { name: 'The Golden King dies', preds: [], early: 60, due: 'B07.D2', rules: [
      { s: 3, way: 'B07.D6', when: [ng('zin_golden_king_dead'), `OR = {\n${g('zin_golden_king_exiled')}\n${noCountry('zin_aenor_is_realm')}\n}`] },
      { s: 2, way: 'B07.D3', when: [g('zin_golden_king_survives')] },
      { s: 2, way: 'B07.D4', when: [g('zin_golden_king_dead'), g('zin_golden_king_plot_exposed')] },
      { s: 2, way: 'B02.D3', when: [g('zin_golden_king_plot_exposed')] },
      { s: 2, way: 'B07.D5', when: [g('zin_golden_king_dead'), `OR = {\n${g('zin_golden_king_natural')}\n${ng('zin_afrit_regicide_ready')}\n}`] },
      { s: 2, way: 'B07.D1', when: [g('zin_golden_king_dead'), 'zin_path_cp05_early = yes'] },
      { s: 1, when: [g('zin_golden_king_dead')] } ] },
    CP06: { name: 'The Deliverer is crowned', preds: ['CP05'], after: { CP05: 90 }, due: 'B09.D2', rules: [
      { s: 3, when: [`OR = {\n${cpIs(5, 3)}\n${g('zin_golden_king_survives')}\n}`, ng('zin_aurevan_crowned'), ng('zin_afrit_kingdom_behind_throne')] },
      { s: 2, way: 'B09.D1', when: [g('zin_afrit_kingdom_behind_throne')] },
      { s: 2, way: 'B09.D4', when: [g('zin_aurevan_crowned'), g('zin_golden_king_plot_exposed')] },
      { s: 1, when: [g('zin_aurevan_crowned')] },
      { s: 2, way: 'B08.D1', when: [g('zin_aenor_regency_endures')] } ] },
    CP07: { name: 'The storm and the Islands of the South', preds: ['CP04'], due: 'B11.D1', rules: [
      { s: 3, when: [g('zin_eindil_lost')] },
      { s: 1, when: ['check_variable = { var = global.zin_eindil_stage value = 4 compare = greater_than_or_equals }'] } ] },
    CP08: { name: 'The King of Gala names the man from the ice', preds: ['CP07'], due: 'B12.D1', rules: [
      { s: 1, when: [g('zin_eindil_named'), `country_exists = ${T.gala}`, ng('zin_lorien_dead')] },
      { s: 3, way: 'B12.D2', when: [`OR = {\nNOT = { country_exists = ${T.gala} }\n${g('zin_lorien_dead')}\n}`] },
      { s: 3, when: [g('zin_eindil_lost')] } ] },
    CP09: { name: 'The hall of Horos', preds: ['CP08'], due: 'B15.D6', rules: [
      { s: 1, when: [g('zin_horos_dead'), g('zin_glo_with_eindil'), g('zin_afrit_wounded')] },
      { s: 3, way: 'B15.D5', when: [`OR = {\n${g('zin_glo_sealed')}\n${g('zin_glo_dimmed')}\n}`, 'check_variable = { global.zin_eindil_stage < 6 }'] },
      { s: 2, way: 'B15.D4', when: [`OR = {\n${g('zin_glo_sealed')}\n${g('zin_glo_dimmed')}\n}`] },
      { s: 2, way: 'B15.D3', when: [g('zin_horos_endures')] },
      { s: 2, way: 'B15.D1', when: [g('zin_horos_dead'), g('zin_glo_with_eindil'), g('zin_afrit_at_yeldenne')] },
      { s: 2, way: 'B15.D2', when: [g('zin_horos_dead'), g('zin_glo_with_eindil')] } ] },
    CP10: { name: 'The heir warns Aenor and is denounced', preds: ['CP09'], due: 'B16.D1', rules: [
      { s: 3, when: [g('zin_eindil_lost')] },
      { s: 1, when: [`OR = {\n${g('zin_aenor_eindil_denounced')}\n${g('zin_afrit_impostor_denounced')}\n}`] } ] },
    CP11: { name: 'The War of the Last Crowns', preds: [], late: 60, due: 'B18.D3', rules: [
      { s: 2, way: 'B18.D3', when: [g('zin_war_piecemeal')] },
      { s: 2, way: 'B18.D1', when: [g('zin_war_of_last_crowns'), 'NOT = { zin_world_date_last_crowns = yes }'] },
      { s: 2, way: 'B18.D2', when: [g('zin_war_of_last_crowns'), 'zin_path_cp11_late = yes'] },
      { s: 1, when: [g('zin_war_of_last_crowns')] } ] },
    CP12: { name: 'Lerendor leaves the Treaty of the Narrow Strait', preds: ['CP11'], after: { CP11: 180 }, due: 'B19.D1', rules: [
      { s: 3, way: 'B19.D4', when: [ng('zin_leren_withdrawal'), `OR = {\n${g('zin_role_leren_crown_vacant')}\n${g('zin_role_aenor_vacant')}\n}`] },
      { s: 2, way: 'B19.D1', when: [g('zin_leren_treaty_honoured')] },
      { s: 2, way: 'B19.D2', when: [g('zin_leren_strait_supremacy')] },
      { s: 1, when: [g('zin_leren_withdrawal')] } ] },
    CP13: { name: 'The Western Crossing', preds: ['CP11'], after: { CP11: 365 }, due: 'B20.D1', rules: [
      { s: 2, way: 'B20.D1', when: [g('zin_west_route_divided')] },
      { s: 2, way: 'B20.D2', when: [`OR = {\n${g('zin_west_route_relief')}\n${g('zin_western_relief_sailed')}\n}`] },
      { s: 2, way: 'B20.D3', when: [g('zin_west_route_hold')] },
      { s: 1, when: [g('zin_western_crossing')] } ] },
    CP14: { name: 'The eastern invasion of the Magical Lands', preds: ['CP11'], after: { CP11: 365 }, due: 'B21.D1', rules: [
      { s: 2, way: 'B21.D2', when: [g('zin_east_united'), ng('zin_eastern_invasion')] },
      { s: 2, way: 'B21.D1', when: [g('zin_east_caravan_war'), ng('zin_eastern_invasion')] },
      { s: 1, when: [g('zin_eastern_invasion')] } ] },
    CP15: { name: 'Volgan retakes Mirolon and marches', preds: [], early: 180, due: 'B22.D5', rules: [
      { s: 3, when: [ng('zin_mirolon_fallen'), noCountry('zin_is_volgan')] },
      { s: 2, way: 'B22.D2', when: [g('zin_mirolon_fallen'), g('zin_volgan_marches'), 'zin_path_cp15_early = yes'] },
      { s: 1, when: [g('zin_mirolon_fallen'), g('zin_volgan_marches')] },
      { s: 2, due: true, way: 'B23.D1', when: [g('zin_mirolon_fallen')] },
      { s: 2, due: true, way: 'B22.D1', when: ['zin_mirolon_passes_held = yes'] } ] },
    CP16: { name: "Zol's dead rise", preds: [], early: 60, due: 'B24.D3', rules: [
      { s: 3, way: 'B24.D3', when: [ng('zin_zol_rising'), `OR = {\nhas_game_rule = { rule = zin_rule_dark_powers option = RESTRAINED }\nNOT = { country_exists = ${T.zol} }\nAND = {\ncountry_exists = ${T.zol}\n${T.zol} = { has_country_flag = zin_zol_presence_lapsed }\n}\n}`] },
      { s: 2, way: 'B24.D1', when: [g('zin_zol_rising'), 'zin_path_cp16_early = yes'] },
      { s: 1, when: [g('zin_zol_rising')] } ] },
    CP17: { name: 'The god-king abandons Aenor', preds: ['CP06'], due: 'B25.D5', rules: [
      { s: 3, way: 'B25.D5', when: [cpIs(6, 3), `NOT = { ${AFRIT_REALM} }`] },
      { s: 2, way: 'B25.D1', when: [g('zin_afrit_stand_in_parim')] },
      { s: 2, way: 'B25.D3', when: [g('zin_afrit_abandoned_aenor'), g('zin_afrit_king_of_east'), g('zin_afrit_unmasked_early')] },
      { s: 1, when: [g('zin_afrit_abandoned_aenor'), g('zin_afrit_king_of_east'), g('zin_afrit_revealed')] },
      { s: 2, due: true, way: 'B26.D1', when: [g('zin_afrit_abandoned_aenor')] } ] },
    CP18: { name: 'Western armies take Parim', preds: ['CP13'], due: 'B27.D1', rules: [
      { s: 3, when: [cpIs(13, 2), ng('zin_west_parim_taken')] },
      { s: 2, way: 'B27.D3', when: [g('zin_west_throne_claimed')] },
      { s: 1, when: [g('zin_west_parim_taken')] } ] },
    CP19: { name: 'The heir returns on a dragon', preds: ['CP10'], due: 'B29.D2', rules: [
      { s: 3, when: [g('zin_eindil_lost')] },
      { s: 2, way: 'B29.D1', when: [g('zin_eindil_quiet_return')] },
      { s: 1, when: [g('zin_eindil_returned'), g('zin_war_of_last_crowns')] },
      { s: 2, way: 'B29.D1', when: [g('zin_eindil_returned')] } ] },
    CP20: { name: "Varner's wards; Varner dies", preds: ['CP16'], due: 'B32.D1', rules: [
      { s: 3, when: [cpIs(16, 3), ng('zin_varner_dead')] },
      { s: 1, when: [g('zin_varner_dead')] } ] },
    CP21: { name: 'Volgan casts the heir down; the New Gods restore him', preds: ['CP15'], due: 'B33.D3', rules: [
      { s: 1, when: [g('zin_eindil_restored')] },
      { s: 3, way: 'B33.D1', when: [g('zin_eindil_lost')] },
      { s: 3, way: 'B33.D2', when: [`OR = {\n${g('zin_volgan_body_destroyed')}\n${noCountry('zin_is_volgan')}\n}`] } ] },
    CP22: { name: "Volgan's manifested body is destroyed", preds: ['CP15'], due: 'B34.D1', rules: [
      { s: 1, when: [g('zin_volgan_body_destroyed')] },
      { s: 3, way: 'B34.D2', when: [`OR = {\n${g('zin_volgan_withdrawn_south')}\n${noCountry('zin_is_volgan')}\n}`] } ] },
    CP23: { name: "Zol's most loyal servant comes forth and is forced back", preds: ['CP16', 'CP22'], due: 'B35.D1', rules: [
      { s: 3, way: 'B35.D1', when: [cpIs(16, 3), ng('zin_kusven_forth')] },
      { s: 1, when: [g('zin_kusven_forth'), g('zin_kusven_withdrawn'), g('zin_lorien_dead')] },
      { s: 2, way: 'B36.D1', when: [g('zin_kusven_withdrawn')] },
      { s: 2, due: true, way: 'B35.D2', when: [g('zin_kusven_forth')] } ] },
    CP24: { name: 'The false god returns; the cliff', preds: ['CP17'], due: 'B38.D1', rules: [
      { s: 1, when: [g('zin_afrit_returned'), g('zin_eindil_cast_down'), g('zin_afrit_claims_aoaz')] },
      { s: 3, way: 'B38.D3', when: [ng('zin_afrit_returned'), `OR = {\n${g('zin_afrit_dead')}\n${g('zin_afrit_hidden')}\nNOT = { ${AFRIT_REALM} }\n}`] },
      { s: 2, due: true, way: 'B39.D1', when: [g('zin_afrit_returned')] } ] },
    CP25: { name: 'The palace', preds: ['CP24'], due: 'B41.D1', rules: [
      { s: 1, when: [g('zin_afrit_dead'), g('zin_golbran_dead'), 'check_variable = { global.zin_afrit_artifacts < 0.5 }'] },
      { s: 3, when: [g('zin_eindil_lost'), ng('zin_afrit_dead')] },
      { s: 2, way: 'B41.D3', when: [g('zin_afrit_dead')] },
      { s: 2, due: true, way: 'B41.D2', when: [g('zin_afrit_palace_held')] } ] },
    CP26: { name: 'The heir is crowned King of Aenor', preds: ['CP25'], due: 'B42.D1', rules: [
      { s: 2, way: 'B42.D4', when: [g('zin_eindil_crowned'), g('zin_golden_king_survives')] },
      { s: 1, when: [g('zin_eindil_crowned'), cpIs(25, 1)] },
      { s: 2, m: 'other_way', when: [g('zin_eindil_crowned')] },
      { s: 3, when: [g('zin_eindil_lost'), ng('zin_eindil_crowned')] } ] },
  };
}

// ------------------------------------------------------------------------------------------------ the roles (section 8, R01 to R17)
// Each role keeps its holder while the holder qualifies (country flag zin_role_holder_<key>, global event target zin_role_<key>); when it no
// longer does, the successor order picks the next one, and a public role tells the human players (A Duty Passes, zin_path.<10 + role>).
// Steps are effect bodies that save the global event target zin_role_<key>_next; a step runs only while no candidate is found.
const best = (key, cond, measure = 'num_of_controlled_states') => `set_temp_variable = { zin_role_best = -1 }\nevery_country = {\nlimit = {\n${cond}\n}\nif = {\nlimit = { check_variable = { ${measure} > zin_role_best } }\nset_temp_variable = { zin_role_best = ${measure} }\nsave_global_event_target_as = zin_role_${key}_next\n}\n}`;
const tagStep = (key, tag, cond = 'exists = yes') => `if = {\nlimit = {\ncountry_exists = ${tag}\n${tag} = {\n${cond}\n}\n}\n${tag} = { save_global_event_target_as = zin_role_${key}_next }\n}`;
const varStep = (key, v, cond = 'exists = yes') => `if = {\nlimit = { has_variable = global.${v} }\nvar:global.${v} = {\nif = {\nlimit = {\n${cond}\n}\nsave_global_event_target_as = zin_role_${key}_next\n}\n}\n}`;
const stateStep = (key, stateCond, who, cond) => `random_state = {\nlimit = {\n${stateCond}\n${who} = {\n${cond}\n}\n}\n${who} = { save_global_event_target_as = zin_role_${key}_next }\n}`;
const site = (trigger, id) => `OR = {\n${trigger} = yes\nstate = ${id}\n}`;
const notDark = 'NOT = { zin_diplo_is_dark_power = yes }';
export function roles(T) {
  return [
    { key: 'aenor', n: 1, name: 'The crown of Aenor', valid: 'zin_aenor_is_realm = yes', steps: k => [tagStep(k, T.aenor, 'zin_aenor_is_realm = yes'), best(k, 'zin_aenor_is_realm = yes')],
      news: { title: 'The Crown of Parim Passes', desc: 'The court that answered for Aenor is no longer what it was. [zin_role_aenor.GetName] now keeps the charters and seals of the old crown, and every court that owes Aenor anything must decide what it owes the new keeper.', ok: 'We will watch how they wear it.' } },
    { key: 'afrit_seat', n: 2, name: "The Deliverer's seat", valid: 'OR = {\nzin_afrit_is_hub = yes\nzin_afrit_rules_here = yes\nhas_character = zin_aurevan\n}',
      steps: k => [tagStep(k, T.worshipdom, 'zin_afrit_is_hub = yes'), best(k, 'has_character = zin_aurevan'), best(k, 'zin_afrit_eastern_candidate = yes', 'zin_footholds')] },
    { key: 'host', n: 3, name: 'The Host of Eindil', mirror: 'zin_eindil_host', valid: 'exists = yes', steps: k => [varStep(k, 'zin_eindil_host'), tagStep(k, T.selen)], gate: g('zin_eindil_host_raised'),
      news: { title: 'The Host Finds a New Banner', desc: 'The realm that sheltered the Host of Eindil can shelter it no longer. Its captains have carried their banners to [zin_role_host.GetName], and the war of the living goes on from there.', ok: 'May the new banner hold.' } },
    { key: 'gala_host', n: 4, name: 'The court of the naming', mirror: 'zin_eindil_gala_host', valid: 'exists = yes', steps: k => [varStep(k, 'zin_eindil_gala_host'), tagStep(k, T.gala), best(k, 'has_character = zin_lorien')] },
    { key: 'grey_ford_a', n: 5, name: 'The first crown of the Grey Ford', valid: 'has_country_flag = zin_region_west_lands', steps: k => [tagStep(k, T.gunwyn), best(k, `has_country_flag = zin_region_west_lands\nNOT = { tag = ${T.girdon} }`)] },
    { key: 'grey_ford_b', n: 5, name: 'The second crown of the Grey Ford', valid: 'has_country_flag = zin_region_west_lands\nNOT = { has_country_flag = zin_role_holder_grey_ford_a }',
      steps: k => [tagStep(k, T.girdon, 'NOT = { has_country_flag = zin_role_holder_grey_ford_a }'),
        ...['has_opinion = { target = event_target:zin_role_grey_ford_a value < -25 }', 'has_opinion = { target = event_target:zin_role_grey_ford_a value < 0 }', 'always = yes'].map(op => `if = {\nlimit = {\nNOT = { has_event_target = zin_role_${k}_next }\nhas_event_target = zin_role_grey_ford_a\n}\nevent_target:zin_role_grey_ford_a = {\nrandom_neighbor_country = {\nlimit = {\nhas_country_flag = zin_region_west_lands\n${op}\n}\nsave_global_event_target_as = zin_role_${k}_next\n}\n}\n}`)] },
    { key: 'crossing_lead', n: 6, name: 'The leader of the Western Crossing', valid: 'has_country_flag = zin_region_west_lands', steps: k => [tagStep(k, T.gunwyn), best(k, 'has_country_flag = zin_region_west_lands')], gate: g('zin_west_council'),
      news: { title: 'The Ford Council Looks Elsewhere', desc: 'The crown that led the Ford Council can lead it no longer, and the western courts have turned to [zin_role_crossing_lead.GetName] to speak for them and to lead them if they sail.', ok: 'The West will follow whoever can lead it.' } },
    { key: 'leren_crown', n: 7, name: 'The Leren crown', valid: 'has_country_flag = zin_region_north_lands', steps: k => [tagStep(k, T.lerendor), stateStep(k, site('zin_is_site_sonargur', T.sonargur), 'controller', `has_country_flag = zin_region_north_lands\n${notDark}`), best(k, `has_country_flag = zin_region_north_lands\n${notDark}`)],
      news: { title: 'A New Warden of the Strait', desc: 'The old crown that kept the Narrow Strait has fallen from its place. [zin_role_leren_crown.GetName] now holds the northern shore and with it the old quarrel over the strait, its tolls and its treaty.', ok: 'The strait has a new keeper.' } },
    { key: 'volgan_target', n: 8, name: 'The watch on the southern passes', valid: notDark, steps: k => [tagStep(k, T.mirolon), stateStep(k, site('zin_is_site_mirolon_passes', T.mirolonState), 'controller', notDark)] },
    { key: 'hall_holder', n: 9, name: 'The keeper of the hall of Horos', valid: 'exists = yes', steps: k => [tagStep(k, T.keeper), stateStep(k, site('zin_is_site_yeldenne', T.hallState), 'owner', 'exists = yes')] },
    { key: 'stage8_host', n: 10, name: "The heir's shelter in the Middle Lands", mirror: 'zin_eindil_stage8_host', valid: 'NOT = { zin_afrit_rules_here = yes }', steps: k => [varStep(k, 'zin_eindil_stage8_host'), tagStep(k, T.selen, 'NOT = { zin_afrit_rules_here = yes }'), best(k, 'has_country_flag = zin_region_middle_lands\nNOT = { zin_afrit_rules_here = yes }')] },
    { key: 'alleria', n: 11, name: "Alleria's employer", valid: 'has_character = zin_alleria', steps: k => [best(k, 'has_character = zin_alleria'), `if = {\nlimit = {\nNOT = { has_event_target = zin_role_${k}_next }\nhas_event_target = zin_role_host\n}\nevent_target:zin_role_host = { save_global_event_target_as = zin_role_${k}_next }\n}`] },
    { key: 'dragon_keeper', n: 12, name: 'The keeper of Dragon Mountain', valid: 'zin_world_is_dragon_keeper = yes', steps: k => [best(k, 'zin_world_is_dragon_keeper = yes')] },
    { key: 'volgan_steward', n: 14, name: "Volgan's steward", valid: 'OR = {\nzin_is_volgan = yes\nAND = {\nhas_country_flag = zin_region_ember_lands\nzin_diplo_is_dark_power = yes\n}\n}', steps: k => [best(k, 'zin_is_volgan = yes'), best(k, 'has_country_flag = zin_region_ember_lands\nzin_diplo_is_dark_power = yes')] },
    { key: 'parim_holder', n: 15, name: 'The holder of Parim', valid: `any_controlled_state = {\n${site('zin_is_site_parim', T.parimState)}\n}`, steps: k => [`zin_aenor_find_parim_realm = yes\nif = {\nlimit = { has_event_target = zin_aenor_parim_realm }\nevent_target:zin_aenor_parim_realm = {\nif = {\nlimit = {\nany_controlled_state = {\n${site('zin_is_site_parim', T.parimState)}\n}\n}\nsave_global_event_target_as = zin_role_${k}_next\n}\n}\n}`, stateStep(k, site('zin_is_site_parim', T.parimState), 'controller', 'exists = yes')] },
    { key: 'ice_host', n: 16, name: 'The host at the ice', mirror: 'zin_eindil_ice_host', valid: notDark, steps: k => [varStep(k, 'zin_eindil_ice_host', notDark), stateStep(k, 'zin_is_site_eindil_ice = yes', 'owner', notDark), best(k, `has_country_flag = zin_region_cold_lands\n${notDark}`)] },
    { key: 'wreck_host', n: 17, name: 'The host at the wreck', mirror: 'zin_eindil_wreck_host', valid: notDark, steps: k => [varStep(k, 'zin_eindil_wreck_host', notDark), tagStep(k, T.howan, notDark), tagStep(k, T.nara, notDark), tagStep(k, T.verde, notDark), best(k, `has_country_flag = zin_region_islands_of_the_south\n${notDark}`)] },
  ];
}
// R13 (the eastern candidates) has no single holder: the tick counts them into global.zin_role_eastern_candidates.

function roleEffect(r) {
  const k = r.key;
  const holder = `zin_role_holder_${k}`;
  const mirror = r.mirror ? `\nOR = {\nNOT = { has_variable = global.${r.mirror} }\nvar:global.${r.mirror} = { has_country_flag = ${holder} }\n}` : '';
  const steps = r.steps(k).map((s, i) => i ? `if = {\nlimit = { NOT = { has_event_target = zin_role_${k}_next } }\n${s}\n}` : s).join('\n');
  // A pass (not the first holder) of a public role, once its gate is open, is told to the human players after the new holder is saved.
  const news = r.news ? `\nif = {\nlimit = {\ncheck_variable = { zin_role_passed = 1 }\n${r.gate ?? 'always = yes'}\n}\nevery_country = {\nlimit = { is_ai = no }\ncountry_event = { id = zin_path.${10 + r.n} }\n}\n}` : '';
  return `# R${String(r.n).padStart(2, '0')} ${r.name}. Keeps the holder while it qualifies; else the successor order of alternate_history.md section 8.
if = {
limit = {
NOT = {
AND = {
has_event_target = zin_role_${k}
event_target:zin_role_${k} = {
exists = yes
has_country_flag = ${holder}
${r.valid}${mirror}
}
}
}
}
clear_global_event_target = zin_role_${k}_next
set_temp_variable = { zin_role_passed = 0 }
${steps}
if = {
limit = { has_event_target = zin_role_${k}_next }
if = {
limit = { event_target:zin_role_${k}_next = { NOT = { has_country_flag = ${holder} } } }
if = {
limit = { has_event_target = zin_role_${k} }
event_target:zin_role_${k} = { clr_country_flag = ${holder} }
set_temp_variable = { zin_role_passed = 1 }
}
event_target:zin_role_${k}_next = { set_country_flag = ${holder} }
log = "ZIN path: role R${String(r.n).padStart(2, '0')} ${k} passes to [zin_role_${k}_next.GetTag]"
}
event_target:zin_role_${k}_next = { save_global_event_target_as = zin_role_${k} }
clr_global_flag = zin_role_${k}_vacant${news}
}
else = {
if = {
limit = { has_event_target = zin_role_${k} }
event_target:zin_role_${k} = { clr_country_flag = ${holder} }
}
clear_global_event_target = zin_role_${k}
set_global_flag = zin_role_${k}_vacant
}
clear_global_event_target = zin_role_${k}_next
}`;
}

// ------------------------------------------------------------------------------------------------ script
const pad = n => String(n).padStart(2, '0');
const windowFlag = (cp, days) => ['OR = {', ...PACES.flatMap(p => ['\tAND = {', ...paceTest(p).map(l => `\t\t${l}`), `\t\thas_global_flag = { flag = zin_path_${cp.toLowerCase()}_done days > ${shiftDays(days, p) - 1} }`, '\t}']), '}'].join('\n');

export function pathScripts(table, R, T) {
  const triggers = new Map(), effects = new Map(), byCp = new Map(table.checkpoints.map(c => [c.cp, c]));
  const magnitude = (cp, way, cls) => {
    if (cls) return cls;
    const d = byCp.get(cp).divergences[way];
    if (!d) throw new Error(`${cp}: ${way} is not a divergence of its beats`);
    if (!MAG_CLASS.has(d.magnitude)) throw new Error(`${cp}: ${way} has magnitude ${d.magnitude}, which is not a class of the design`);
    return MAG_CLASS.get(d.magnitude);
  };
  for (const c of table.checkpoints) {
    const r = R[c.cp], nn = pad(c.n), id = `zin_path_cp${nn}`;
    if (!r) throw new Error(`${c.cp}: no rules`);
    triggers.set(`${id}_ready`, r.preds.length ? `# ${c.cp}: its predecessors are resolved (any state; the rule against deadlock).\n${r.preds.map(p => `NOT = { check_variable = { global.zin_path_${p.toLowerCase()} = 0 } }`).join('\n')}` : `# ${c.cp} has no predecessor.\nalways = yes`);
    for (const [suffix, s] of [['historical', 1], ['diverged', 2], ['skipped', 3]]) {
      const own = r.rules.filter(x => x.s === s && !x.due);
      triggers.set(`${id}_${suffix}`, own.length ? `# ${c.cp}: the ${suffix} rules of historical_path.mjs.\nOR = {\n${own.map(x => `AND = {\n${x.when.join('\n')}\n}`).join('\n')}\n}` : `# ${c.cp} has no ${suffix} rule.\nalways = no`);
    }
    if (!r.noLatest) {
      if (!c.latest) throw new Error(`${c.cp}: no latest date`);
      const rel = Object.entries(r.after ?? {});
      triggers.set(`${id}_due`, `# ${c.cp}: its latest date (${c.latest} at the standard pace)${rel.map(([p, d]) => ` and ${d} days after ${p}`).join('')} have passed.\n${afterDate(c.latest).join('\n')}${rel.map(([p, d]) => `\n${windowFlag(p, d)}`).join('')}`);
      triggers.set(`${id}_overdue`, `# The watchdog: ${WATCHDOG_DAYS} days past the latest date${rel.length ? ' and the windows' : ''}.\n${afterDate(addDays(c.latest, WATCHDOG_DAYS)).join('\n')}${rel.map(([p, d]) => `\n${windowFlag(p, d + WATCHDOG_DAYS)}`).join('')}`);
    }
    if (r.early) triggers.set(`${id}_early`, `# ${c.cp}: more than ${r.early} days before its target (${c.target}).\nNOT = {\n${afterDate(addDays(c.target, -r.early)).join('\n')}\n}`);
    if (r.late) triggers.set(`${id}_late`, `# ${c.cp}: more than ${r.late} days after its target (${c.target}).\n${afterDate(addDays(c.target, r.late)).join('\n')}`);
  }

  // The resolution and the measure (alternate_history.md section 6).
  const branches = table.checkpoints.map((c, i) => `${i ? 'else_if' : 'if'} = {
limit = {
check_variable = { zin_pr_cp = ${c.n} }
check_variable = { global.zin_path_cp${pad(c.n)} = 0 }
}
set_variable = { global.zin_path_cp${pad(c.n)} = zin_pr_state }
set_variable = { global.zin_path_cp${pad(c.n)}_way = zin_pr_way }
set_variable = { global.zin_path_cp${pad(c.n)}_m = zin_pr_m }
set_global_flag = zin_path_cp${pad(c.n)}_done
set_temp_variable = { zin_pr_w = constant:zin_path_weight.cp${pad(c.n)} }
set_temp_variable = { zin_pr_ok = 1 }
log = "ZIN path: checkpoint ${pad(c.n)} resolved [?global.zin_path_cp${pad(c.n)}|0], way [?global.zin_path_cp${pad(c.n)}_way|0]"
}`).join('\n');
  effects.set('zin_path_resolve', `# Arguments (E1): zin_arg_cp (1 to 26), zin_arg_state (1 historical, 2 diverged, 3 skipped), zin_arg_way (the way code: beat x 100 + divergence,
# 0 when historical or none applies) and zin_arg_m (the magnitude of a diverged resolution; a historical one counts 0, a skipped one
# constant:zin_path_magnitude.skipped). A checkpoint resolves once; the measure follows. Owners may call it; the tick does for every rule.
set_temp_variable = { zin_pr_cp = zin_arg_cp }
set_temp_variable = { zin_pr_state = zin_arg_state }
set_temp_variable = { zin_pr_way = zin_arg_way }
set_temp_variable = { zin_pr_m = zin_arg_m }
clear_variable = zin_arg_cp
clear_variable = zin_arg_state
clear_variable = zin_arg_way
clear_variable = zin_arg_m
if = {
limit = { check_variable = { zin_pr_state = 1 } }
set_temp_variable = { zin_pr_m = constant:zin_path_magnitude.historical }
}
else_if = {
limit = { check_variable = { zin_pr_state = 3 } }
set_temp_variable = { zin_pr_m = constant:zin_path_magnitude.skipped }
}
set_temp_variable = { zin_pr_ok = 0 }
${branches}
if = {
limit = { check_variable = { zin_pr_ok = 1 } }
zin_path_measure = yes
}`);
  effects.set('zin_path_measure', `# Reads the temporary zin_pr_w and zin_pr_m of zin_path_resolve. points += w x m; resolved weight += w; divergence = 100 x points /
# max(resolved weight, floor weight), clamped 0 to 100; departure = 100 x points / total weight (only rises); band from the divergence.
set_temp_variable = { zin_pr_pts = zin_pr_w }
multiply_temp_variable = { zin_pr_pts = zin_pr_m }
add_to_variable = { global.zin_path_points = zin_pr_pts }
add_to_variable = { global.zin_path_resolved_weight = zin_pr_w }
set_temp_variable = { zin_pr_den = global.zin_path_resolved_weight }
if = {
limit = { check_variable = { zin_pr_den < ${T.floorWeight} } }
set_temp_variable = { zin_pr_den = constant:zin_path.floor_weight }
}
set_temp_variable = { zin_pr_div = global.zin_path_points }
multiply_temp_variable = { zin_pr_div = 100 }
divide_temp_variable = { zin_pr_div = zin_pr_den }
set_variable = { global.zin_path_divergence = zin_pr_div }
clamp_variable = { var = global.zin_path_divergence min = 0 max = 100 }
set_temp_variable = { zin_pr_dep = global.zin_path_points }
multiply_temp_variable = { zin_pr_dep = 100 }
divide_temp_variable = { zin_pr_dep = constant:zin_path.total_weight }
set_variable = { global.zin_path_departure = zin_pr_dep }
clamp_variable = { var = global.zin_path_departure min = 0 max = 100 }
${T.bands.slice().reverse().map((b, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { ${b.from > 0 ? `check_variable = { var = global.zin_path_divergence value = ${b.from} compare = greater_than_or_equals }` : 'always = yes'} }\nset_variable = { global.zin_path_band = ${b.n} }\n}`).join('\n')}`);

  // The tick.
  const block = c => {
    const r = R[c.cp], nn = pad(c.n);
    const set = (s, way, m) => `set_temp_variable = { zin_pt_state = ${s} }\nset_temp_variable = { zin_pt_way = ${wayCode(way)} }\nset_temp_variable = { zin_pt_m = ${s === 2 ? `constant:zin_path_magnitude.${m}` : 0} }`;
    const ordered = [...r.rules.filter(x => !x.due), ...r.rules.filter(x => x.due)];
    const arms = ordered.map(x => ({ when: [...(x.due ? [`zin_path_cp${nn}_due = yes`] : []), ...x.when], body: set(x.s, x.way, x.s === 2 ? magnitude(c.cp, x.way, x.m) : null), note: `${['', 'historical', 'diverged', 'skipped'][x.s]}${x.way ? ` ${x.way}` : ''}${x.due ? ' (at the latest date)' : ''}` }));
    if (!r.noLatest) arms.push({ when: [`zin_path_cp${nn}_due = yes`], body: set(2, r.due, magnitude(c.cp, r.due)), note: `the latest date: diverged ${r.due}` });
    return `# ${c.cp} ${r.name} (weight ${c.weight}).
if = {
limit = {
check_variable = { global.zin_path_cp${nn} = 0 }
zin_path_cp${nn}_ready = yes
}
set_temp_variable = { zin_pt_state = 0 }
${arms.map((a, i) => `${i ? 'else_if' : 'if'} = {\n# ${a.note}\nlimit = {\n${a.when.join('\n')}\n}\n${a.body}\n}`).join('\n')}
if = {
limit = { check_variable = { zin_pt_state > 0 } }
set_temp_variable = { zin_arg_cp = ${c.n} }
set_temp_variable = { zin_arg_state = zin_pt_state }
set_temp_variable = { zin_arg_way = zin_pt_way }
set_temp_variable = { zin_arg_m = zin_pt_m }
zin_path_resolve = yes
}
}${r.noLatest ? '' : `
if = {
# the watchdog: still pending ${WATCHDOG_DAYS} days after the latest date
limit = {
check_variable = { global.zin_path_cp${nn} = 0 }
zin_path_cp${nn}_overdue = yes
}
log = "ZIN path: checkpoint ${nn} stalled"
set_global_flag = zin_path_stalled
set_temp_variable = { zin_arg_cp = ${c.n} }
set_temp_variable = { zin_arg_state = 3 }
set_temp_variable = { zin_arg_way = 0 }
set_temp_variable = { zin_arg_m = 0 }
zin_path_resolve = yes
}`}`;
  };
  effects.set('zin_path_close', `# After an ending (section 10, the sandbox): every pending checkpoint resolves skipped without counting, and the tick stops.
set_global_flag = zin_path_closed
${table.checkpoints.map(c => `if = {\nlimit = { check_variable = { global.zin_path_cp${pad(c.n)} = 0 } }\nset_variable = { global.zin_path_cp${pad(c.n)} = 3 }\nset_global_flag = zin_path_cp${pad(c.n)}_done\n}`).join('\n')}
log = "ZIN path: the age has turned; the path is closed"`);
  const R_ = roles(T);
  for (const r of R_) effects.set(`zin_path_role_${r.key}`, roleEffect(r));
  effects.set('zin_path_resolve_roles', `# The role registry (section 8): every role is re-checked once a month and whenever an owner calls its resolver before acting.
${R_.map(r => `zin_path_role_${r.key} = yes`).join('\n')}
# R13: the eastern candidates are counted, not held.
set_variable = { global.zin_role_eastern_candidates = 0 }
every_country = {
limit = { zin_afrit_eastern_candidate = yes }
add_to_variable = { global.zin_role_eastern_candidates = 1 }
}`);
  effects.set('zin_path_tick', `# Step 8 of the world tick (06 spec, "The path tick"). Roles first, then each pending checkpoint whose predecessors are resolved, in
# order: skipped, historical or diverged by its rules, diverged at its latest date; the watchdog skips one still pending ${WATCHDOG_DAYS} days later.
if = {
limit = { NOT = { has_global_flag = zin_path_closed } }
if = {
limit = { has_global_flag = zin_ending_reached }
zin_path_close = yes
}
else = {
zin_path_resolve_roles = yes
${table.checkpoints.map(block).join('\n')}
}
}`);
  return { triggers, effects, roles: R_ };
}

// ------------------------------------------------------------------------------------------------ build
export async function buildHistoricalPath(staged, ctx) {
  const table = ctx.checkpoints ?? await loadCheckpoints();
  const roster = ctx.countries;
  // K56: the hall is the castle's state; its owner is the keeper (data/mech_journey_glo.json hallState and keeper).
  const glo = JSON.parse(await readFile(new URL('../data/mech_journey_glo.json', import.meta.url), 'utf8'));
  const byName = new Map(roster.map(c => [c.name, c]));
  const need = n => { const c = byName.get(n); if (!c) throw new Error(`historical_path: ${n} is not in the roster`); return c; };
  const T = { aenor: need('Aenor').tag, worshipdom: need('Worshipdom').tag, selen: need('Selen').tag, gala: need('Gala').tag, gunwyn: need('Gunwyn').tag, girdon: need('Girdon').tag,
    lerendor: need('Lerendor').tag, mirolon: need('Mirolon').tag, keeper: need('Pertolor').tag, howan: need('Howan').tag, nara: need('Nara').tag, verde: need('Verde').tag,
    volgan: need('Puvulan').tag, zol: need("Zol's Mistake").tag, parimState: need('Aenor').capitalState, sonargur: need('Lerendor').capitalState,
    mirolonState: need('Mirolon').capitalState, hallState: glo.hallState,
    floorWeight: 30, bands: [{ n: 0, from: 0, name: 'As the Chronicle Tells' }, { n: 1, from: 10, name: 'Another Telling' }, { n: 2, from: 30, name: 'A Different Age' }, { n: 3, from: 60, name: 'An Age Unwritten' }] };
  const R = rules(T);
  const { triggers, effects, roles: R_ } = pathScripts(table, R, T);

  const consts = `zin_path = {\nschema = {\nany_key = yes\ndata = fixed_point\n}\nfloor_weight = ${T.floorWeight}\ntotal_weight = ${table.totalWeight}\n${T.bands.map(b => `band_${b.n} = ${b.from}`).join('\n')}\nwatchdog_days = ${WATCHDOG_DAYS}\n}\nzin_path_weight = {\nschema = {\nany_key = yes\ndata = int\n}\n${table.checkpoints.map(c => `cp${pad(c.n)} = ${c.weight}`).join('\n')}\n}\nzin_path_magnitude = {\nschema = {\nany_key = yes\ndata = fixed_point\n}\n${Object.entries(table.magnitudes).map(([k, v]) => `${k} = ${num(v)}`).join('\n')}\n}`;
  staged.text('common/script_constants/zin_path.txt', format(`${hdr(MOD, SPEC, 'Weights, magnitudes and constants of the divergence measure (alternate_history.md section 6; data/path_checkpoints.json).')}\n${consts}\n`));
  staged.text('common/scripted_triggers/zin_path.txt', format(`${hdr(MOD, SPEC, 'Checkpoint triggers: ready (predecessors resolved), historical, diverged, skipped, due (latest date), overdue (watchdog), early and late. Dates are paced (lib/story_dates.mjs).')}\n${[...triggers].map(([n, b]) => blk(n, b)).join('\n')}\n`));
  staged.text('common/scripted_effects/zin_path.txt', format(`${hdr(MOD, SPEC, 'The path tick, the resolution and the measure, the sandbox close and the role registry. Arguments are temporary variables zin_arg_<name> (E1).')}\n${[...effects].map(([n, b]) => blk(n, b)).join('\n')}\n`));

  const loc = new Loc(), evLoc = new Loc();
  for (const c of table.checkpoints) loc.set(`zin_path_cp${pad(c.n)}_name`, R[c.cp].name);
  for (const b of T.bands) loc.set(`zin_path_band_${b.n}_name`, b.name);
  for (const r of R_) loc.set(`zin_path_role_${r.key}_name`, r.name);
  const dt = (name, entries) => blk('defined_text', list(`name = ${name}`, entries.map(([cond, key]) => blk('text', list(cond ? blk('trigger', cond) : '', `localization_key = ${key}`)))));
  staged.text('common/scripted_localisation/zin_path.txt', format(`${hdr(MOD, SPEC, 'The band name of the divergence measure.')}\n${dt('zin_path_band_name', T.bands.slice().reverse().map(b => [b.n ? `check_variable = { global.zin_path_band = ${b.n} }` : '', `zin_path_band_${b.n}_name`]))}\n`));

  // Events: the start check and the role news.
  const contract = ['zin_eindil_awake', 'zin_eindil_war_king', 'zin_golden_king_dead', 'zin_aurevan_crowned', 'zin_eindil_named', 'zin_horos_dead', 'zin_glo_with_eindil', 'zin_afrit_revealed', 'zin_war_of_last_crowns',
    'zin_western_crossing', 'zin_leren_withdrawal', 'zin_volgan_marches', 'zin_zol_rising', 'zin_afrit_king_of_east', 'zin_eindil_returned', 'zin_varner_dead', 'zin_volgan_body_destroyed', 'zin_kusven_forth',
    'zin_kusven_withdrawn', 'zin_lorien_dead', 'zin_afrit_dead', 'zin_golbran_dead', 'zin_eindil_crowned', 'zin_ending_reached'];
  const out = [];
  out.push(writeEvent('zin_path', { id: 1, kind: 'hidden', immediate: `# The start check (B01, 06 spec acceptance 3): no war, no story flag of the contract, the man in the ice recruited by nobody. A failure is logged
# and marks the run (zin_path_stalled); CP01 then resolves diverged.
if = {
limit = {
OR = {
any_country = { has_war = yes }
${contract.map(g).join('\n')}
any_country = { has_character = zin_eindil }
}
}
log = "ZIN path: the start check failed"
set_global_flag = zin_path_start_failed
set_global_flag = zin_path_stalled
}
else = {
log = "ZIN path: the start check passed"
}` }, evLoc, { hiddenOk: 'The age begins.' }).text);
  for (const r of R_.filter(x => x.news)) out.push(writeEvent('zin_path', { id: 10 + r.n, kind: 'country', title: r.news.title, desc: r.news.desc, picture: 'generic_court', options: [{ key: 'a', text: r.news.ok }] }, evLoc).text);
  staged.text('events/zin_path.txt', format(`${hdr(MOD, SPEC, 'Namespace zin_path: the hidden start check (zin_path.1) and A Duty Passes for the public roles (zin_path.<10 + role number>).')}\nadd_namespace = zin_path\n\n${out.join('\n\n')}\n`));

  const all = { ...Object.fromEntries(loc.map), ...Object.fromEntries(evLoc.map) };
  if (Object.keys(all).some(k => k.startsWith('zin_loc_chronicle_cp'))) throw new Error('zin_path_l_english.yml holds no Chronicle line (06 spec acceptance 11)');
  const problems = [...secrecyLeaks(all), ...(await wordProblems(all)), ...notCp1252(all)];
  if (problems.length) throw new Error(`historical_path text:\n  ${problems.join('\n  ')}`);
  staged.loc('zin_path', all);

  return { counts: { checkpoints: table.checkpoints.length, rules: Object.values(R).reduce((a, r) => a + r.rules.length, 0), roles: R_.length, triggers: triggers.size, effects: effects.size, events: out.length, keys: Object.keys(all).length },
    definitions: { triggers: [...triggers.keys()], effects: [...effects.keys()], events: [1, ...R_.filter(x => x.news).map(r => 10 + r.n)].map(n => `zin_path.${n}`) } };
}

// ------------------------------------------------------------------------------------------------ CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv.includes('--write')) {
  const table = checkpointsFromDesign(await loadDesign());
  await writeFile(CHECKPOINTS, `${JSON.stringify(table, null, 1)}\n`);
  console.log(`Wrote ${fileURLToPath(CHECKPOINTS)}: ${table.checkpoints.length} checkpoints, total weight ${table.totalWeight}`);
}
