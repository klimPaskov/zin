// Institutions, trade group (spec 03_gameplay/08_institutions.md sections 4 and 5): the AI side of the Great Fairs and
// of Sending Arms. The market, licence and lend-lease machinery is the engine's; the equipment fields (`can_license`,
// `lend_lease_cost`, `can_be_lend_leased`) are written by the warfare module from the tables exported here, and the
// one define that must change goes to defines.json through the integration note.
import { HEADER, block, lines, countryKey } from './inst_util.mjs';

const strategy = (type, id, value, extra = '') => block('ai_strategy', lines(`type = ${type}`, id !== undefined ? `id = ${id}` : '', extra, `value = ${value}`));

// The market strategies: sell what is in surplus, buy only when frightened, never put hulls or granted gear on a stall.
export function marketStrategies(data) {
  const m = data.core.market, sell = [], buy = [];
  for (const e of m.forSale) sell.push(strategy('equipment_market_for_sale_threshold', e.id, e.threshold), strategy('equipment_market_min_for_sale', e.id, e.min));
  for (const id of m.neverForSale) sell.push(strategy('equipment_market_for_sale_threshold', id, 1000000));
  for (const e of m.buying) buy.push(strategy('equipment_market_buying_threshold', e.id, e.threshold));
  buy.push(strategy('equipment_market_spend_factories', undefined, m.spendWorkshops));
  return [
    block('zin_inst_market_sell', lines('enable = { always = yes }', 'abort_when_not_enabled = yes', ...sell)),
    block('zin_inst_market_buy', lines(block('enable', `check_variable = { global.zin_gathering_dark > ${m.buyWhenDarkAbove - 1} }`), 'abort_when_not_enabled = yes', ...buy)),
  ];
}

// An overlord sends arms to its subjects willingly (tribute in arms); the strategy is one per subject, enabled for
// the overlord, because the strategy type names the receiving country.
export function lendStrategies(data, countries) {
  const byName = new Map(countries.map(c => [c.name, c])), out = [];
  for (const s of countries.filter(c => c.overlord)) {
    const lord = byName.get(s.overlord);
    if (!lord) throw new Error(`Overlord ${s.overlord} of ${s.name} is not in the roster`);
    out.push(block(`zin_inst_lend_${countryKey(s)}`, lines(block('enable', `original_tag = ${lord.tag}`), 'abort_when_not_enabled = yes', strategy('send_lend_lease_desire', s.tag, data.core.lend.overlordDesire))));
  }
  return out;
}

export function tradeStrategies(data, countries) {
  return { text: [...marketStrategies(data), ...lendStrategies(data, countries)], counts: { market: 2, lend: countries.filter(c => c.overlord).length } };
}

// Licence and lend-lease tables for warfare's equipment files (section 5), as a per-archetype answer.
export function equipmentRights(data) {
  const L = data.core.licences, W = data.core.lend, rows = {};
  for (const id of L.yes) rows[id] = { can_license: true };
  for (const id of L.no) rows[id] = { can_license: false };
  for (const id of Object.keys(rows)) {
    const lendable = !W.notLendable.includes(id) && !(rows[id].can_license === false);
    rows[id].can_be_lend_leased = lendable ? 'zin_inst_lend_ok' : 'never';
    rows[id].lend_lease_cost = lendable ? (W.weights[id] ?? 1) : 0;
  }
  return rows;
}
export const TRADE_HEADER = HEADER;
