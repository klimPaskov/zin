// Script text of the deep past (owner decision K64, docs/specs/04_mechanics/deep_past.md; addendum docs/plans/deep_history/k62_fallen_realms.md).
// Pure functions: deepScripts(D, P) returns the triggers, effects, decisions, missions, events, start effect, monthly block,
// achievements and scripted localisation as Clausewitz text; modules/deep_past.mjs checks and stages them.
//
// P is the plan of modules/deep_past.mjs: P.t maps the data's realm codes to the roster's tags (resolved by name), P.N the tuning
// (data/deep_past.json constants). Every site is resolved at the start by a rule (a capital, the states a realm owns, their coast, their
// neighbours), never by a state number: the map import renumbers the states. Nothing here runs for every country on a schedule; the one
// monthly block (zin_story_tick_deep) runs on the world runner inside zin_story_tick and names its realms.
import { num } from './mech_court_lib.mjs';

// ------------------------------------------------------------------------------------------------ helpers
const L = (...parts) => parts.flat(Infinity).filter(x => x !== undefined && x !== null && x !== false && x !== '').join('\n');
const B = (name, ...body) => `${name} = {\n${L(body)}\n}`;
const IF = (limit, ...body) => B('if', B('limit', limit), body);
const ELIF = (limit, ...body) => B('else_if', B('limit', limit), body);
const ELSE = (...body) => B('else', body);
const OR = (...c) => { const x = c.flat().filter(Boolean); return x.length === 1 ? x[0] : B('OR', x); };
const NOT = (...c) => B('NOT', c);
const tagIs = (...tags) => OR(tags.flat().map(t => `original_tag = ${t}`));
const flag = f => `has_country_flag = ${f}`;
const gflag = f => `has_global_flag = ${f}`;
const tt = (key, ...c) => B('custom_trigger_tooltip', `tooltip = ${key}`, c);
const ett = key => `custom_effect_tooltip = ${key}`;
const hidden = (...b) => B('hidden_effect', b);
const ev = (id, days) => days ? `country_event = { id = zin_deep.${id} days = ${days} }` : `country_event = { id = zin_deep.${id} }`;
const exists = t => `country_exists = ${t}`;
const to = (t, ...b) => B(t, b);
// A report to a realm only if it exists (K61: the realms involved hear, never the world).
const tell = (t, id) => IF(exists(t), to(t, ev(id)));
const neighbours = id => B('every_neighbor_country', ev(id));
const site = k => `var:global.zin_deep_site_${k}`;
const pay = (type, amount) => `add_equipment_to_stockpile = { type = ${type} amount = -${amount} }`;
const hasEq = (type, amount) => `has_equipment = { ${type} > ${amount - 1} }`;
const opinion = (who, target, mod) => to(who, `add_opinion_modifier = { target = ${target} modifier = ${mod} }`);
const both = (a, b, mod) => L(opinion(a, b, mod), opinion(b, a, mod));
const loop = (array, ...body) => B('for_each_scope_loop', `array = global.${array}`, body);
const claimAll = (array, claimant) => loop(array, IF(NOT('is_core_of = event_target:zin_deep_claimant'), 'add_state_claim = event_target:zin_deep_claimant'));
const unclaimAll = array => loop(array, IF('is_claimed_by = event_target:zin_deep_claimant', 'remove_state_claim = event_target:zin_deep_claimant'));
const weigh = (base, ...mods) => L(`base = ${base}`, mods.map(([k, v, c]) => B('modifier', `${k} = ${num(v)}`, c)));

// ------------------------------------------------------------------------------------------------ the scripts
export function deepScripts(D, P) {
  const N = D.constants, t = P.t;
  const T = {}, E = {};
  const holds = [t.KUN, t.HRA, t.BRU, t.GRO], western = [t.BRU, t.GRO];
  const walkers = [t.CLD, t.KVI, t.HOR, t.FEA, t.MLK];
  const charter = [t.ADE, t.RAE, t.PLL];
  const isles = [t.ADE, t.RAE, t.PLL, t.SEI, t.LEN];
  const corsairs = [t.SNT, t.BEN];
  const pilots = [t.ADE, t.RAE, t.PLL, t.SEI, t.LEN, t.HLN, t.ORH];

  // ---------------------------------------------------------------------------------------------- triggers
  T.zin_deep_is_orran = `# The Orran realms that keep the Low Country's tongue: the Veiled and the Redbark.\n${tagIs(t.CUR, t.BLO)}`;
  T.zin_deep_is_hold = `# The four delving holds (Gromatrak's heirs).\n${tagIs(holds)}`;
  T.zin_deep_is_western_hold = `# The western holds, who blame Kunhrim for the Letting-In.\n${tagIs(western)}`;
  T.zin_deep_is_ice_walker = `# The Cold Lands realms that may send an ice-walk (6.4).\n${tagIs(walkers)}`;
  T.zin_deep_is_cold_crown = `# The crowns that may claim the hearth-stone and the Sun Crown.\n${tagIs(t.CLD, t.MLK)}`;
  T.zin_deep_is_isle_realm = `# The Tritonic chart-islanders, Margorodai's heirs.\n${tagIs(isles)}`;
  T.zin_deep_charter_member = L('# A member of the Pupor Charter: its three isles, or a realm in Adel\'s league.', OR(tagIs(charter), `is_in_faction_with = ${t.ADE}`));
  T.zin_deep_low_country_seeker = L('# The realms that may seek the Low Country: its keepers, the Bloody Forest and Aenor.', tagIs(t.CUR, t.HIR, t.ORH, t.BLO, t.AEN));
  T.zin_deep_has_cord = OR(flag('zin_deep_keeps_cord'), flag('zin_deep_shared_cord'));
  T.zin_deep_has_stone = OR(flag('zin_deep_keeps_stone'), flag('zin_deep_shared_stone'));
  T.zin_deep_has_tide = OR(flag('zin_deep_keeps_tide'), flag('zin_deep_shared_tide'));
  T.zin_deep_two_counts_done = '# The realm has brought the cords and the stones together (zin_deep.30).\nhas_country_flag = zin_deep_low_country_charted';
  T.zin_deep_low_country_lost = L('# Two keepings destroyed: the Low Country can never be pieced together in this game.',
    OR(B('AND', gflag('zin_deep_cord_burned'), gflag('zin_deep_count_scattered')), B('AND', gflag('zin_deep_cord_burned'), gflag('zin_deep_tide_broken')), B('AND', gflag('zin_deep_count_scattered'), gflag('zin_deep_tide_broken'))));
  T.zin_deep_cairn_oath_kept = '# A seeker has kept the Cairn-Oath for the constant number of years (Hirolon\'s AI reads it).\nhas_global_flag = zin_deep_oath_proven';
  T.zin_deep_halls_opened = L('# The realm owns the Kalioth state and has opened its shafts.', flag('zin_deep_kalioth_shafts'), B(site('kalioth_halls'), 'is_owned_by = ROOT'));
  T.zin_deep_holds_hearth_stone = '# The realm holds the hearth-stone of the king\'s hall under the ice.\nhas_country_flag = zin_deep_hearth_stone';
  T.zin_deep_moot_sitting = '# The Road Moot sits with all four holds.\nhas_global_flag = zin_deep_road_moot';
  const pairs = [];
  for (let i = 0; i < holds.length; i++) for (let j = i + 1; j < holds.length; j++) pairs.push(NOT(to(holds[i], `has_war_with = ${holds[j]}`)));
  T.zin_deep_all_holds_stand = L('# All four holds exist and none is at war with another.', holds.map(exists), pairs);
  T.zin_deep_square_open_to = L('# The Cursed Square\'s shore is ours, held by us, or opened to us by sale or the Charter.',
    OR(flag('zin_deep_square_open'), B(site('cursed_square_shore'), 'is_controlled_by = ROOT')));
  T.zin_deep_owns_ice_state = B('any_owned_state', OR('has_state_flag = zin_deep_site_frozen_lands', 'has_state_flag = zin_deep_site_far_ice'));
  T.zin_deep_long_light = L('# The Long Light after a mild winter: the Cold Lands\' winter roll (zin_cold.10) set 0 for the winter just past and the next winter has not begun.',
    NOT(gflag('zin_cold_winter_season')), 'check_variable = { global.zin_cold_winter < 0.5 }');
  T.zin_deep_in_last_war = L('# At war while the War of the Last Crowns is fought.', gflag('zin_war_of_last_crowns'), 'has_war = yes');
  // The great tides: the months of the window (data constants dive_month_a and dive_month_b), read with the year of the date (calendar.mjs pattern).
  const [ma, mb] = [N.dive_month_a, N.dive_month_b];
  T.zin_deep_tide_window = L(`# The months of the great tides (month ${ma} and month ${mb}): the dive window.`,
    B('meta_trigger', B('text', OR(B('AND', NOT(`date < [Y].${ma}.1`), `date < [Y].${ma + 1}.1`), B('AND', NOT(`date < [Y].${mb}.1`), `date < [Y].${mb + 1}.1`))), 'Y = "[?global.year|0]"'));
  T.zin_deep_has_pilots = L('# The crossing host has island pilots: a chart-island realm or Orohaf sails with it.',
    B('any_country', 'zin_west_in_crossing = yes', tagIs(pilots)));

  const navalBase = (k, lvl) => B(site(k), `any_province_building_level = { province = { all_provinces = yes } building = naval_base level > ${lvl - 1} }`);
  const ownedOr = k => B(site(k), OR('is_owned_by = ROOT', 'owner = { is_subject_of = ROOT }'));

  // ---------------------------------------------------------------------------------------------- the start
  const capSite = (tag, k) => to(tag, B('capital_scope', `set_state_flag = zin_deep_site_${k}`, `set_variable = { global.zin_deep_site_${k} = THIS }`));
  const ownedList = (tag, k, filter) => to(tag, B('every_owned_state', filter ? B('limit', filter) : '', `set_state_flag = zin_deep_site_${k}`, `add_to_array = { global.zin_deep_${k}_states = THIS }`));
  const start = L(
    '# Keepers of the Low Country (6.4), the sites by rule (6.3), the old grudge of the holds (6.7) and the Eldest Cairn\'s count.',
    to(t.CUR, 'set_country_flag = zin_deep_keeps_cord'), to(t.HIR, 'set_country_flag = zin_deep_keeps_stone'), to(t.ORH, 'set_country_flag = zin_deep_keeps_tide'),
    capSite(t.CUR, 'eldest_barrow'), capSite(t.HIR, 'eldest_cairn'), capSite(t.ORH, 'tide_chambers'),
    '# The Mothers\' Mound breaks the water off Orohaf\'s isle; until the map import adds its islet, the dive is reached through Orohaf\'s seat.',
    capSite(t.ORH, 'mothers_mound_shore'),
    ownedList(t.ORH, 'nimlan_banks', 'is_coastal = yes'), ownedList(t.HIR, 'nimlan_banks', 'is_coastal = yes'),
    capSite(t.LUV, 'gate_west'), capSite(t.DLB, 'gate_east'), capSite(t.ELD, 'old_roads_end'), capSite(t.NOL, 'old_ditches'), capSite(t.ERC, 'kalioth_halls'),
    holds.map(h => to(h, B('capital_scope', 'set_state_flag = zin_deep_site_sea_door', `set_variable = { global.zin_deep_site_sea_door_${h} = THIS }`))),
    to(t.BEN, IF(B('capital_scope', 'is_coastal = yes'), B('capital_scope', 'set_state_flag = zin_deep_site_cursed_square_shore', 'set_variable = { global.zin_deep_site_cursed_square_shore = THIS }')),
      ELSE(B('random_owned_state', B('limit', 'is_coastal = yes'), 'set_state_flag = zin_deep_site_cursed_square_shore', 'set_variable = { global.zin_deep_site_cursed_square_shore = THIS }'))),
    ownedList(t.CLD, 'frozen_lands', 'is_coastal = no'), ownedList(t.KVI, 'far_ice'),
    '# The Vale states that border the Red Woods keep Orran names (the River Names route of the Bloody Forest).',
    to(t.BLO, B('every_owned_state', B('every_neighbor_state', B('limit', `is_owned_by = ${t.AEN}`, NOT('has_state_flag = zin_deep_site_river_names')), 'set_state_flag = zin_deep_site_river_names', 'add_to_array = { global.zin_deep_river_names_states = THIS }'))),
    ownedList(t.PLO, 'plutondo_valley'), ownedList(t.MIE, 'miaed_passes'), ownedList(t.PON, 'pornivior_road'), ownedList(t.KON, 'konorar_valley'), ownedList(t.FEA, 'free_steadings'),
    to(t.AEN, B('capital_scope', 'set_variable = { global.zin_deep_site_parim = THIS }')),
    western.map(w => opinion(w, t.KUN, 'zin_opinion_old_blame')),
    `set_variable = { global.zin_deep_cairn_stones = ${N.night_ba + N.start_count} }`,
    `set_variable = { global.zin_deep_cairn_year = ${N.start_year} }`);

  // ---------------------------------------------------------------------------------------------- the Low Country (Muzerar)
  E.zin_deep_open_low_country = '# Scope: a seeker. The Low Country\'s category opens.\nset_country_flag = zin_deep_low_country_open';
  E.zin_deep_cords_counted = L('# What the Cords Count (the Cursed Lands\' focus): the category opens, the Bloody Forest hears.', 'zin_deep_open_low_country = yes', ev(10), tell(t.BLO, 11));
  E.zin_deep_show_last_cord = L('# The Last Cord Shown: the relic, and every Orran realm and Aenor\'s scholars learn where it lies.',
    'set_global_flag = zin_deep_last_cord_shown', 'add_ideas = zin_deep_relic_last_cord', tell(t.BLO, 12),
    IF(exists(t.AEN), to(t.AEN, 'set_country_flag = zin_deep_cord_whereabouts', 'zin_deep_open_low_country = yes', ev(12))));
  E.zin_deep_hide_last_cord = L('# The Last Cord Hidden: the mothers move the cord, which can no longer burn.', 'set_global_flag = zin_deep_last_cord_hidden', 'add_ideas = zin_deep_cord_moved');
  E.zin_deep_red_cords = '# The Red Cords (the Bloody Forest\'s focus): the forest seeks the Low Country.\nzin_deep_open_low_country = yes';
  E.zin_deep_cord_gift_asked = L('# One Tongue in Two Woods: the Bloody Forest asks the cord-mothers for the Cord as a gift.',
    IF(L(exists(t.CUR), to(t.CUR, flag('zin_deep_keeps_cord')), NOT(gflag('zin_deep_cord_burned')), NOT('zin_deep_has_cord = yes')), to(t.CUR, ev(14))));
  E.zin_deep_speak_river_names = L('# River Names Spoken: claims on the Vale states that border the Red Woods, and the drowned inheritance stands between the Orran realms and Aenor.',
    'set_global_flag = zin_deep_river_names_spoken', 'save_event_target_as = zin_deep_claimant', claimAll('zin_deep_river_names_states'),
    IF(exists(t.AEN), opinion(t.AEN, 'ROOT', 'zin_opinion_river_names_claimed'), opinion('ROOT', t.AEN, 'zin_opinion_drowned_inheritance'),
      IF(exists(t.CUR), opinion(t.CUR, t.AEN, 'zin_opinion_drowned_inheritance')), to(t.AEN, ev(44))));
  E.zin_deep_open_tide_chambers = L('# The Tide-Chambers Opened (Orohaf\'s focus): the chambers\' state modifier, and the category opens.',
    B(site('tide_chambers'), IF(NOT('has_dynamic_modifier = { modifier = zin_deep_tide_chambers_opened }'), 'add_dynamic_modifier = { modifier = zin_deep_tide_chambers_opened }')), 'zin_deep_open_low_country = yes');
  E.zin_deep_queens_rite = '# The Queens\' Rite (Orohaf\'s focus): the Tide goes to Aenor or to the Orran heirs, never both.\ncountry_event = { id = zin_deep.40 }';
  E.zin_deep_open_eldest_cairn = '# The Eldest Cairn (Hirolon\'s focus): the category opens.\nzin_deep_open_low_country = yes';
  E.zin_deep_speak_count = '# Speak the Count: the giants will answer those who ask, and the oath-keepers may earn the dike-stones.\nset_global_flag = zin_deep_count_spoken';
  E.zin_deep_keep_silence = L('# Keep the Silence: the Two Counts can never be made in this game.', 'set_global_flag = zin_deep_silence_kept', 'add_ideas = zin_deep_silence');
  E.zin_deep_check_two_counts = L('# Scope: a realm. When it holds the Cord and the Stone, the counts are brought together (zin_deep.30).',
    IF(L('zin_deep_has_cord = yes', 'zin_deep_has_stone = yes', NOT(flag('zin_deep_low_country_charted')), NOT(gflag('zin_deep_silence_kept'))), ev(30)));
  E.zin_deep_chart_low_country = L('# zin_deep.30: the year of the Night of the Sea and the line of the dikes; the low fields charted; the art Cord-Reckoning recovered.',
    'set_country_flag = zin_deep_low_country_charted', 'set_country_flag = zin_deep_recovered_cord_reckoning', 'set_global_flag = zin_deep_counts_made',
    loop('zin_deep_nimlan_banks_states', IF(NOT('has_dynamic_modifier = { modifier = zin_deep_low_fields_charted }'), 'add_dynamic_modifier = { modifier = zin_deep_low_fields_charted }')),
    IF(L(NOT('tag = ' + t.CUR), exists(t.CUR)), to(t.CUR, ev(31))), IF(L(NOT('tag = ' + t.HIR), exists(t.HIR)), to(t.HIR, ev(31))));
  E.zin_deep_share = L('# Scope: the keeper (the event\'s ROOT). zin_arg_keeping 1 Cord, 2 Stone, 3 Tide: FROM shares it, the bond goes both ways, FROM hears.',
    'FROM = {', IF('check_variable = { zin_arg_keeping = 1 }', 'set_country_flag = zin_deep_shared_cord'),
    IF('check_variable = { zin_arg_keeping = 2 }', 'set_country_flag = zin_deep_shared_stone'),
    IF('check_variable = { zin_arg_keeping = 3 }', 'set_country_flag = zin_deep_shared_tide'), 'zin_deep_open_low_country = yes', '}',
    both('ROOT', 'FROM', 'zin_opinion_keeping_given'), 'FROM = { zin_deep_check_two_counts = yes }');

  // the three asks
  const askVisible = (keeper, has) => L(NOT(`original_tag = ${keeper}`), NOT(`${has} = yes`), exists(keeper));
  const eqCost = L('set_temp_variable = { zin_d_eq = num_owned_states }', `multiply_temp_variable = { zin_d_eq = ${N.cord_eq_per_state} }`,
    `clamp_temp_variable = { var = zin_d_eq min = ${N.cord_eq_min} max = ${N.cord_eq_max} }`, 'multiply_temp_variable = { zin_d_eq = -1 }', 'add_equipment_to_stockpile = { type = zin_arms_equipment amount = zin_d_eq }');
  const decisions = { zin_deep_low_country: [], zin_deep_two_shores: [], zin_deep_kalioth: [], zin_deep_sea_doors: [], zin_deep_sea_roads: [], zin_deep_ice: [] };
  const missions = [];
  const dec = (cat, d) => decisions[cat].push(d);
  const lowPP = `NOT = { has_political_power > ${N.ai_pp_reserve} }`;
  // The guards come last: a factor of 0 after the additions keeps the weight at 0 (ai_will_do applies its modifiers in order).
  const aiBase = (base, ...mods) => weigh(base, ...mods, ['factor', 0, 'has_war = yes'], ['factor', 0, lowPP]);

  dec('zin_deep_low_country', { id: 'zin_deep_ask_cord_mothers', icon: 'birth_rolls', cost: N.ask_pp, cooldown: N.ask_cooldown_days,
    visible: L(askVisible(t.CUR, 'zin_deep_has_cord'), to(t.CUR, flag('zin_deep_keeps_cord')), NOT(gflag('zin_deep_cord_burned'))),
    available: L(`NOT = { has_war_with = ${t.CUR} }`, tt('zin_deep_tt_no_claim_on_veiled', to(t.CUR, NOT(B('any_owned_state', 'is_claimed_by = ROOT')))),
      tt('zin_deep_tt_cord_refused', NOT(flag('zin_deep_cord_refused'))), hasEq('zin_arms_equipment', N.cord_eq_min)),
    effect: L(ett('zin_deep_ask_cord_mothers_tt'), hidden(eqCost, to(t.CUR, ev(21)))),
    ai: aiBase(N.ai_ask_base, ['add', N.ai_ask_seeker, 'zin_deep_low_country_seeker = yes'], ['factor', 0, `has_opinion = { target = ${t.CUR} value < -10 }`]) });
  dec('zin_deep_low_country', { id: 'zin_deep_ask_cairn_keepers', icon: 'giant_hammer', cost: N.ask_pp, cooldown: N.ask_cooldown_days,
    visible: L(askVisible(t.HIR, 'zin_deep_has_stone'), to(t.HIR, flag('zin_deep_keeps_stone')), NOT(gflag('zin_deep_silence_kept')), NOT(gflag('zin_deep_count_scattered'))),
    available: L(`NOT = { has_war_with = ${t.HIR} }`, tt('zin_deep_tt_no_army_in_ring', NOT(`has_military_access_to = ${t.HIR}`), NOT(B('any_controlled_state', `is_owned_by = ${t.HIR}`))),
      tt('zin_deep_tt_stone_refused', NOT(flag('zin_deep_stone_refused'))), `has_manpower > ${N.stone_manpower - 1}`, hasEq('convoy', N.stone_convoys)),
    effect: L(ett('zin_deep_ask_cairn_keepers_tt'), hidden(`add_manpower = -${N.stone_manpower}`, pay('convoy', N.stone_convoys), to(t.HIR, ev(24)))),
    ai: aiBase(N.ai_ask_base, ['add', N.ai_ask_seeker, 'zin_deep_low_country_seeker = yes'], ['factor', 0, NOT(gflag('zin_deep_count_spoken'))]) });
  const tideAvail = L(`NOT = { has_war_with = ${t.ORH} }`, tt('zin_deep_tt_tide_not_puppet', NOT(to(t.ORH, 'is_subject_of = ROOT'))), tt('zin_deep_tt_tide_refused', NOT(flag('zin_deep_tide_refused'))));
  const tideVisible = L(askVisible(t.ORH, 'zin_deep_has_tide'), to(t.ORH, flag('zin_deep_keeps_tide')));
  dec('zin_deep_low_country', { id: 'zin_deep_ask_isle_houses', icon: 'island_shrine', cost: N.ask_pp, cooldown: N.ask_cooldown_days,
    visible: L(tideVisible, NOT(`original_tag = ${t.AEN}`)), available: L(tideAvail, `navy_experience > ${N.tide_navy_xp - 1}`),
    effect: L(ett('zin_deep_ask_isle_houses_tt'), `navy_experience = -${N.tide_navy_xp}`, `give_guarantee = ${t.ORH}`, hidden(to(t.ORH, ev(27)))),
    ai: aiBase(N.ai_ask_base, ['add', N.ai_ask_seeker, 'zin_deep_low_country_seeker = yes']) });
  dec('zin_deep_low_country', { id: 'zin_deep_ask_isle_houses_aenor', icon: 'island_shrine', cost: N.tide_pp_aenor, cooldown: N.ask_cooldown_days,
    visible: L(tideVisible, `original_tag = ${t.AEN}`), available: tideAvail,
    effect: L(ett('zin_deep_ask_isle_houses_aenor_tt'), hidden(to(t.ORH, ev(27)))),
    ai: aiBase(N.ai_ask_base, ['add', N.ai_ask_seeker, flag('zin_deep_scholar_home')]) });

  // the dive
  const diveVisible = L('zin_deep_has_tide = yes', OR(B('AND', 'zin_deep_has_cord = yes', 'zin_deep_has_stone = yes'), B('AND', `original_tag = ${t.ORH}`, flag('zin_deep_mound_own_name'))),
    NOT(gflag('zin_deep_mothers_stone_raised')));
  const diveAvail = L(tt('zin_deep_tt_tide_window', 'zin_deep_tide_window = yes'), tt('zin_deep_tt_dive_cooldown', NOT(flag('zin_deep_dive_cooldown'))),
    tt('zin_deep_tt_mound_reach', OR(B(site('mothers_mound_shore'), 'is_owned_by = ROOT'), flag('zin_deep_shared_tide'))),
    tt('zin_deep_tt_mound_base', navalBase('mothers_mound_shore', N.dive_naval_base)), NOT('has_war = yes'));
  const divePay = mult => L(`navy_experience = -${N.dive_navy_xp * mult}`, `add_manpower = -${N.dive_manpower * mult}`, pay('convoy', N.dive_convoys * mult));
  for (const [suffix, mult, when] of [['', 1, NOT(to(t.ORH, 'is_subject = yes'))], ['_hard', 2, to(t.ORH, 'is_subject = yes')]]) {
    dec('zin_deep_low_country', { id: `zin_deep_dive_mothers_mound${suffix}`, icon: 'necklace_deep', days: N.dive_days,
      visible: L(diveVisible, OR(NOT(exists(t.ORH)), when)),
      available: L(diveAvail, `navy_experience > ${N.dive_navy_xp * mult - 1}`, `has_manpower > ${N.dive_manpower * mult - 1}`, hasEq('convoy', N.dive_convoys * mult)),
      effect: L(ett(`zin_deep_dive_mothers_mound${suffix}_tt`), hidden(divePay(mult), 'set_country_flag = zin_deep_dived_mound')),
      remove: 'zin_deep_dive_outcome = yes',
      ai: aiBase(N.ai_dive_base, ['factor', 0, NOT(B(site('mothers_mound_shore'), 'is_owned_by = ROOT'))]) });
  }
  E.zin_deep_dive_outcome = L('# The storm roll of the dive (6.4): the Mothers\' Stone, the hall-door, or the divers lost. The Tide and Borrak\'s divers lower the risk.',
    B('random_list',
      B(String(N.dive_success), B('modifier', `add = ${N.dive_tide_bonus}`, flag('zin_deep_keeps_tide')), B('modifier', `add = ${N.dive_divers_bonus}`, flag('zin_deep_divers_of_borrak')),
        B('modifier', `add = ${N.dive_door_bonus}`, flag('zin_deep_hall_door')), 'zin_deep_raise_mothers_stone = yes'),
      B(String(N.dive_door), IF(NOT(flag('zin_deep_hall_door')), 'set_country_flag = zin_deep_hall_door'), ev(36)),
      B(String(N.dive_lost), B('modifier', `add = -${N.dive_tide_bonus}`, flag('zin_deep_keeps_tide')), B('modifier', `add = -${N.dive_divers_bonus}`, flag('zin_deep_divers_of_borrak')),
        `add_manpower = -${N.dive_manpower}`, `set_country_flag = { flag = zin_deep_dive_cooldown days = ${N.dive_cooldown_days} }`, ev(37),
        IF(L(exists(t.ORH), NOT(`tag = ${t.ORH}`)), to(t.ORH, ev(38))))),
    tell(t.HIR, 39), IF(exists(t.ORH), to(t.ORH, neighbours(39))));
  E.zin_deep_raise_mothers_stone = L('# The divers bring up the Mothers\' Stone: the relic, the art Dike-Craft, and the Veiled\'s grudge unless the Cord was shared first.',
    'set_global_flag = zin_deep_mothers_stone_raised', 'set_country_flag = zin_deep_recovered_dike_craft',
    IF(`original_tag = ${t.ORH}`, 'add_ideas = zin_deep_relic_mothers_stone_orohaf'), ELSE('add_ideas = zin_deep_relic_mothers_stone'),
    IF(L(NOT('zin_deep_has_cord = yes'), exists(t.CUR)), opinion(t.CUR, 'ROOT', 'zin_opinion_stone_taken')), ev(35));

  // the Moot of Mothers (the ambition)
  for (const [self, other] of [[t.CUR, t.BLO], [t.BLO, t.CUR]]) {
    dec('zin_deep_low_country', { id: `zin_deep_moot_of_mothers_${self.toLowerCase()}`, icon: 'crown_witnesses', cost: N.moot_pp, cooldown: N.moot_cooldown_days,
      visible: L(`original_tag = ${self}`, flag('zin_deep_moot_route'), NOT(gflag('zin_deep_cord_burned')), NOT(gflag('zin_deep_moot_formed'))),
      available: L(tt('zin_deep_tt_cord_shown', gflag('zin_deep_last_cord_shown')), 'zin_deep_two_counts_done = yes',
        tt('zin_deep_tt_other_orran', OR(NOT(exists(other)), to(other, 'is_subject_of = ROOT'))), NOT(`has_war_with = ${other}`)),
      effect: L(ett('zin_deep_moot_of_mothers_tt'), hidden(IF(exists(other), to(other, ev(42))), ELSE('zin_deep_form_moot = yes'))),
      ai: aiBase(N.ai_ambition_base) });
  }
  E.zin_deep_form_moot = L('# The Moot of Mothers formed: the Low Country\'s name, the Peace of the Cords, claims on the Konorar valley (never cores).',
    'set_cosmetic_tag = zin_cosmetic_muzerar', 'add_ideas = zin_deep_peace_of_cords', 'set_global_flag = zin_deep_moot_formed', 'set_country_flag = zin_deep_moot_of_mothers',
    'save_event_target_as = zin_deep_claimant', claimAll('zin_deep_konorar_valley_states'), ev(43), neighbours(43));

  // the almoners' copy (the optional hook, A3 holds until zin_afrit_revealed)
  // ---------------------------------------------------------------------------------------------- the Two Shores (Tarkia)
  E.zin_deep_trace_ditches = L('# The Old Ditches (the focus of Noleksun): the farms of the march watered as they were before the rift.',
    B(site('old_ditches'), IF(L('is_owned_by = ROOT', NOT('has_dynamic_modifier = { modifier = zin_deep_old_ditches }')), 'add_dynamic_modifier = { modifier = zin_deep_old_ditches }')));
  E.zin_deep_open_two_shores = '# Scope: a keeper of the Two Shores (Luv-zhise, Delbiz, Eldafaen): the category opens.\nset_country_flag = zin_deep_two_shores_open';
  E.zin_deep_read_first_stair = L('# Read the First Stair (Alerhia\'s focus): the stair is older than the crown; the scribes work in its vaults.',
    'set_country_flag = zin_deep_first_stair_read', 'zin_deep_open_two_shores = yes', `add_timed_idea = { idea = zin_deep_stair_scribes days = ${N.stair_research_days} }`, ev(50));
  const gateSeekers = tagIs(t.ALR, t.LUV, t.LCC);
  dec('zin_deep_two_shores', { id: 'zin_deep_ask_ferry_leave', icon: 'river_ford', cost: N.leave_pp, cooldown: N.ask_cooldown_days,
    visible: L(tagIs(t.ALR, t.LCC), flag('zin_deep_two_shores_open'), NOT(flag('zin_deep_luv_leave')), exists(t.LUV), NOT(gflag('zin_deep_gate_west_cleared'))),
    available: L(`NOT = { has_war_with = ${t.LUV} }`, tt('zin_deep_tt_leave_refused', NOT(flag('zin_deep_leave_refused')))),
    effect: L(ett('zin_deep_ask_ferry_leave_tt'), hidden(to(t.LUV, ev(51)))), ai: aiBase(N.ai_ask_base) });
  dec('zin_deep_two_shores', { id: 'zin_deep_stones_under_the_caps', icon: 'mushroom_grove', cost: N.dig_pp, days: N.dig_days,
    visible: L(gateSeekers, flag('zin_deep_two_shores_open'), NOT(gflag('zin_deep_gate_west_cleared')), NOT(flag('zin_deep_digging_west'))),
    available: L(tt('zin_deep_tt_leave', OR(`original_tag = ${t.LUV}`, flag('zin_deep_luv_leave'))), tt('zin_deep_tt_dig_ready', OR(NOT(`original_tag = ${t.ALR}`), flag('zin_deep_dig_ready'))),
      tt('zin_deep_tt_mycid_passage', OR(NOT(exists(t.MSH)), B('AND', `NOT = { has_war_with = ${t.MSH} }`, to(t.MSH, NOT(`has_opinion = { target = ROOT value < ${N.mycid_opinion_min} }`))))),
      hasEq('zin_arms_equipment', N.dig_equipment), `has_manpower > ${N.dig_manpower - 1}`, NOT('has_war = yes')),
    effect: L(ett('zin_deep_stones_under_the_caps_tt'), hidden(pay('zin_arms_equipment', N.dig_equipment), `add_manpower = -${N.dig_manpower}`, 'set_country_flag = zin_deep_digging_west')),
    remove: L('clr_country_flag = zin_deep_digging_west', B('random_list', B(String(N.spore_chance), `add_manpower = -${N.spore_manpower}`, ev(54)),
      B(String(100 - N.spore_chance), 'set_global_flag = zin_deep_gate_west_cleared', ev(53), B(site('gate_west'), B('owner', neighbours(53))), 'zin_deep_check_gate_stones = yes'))),
    ai: aiBase(N.ai_dig_base) });
  dec('zin_deep_two_shores', { id: 'zin_deep_ask_fair_consent', icon: 'herds', cost: N.leave_pp, cooldown: N.ask_cooldown_days,
    visible: L(`original_tag = ${t.ALR}`, flag('zin_deep_two_shores_open'), NOT(flag('zin_deep_delbiz_leave')), exists(t.DLB), NOT(gflag('zin_deep_gate_east_cleared'))),
    available: L(`NOT = { has_war_with = ${t.DLB} }`, tt('zin_deep_tt_leave_refused', NOT(flag('zin_deep_leave_refused')))),
    effect: L(ett('zin_deep_ask_fair_consent_tt'), hidden(to(t.DLB, ev(55)))), ai: aiBase(N.ai_ask_base) });
  dec('zin_deep_two_shores', { id: 'zin_deep_pillars_of_the_fair', icon: 'quarry_stone', cost: N.fair_pp, days: N.fair_days,
    visible: L(tagIs(t.ALR, t.DLB), flag('zin_deep_two_shores_open'), NOT(gflag('zin_deep_gate_east_cleared')), NOT(flag('zin_deep_digging_east'))),
    available: L(tt('zin_deep_tt_fair', OR(B('AND', `original_tag = ${t.DLB}`, flag('zin_deep_fair_consent')), flag('zin_deep_delbiz_leave'))), NOT('has_war = yes')),
    effect: L(ett('zin_deep_pillars_of_the_fair_tt'), hidden('set_country_flag = zin_deep_digging_east', IF(exists(t.DLB), to(t.DLB, `add_timed_idea = { idea = zin_deep_fair_closed days = ${N.fair_closed_days} }`)))),
    remove: L('clr_country_flag = zin_deep_digging_east', 'set_global_flag = zin_deep_gate_east_cleared', ev(57), B(site('gate_east'), B('owner', neighbours(57))), 'zin_deep_check_gate_stones = yes'),
    ai: aiBase(N.ai_dig_base) });
  E.zin_deep_check_gate_stones = L('# Both halves of the old city cleared: Alerhia keeps the Gate-Stones (6.5).',
    IF(L(gflag('zin_deep_gate_west_cleared'), gflag('zin_deep_gate_east_cleared'), NOT(gflag('zin_deep_gate_stones')), exists(t.ALR)),
      'set_global_flag = zin_deep_gate_stones', to(t.ALR, ev(58))));
  dec('zin_deep_two_shores', { id: 'zin_deep_ask_the_archive', icon: 'scroll_treaty', cost: N.archive_pp, cooldown: N.ask_cooldown_days,
    visible: L(gflag('zin_deep_gate_west_cleared'), gflag('zin_deep_gate_east_cleared'), NOT(flag('zin_deep_bridge_treaty')), NOT(gflag('zin_deep_treaty_closed')), NOT(gflag('zin_deep_treaty_kept_shut')), exists(t.ELD),
      flag('zin_deep_two_shores_open'), OR(NOT(`original_tag = ${t.ALR}`), flag('zin_deep_archive_ask_ready'))),
    available: L(tt('zin_deep_tt_not_coalition', NOT(flag('zin_east_coalition_member'))), tt('zin_deep_tt_not_dominion', NOT('has_government = fascism')),
      to(t.ELD, `has_opinion = { target = ROOT value > ${N.archive_opinion_min - 1} }`), `NOT = { has_war_with = ${t.ELD} }`),
    effect: L(ett('zin_deep_ask_the_archive_tt'), hidden(to(t.ELD, ev(60)))), ai: aiBase(N.ai_ask_base) });
  dec('zin_deep_two_shores', { id: 'zin_deep_raise_the_bridge_road', icon: 'roads_paved', cost: N.road_pp,
    visible: L(flag('zin_deep_bridge_treaty'), NOT(gflag('zin_deep_bridge_road'))),
    available: L(tt('zin_deep_tt_gates_held', B(site('gate_west'), OR('is_owned_by = ROOT', 'owner = { is_subject_of = ROOT }', 'owner = { is_in_faction_with = ROOT }')),
      B(site('gate_east'), OR('is_owned_by = ROOT', 'owner = { is_subject_of = ROOT }', 'owner = { is_in_faction_with = ROOT }'))), hasEq('convoy', N.road_convoys), hasEq('zin_camp_equipment', N.road_camp)),
    effect: L(ett('zin_deep_raise_the_bridge_road_tt'), hidden(pay('convoy', N.road_convoys), pay('zin_camp_equipment', N.road_camp), 'set_global_flag = zin_deep_bridge_road', 'set_country_flag = zin_deep_bridge_road_raised',
      ['gate_west', 'gate_east'].map(g => B(site(g), 'add_building_construction = { type = infrastructure level = 1 instant_build = yes }',
        'add_building_construction = { type = naval_base level = 1 province = { all_provinces = yes limit_to_coastal = yes } instant_build = yes }', 'add_dynamic_modifier = { modifier = zin_deep_gates_cleared }')),
      B(site('gate_west'), B('owner', 'save_event_target_as = zin_deep_west_shore')), B(site('gate_east'), B('owner', IF(NOT('tag = event_target:zin_deep_west_shore'), 'add_opinion_modifier = { target = event_target:zin_deep_west_shore modifier = zin_opinion_shores_bound }', 'event_target:zin_deep_west_shore = { add_opinion_modifier = { target = PREV modifier = zin_opinion_shores_bound } }'))),
      ev(59))),
    ai: aiBase(N.ai_ambition_base) });
  dec('zin_deep_two_shores', { id: 'zin_deep_bridge_kingdom', icon: 'bridge_oaths', cost: N.bridge_kingdom_pp,
    visible: L(`original_tag = ${t.ALR}`, flag('zin_deep_bridge_treaty'), NOT(flag('zin_deep_bridge_kingdom'))),
    available: L(tt('zin_deep_tt_road_raised', flag('zin_deep_bridge_road_raised')), tt('zin_deep_tt_gates_owned', ownedOr('gate_west'), ownedOr('gate_east')),
      tt('zin_deep_tt_not_coalition', NOT(flag('zin_east_coalition_member'))), tt('zin_deep_tt_no_crossing', NOT('has_completed_focus = zin_regional_alerhia_the_crossing_of_the_rift')),
      `has_stability > ${N.bridge_kingdom_stability}`),
    effect: L(ett('zin_deep_bridge_kingdom_tt'), hidden('set_cosmetic_tag = zin_cosmetic_tarkia', 'set_country_flag = zin_deep_bridge_kingdom', 'set_global_flag = zin_deep_bridge_kingdom_formed',
      IF('has_idea = zin_deep_relic_gate_stones', 'swap_ideas = { remove_idea = zin_deep_relic_gate_stones add_idea = zin_deep_bridge_remembered_2 }'), ELSE('add_ideas = zin_deep_bridge_remembered_2'),
      [t.LCC, t.ELD].map(x => IF(exists(x), opinion(x, 'ROOT', 'zin_opinion_bridge_treaty'))), ev(64), neighbours(64))),
    ai: aiBase(N.ai_ambition_base) });
  E.zin_deep_crossing_banks = L('# Called by zin_west_sail (mech_crossing.mjs) when the first sailing makes for Aenor Isle; scope: the leader of the crossing, temporary west_lift. A defender that has charted the low fields grounds a share of the host on the banks unless island pilots sail with it.',
    IF(L('check_variable = { global.zin_west_sailings = 0 }', B('any_country', 'has_war_with = ROOT', 'zin_deep_two_counts_done = yes'), NOT('zin_deep_has_pilots = yes')),
      'set_temp_variable = { zin_d_banks = west_lift }', `multiply_temp_variable = { zin_d_banks = ${N.banks_share} }`, 'round_temp_variable = zin_d_banks', 'subtract_from_temp_variable = { west_lift = zin_d_banks }',
      `set_temp_variable = { zin_arg_value = -${N.banks_fleet} }`, 'zin_west_add_fleet = yes', ev(45)));
  E.zin_deep_coalition_weight = L('# Called by zin_east_compute_weight (mech_east.mjs) in the scope of an East Lands court; adds to its temporary zin_e_w (eastern spec section 5, addendum 6.4).',
    IF(flag('zin_deep_bridge_treaty'), `add_to_temp_variable = { zin_e_w = ${N.coalition_treaty} }`),
    ELIF(L(flag('zin_deep_first_stair_read'), OR('has_government = fascism', flag('zin_east_rift_whispered'))), `add_to_temp_variable = { zin_e_w = ${N.coalition_stair} }`),
    IF(flag('zin_deep_diadem_worn'), `add_to_temp_variable = { zin_e_w = ${N.coalition_diadem} }`));

  // ---------------------------------------------------------------------------------------------- the Kalioth Crown (Rhabtarkia)
  E.zin_deep_open_kalioth = '# Under the Seven Forts (Erco\'s focus): the Kalioth category opens, with Open the Old Shafts.\nset_country_flag = zin_deep_kalioth_open';
  dec('zin_deep_kalioth', { id: 'zin_deep_open_the_old_shafts', icon: 'mine_cart', cost: N.shafts_pp, days: N.shafts_days,
    visible: L(OR(flag('zin_deep_kalioth_open'), B('AND', NOT(`original_tag = ${t.ERC}`), B(site('kalioth_halls'), 'is_owned_by = ROOT'))), NOT(flag('zin_deep_kalioth_shafts')), NOT(flag('zin_deep_shafts_digging')), NOT(gflag('zin_deep_diadem_decided'))),
    available: L(B(site('kalioth_halls'), 'is_owned_by = ROOT'), `has_manpower > ${N.shafts_manpower - 1}`, hasEq('zin_arms_equipment', N.shafts_equipment)),
    effect: L(ett('zin_deep_open_the_old_shafts_tt'), hidden(`add_manpower = -${N.shafts_manpower}`, pay('zin_arms_equipment', N.shafts_equipment), 'set_country_flag = zin_deep_shafts_digging')),
    remove: L('clr_country_flag = zin_deep_shafts_digging', 'set_country_flag = zin_deep_kalioth_shafts', 'set_country_flag = zin_deep_kalioth_open',
      B(site('kalioth_halls'), IF(NOT('has_dynamic_modifier = { modifier = zin_deep_kalioth_halls_opened }'), 'add_dynamic_modifier = { modifier = zin_deep_kalioth_halls_opened }')),
      IF(`original_tag = ${t.ERC}`, ev(100)), ELSE(ev(101))),
    ai: aiBase(N.ai_dig_base) });
  E.zin_deep_diadem_fate = L('# The diadem\'s fate (Erco\'s three focuses, zin_deep.101 for any other owner). Argument zin_arg_way: 1 walled up again, 2 melted, 3 worn.',
    'set_temp_variable = { zin_deep_way = zin_arg_way }', 'clear_variable = zin_arg_way', 'set_global_flag = zin_deep_diadem_decided',
    IF('check_variable = { zin_deep_way = 1 }', `add_stability = ${N.wall_stability}`, 'set_global_flag = zin_deep_diadem_walled'),
    IF('check_variable = { zin_deep_way = 2 }', 'set_global_flag = zin_deep_diadem_melted', 'set_country_flag = zin_deep_melted_by_me', 'set_country_flag = zin_deep_recovered_kalioth_forge', 'add_ideas = zin_deep_mine_lords_oath',
      IF(exists(t.ALR), opinion(t.ALR, 'ROOT', 'zin_opinion_diadem_melted'), to(t.ALR, ev(103)))),
    IF('check_variable = { zin_deep_way = 3 }', 'set_country_flag = zin_deep_diadem_worn', 'set_variable = { global.zin_deep_diadem_wearer = ROOT }', 'set_country_flag = zin_deep_recovered_kalioth_forge',
      'add_ideas = zin_deep_relic_diadem', 'save_event_target_as = zin_deep_claimant', claimAll('zin_deep_plutondo_valley_states'), claimAll('zin_deep_miaed_passes_states'), claimAll('zin_deep_pornivior_road_states'),
      [t.ALR, t.NRS, t.HER, t.NOL].map(x => IF(exists(x), opinion(x, 'ROOT', 'zin_opinion_old_tribute'))),
      IF(NOT(`original_tag = ${t.ERC}`), B(site('kalioth_halls'), 'add_dynamic_modifier = { modifier = zin_deep_kalioth_unrest }')),
      [t.ALR, t.PLO, t.MIE].map(x => tell(x, 102))));
  E.zin_deep_glacier_road = '# The Glacier Road (Erco\'s focus after Wear): a scouting party over the Melty Pass.\ncountry_event = { id = zin_deep.110 }';
  dec('zin_deep_kalioth', { id: 'zin_deep_kalioth_crown', icon: 'crown_iron', cost: N.kalioth_crown_pp,
    visible: L(`original_tag = ${t.ERC}`, flag('zin_deep_diadem_worn'), NOT(flag('zin_deep_kalioth_crown')), NOT(gflag('zin_deep_kalioth_fallen'))),
    available: L(tt('zin_deep_tt_valley_held', B('all_of_scopes', 'array = global.zin_deep_plutondo_valley_states', OR('is_owned_by = ROOT', 'owner = { is_subject_of = ROOT }')),
      B('all_of_scopes', 'array = global.zin_deep_miaed_passes_states', OR('is_owned_by = ROOT', 'owner = { is_subject_of = ROOT }'))),
      `has_stability > ${N.kalioth_crown_stability}`, `army_experience > ${N.kalioth_crown_army_xp - 1}`),
    effect: L(ett('zin_deep_kalioth_crown_tt'), `army_experience = -${N.kalioth_crown_army_xp}`, hidden('set_cosmetic_tag = zin_cosmetic_rhabtarkia', 'set_country_flag = zin_deep_kalioth_crown', 'add_ideas = zin_deep_kalioth_crown_spirit',
      `add_timed_idea = { idea = zin_deep_compliance_work days = ${N.kalioth_compliance_days} }`, ev(109), neighbours(109))),
    ai: aiBase(N.ai_ambition_base, ['factor', 0, NOT('has_government = fascism')]) });
  dec('zin_deep_kalioth', { id: 'zin_deep_demand_old_tribute', icon: 'tribute_chest', cost: N.tribute_demand_pp, cooldown: N.tribute_demand_cooldown, targets: [t.PLO, t.MIE, t.PON],
    rootTrigger: flag('zin_deep_kalioth_crown'),
    target: L('FROM = {', 'exists = yes', NOT('is_subject_of = ROOT'), NOT('has_war_with = ROOT'), 'any_owned_state = { OR = { has_state_flag = zin_deep_site_plutondo_valley has_state_flag = zin_deep_site_miaed_passes has_state_flag = zin_deep_site_pornivior_road } }', '}'),
    effect: L(ett('zin_deep_demand_old_tribute_tt'), hidden('FROM = { country_event = { id = zin_deep.107 } }')),
    ai: aiBase(N.ai_tribute_base) });

  // ---------------------------------------------------------------------------------------------- the Sea-Doors (Gromatrak)
  E.zin_deep_read_door = L('# Read the Names on the Door (the holds\' focus): the hold reads the names of the last delvers; the other holds hear through the moot.',
    'set_country_flag = zin_deep_door_read', 'set_country_flag = zin_deep_sea_doors_open', `add_timed_idea = { idea = zin_deep_door_names days = ${N.door_research_days} }`, ev(150),
    holds.map(h => IF(L(NOT(`tag = ${h}`), exists(h)), to(h, ev(151)))),
    IF(L(holds.map(h => OR(NOT(exists(h)), to(h, flag('zin_deep_door_read')))), NOT(gflag('zin_deep_all_doors_read'))), 'set_global_flag = zin_deep_all_doors_read',
      holds.map(h => IF(exists(h), to(h, 'set_country_flag = zin_deep_recovered_deep_road_shoring'))), ...[]));
  dec('zin_deep_sea_doors', { id: 'zin_deep_settle_the_old_blame', icon: 'tribute_chest', cost: N.blame_pp, cooldown: N.ask_cooldown_days,
    visible: L(`original_tag = ${t.KUN}`, flag('zin_deep_door_read'), NOT(gflag('zin_deep_blame_settled'))),
    available: L(tt('zin_deep_tt_western_door_read', OR(western.map(w => B('AND', exists(w), to(w, flag('zin_deep_door_read')), to(w, NOT(flag('zin_deep_blame_answered'))))))), hasEq('zin_arms_equipment', N.blame_equipment)),
    effect: L(ett('zin_deep_settle_the_old_blame_tt'), hidden(pay('zin_arms_equipment', N.blame_equipment), western.map(w => IF(L(exists(w), to(w, flag('zin_deep_door_read')), to(w, NOT(flag('zin_deep_blame_answered')))), to(w, ev(152)))))),
    ai: aiBase(N.ai_moot_base) });
  dec('zin_deep_sea_doors', { id: 'zin_deep_yield_the_old_blame', icon: 'olive_branch',
    visible: L('zin_deep_is_western_hold = yes', flag('zin_deep_door_read'), NOT(flag('zin_deep_blame_answered')), NOT(gflag('zin_deep_blame_settled'))),
    available: L(exists(t.KUN), to(t.KUN, flag('zin_deep_door_read'))),
    effect: L(ett('zin_deep_yield_the_old_blame_tt'), `add_stability = -${N.blame_stability}`, hidden('zin_deep_blame_answered = yes', to(t.KUN, ev(154)))),
    ai: aiBase(N.ai_yield_base) });
  E.zin_deep_blame_answered = L('# Scope: a western hold. Its blame of Kunhrim is settled; the moot\'s condition holds once every standing western hold has settled.',
    'set_country_flag = zin_deep_blame_answered', `remove_opinion_modifier = { target = ${t.KUN} modifier = zin_opinion_old_blame }`,
    IF(western.map(w => OR(NOT(exists(w)), to(w, flag('zin_deep_blame_answered')))), 'set_global_flag = zin_deep_blame_settled'));
  dec('zin_deep_sea_doors', { id: 'zin_deep_call_the_road_moot', icon: 'council_table', cost: N.moot_call_pp,
    visible: L('zin_deep_is_hold = yes', flag('zin_deep_door_read'), NOT(gflag('zin_deep_road_moot')), NOT(gflag('zin_deep_moot_called'))),
    available: L('zin_deep_all_holds_stand = yes', tt('zin_deep_tt_blame_settled', gflag('zin_deep_blame_settled')), tt('zin_deep_tt_moot_failed', NOT(flag('zin_deep_moot_failed')))),
    effect: L(ett('zin_deep_call_the_road_moot_tt'), `add_timed_idea = { idea = zin_deep_moot_gold days = ${N.moot_gold_days} }`, hidden('set_global_flag = zin_deep_moot_called', 'set_variable = { global.zin_deep_moot_caller = ROOT }',
      'set_variable = { global.zin_deep_moot_answers = 0 }', 'set_variable = { global.zin_deep_moot_came = 0 }', holds.map(h => IF(NOT(`tag = ${h}`), to(h, ev(155)))))),
    ai: aiBase(N.ai_moot_base) });
  E.zin_deep_moot_answer = L('# Scope: a hold answering the Road Moot (zin_deep.155). zin_arg_came 1 comes, 0 stays away. When the three have answered the moot sits or fails.',
    'add_to_variable = { global.zin_deep_moot_answers = 1 }', IF('check_variable = { zin_arg_came = 1 }', 'add_to_variable = { global.zin_deep_moot_came = 1 }'), 'clear_variable = zin_arg_came',
    IF('check_variable = { global.zin_deep_moot_answers > 2.99 }',
      IF('check_variable = { global.zin_deep_moot_came > 2.99 }', 'set_global_flag = zin_deep_road_moot'),
      ELSE('clr_global_flag = zin_deep_moot_called', B('var:global.zin_deep_moot_caller', `set_country_flag = { flag = zin_deep_moot_failed days = ${N.moot_fail_days} }`)),
      holds.map(h => tell(h, 156))));
  dec('zin_deep_sea_doors', { id: 'zin_deep_a_deep_king_again', icon: 'crown_witnesses',
    visible: L('zin_deep_is_hold = yes', 'zin_deep_moot_sitting = yes', NOT(gflag('zin_deep_deep_king_chosen')), NOT(gflag('zin_deep_vote_open'))),
    available: 'zin_deep_all_holds_stand = yes',
    effect: L(ett('zin_deep_a_deep_king_again_tt'), hidden('set_global_flag = zin_deep_vote_open', 'set_variable = { global.zin_deep_votes_cast = 0 }', 'set_variable = { global.zin_deep_votes_caller = 0 }',
      'set_variable = { global.zin_deep_largest_hold = var:global.zin_deep_moot_caller }', 'set_temp_variable = { zin_d_most = 0 }',
      holds.map(h => IF(exists(h), to(h, IF('check_variable = { num_owned_states > zin_d_most }', 'set_temp_variable = { zin_d_most = num_owned_states }', 'set_variable = { global.zin_deep_largest_hold = THIS }')))),
      holds.map(h => tell(h, 157)))),
    ai: aiBase(N.ai_moot_base) });
  E.zin_deep_cast_vote = L('# Scope: a hold voting (zin_deep.157). zin_arg_caller 1 for the caller of the moot, 0 for the largest hold. The fourth vote crowns the Deep King.',
    'add_to_variable = { global.zin_deep_votes_cast = 1 }', IF('check_variable = { zin_arg_caller = 1 }', 'add_to_variable = { global.zin_deep_votes_caller = 1 }'), 'clear_variable = zin_arg_caller',
    IF('check_variable = { global.zin_deep_votes_cast > 3.99 }',
      IF('check_variable = { global.zin_deep_votes_caller > 1.99 }', B('var:global.zin_deep_moot_caller', 'zin_deep_crown_deep_king = yes')),
      ELSE(B('var:global.zin_deep_largest_hold', 'zin_deep_crown_deep_king = yes'))));
  E.zin_deep_crown_deep_king = L('# Scope: the chosen hold. The Deep King again: the name, the lamp, the Road Moot as one league (a new league only when the holds stand in none).',
    'set_global_flag = zin_deep_deep_king_chosen', 'clr_global_flag = zin_deep_vote_open', 'set_country_flag = zin_deep_deep_king', 'set_variable = { global.zin_deep_deep_king = THIS }',
    'set_cosmetic_tag = zin_cosmetic_gromatrak', 'add_ideas = zin_deep_relic_deep_lamp',
    IF('is_in_faction = no', 'create_faction = zin_deep_road_moot_faction'),
    IF('is_faction_leader = yes', holds.map(h => IF(L(exists(h), NOT(`tag = ${h}`), to(h, 'is_in_faction = no')), `add_to_faction = ${h}`))),
    holds.map(h => tell(h, 158)));
  dec('zin_deep_sea_doors', { id: 'zin_deep_the_sea_is_the_seal', icon: 'ring_doors',
    visible: L(flag('zin_deep_deep_king'), NOT(gflag('zin_deep_sea_sealed')), NOT(gflag('zin_deep_door_open'))),
    available: 'zin_deep_all_holds_stand = yes',
    effect: L(ett('zin_deep_the_sea_is_the_seal_tt'), hidden('zin_deep_swear_seal = yes')),
    ai: weigh(N.ai_seal_base) });
  E.zin_deep_swear_seal = L('# The Sea Is the Seal: the four holds swear never to open a door; lasting bonuses in every hold, the doors closed for this game.',
    'set_global_flag = zin_deep_sea_sealed', holds.map(h => IF(exists(h), to(h, 'add_ideas = zin_deep_sea_is_the_seal', ev(159)))));
  const desperate = L(OR(B('any_neighbor_state', 'NOT = { is_owned_by = ROOT }'), 'has_war = yes'), 'has_capitulated = no');
  dec('zin_deep_sea_doors', { id: 'zin_deep_open_the_sea_door', icon: 'abyss_stair', cost: N.door_pp, days: N.door_days,
    visible: L(flag('zin_deep_deep_king'), NOT(gflag('zin_deep_sea_sealed')), NOT(gflag('zin_deep_door_open')), NOT(gflag('zin_deep_door_ever_opened')), NOT(flag('zin_deep_door_opening'))),
    available: L('has_tech = zin_tech_rites_of_unbinding', `has_fuel > ${N.door_essence - 1}`, `army_experience > ${N.door_army_xp - 1}`, `has_manpower > ${N.door_manpower - 1}`),
    effect: L(ett('zin_deep_open_the_sea_door_tt'), `army_experience = -${N.door_army_xp}`, hidden(`add_fuel = -${N.door_essence}`, `add_manpower = -${N.door_manpower}`, 'set_country_flag = zin_deep_door_opening')),
    remove: L('clr_country_flag = zin_deep_door_opening', ev(160)),
    ai: weigh(0, ['add', N.ai_door_desperate, L('has_war = yes', 'surrender_progress > 0.3')], ['factor', 0, NOT('has_tech = zin_tech_rites_of_unbinding')]) });
  E.zin_deep_door_opened = L('# Scope: the Deep King\'s hold (zin_deep.160). The road between it and the hold of event target zin_deep_road_end is open; the hidden risk begins.',
    'set_global_flag = zin_deep_door_open', 'set_global_flag = zin_deep_door_ever_opened', 'set_variable = { global.zin_deep_door_opener = THIS }',
    'add_ideas = zin_deep_road_reopened', 'event_target:zin_deep_road_end = { add_ideas = zin_deep_road_reopened }',
    holds.map(h => IF(L(exists(h), NOT(`tag = ${h}`)), opinion(h, 'ROOT', 'zin_opinion_door_opened'), to(h, ev(161)))),
    'clear_array = global.zin_deep_awake_states');
  missions.push({ id: 'zin_deep_seal_the_door', icon: 'ring_doors', days: N.seal_days,
    available: L(`has_fuel > ${N.seal_essence - 1}`, `has_manpower > ${N.seal_manpower - 1}`),
    complete: L(ett('zin_deep_seal_the_door_tt'), hidden(`add_fuel = -${N.seal_essence}`, `add_manpower = -${N.seal_manpower}`, 'set_country_flag = zin_deep_resealed_by_me', 'zin_deep_reseal = yes')),
    onTimeout: L(ett('zin_deep_seal_the_door_timeout_tt'), hidden('set_global_flag = zin_deep_deep_crisis', 'zin_deep_tell_the_deep = yes')) });
  E.zin_deep_tell_the_deep = L('# The holds and every realm the deep has reached hear of the crisis (zin_deep.173).', holds.map(h => tell(h, 173)),
    loop('zin_deep_awake_states', B('owner', IF(L(NOT('zin_deep_is_hold = yes'), NOT(flag('zin_deep_crisis_told'))), 'set_country_flag = zin_deep_crisis_told', ev(173)))));
  dec('zin_deep_sea_doors', { id: 'zin_deep_seal_the_deep', icon: 'ward_circle', cost: N.crisis_seal_pp,
    visible: L(gflag('zin_deep_deep_crisis'), OR('zin_deep_is_hold = yes', B('any_owned_state', 'has_dynamic_modifier = { modifier = zin_deep_the_deep_awake }'))),
    available: L(`has_fuel > ${N.crisis_seal_essence - 1}`, `has_manpower > ${N.crisis_seal_manpower - 1}`),
    effect: L(ett('zin_deep_seal_the_deep_tt'), hidden(`add_fuel = -${N.crisis_seal_essence}`, `add_manpower = -${N.crisis_seal_manpower}`, 'clr_global_flag = zin_deep_deep_crisis', 'zin_deep_reseal = yes')),
    ai: weigh(N.ai_seal_crisis, ['factor', 0, lowPP]) });
  E.zin_deep_reseal = L('# The door shut again: the deep\'s modifier leaves every state it reached, the road is lost.',
    loop('zin_deep_awake_states', 'remove_dynamic_modifier = { modifier = zin_deep_the_deep_awake }', 'clr_state_flag = zin_deep_awake'),
    'clear_array = global.zin_deep_awake_states', 'clr_global_flag = zin_deep_deep_awake', 'clr_global_flag = zin_deep_door_open',
    IF(gflag('zin_deep_deep_crisis'), 'clr_global_flag = zin_deep_deep_crisis'), 'set_global_flag = zin_deep_resealed',
    B('every_country', B('limit', 'has_idea = zin_deep_road_reopened'), 'remove_ideas = zin_deep_road_reopened'),
    holds.map(h => tell(h, 172)));

  // ---------------------------------------------------------------------------------------------- the Sea-Roads (Margorodai)
  E.zin_deep_read_league_charts = L('# The League\'s Oldest Charts (Adel\'s focus): the Cursed Square was a harbour; a copy of the charts goes to the Lens.',
    'set_country_flag = zin_deep_square_known', 'set_country_flag = zin_deep_sea_roads_open', ev(200), tell(t.LEN, 201));
  E.zin_deep_open_sea_roads = L('# The High Speaker\'s Seat (Nondondor\'s focus): the crown remembers the league\'s seat and the harbour under the reefs.',
    'set_country_flag = zin_deep_square_known', 'set_country_flag = zin_deep_sea_roads_open');
  const seaSeeker = OR('zin_deep_charter_member = yes', `original_tag = ${t.NND}`);
  dec('zin_deep_sea_roads', { id: 'zin_deep_buy_the_square', icon: 'coin_chest', cost: N.buy_square_pp, cooldown: N.ask_cooldown_days,
    visible: L(flag('zin_deep_square_known'), seaSeeker, NOT('zin_deep_square_open_to = yes'), exists(t.BEN), B(site('cursed_square_shore'), `is_owned_by = ${t.BEN}`)),
    available: L(`NOT = { has_war_with = ${t.BEN} }`, hasEq('convoy', N.buy_square_convoys), tt('zin_deep_tt_benan_refused', NOT(flag('zin_deep_benan_refused')))),
    effect: L(ett('zin_deep_buy_the_square_tt'), hidden(pay('convoy', N.buy_square_convoys), to(t.BEN, ev(202)))), ai: aiBase(N.ai_ask_base) });
  dec('zin_deep_sea_roads', { id: 'zin_deep_benan_into_the_charter', icon: 'banner_league', cost: N.charter_ask_pp, cooldown: N.ask_cooldown_days,
    visible: L(flag('zin_deep_square_known'), `original_tag = ${t.ADE}`, NOT('zin_deep_square_open_to = yes'), exists(t.BEN)),
    available: L(`NOT = { has_war_with = ${t.BEN} }`, tt('zin_deep_tt_benan_refused', NOT(flag('zin_deep_benan_refused')))),
    effect: L(ett('zin_deep_benan_into_the_charter_tt'), hidden(to(t.BEN, ev(204)))), ai: aiBase(N.ai_ask_base) });
  dec('zin_deep_sea_roads', { id: 'zin_deep_ask_the_lamp', icon: 'lighthouse', cost: N.lamp_pp, cooldown: N.ask_cooldown_days,
    visible: L(flag('zin_deep_square_known'), seaSeeker, 'zin_deep_square_open_to = yes', NOT(flag('zin_deep_lamp_lent')), exists(t.LEN)),
    available: L(tt('zin_deep_tt_charter_member', 'zin_deep_charter_member = yes'), NOT(B('any_country', 'zin_deep_charter_member = yes', 'has_war_with = ROOT')), `NOT = { has_war_with = ${t.LEN} }`),
    effect: L(ett('zin_deep_ask_the_lamp_tt'), hidden(to(t.LEN, ev(206)))), ai: aiBase(N.ai_ask_base) });
  dec('zin_deep_sea_roads', { id: 'zin_deep_relight_the_square', icon: 'lantern_chain', cost: N.relight_pp, days: N.relight_days,
    visible: L(flag('zin_deep_square_known'), OR(flag('zin_deep_lamp_lent'), NOT(exists(t.LEN))), NOT(gflag('zin_deep_square_relit')), NOT(flag('zin_deep_relighting'))),
    available: L('zin_deep_square_open_to = yes', tt('zin_deep_tt_square_base', navalBase('cursed_square_shore', 1)), `navy_experience > ${N.relight_navy_xp - 1}`, hasEq('convoy', N.relight_convoys), `has_manpower > ${N.relight_manpower - 1}`),
    effect: L(ett('zin_deep_relight_the_square_tt'), `navy_experience = -${N.relight_navy_xp}`, hidden(pay('convoy', N.relight_convoys), `add_manpower = -${N.relight_manpower}`, 'set_country_flag = zin_deep_relighting')),
    remove: L('clr_country_flag = zin_deep_relighting', 'zin_deep_relight_done = yes'),
    ai: aiBase(N.ai_relight_base, ['factor', 0.1, NOT('has_tech = zin_tech_healers_rolls')]) });
  E.zin_deep_relight_done = L('# The Square relit: the harbour of the living again, the lamp, the old sea-roads\' charts; without the healers\' rolls the Grey Breath may return.',
    'set_global_flag = zin_deep_square_relit', 'set_country_flag = zin_deep_square_relit_by_me', 'set_variable = { global.zin_deep_relighter = THIS }',
    B(site('cursed_square_shore'), 'add_dynamic_modifier = { modifier = zin_deep_square_relit }'), 'add_ideas = zin_deep_relic_square_lamp',
    `add_tech_bonus = { name = zin_deep_sea_roads_charts bonus = ${N.sea_roads_tech_bonus} uses = 1 technology = zin_tech_old_sea_roads }`,
    isles.map(x => IF(L(exists(x), NOT(`tag = ${x}`)), opinion(x, 'ROOT', 'zin_opinion_square_relit_isles'), to(x, ev(209)))),
    corsairs.map(x => IF(L(exists(x), NOT(`tag = ${x}`)), opinion(x, 'ROOT', 'zin_opinion_square_relit_corsairs'), to(x, ev(209)))),
    ev(208), IF(NOT('has_tech = zin_tech_healers_rolls'), B('random_list', B(String(N.breath_chance), 'zin_deep_breath_start = yes'), B(String(100 - N.breath_chance), ''))));
  E.zin_deep_breath_start = L('# The Grey Breath returns (6.4): the shore and the relighter\'s ports sicken; the chart-houses turn cold toward the relighter.',
    `set_global_flag = { flag = zin_deep_grey_breath days = ${N.breath_days} }`, 'set_global_flag = zin_deep_breath_active', 'set_global_flag = zin_deep_breath_ever',
    B(site('cursed_square_shore'), 'zin_deep_breath_state = yes'),
    B('every_owned_state', B('limit', 'is_coastal = yes', 'any_province_building_level = { province = { all_provinces = yes } building = naval_base level > 0 }', NOT('has_state_flag = zin_deep_breath')), 'zin_deep_breath_state = yes'),
    isles.map(x => IF(L(exists(x), NOT(`tag = ${x}`)), opinion(x, 'ROOT', 'zin_opinion_grey_breath'))), ev(210));
  E.zin_deep_breath_state = L('# Scope: a state the Grey Breath reaches; its owner hears once.', 'set_state_flag = zin_deep_breath', 'add_dynamic_modifier = { modifier = zin_deep_grey_breath }',
    'add_to_array = { global.zin_deep_breath_states = THIS }', B('owner', IF(L(NOT(flag('zin_deep_breath_told')), NOT('tag = var:global.zin_deep_relighter')), 'set_country_flag = zin_deep_breath_told', ev(211))));
  dec('zin_deep_sea_roads', { id: 'zin_deep_crowns_route_to_the_isles', icon: 'great_warship', cost: N.crown_route_pp, cooldown: N.ask_cooldown_days,
    visible: L(`original_tag = ${t.NND}`, flag('zin_deep_crown_route'), NOT(flag('zin_deep_crown_route_agreed')), NOT(flag('zin_deep_crown_route_asked'))),
    available: flag('zin_deep_square_relit_by_me'),
    effect: L(ett('zin_deep_crowns_route_to_the_isles_tt'), hidden('set_country_flag = zin_deep_crown_route_asked', 'set_variable = { global.zin_deep_crown_votes = 0 }', 'set_variable = { global.zin_deep_crown_ayes = 0 }',
      [t.RAE, t.SEI].map(x => IF(exists(x), to(x, ev(213))), ELSE('add_to_variable = { global.zin_deep_crown_votes = 1 }', 'add_to_variable = { global.zin_deep_crown_ayes = 1 }')))),
    ai: aiBase(N.ai_ambition_base) });
  E.zin_deep_crown_answer = L('# Scope: Raerby or Seite answering the crown\'s route (zin_deep.213). zin_arg_aye 1 agrees.',
    'add_to_variable = { global.zin_deep_crown_votes = 1 }', IF('check_variable = { zin_arg_aye = 1 }', 'add_to_variable = { global.zin_deep_crown_ayes = 1 }'), 'clear_variable = zin_arg_aye',
    IF('check_variable = { global.zin_deep_crown_votes > 1.99 }', to(t.NND, 'clr_country_flag = zin_deep_crown_route_asked', IF('check_variable = { global.zin_deep_crown_ayes > 1.99 }', 'set_country_flag = zin_deep_crown_route_agreed'),
      ELSE(`set_country_flag = { flag = zin_deep_crown_route_refused days = ${N.crown_route_refused_days} }`), ev(214))));
  for (const [who, routeFlag, members] of [[t.ADE, 'zin_deep_sea_roads_route', [t.RAE, t.PLL]], [t.NND, 'zin_deep_crown_route', [t.ADE, t.RAE, t.PLL]]]) {
    dec('zin_deep_sea_roads', { id: `zin_deep_the_sea_roads_${who.toLowerCase()}`, icon: 'compass_rose', cost: N.sea_roads_pp,
      visible: L(`original_tag = ${who}`, OR(flag('zin_deep_sea_roads_route'), flag(routeFlag)), NOT(gflag('zin_deep_sea_roads_formed'))),
      available: L(tt('zin_deep_tt_relit_by_us', flag('zin_deep_square_relit_by_me')), tt('zin_deep_tt_charter_league', members.map(m => OR(NOT(exists(m)), `is_in_faction_with = ${m}`))),
        tt('zin_deep_tt_no_breath', NOT(gflag('zin_deep_breath_active'))), who === t.NND ? tt('zin_deep_tt_isles_agreed', flag('zin_deep_crown_route_agreed')) : '',
        `navy_experience > ${N.sea_roads_navy_xp - 1}`),
      effect: L(ett('zin_deep_the_sea_roads_tt'), `navy_experience = -${N.sea_roads_navy_xp}`, hidden('set_cosmetic_tag = zin_cosmetic_margorodai', 'set_global_flag = zin_deep_sea_roads_formed', 'set_country_flag = zin_deep_sea_roads',
        'add_ideas = zin_deep_sea_roads_league', corsairs.map(x => IF(L(exists(x), NOT(`tag = ${x}`)), to(x, B('ROOT', `add_dynamic_modifier = { modifier = zin_realm_cb_raiders scope = PREV days = ${N.sea_roads_cause_days} }`)))),
        ev(215), isles.map(x => IF(L(exists(x), NOT(`tag = ${x}`)), to(x, ev(215)))))),
      ai: aiBase(N.ai_ambition_base) });
  }

  // ---------------------------------------------------------------------------------------------- the ice (Heulufaenn)
  E.zin_deep_open_ice = '# Songs of the Long Dark (Coldor\'s focus), the first find, Kvittumm\'s guides: the ice category opens.\nset_country_flag = zin_deep_ice_open';
  dec('zin_deep_ice', { id: 'zin_deep_send_an_ice_walk', icon: 'footprints_snow', days: N.walk_days,
    visible: L('zin_deep_is_ice_walker = yes', flag('zin_deep_ice_open'), NOT(flag('zin_deep_walking'))),
    available: L('zin_deep_owns_ice_state = yes', tt('zin_deep_tt_long_light', 'zin_deep_long_light = yes'), tt('zin_deep_tt_walked', NOT(flag('zin_deep_walked'))), tt('zin_deep_tt_not_last_war', NOT('zin_deep_in_last_war = yes')),
      `army_experience > ${N.walk_army_xp - 1}`, hasEq('zin_camp_equipment', N.walk_camp), `has_manpower > ${N.walk_manpower - 1}`),
    effect: L(ett('zin_deep_send_an_ice_walk_tt'), `army_experience = -${N.walk_army_xp}`, hidden(pay('zin_camp_equipment', N.walk_camp), `add_manpower = -${N.walk_manpower}`, 'set_country_flag = zin_deep_walking',
      `set_country_flag = { flag = zin_deep_walked days = ${N.walk_once_days} }`)),
    remove: L('clr_country_flag = zin_deep_walking', 'zin_deep_walk_outcome = yes'),
    ai: aiBase(N.ai_walk_base, ['factor', 0, 'zin_deep_in_last_war = yes']) });
  E.zin_deep_walk_outcome = L('# The ice-walk\'s roll (6.4): a find, nothing, or losses. Kvittumm\'s guides, trained walkers and the ice giants\' counsel raise the odds.',
    B('random_list',
      B(String(N.walk_find), B('modifier', `add = ${N.walk_guides_bonus}`, flag('zin_deep_reindeer_guides')), B('modifier', `add = ${N.walk_guides_bonus}`, L(`original_tag = ${t.KVI}`, flag('zin_deep_guides_ready'))),
        B('modifier', `add = ${N.walk_trained_bonus}`, flag('zin_deep_walkers_trained')), B('modifier', `add = ${N.walk_breath_bonus}`, gflag('zin_deep_snow_breath')), 'zin_deep_ice_find = yes'),
      B(String(N.walk_nothing), ev(252)),
      B(String(N.walk_losses), B('modifier', `add = -${N.walk_guides_bonus}`, flag('zin_deep_reindeer_guides')), `add_manpower = -${N.walk_manpower}`, ev(253))));
  E.zin_deep_ice_find = L('# A find: the count of finds rises; the clans gather where it lies. A Cold Lands crown\'s third find in the Frozen Lands is the king\'s hall.',
    'add_to_variable = { zin_deep_finds = 1 }', 'add_to_variable = { zin_deep_finds_made = 1 }', 'set_country_flag = zin_deep_ice_open',
    B('random_owned_state', B('limit', OR('has_state_flag = zin_deep_site_frozen_lands', 'has_state_flag = zin_deep_site_far_ice'), NOT('has_dynamic_modifier = { modifier = zin_deep_ice_find }')),
      'add_dynamic_modifier = { modifier = zin_deep_ice_find }', 'set_variable = { global.zin_deep_last_find_state = THIS }'),
    IF(L('zin_deep_is_cold_crown = yes', `check_variable = { zin_deep_finds_made > ${N.hall_finds - 0.01} }`, NOT(gflag('zin_deep_hearth_found')), B('any_owned_state', 'has_state_flag = zin_deep_site_frozen_lands')),
      'set_global_flag = zin_deep_hearth_found', 'set_country_flag = zin_deep_hearth_stone', 'add_ideas = zin_deep_relic_hearth_stone', 'set_variable = { global.zin_deep_hearth_holder = THIS }',
      B('random_owned_state', B('limit', 'has_state_flag = zin_deep_site_frozen_lands'), 'set_variable = { global.zin_deep_hearth_state = THIS }'),
      IF(`original_tag = ${t.MLK}`, 'set_global_flag = zin_deep_hearth_melkgard'), ev(262), neighbours(262)),
    ELSE(ev(251)));
  dec('zin_deep_ice', { id: 'zin_deep_ask_for_guides', icon: 'herds', cost: N.guides_pp, cooldown: N.ask_cooldown_days,
    visible: L('zin_deep_is_ice_walker = yes', NOT(`original_tag = ${t.KVI}`), flag('zin_deep_ice_open'), exists(t.KVI), NOT(flag('zin_deep_reindeer_guides'))),
    available: L(`NOT = { has_war_with = ${t.KVI} }`, tt('zin_deep_tt_guides_refused', NOT(flag('zin_deep_guides_refused')))),
    effect: L(ett('zin_deep_ask_for_guides_tt'), `add_timed_idea = { idea = zin_deep_grain_for_clans days = ${N.grain_days} }`, hidden(to(t.KVI, ev(254)))), ai: aiBase(N.ai_ask_base) });
  dec('zin_deep_ice', { id: 'zin_deep_guides_to_the_old_halls', icon: 'ice_cavern', cost: N.guides_pp,
    visible: L(`original_tag = ${t.KVI}`, flag('zin_deep_ice_open'), NOT(flag('zin_deep_guides_ready'))),
    effect: L(ett('zin_deep_guides_to_the_old_halls_tt'), hidden('set_country_flag = zin_deep_guides_ready')), ai: aiBase(N.ai_ask_base + N.ai_ask_seeker) });
  for (const [id, kin, evid, flagName, icon] of [['zin_deep_carry_a_find_west', t.GNW, 256, 'zin_deep_find_west', 'courier_pilgrim'], ['zin_deep_carry_a_find_to_the_isles', t.ADE, 258, 'zin_deep_find_isles', 'ship_voyage']]) {
    const cheap = id.endsWith('west') ? 'zin_deep_kin_neck' : 'zin_deep_kin_sea';
    dec('zin_deep_ice', { id, icon, cost: N.carry_pp, cooldown: N.ask_cooldown_days,
      visible: L('zin_deep_is_ice_walker = yes', flag('zin_deep_ice_open'), NOT(flag(flagName)), exists(kin)),
      available: L(tt('zin_deep_tt_two_finds', `check_variable = { zin_deep_finds > ${N.carry_finds - 0.01} }`), `NOT = { has_war_with = ${kin} }`, tt('zin_deep_tt_find_refused', NOT(flag(`${flagName}_refused`)))),
      effect: L(ett(`${id}_tt`), hidden('add_to_variable = { zin_deep_finds = -1 }', IF(flag(cheap), `add_political_power = ${N.carry_kin_refund}`), to(kin, ev(evid)))),
      ai: aiBase(N.ai_ask_base, ['add', N.ai_ask_seeker, flag(cheap)]) });
  }
  E.zin_deep_check_three_names = L('# Scope: the finder. Both finds received: three peoples keep three names for one land (zin_deep.260).',
    IF(L(flag('zin_deep_find_west'), flag('zin_deep_find_isles'), NOT(flag('zin_deep_three_names'))), ev(260)));
  E.zin_deep_three_names_known = L('# zin_deep.260: Heulfaenn, Faenn-Cheulu and Heulofaennos are one land; the Boreal kin bonds; the art Sunfields Hull-Craft recovered for the three.',
    'set_country_flag = zin_deep_three_names', 'set_global_flag = zin_deep_three_names_known', 'set_country_flag = zin_deep_recovered_sunfields_hull_craft',
    IF(exists(t.GNW), both('ROOT', t.GNW, 'zin_opinion_boreal_kin'), to(t.GNW, 'set_country_flag = zin_deep_recovered_sunfields_hull_craft', ev(261))),
    IF(exists(t.ADE), both('ROOT', t.ADE, 'zin_opinion_boreal_kin'), to(t.ADE, 'set_country_flag = zin_deep_recovered_sunfields_hull_craft', ev(261))));
  for (const who of [t.CLD, t.MLK]) {
    dec('zin_deep_ice', { id: `zin_deep_the_sun_crown_${who.toLowerCase()}`, icon: 'crown_radiant', cost: N.sun_crown_pp,
      visible: L(`original_tag = ${who}`, 'zin_deep_holds_hearth_stone = yes', NOT(gflag('zin_deep_sun_crown_formed')), who === t.CLD ? flag('zin_deep_sun_crown_route') : ''),
      available: L(tt('zin_deep_tt_three_finds', `check_variable = { zin_deep_finds_made > ${N.hall_finds - 0.01} }`), tt('zin_deep_tt_three_names', flag('zin_deep_three_names')),
        tt('zin_deep_tt_neck_road', OR(NOT(exists(t.HOR)), `is_in_faction_with = ${t.HOR}`, to(t.HOR, 'is_subject_of = ROOT')))),
      effect: L(ett('zin_deep_the_sun_crown_tt'), `add_timed_idea = { idea = zin_deep_grain_for_clans days = ${N.grain_days} }`, hidden('set_cosmetic_tag = zin_cosmetic_heulfaenn', 'set_global_flag = zin_deep_sun_crown_formed',
        'set_country_flag = zin_deep_sun_crown', 'add_ideas = zin_deep_sun_crown_spirit', 'save_event_target_as = zin_deep_claimant', claimAll('zin_deep_free_steadings_states'),
        IF(exists(t.FEA), to(t.FEA, ev(263))), who === t.MLK ? IF(exists(t.CLD), opinion(t.CLD, 'ROOT', 'zin_opinion_sun_crown_usurped')) : '', ev(264), neighbours(264))),
      ai: who === t.MLK ? aiBase(N.ai_ambition_base, ['factor', 0, `has_war_with = ${t.CLD}`]) : aiBase(N.ai_ambition_base) });
  }

  // ---------------------------------------------------------------------------------------------- the monthly block (world runner)
  const oathYears = N.oath_years * 365;
  const tick = L('# zin_story_tick_deep: called by zin_story_tick on the world runner once a month (convention C6). ROOT is the runner; every block names its realms.',
    '# The Eldest Cairn: one stone in every year since the Night of the Sea.',
    IF('check_variable = { global.year > global.zin_deep_cairn_year }', 'set_variable = { global.zin_deep_cairn_year = global.year }', IF(NOT(gflag('zin_deep_count_scattered')), 'add_to_variable = { global.zin_deep_cairn_stones = 1 }')),
    '# Nets of Field-Stone: Orohaf\'s fishers, while it owns the low coasts.',
    IF(L(exists(t.ORH), to(t.ORH, B('any_owned_state', 'has_state_flag = zin_deep_site_nimlan_banks'), NOT(flag('zin_deep_nets_recent')))),
      to(t.ORH, B('random_list', B(String(N.nets_chance), B('modifier', `add = ${N.nets_chance}`, flag('zin_deep_nets_kept')), `set_country_flag = { flag = zin_deep_nets_recent days = ${N.nets_cooldown_days} }`, IF(flag('zin_deep_nets_kept'), ev(2)), ELSE(ev(1))), B(String(100 - N.nets_chance), '')))),
    '# The keepings taken by force (6.4): the Last Cord burns, the count is scattered, the queens\' divers refuse a master.',
    IF(L(NOT(gflag('zin_deep_cord_burned')), NOT(gflag('zin_deep_last_cord_hidden')), B(site('eldest_barrow'), NOT(`is_controlled_by = ${t.CUR}`), B('controller', `has_war_with = ${t.CUR}`))),
      'set_global_flag = zin_deep_cord_burned', 'set_global_flag = zin_deep_keeping_taken', IF(exists(t.CUR), to(t.CUR, 'clr_country_flag = zin_deep_keeps_cord')),
      B(site('eldest_barrow'), B('controller', 'save_event_target_as = zin_deep_taker', ev(15))),
      [t.CUR, t.BLO, t.HIR, t.ORH].map(x => IF(exists(x), opinion(x, 'event_target:zin_deep_taker', 'zin_opinion_keeping_taken'), to(x, ev(16)))),
      IF(L(exists(t.AEN), 'event_target:zin_deep_taker = { original_tag = ' + t.AEN + ' }'), [t.CUR, t.BLO].map(x => IF(exists(x), opinion(x, t.AEN, 'zin_opinion_drowned_inheritance'))))),
    IF(L(NOT(gflag('zin_deep_count_scattered')), B(site('eldest_cairn'), NOT(`is_controlled_by = ${t.HIR}`), B('controller', `has_war_with = ${t.HIR}`))),
      'set_global_flag = zin_deep_count_scattered', 'set_global_flag = zin_deep_keeping_taken', IF(exists(t.HIR), to(t.HIR, 'clr_country_flag = zin_deep_keeps_stone')),
      B(site('eldest_cairn'), B('controller', 'save_event_target_as = zin_deep_taker', ev(17))),
      [t.HIR, t.CUR, t.ORH].map(x => IF(exists(x), opinion(x, 'event_target:zin_deep_taker', 'zin_opinion_keeping_taken')))),
    IF(L(NOT(gflag('zin_deep_tide_broken')), exists(t.ORH), to(t.ORH, 'is_subject = yes')), 'set_global_flag = zin_deep_tide_broken'),
    '# The Cairn-Oath (6.4): broken at once by war, passage or a held state; kept long enough, it proves the seeker and may earn the dike-stones.',
    IF(exists(t.HIR), loop('zin_deep_oath_holders',
      IF(OR(`has_war_with = ${t.HIR}`, `has_military_access_to = ${t.HIR}`, B('any_controlled_state', `is_owned_by = ${t.HIR}`), 'exists = no'),
        'clr_country_flag = zin_deep_cairn_oath', 'set_country_flag = zin_deep_oath_broken', IF('exists = yes', opinion(t.HIR, 'PREV', 'zin_opinion_oath_broken'), ev(34))),
      ELSE('set_temp_variable = { zin_d_days = global.num_days }', 'subtract_from_temp_variable = { zin_d_days = zin_deep_oath_start }',
        IF(`check_variable = { zin_d_days > ${oathYears} }`, IF(NOT(gflag('zin_deep_oath_proven')), 'set_global_flag = zin_deep_oath_proven'),
          IF(L(gflag('zin_deep_count_spoken'), NOT(flag('zin_deep_dike_stones')), NOT(flag('zin_deep_stones_wait'))), to(t.HIR, ev(32))))))),
    B('for_each_loop', 'array = global.zin_deep_oath_holders', 'value = zin_d_holder', 'break = zin_d_break',
      IF(B('var:zin_d_holder', NOT(flag('zin_deep_cairn_oath'))), 'remove_from_array = { array = global.zin_deep_oath_holders value = zin_d_holder }', 'set_temp_variable = { zin_d_break = 1 }')),
    '# Aenor\'s scholars take up the question once the Lost Cause\'s scholar comes home from the edge.',
    IF(L(exists(t.AEN), exists(t.CUR), to(t.CUR, 'has_completed_focus = zin_regional_cursed_lands_a_scholar_at_the_edge'), to(t.AEN, NOT(flag('zin_deep_scholar_home')))),
      to(t.AEN, 'set_country_flag = zin_deep_scholar_home', 'zin_deep_open_low_country = yes', ev(18))),
    '# The almoners ask to copy the cords (A3 holds until the reveal).',
    IF(L(exists(t.CUR), to(t.CUR, 'has_completed_focus = zin_regional_cursed_lands_healers_from_outside', flag('zin_deep_keeps_cord'), NOT(flag('zin_deep_almoners_asked')))),
      to(t.CUR, 'set_country_flag = zin_deep_almoners_asked', ev(19))),
    IF(L(gflag('zin_deep_cords_copied'), gflag('zin_afrit_revealed'), NOT(gflag('zin_deep_copy_known')), exists(t.CUR)), 'set_global_flag = zin_deep_copy_known', to(t.CUR, ev(20))),
    '# The treaty of passage: broken by war on the elven shore, closed for this game if the coalition crosses with Alerhia in it.',
    IF(L(gflag('zin_deep_treaty_held'), B('var:global.zin_deep_treaty_holder', OR(`has_war_with = ${t.ELD}`, `has_war_with = ${t.LCC}`))),
      'clr_global_flag = zin_deep_treaty_held', 'set_global_flag = zin_deep_treaty_closed',
      B('var:global.zin_deep_treaty_holder', 'clr_country_flag = zin_deep_bridge_treaty', IF('has_idea = zin_deep_relic_treaty', 'remove_ideas = zin_deep_relic_treaty'), ev(62),
        [t.ELD, t.LCC].map(x => IF(exists(x), opinion(x, 'PREV', 'zin_opinion_treaty_broken'))))),
    IF(L(NOT(gflag('zin_deep_treaty_closed')), gflag('zin_eastern_invasion'), exists(t.ALR), to(t.ALR, flag('zin_east_coalition_member'))),
      'set_global_flag = zin_deep_treaty_closed', tell(t.ALR, 63), tell(t.ELD, 63),
      IF(gflag('zin_deep_treaty_held'), 'clr_global_flag = zin_deep_treaty_held', B('var:global.zin_deep_treaty_holder', 'clr_country_flag = zin_deep_bridge_treaty'))),
    IF(L(exists(t.ALR), to(t.ALR, flag('zin_east_coalition_member'), NOT(flag('zin_deep_joined_coalition')))), to(t.ALR, 'set_country_flag = zin_deep_joined_coalition')),
    '# The diadem worn: the envoy from Nafeher, the tribute war goals, and the fall when Volgan\'s body is destroyed.',
    IF(L('has_variable = global.zin_deep_diadem_wearer', B('var:global.zin_deep_diadem_wearer', 'exists = yes', flag('zin_deep_diadem_worn'), NOT(flag('zin_deep_envoy_came'))),
      OR(gflag('zin_volgan_marches'), `check_variable = { global.zin_gathering_dark > ${N.tribute_dark} }`), exists(t.PUV)),
      B('var:global.zin_deep_diadem_wearer', 'set_country_flag = zin_deep_envoy_came'), to(t.PUV, B('var:global.zin_deep_diadem_wearer', ev(105)))),
    IF(L('has_variable = global.zin_deep_diadem_wearer', exists(t.PUV), exists(t.AEN), to(t.PUV, `has_war_with = ${t.AEN}`)),
      B('var:global.zin_deep_diadem_wearer', IF(L('exists = yes', flag('zin_deep_old_tribute')),
        [t.HER, t.NOL].map(x => IF(L(exists(x), NOT(`has_war_with = ${x}`), NOT(flag(`zin_deep_tribute_goal_${x}`))), `set_country_flag = zin_deep_tribute_goal_${x}`, `create_wargoal = { type = puppet_wargoal_focus target = ${x} }`))))),
    IF(L('has_variable = global.zin_deep_diadem_wearer', exists(t.PUV), exists(t.AEN), to(t.PUV, `NOT = { has_war_with = ${t.AEN} }`)),
      B('var:global.zin_deep_diadem_wearer', [t.HER, t.NOL].map(x => IF(flag(`zin_deep_tribute_goal_${x}`), `clr_country_flag = zin_deep_tribute_goal_${x}`)))),
    IF(L('has_variable = global.zin_deep_diadem_wearer', gflag('zin_volgan_body_destroyed'), NOT(gflag('zin_deep_kalioth_fallen')), B('var:global.zin_deep_diadem_wearer', 'exists = yes', flag('zin_deep_old_tribute'))),
      'set_global_flag = zin_deep_kalioth_fallen', B('var:global.zin_deep_diadem_wearer', 'zin_deep_kalioth_falls = yes')),
    '# The Sea-Door: while it stands open, the deep may wake; once awake it spreads one state step a month until the door is sealed.',
    IF(L(gflag('zin_deep_door_open'), NOT(gflag('zin_deep_deep_awake')), B('var:global.zin_deep_door_opener', 'exists = yes')),
      B('var:global.zin_deep_door_opener', B('random_list',
        B(String(N.wake_chance), B('modifier', `add = -${N.wake_essence_relief}`, `has_fuel > ${N.wake_essence_stock}`), B('modifier', `add = -${N.wake_ward_relief}`, 'has_tech = zin_tech_lantern_wards'), 'zin_deep_wake = yes'),
        B(String(100 - N.wake_chance), '')))),
    IF(L(gflag('zin_deep_deep_awake'), `check_variable = { global.zin_deep_awake_states^num < ${N.wake_max_states} }`),
      'clear_array = global.zin_deep_awake_new',
      loop('zin_deep_awake_states', B('every_neighbor_state', B('limit', NOT('has_state_flag = zin_deep_awake')), 'set_state_flag = zin_deep_awake', 'add_to_array = { global.zin_deep_awake_new = THIS }')),
      loop('zin_deep_awake_new', 'add_dynamic_modifier = { modifier = zin_deep_the_deep_awake }', 'add_to_array = { global.zin_deep_awake_states = THIS }',
        B('owner', IF(L(NOT(flag('zin_deep_deep_reached')), NOT('tag = var:global.zin_deep_door_opener')), 'set_country_flag = zin_deep_deep_reached', ev(171), neighbours(171)))),
      IF(gflag('zin_deep_deep_crisis'), 'zin_deep_tell_the_deep = yes')),
    '# The Grey Breath: a chance each month to reach a neighbour\'s port; it passes when its season ends.',
    IF(L(gflag('zin_deep_breath_active'), gflag('zin_deep_grey_breath')),
      'clear_array = global.zin_deep_breath_new',
      loop('zin_deep_breath_states', B('random_list', B(String(N.breath_spread), B('random_neighbor_state', B('limit', 'is_coastal = yes', NOT('has_state_flag = zin_deep_breath')), 'add_to_array = { global.zin_deep_breath_new = THIS }')), B(String(100 - N.breath_spread), ''))),
      loop('zin_deep_breath_new', IF(NOT('has_state_flag = zin_deep_breath'), 'zin_deep_breath_state = yes'))),
    IF(L(gflag('zin_deep_breath_active'), NOT(gflag('zin_deep_grey_breath'))),
      'clr_global_flag = zin_deep_breath_active', loop('zin_deep_breath_states', 'remove_dynamic_modifier = { modifier = zin_deep_grey_breath }', 'clr_state_flag = zin_deep_breath'),
      'clear_array = global.zin_deep_breath_states', B('var:global.zin_deep_relighter', IF('exists = yes', ev(212)))),
    '# The ice: the first Long Light after a mild winter tells the walkers that the ice gives things back.',
    IF('zin_deep_long_light = yes', walkers.map(w => IF(L(exists(w), to(w, 'zin_deep_owns_ice_state = yes', NOT(flag('zin_deep_ice_open')), NOT(flag('zin_deep_ice_heard')))), to(w, 'set_country_flag = zin_deep_ice_heard', 'zin_deep_open_ice = yes', ev(250))))),
    '# The hearth-stone changes hands with the state where it is kept, when a Cold Lands crown takes that state.',
    IF(L(gflag('zin_deep_hearth_found'), B('var:global.zin_deep_hearth_state', B('owner', 'zin_deep_is_cold_crown = yes', NOT(flag('zin_deep_hearth_stone'))))),
      B('var:global.zin_deep_hearth_holder', IF('exists = yes', 'clr_country_flag = zin_deep_hearth_stone', IF('has_idea = zin_deep_relic_hearth_stone', 'remove_ideas = zin_deep_relic_hearth_stone'), ev(265))),
      B('var:global.zin_deep_hearth_state', B('owner', 'set_country_flag = zin_deep_hearth_stone', 'add_ideas = zin_deep_relic_hearth_stone', 'set_variable = { global.zin_deep_hearth_holder = THIS }',
        IF(`original_tag = ${t.MLK}`, 'set_global_flag = zin_deep_hearth_melkgard'), ev(265))), 'set_global_flag = zin_deep_hearth_changed_hands'),
    '# Achievement tracking: the Moot of Mothers must never take Parim.',
    IF(L(gflag('zin_deep_moot_formed'), NOT(gflag('zin_deep_moot_took_parim')), B('var:global.zin_deep_site_parim', B('controller', flag('zin_deep_moot_of_mothers')))), 'set_global_flag = zin_deep_moot_took_parim'));
  E.zin_story_tick_deep = tick;
  E.zin_deep_wake = L('# Scope: the opener. Something knocks: the deep wakes in the opener\'s door state and the sealing mission begins.',
    'set_global_flag = zin_deep_deep_awake', 'clear_array = global.zin_deep_awake_states',
    B('capital_scope', 'set_state_flag = zin_deep_awake', 'add_dynamic_modifier = { modifier = zin_deep_the_deep_awake }', 'add_to_array = { global.zin_deep_awake_states = THIS }'),
    'activate_mission = zin_deep_seal_the_door', ev(170), holds.map(h => IF(L(exists(h), NOT(`tag = ${h}`)), to(h, ev(170)))));
  E.zin_deep_kalioth_falls = L('# Scope: the wearer who paid the Old Tribute when Volgan\'s body is destroyed (zin_deep.108): the mine-lords rise, the crown\'s claims are lost.',
    'save_event_target_as = zin_deep_claimant', unclaimAll('zin_deep_plutondo_valley_states'), unclaimAll('zin_deep_miaed_passes_states'), unclaimAll('zin_deep_pornivior_road_states'),
    IF('has_idea = zin_deep_relic_diadem', 'remove_ideas = zin_deep_relic_diadem'), IF('has_idea = zin_deep_kalioth_crown_spirit', 'remove_ideas = zin_deep_kalioth_crown_spirit'),
    IF(flag('zin_deep_kalioth_crown'), 'drop_cosmetic_tag = yes', 'clr_country_flag = zin_deep_kalioth_crown'), 'clr_country_flag = zin_deep_diadem_worn',
    `add_timed_idea = { idea = zin_deep_mine_lords_rise days = ${N.rising_days} }`, B(site('kalioth_halls'), IF('is_owned_by = ROOT', `add_resistance = ${N.rising_resistance}`)), ev(108));

  // ---------------------------------------------------------------------------------------------- scripted localisation (the knowledge layers of the category names)
  const dt = (name, rows) => B('defined_text', `name = ${name}`, rows.map(([trig, key]) => B('text', trig ? B('trigger', trig) : '', `localization_key = ${key}`)));
  const sloc = [
    dt('GetDeepLowCountryTitle', [[OR('zin_deep_two_counts_done = yes', 'zin_deep_is_orran = yes'), 'zin_deep_cat_low_country_named'], [`original_tag = ${t.HIR}`, 'zin_deep_cat_low_country_stone'], [`original_tag = ${t.ORH}`, 'zin_deep_cat_low_country_tide'], [null, 'zin_deep_cat_low_country_plain']]),
    dt('GetDeepTwoShoresTitle', [[OR(flag('zin_deep_first_stair_read'), flag('zin_deep_bridge_treaty')), 'zin_deep_cat_two_shores_named'], [`original_tag = ${t.DLB}`, 'zin_deep_cat_two_shores_fair'], [tagIs(t.ELD, t.LCC), 'zin_deep_cat_two_shores_treaty'], [null, 'zin_deep_cat_two_shores_plain']]),
    dt('GetDeepKaliothTitle', [[flag('zin_deep_kalioth_shafts'), 'zin_deep_cat_kalioth_named'], [null, 'zin_deep_cat_kalioth_plain']]),
    dt('GetDeepSeaDoorsTitle', [[flag('zin_deep_door_read'), 'zin_deep_cat_sea_doors_named'], [null, 'zin_deep_cat_sea_doors_plain']]),
    dt('GetDeepSeaRoadsTitle', [[flag('zin_deep_square_known'), 'zin_deep_cat_sea_roads_named'], [null, 'zin_deep_cat_sea_roads_plain']]),
    dt('GetDeepIceTitle', [[flag('zin_deep_three_names'), 'zin_deep_cat_ice_named'], [null, 'zin_deep_cat_ice_plain']]),
  ];

  // ---------------------------------------------------------------------------------------------- achievements (6.12)
  const ach = [
    ['zin_ach_two_counts', tagIs(t.CUR, t.BLO, t.ORH, t.HIR, t.AEN), L('zin_deep_two_counts_done = yes', flag('zin_deep_dived_mound'), gflag('zin_deep_mothers_stone_raised'), 'zin_deep_has_cord = yes', 'zin_deep_has_stone = yes', 'zin_deep_has_tide = yes', NOT(gflag('zin_deep_keeping_taken')))],
    ['zin_ach_mothers_moot', tagIs(t.CUR, t.BLO), L(flag('zin_deep_moot_of_mothers'), NOT(gflag('zin_deep_river_names_spoken')), NOT(gflag('zin_deep_moot_took_parim')))],
    ['zin_ach_bridge_without_war', `original_tag = ${t.ALR}`, L(flag('zin_deep_bridge_kingdom'), NOT(flag('zin_deep_joined_coalition')), `date < ${N.ach_by_year}.1.1`)],
    ['zin_ach_diadem_melted', `original_tag = ${t.ERC}`, L(flag('zin_deep_melted_by_me'), gflag('zin_eastern_invasion'), `date > ${N.ach_by_year - 1}.12.31`, 'has_capitulated = no')],
    ['zin_ach_kalioth_restored', `original_tag = ${t.ERC}`, L(flag('zin_deep_kalioth_crown'), flag('zin_deep_old_tribute'), gflag('zin_volgan_body_destroyed'), NOT(gflag('zin_deep_kalioth_fallen')))],
    ['zin_ach_sea_is_the_seal', tagIs(holds), L(gflag('zin_deep_deep_king_chosen'), gflag('zin_deep_sea_sealed'), holds.map(exists), `date > ${N.ach_by_year - 1}.12.31`)],
    ['zin_ach_what_knocks', tagIs(holds), L(flag('zin_deep_deep_king'), flag('zin_deep_resealed_by_me'), NOT(gflag('zin_deep_deep_crisis')))],
    ['zin_ach_square_relit', tagIs(t.ADE, t.NND), L(flag('zin_deep_sea_roads'), flag('zin_deep_square_relit_by_me'), NOT(gflag('zin_deep_breath_ever')))],
    ['zin_ach_sun_crown', `original_tag = ${t.CLD}`, L(flag('zin_deep_sun_crown'), gflag('zin_western_crossing'), OR(NOT(exists(t.HOR)), `is_in_faction_with = ${t.HOR}`, to(t.HOR, 'is_subject_of = ROOT')), NOT(gflag('zin_deep_hearth_melkgard')))],
  ];
  const achievements = L(`unique_id = ${D.achievementsId}`, ach.map(([id, possible, happened]) => B(id, B('possible', 'has_start_date < 1748.3.2', possible), B('happened', happened))));

  const catVisible = { zin_deep_kalioth: OR(flag('zin_deep_kalioth_open'), B('AND', NOT(`original_tag = ${t.ERC}`), B(site('kalioth_halls'), 'is_owned_by = ROOT'))) };
  return { T, E, start, decisions, missions, catVisible, sloc: sloc.join('\n'), achievements, achievementIds: ach.map(a => a[0]), holds, walkers, isles, corsairs };
}

// ------------------------------------------------------------------------------------------------ events
// The event scripts (ids, pictures, audiences, option effects and AI); the texts are data/deep_past.json "events" keyed by id.
export function deepEvents(D, P) {
  const N = D.constants, t = P.t;
  const S = [];
  // e(id, picture, fired_by, options[], extra): options are [{ ai, effect?, trigger? }]; extra may hold requires, gate, descIf (conditions of the desc variants).
  const e = (id, picture, fired_by, options, extra = {}) => S.push({ id, picture, fired_by, options, ...extra });
  const ok = (ai = 1, effect) => ({ ai, effect });
  const callArg = (eff, arg, v) => [`set_temp_variable = { zin_arg_${arg} = ${v} }`, `${eff} = yes`];
  const share = k => [`set_temp_variable = { zin_arg_keeping = ${k} }`, 'zin_deep_share = yes', 'clear_variable = zin_arg_keeping'];
  const opin = (who, target, mod) => `${who} = { add_opinion_modifier = { target = ${target} modifier = ${mod} } }`;
  const lowPP = 'NOT = { has_political_power > 0 }';

  // Low Country: the nets, the counts of the keepers, the asks and answers
  e(1, 'generic_sea', 'zin_story_tick_deep (Orohaf, a chance each month while it owns the low coasts)', [ok(60, ['add_stability = 0.01']), ok(40, ['add_political_power = 10'])]);
  e(2, 'generic_sea', 'zin_story_tick_deep (Orohaf with Nets of Field-Stone Kept)', [ok(60, ['navy_experience = 5']), ok(40, ['add_stability = 0.01'])]);
  e(10, 'generic_wilds', 'zin_deep_cords_counted (the Cursed Lands\' focus What the Cords Count)', [ok(1, ['add_stability = 0.02'])], { gate: ['Muzerar'] });
  e(11, 'generic_wilds', 'zin_deep_cords_counted (to the Bloody Forest)', [ok(1)]);
  e(12, 'generic_wilds', 'zin_deep_show_last_cord (to the Bloody Forest and Aenor)', [ok(1)]);
  e(14, 'generic_wilds', 'zin_deep_cord_gift_asked (to the Cursed Lands)', [
    { ai: { base: 70, mods: [['add', 20, `has_opinion = { target = FROM value > 25 }`], ['factor', 0.2, `has_opinion = { target = FROM value < 0 }`]] }, effect: [...share(1), 'FROM = { country_event = { id = zin_deep.22 } }'] },
    { ai: 30, effect: ['FROM = { country_event = { id = zin_deep.23 } }'] },
    { ai: 5, trigger: ['has_idea = zin_deep_relic_last_cord'], effect: [...share(1), 'remove_ideas = zin_deep_relic_last_cord', 'FROM = { add_ideas = zin_deep_relic_last_cord country_event = { id = zin_deep.22 } }'] }]);
  e(15, 'generic_war', 'zin_story_tick_deep (to the realm whose army holds the eldest barrow)', [ok(1)]);
  e(16, 'generic_wilds', 'zin_story_tick_deep (to the Orran realms, Hirolon and Orohaf: the Cord burned)', [ok(1)]);
  e(17, 'generic_war', 'zin_story_tick_deep (to the realm whose army holds the Eldest Cairn)', [ok(1)]);
  e(18, 'generic_court', 'zin_story_tick_deep (to Aenor when the Cursed Lands have completed A Scholar at the Edge)', [ok(1, ['add_political_power = 15'])]);
  e(19, 'generic_wilds', 'zin_story_tick_deep (to the Cursed Lands after Healers from Outside)', [
    { ai: 55, effect: ['set_global_flag = zin_deep_cords_copied', 'add_stability = 0.03', `add_manpower = ${N.almoner_manpower}`] }, { ai: 45, effect: ['add_political_power = 15'] }],
    { descIf: [`has_global_flag = zin_afrit_revealed`] });
  e(20, 'unmasking', 'zin_story_tick_deep (to the Cursed Lands once the copy was made and Afrit is revealed)', [ok(1, ['add_stability = -0.02', 'add_war_support = 0.03'])], { requires: ['zin_afrit_revealed'] });
  e(21, 'generic_wilds', 'zin_deep_ask_cord_mothers (to the Cursed Lands)', [
    { ai: { base: 50, mods: [['add', 30, 'has_opinion = { target = FROM value > 25 }'], ['factor', 0.1, 'has_opinion = { target = FROM value < -10 }'], ['factor', 0, 'FROM = { has_war_with = ROOT }']] }, effect: [...share(1), 'FROM = { country_event = { id = zin_deep.22 } }'] },
    { ai: 50, effect: [`FROM = { set_country_flag = { flag = zin_deep_cord_refused days = ${N.ask_refused_days} } }`, opin('FROM', 'ROOT', 'zin_opinion_keeping_refused'), 'FROM = { country_event = { id = zin_deep.23 } }'] }]);
  e(22, 'hermitage', 'zin_deep.21 and zin_deep.14 (the cord-mothers say yes)', [ok(1)]);
  e(23, 'hermitage', 'zin_deep.21 and zin_deep.14 (the cord-mothers say no)', [ok(1)]);
  e(24, 'generic_wilds', 'zin_deep_ask_cairn_keepers (to Hirolon)', [
    { ai: { base: 10, mods: [['add', 60, 'has_global_flag = zin_deep_count_spoken'], ['factor', 0, 'has_global_flag = zin_deep_silence_kept']] },
      effect: [...share(2), 'FROM = { set_country_flag = zin_deep_cairn_oath set_variable = { zin_deep_oath_start = global.num_days } }', 'add_to_array = { global.zin_deep_oath_holders = FROM }', 'FROM = { country_event = { id = zin_deep.25 } }'] },
    { ai: 50, effect: [`FROM = { set_country_flag = { flag = zin_deep_stone_refused days = ${N.oath_years * 365} } }`, 'FROM = { country_event = { id = zin_deep.26 } }'] }]);
  e(25, 'hermitage', 'zin_deep.24 (the cairn-keepers say yes)', [ok(1)]);
  e(26, 'hermitage', 'zin_deep.24 (the cairn-keepers say no)', [ok(1)]);
  e(27, 'generic_sea', 'zin_deep_ask_isle_houses (to Orohaf)', [
    { ai: { base: 40, mods: [['add', 40, `FROM = { original_tag = ${t.AEN} } NOT = { has_global_flag = zin_golden_king_dead }`], ['add', 20, 'has_opinion = { target = FROM value > 25 }'], ['factor', 0, 'FROM = { has_war_with = ROOT }']] },
      effect: [...share(3), 'FROM = { country_event = { id = zin_deep.28 } }'] },
    { ai: 40, effect: [`FROM = { set_country_flag = { flag = zin_deep_tide_refused days = ${N.ask_refused_days} } }`, 'FROM = { country_event = { id = zin_deep.29 } }'] }]);
  e(28, 'houses', 'zin_deep.27 (the isle houses say yes)', [ok(1)]);
  e(29, 'houses', 'zin_deep.27 (the isle houses say no)', [ok(1)]);
  e(30, 'hermitage', 'zin_deep_check_two_counts (a realm holding the Cord and the Stone)', [ok(1, ['zin_deep_chart_low_country = yes'])], { gate: ['Muzerar'] });
  e(31, 'hermitage', 'zin_deep_chart_low_country (to the keepers whose counts were brought together)', [ok(1)]);
  e(32, 'generic_wilds', 'zin_story_tick_deep (to Hirolon when a seeker has kept the Cairn-Oath long enough)', [
    { ai: 80, effect: ['FROM = { set_country_flag = zin_deep_dike_stones set_country_flag = zin_deep_recovered_dike_craft add_ideas = zin_deep_relic_dike_stones country_event = { id = zin_deep.33 } }'] },
    { ai: 20, effect: ['FROM = { set_country_flag = { flag = zin_deep_stones_wait days = 365 } }'] }]);
  e(33, 'hermitage', 'zin_deep.32 (the dike-stones given)', [ok(1)]);
  e(34, 'generic_wilds', 'zin_story_tick_deep (to a realm that broke the Cairn-Oath)', [ok(1)]);
  e(35, 'generic_sea', 'zin_deep_raise_mothers_stone (the diver)', [ok(1)]);
  e(36, 'generic_sea', 'zin_deep_dive_outcome (the hall-door found)', [ok(1)]);
  e(37, 'generic_sea', 'zin_deep_dive_outcome (the divers lost)', [ok(1)]);
  e(38, 'houses', 'zin_deep_dive_outcome (mourning at Borrak, to Orohaf)', [ok(1, ['add_war_support = 0.01'])]);
  e(39, 'generic_sea', 'zin_deep_dive_outcome (a minor report to Hirolon and the neighbours of Orohaf)', [ok(1)]);
  e(40, 'houses', 'zin_deep_queens_rite (Orohaf\'s focus The Queens\' Rite)', [
    { ai: { base: 70, mods: [['factor', 0.1, `has_global_flag = zin_golden_king_dead has_opinion = { target = ${t.AEN} value < 0 }`]] }, trigger: [`country_exists = ${t.AEN}`],
      effect: [`${t.AEN} = { set_country_flag = zin_deep_shared_tide zin_deep_open_low_country = yes country_event = { id = zin_deep.41 } zin_deep_check_two_counts = yes }`, `add_opinion_modifier = { target = ${t.AEN} modifier = zin_opinion_keeping_given }`, opin(t.AEN, 'ROOT', 'zin_opinion_keeping_given')] },
    { ai: { base: 30, mods: [['add', 50, `has_global_flag = zin_golden_king_dead has_opinion = { target = ${t.AEN} value < 0 }`]] },
      effect: [t.CUR, t.BLO].map(x => `if = { limit = { country_exists = ${x} } ${x} = { set_country_flag = zin_deep_shared_tide zin_deep_open_low_country = yes country_event = { id = zin_deep.41 } zin_deep_check_two_counts = yes } add_opinion_modifier = { target = ${x} modifier = zin_opinion_keeping_given } }`) }]);
  e(41, 'generic_sea', 'zin_deep.40 (the Tide given)', [ok(1)]);
  e(42, 'generic_wilds', 'zin_deep_moot_of_mothers_* (to the other Orran realm)', [
    { ai: { base: 60, mods: [['add', 30, 'has_opinion = { target = FROM value > 50 }'], ['factor', 0.2, 'has_opinion = { target = FROM value < 0 }']] }, effect: ['FROM = { annex_country = { target = ROOT transfer_troops = yes } zin_deep_form_moot = yes }'] },
    { ai: 40, effect: [`FROM = { add_stability = -${N.moot_refused_stability} }`] }], { gate: ['Muzerar'] });
  e(43, 'generic_court', 'zin_deep_form_moot (the formed realm and its neighbours)', [ok(1)], { gate: ['Muzerar'] });
  e(44, 'generic_court', 'zin_deep_speak_river_names (to Aenor)', [ok(1)]);
  e(45, 'generic_sea', 'zin_deep_crossing_banks (the crossing leader: a share of the first sailing aground on the low fields)', [ok(1)]);
  // Two Shores
  e(50, 'generic_court', 'zin_deep_read_first_stair (Alerhia\'s focus)', [ok(1, ['add_political_power = 25'])], { gate: ['Tarkia'] });
  e(51, 'generic_court', 'zin_deep_ask_ferry_leave (to Luv-zhise)', [
    { ai: { base: 50, mods: [['add', 100, 'has_country_flag = zin_deep_ferry_leave'], ['factor', 0, 'FROM = { has_war_with = ROOT }'], ['factor', 0.3, 'has_opinion = { target = FROM value < 0 }']] }, effect: ['FROM = { set_country_flag = zin_deep_luv_leave country_event = { id = zin_deep.52 } }', 'add_political_power = 25'] },
    { ai: 30, effect: [`FROM = { set_country_flag = { flag = zin_deep_leave_refused days = ${N.ask_refused_days} } country_event = { id = zin_deep.52 } }`] }]);
  e(52, 'generic_peace', 'zin_deep.51 and zin_deep.55 (the answer)', [ok(1)], { descIf: ['OR = { has_country_flag = zin_deep_luv_leave has_country_flag = zin_deep_delbiz_leave }'] });
  e(53, 'generic_wilds', 'zin_deep_stones_under_the_caps (the western gate cleared; the digger and the gate state\'s neighbours)', [ok(1)]);
  e(54, 'generic_wilds', 'zin_deep_stones_under_the_caps (the Spore Summer)', [ok(1)]);
  e(55, 'generic_court', 'zin_deep_ask_fair_consent (to Delbiz)', [
    { ai: { base: 50, mods: [['add', 100, 'has_country_flag = zin_deep_fair_consent'], ['add', 20, 'has_opinion = { target = FROM value > 25 }'], ['factor', 0, 'FROM = { has_war_with = ROOT }']] }, effect: ['FROM = { set_country_flag = zin_deep_delbiz_leave country_event = { id = zin_deep.52 } }'] },
    { ai: 30, effect: [`FROM = { set_country_flag = { flag = zin_deep_leave_refused days = ${N.ask_refused_days} } country_event = { id = zin_deep.52 } }`] }]);
  e(57, 'generic_wilds', 'zin_deep_pillars_of_the_fair (the eastern gate cleared; the digger and the gate state\'s neighbours)', [ok(1)]);
  e(58, 'generic_court', 'zin_deep_check_gate_stones (to Alerhia)', [ok(1, ['add_ideas = zin_deep_relic_gate_stones', 'set_country_flag = zin_deep_recovered_stair_builders_measure'])], { gate: ['Tarkia'] });
  e(59, 'generic_peace', 'zin_deep_raise_the_bridge_road (the builder)', [ok(1)]);
  e(60, 'generic_peace', 'zin_deep_ask_the_archive (to Eldafaen)', [
    { ai: { base: 40, mods: [['add', 50, 'has_country_flag = zin_deep_treaty_willing'], ['factor', 0, 'FROM = { has_country_flag = zin_east_coalition_member }'], ['factor', 0, 'FROM = { has_government = fascism }']] },
      effect: ['FROM = { set_country_flag = zin_deep_bridge_treaty set_country_flag = zin_deep_recovered_stair_builders_measure add_ideas = zin_deep_relic_treaty }', 'set_variable = { global.zin_deep_treaty_holder = FROM }', 'set_global_flag = zin_deep_treaty_held',
        'add_opinion_modifier = { target = FROM modifier = zin_opinion_bridge_treaty }', opin('FROM', 'ROOT', 'zin_opinion_bridge_treaty'),
        `if = { limit = { country_exists = ${t.LCC} } ${t.LCC} = { add_opinion_modifier = { target = FROM modifier = zin_opinion_bridge_treaty } } FROM = { add_opinion_modifier = { target = ${t.LCC} modifier = zin_opinion_bridge_treaty } } }`,
        'FROM = { country_event = { id = zin_deep.61 } }'] },
    { ai: 50, effect: [`FROM = { set_country_flag = { flag = zin_deep_archive_refused days = ${N.ask_refused_days} } country_event = { id = zin_deep.61 } }`] }]);
  e(61, 'hermitage', 'zin_deep.60 (the Archive\'s answer)', [ok(1)], { descIf: ['has_country_flag = zin_deep_bridge_treaty'] });
  e(62, 'generic_war', 'zin_story_tick_deep (the treaty broken by war on the elven shore)', [ok(1)]);
  e(63, 'generic_war', 'zin_story_tick_deep (the coalition crosses with Alerhia in it: the Archive closes the treaty)', [ok(1)]);
  e(64, 'generic_court', 'zin_deep_bridge_kingdom (Alerhia and its neighbours)', [ok(1)], { gate: ['Tarkia'] });
  // Kalioth
  e(100, 'generic_wilds', 'zin_deep_open_the_old_shafts (Erco: the wall found; the court decides through its focuses)', [ok(1)], { gate: ['Rhabtarkia'] });
  e(101, 'generic_wilds', 'zin_deep_open_the_old_shafts (any other owner of the Kalioth state: the diadem\'s fate)', [
    { ai: N.ai_wall, effect: callArg('zin_deep_diadem_fate', 'way', 1) },
    { ai: { base: N.ai_melt, mods: [['add', 25, `has_opinion = { target = ${t.ALR} value > 49 }`]] }, effect: callArg('zin_deep_diadem_fate', 'way', 2) },
    { ai: { base: 0, mods: [['add', N.ai_wear_dominion, `has_government = fascism check_variable = { global.zin_gathering_dark > ${N.ai_wear_dark} } NOT = { has_war_with = ${t.PUV} }`]] }, effect: callArg('zin_deep_diadem_fate', 'way', 3) }], { gate: ['Rhabtarkia'] });
  e(102, 'generic_war', 'zin_deep_diadem_fate way 3 (to Alerhia, Plutondo and Miaed)', [ok(1)]);
  e(103, 'generic_peace', 'zin_deep_diadem_fate way 2 (to Alerhia)', [ok(1)]);
  e(105, 'southern_warning', 'zin_story_tick_deep (the envoy from Nafeher, to the wearer)', [
    { ai: { base: 30, mods: [['add', 40, 'has_government = fascism'], ['factor', 0, 'has_war_with = FROM']] },
      effect: [`add_equipment_to_stockpile = { type = convoy amount = -${N.tribute_convoys} }`, `add_equipment_to_stockpile = { type = zin_arms_equipment amount = -${N.tribute_equipment} }`, 'set_country_flag = zin_deep_old_tribute', 'FROM = { country_event = { id = zin_deep.106 } }'] },
    { ai: { base: 70, mods: [['factor', 0.3, 'has_government = fascism']] }, effect: [opin('FROM', 'ROOT', 'zin_opinion_tribute_refused'), 'FROM = { country_event = { id = zin_deep.106 } }'] }]);
  e(106, 'generic_war', 'zin_deep.105 (the answer, to Volgan\'s realm)', [ok(1)], { descIf: ['FROM = { has_country_flag = zin_deep_old_tribute }'] });
  e(107, 'generic_court', 'zin_deep_demand_old_tribute (to the holder of a Kalioth land)', [
    { ai: { base: 30, mods: [['add', 40, 'FROM = { num_divisions > 30 }']] }, effect: [`add_political_power = -${N.tribute_paid_pp}`, `FROM = { add_political_power = ${N.tribute_paid_pp} }`] },
    { ai: 70, effect: ['FROM = { create_wargoal = { type = puppet_wargoal_focus target = ROOT } }'] }], { gate: ['Rhabtarkia'] });
  e(108, 'volgan_broken', 'zin_deep_kalioth_falls (the wearer, when Volgan\'s body is destroyed)', [ok(1)], { requires: ['zin_volgan_body_destroyed'] });
  e(109, 'generic_court', 'zin_deep_kalioth_crown (Erco and its neighbours)', [ok(1)], { gate: ['Rhabtarkia'] });
  e(110, 'generic_wilds', 'zin_deep_glacier_road (Erco\'s focus The Glacier Road)', [ok(1, ['army_experience = 10'])]);
  // Sea-Doors
  e(150, 'generic_wilds', 'zin_deep_read_door (the hold that reads its door)', [ok(1)], { gate: ['Gromatrak'] });
  e(151, 'generic_wilds', 'zin_deep_read_door (to the other holds)', [ok(1)]);
  e(152, 'generic_court', 'zin_deep_settle_the_old_blame (to a western hold)', [
    { ai: { base: 60, mods: [['add', 20, `has_opinion = { target = ${t.KUN} value > 0 }`]] }, effect: ['zin_deep_blame_answered = yes', `${t.KUN} = { country_event = { id = zin_deep.153 } }`] },
    { ai: 40, effect: [`${t.KUN} = { country_event = { id = zin_deep.153 } }`] }]);
  e(153, 'generic_peace', 'zin_deep.152 (a western hold\'s answer, to Kunhrim)', [ok(1)], { descIf: ['FROM = { has_country_flag = zin_deep_blame_answered }'] });
  e(154, 'generic_court', 'zin_deep_yield_the_old_blame (to Kunhrim)', [ok(1)]);
  e(155, 'generic_court', 'zin_deep_call_the_road_moot (to the other holds)', [
    { ai: { base: 70, mods: [['add', 20, 'has_opinion = { target = FROM value > 25 }'], ['factor', 0.3, 'has_opinion = { target = FROM value < 0 }']] }, effect: callArg('zin_deep_moot_answer', 'came', 1) },
    { ai: 30, effect: callArg('zin_deep_moot_answer', 'came', 0) }]);
  e(156, 'generic_court', 'zin_deep_moot_answer (to the four holds: the moot sits or fails)', [ok(1)], { descIf: ['has_global_flag = zin_deep_road_moot'], gate: ['Gromatrak'] });
  e(157, 'generic_court', 'zin_deep_a_deep_king_again (the vote, to each hold)', [
    { ai: { base: 50, mods: [['add', 30, 'var:global.zin_deep_moot_caller = { tag = ROOT }']] }, effect: callArg('zin_deep_cast_vote', 'caller', 1) },
    { ai: { base: 50, mods: [['add', 30, 'var:global.zin_deep_largest_hold = { tag = ROOT }']] }, effect: callArg('zin_deep_cast_vote', 'caller', 0) }], { gate: ['Gromatrak'] });
  e(158, 'generic_court', 'zin_deep_crown_deep_king (to the four holds)', [ok(1)], { gate: ['Gromatrak'] });
  e(159, 'generic_peace', 'zin_deep_swear_seal (to the four holds)', [ok(1)]);
  const roadEnd = h => ({ ai: 10, trigger: [`country_exists = ${h}`, `NOT = { tag = ${h} }`], effect: [`${h} = { save_event_target_as = zin_deep_road_end }`, 'zin_deep_door_opened = yes'] });
  e(160, 'generic_wilds', 'zin_deep_open_the_sea_door (the Deep King\'s hold: the road\'s other end)', [t.KUN, t.HRA, t.BRU, t.GRO].map(roadEnd));
  e(161, 'generic_war', 'zin_deep_door_opened (to the other holds)', [ok(1)]);
  e(170, 'generic_war', 'zin_deep_wake (to the opener and the holds)', [ok(1)]);
  e(171, 'generic_war', 'zin_story_tick_deep (a realm the deep reaches, and its neighbours)', [ok(1)]);
  e(172, 'generic_peace', 'zin_deep_reseal (to the holds)', [ok(1)]);
  e(173, 'generic_war', 'zin_deep_tell_the_deep (the regional crisis, to the holds and the realms the deep has reached)', [ok(1)]);
  // Sea-Roads
  e(200, 'generic_sea', 'zin_deep_read_league_charts (Adel\'s focus)', [ok(1, ['navy_experience = 10'])], { gate: ['Margorodai'] });
  e(201, 'generic_sea', 'zin_deep_read_league_charts (to the Lens)', [ok(1)]);
  e(202, 'generic_sea', 'zin_deep_buy_the_square (to Benan)', [
    { ai: { base: 40, mods: [['add', 100, 'has_country_flag = zin_deep_square_for_sale'], ['factor', 0, 'has_country_flag = zin_deep_square_nobodys']] }, effect: [`add_political_power = ${N.square_price_pp}`, 'FROM = { set_country_flag = zin_deep_square_open country_event = { id = zin_deep.203 } }'] },
    { ai: 60, effect: [`FROM = { set_country_flag = { flag = zin_deep_benan_refused days = ${N.ask_refused_days} } country_event = { id = zin_deep.203 } }`] }]);
  e(203, 'generic_court', 'zin_deep.202 and zin_deep.204 (Benan\'s answer)', [ok(1)], { descIf: ['has_country_flag = zin_deep_square_open'] });
  e(204, 'generic_sea', 'zin_deep_benan_into_the_charter (to Benan)', [
    { ai: { base: 20, mods: [['add', 40, 'has_opinion = { target = FROM value > 25 }'], ['factor', 0, 'has_country_flag = zin_deep_square_nobodys'], ['factor', 0, 'is_in_faction = yes']] },
      effect: ['if = { limit = { FROM = { is_faction_leader = yes } is_in_faction = no } FROM = { add_to_faction = ROOT } }', 'FROM = { set_country_flag = zin_deep_square_open country_event = { id = zin_deep.203 } }'] },
    { ai: 80, effect: [`FROM = { set_country_flag = { flag = zin_deep_benan_refused days = ${N.ask_refused_days} } country_event = { id = zin_deep.203 } }`] }]);
  e(206, 'generic_sea', 'zin_deep_ask_the_lamp (to the Lens)', [
    { ai: { base: 70, mods: [['factor', 0, 'FROM = { NOT = { zin_deep_charter_member = yes } }']] }, effect: ['FROM = { set_country_flag = zin_deep_lamp_lent country_event = { id = zin_deep.207 } }'] },
    { ai: 30, effect: ['FROM = { country_event = { id = zin_deep.207 } }'] }]);
  e(207, 'generic_peace', 'zin_deep.206 (the Lens\'s answer)', [ok(1)], { descIf: ['has_country_flag = zin_deep_lamp_lent'] });
  e(208, 'generic_sea', 'zin_deep_relight_done (the relighter)', [ok(1)], { gate: ['Margorodai', 'Halgohavnai'] });
  e(209, 'generic_sea', 'zin_deep_square_relit (to the chart-houses and the corsair isles)', [ok(1)]);
  e(210, 'generic_wilds', 'zin_deep_breath_start (the relighter)', [ok(1)]);
  e(211, 'generic_wilds', 'zin_deep_breath_state (a realm whose port the Grey Breath reaches)', [ok(1)]);
  e(212, 'generic_peace', 'zin_story_tick_deep (the Grey Breath passes, to the relighter)', [ok(1)]);
  e(213, 'generic_sea', 'zin_deep_crowns_route_to_the_isles (to Raerby and Seite)', [
    { ai: { base: 20, mods: [['add', 30, 'has_country_flag = zin_deep_banks_court'], ['factor', 0, 'has_country_flag = zin_deep_fathers_refuse']] }, effect: callArg('zin_deep_crown_answer', 'aye', 1), trigger: ['NOT = { has_country_flag = zin_deep_fathers_refuse }'] },
    { ai: 80, effect: callArg('zin_deep_crown_answer', 'aye', 0) }]);
  e(214, 'generic_sea', 'zin_deep_crown_answer (to Nondondor)', [ok(1)], { descIf: ['has_country_flag = zin_deep_crown_route_agreed'] });
  e(215, 'generic_court', 'the Sea-Roads proclaimed (the leader and the isles)', [ok(1)], { gate: ['Margorodai'] });
  // Ice
  e(250, 'generic_wilds', 'zin_story_tick_deep (the first Long Light, to the Cold Lands walkers)', [ok(1)]);
  e(251, 'generic_wilds', 'zin_deep_ice_find (a find)', [ok(1, ['add_stability = 0.01'])], { descIf: ['check_variable = { zin_deep_finds_made < 1.5 }'] });
  e(252, 'generic_wilds', 'zin_deep_walk_outcome (nothing)', [ok(1)]);
  e(253, 'generic_wilds', 'zin_deep_walk_outcome (losses)', [ok(1)]);
  e(254, 'generic_wilds', 'zin_deep_ask_for_guides (to Kvittumm)', [
    { ai: { base: 60, mods: [['add', 20, 'has_opinion = { target = FROM value > 25 }'], ['factor', 0, 'FROM = { has_war_with = ROOT }']] }, effect: [`FROM = { set_country_flag = { flag = zin_deep_reindeer_guides days = ${N.guides_days} } country_event = { id = zin_deep.255 } }`, 'add_political_power = 15'] },
    { ai: 40, effect: [`FROM = { set_country_flag = { flag = zin_deep_guides_refused days = ${N.ask_refused_days} } country_event = { id = zin_deep.255 } }`] }]);
  e(255, 'hermitage', 'zin_deep.254 (Kvittumm\'s answer)', [ok(1)], { descIf: ['has_country_flag = zin_deep_reindeer_guides'] });
  e(256, 'generic_wilds', 'zin_deep_carry_a_find_west (to Gunwyn)', [
    { ai: { base: 50, mods: [['add', 100, 'has_country_flag = zin_deep_kin_in_ice'], ['add', 20, 'has_opinion = { target = FROM value > 25 }'], ['factor', 0, 'has_war_with = FROM']] }, effect: ['FROM = { set_country_flag = zin_deep_find_west country_event = { id = zin_deep.257 } zin_deep_check_three_names = yes }'] },
    { ai: 30, effect: [`FROM = { set_country_flag = { flag = zin_deep_find_west_refused days = ${N.ask_refused_days} } country_event = { id = zin_deep.257 } }`] }]);
  e(257, 'generic_peace', 'zin_deep.256 (Gunwyn\'s answer)', [ok(1)], { descIf: ['has_country_flag = zin_deep_find_west'] });
  e(258, 'generic_sea', 'zin_deep_carry_a_find_to_the_isles (to Adel)', [
    { ai: { base: 50, mods: [['add', 20, 'has_opinion = { target = FROM value > 25 }'], ['factor', 0, 'has_war_with = FROM']] }, effect: ['FROM = { set_country_flag = zin_deep_find_isles country_event = { id = zin_deep.259 } zin_deep_check_three_names = yes }'] },
    { ai: 30, effect: [`FROM = { set_country_flag = { flag = zin_deep_find_isles_refused days = ${N.ask_refused_days} } country_event = { id = zin_deep.259 } }`] }]);
  e(259, 'generic_peace', 'zin_deep.258 (Adel\'s answer)', [ok(1)], { descIf: ['has_country_flag = zin_deep_find_isles'] });
  e(260, 'generic_wilds', 'zin_deep_check_three_names (the finder)', [ok(1, ['zin_deep_three_names_known = yes'])], { gate: ['Heulfaenn', 'Faenn-Cheulu', 'Heulofaennos', 'Heulufaenn'] });
  e(261, 'generic_peace', 'zin_deep_three_names_known (to Gunwyn and Adel)', [ok(1)], { gate: ['Heulfaenn', 'Faenn-Cheulu', 'Heulofaennos'] });
  e(262, 'generic_wilds', 'zin_deep_ice_find (the third find: the king\'s hall; and the finder\'s neighbours)', [ok(1)]);
  e(263, 'generic_war', 'the Sun Crown (to Fearno)', [ok(1, ['add_war_support = 0.05'])]);
  e(264, 'generic_court', 'the Sun Crown proclaimed (the crown and its neighbours)', [ok(1)], { gate: ['Heulfaenn'] });
  e(265, 'generic_wilds', 'zin_story_tick_deep (the hearth-stone changes hands)', [ok(1)]);
  return S;
}
