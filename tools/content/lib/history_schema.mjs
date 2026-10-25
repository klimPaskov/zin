// Schema of the regional history files (tools/content/data/world/history/<region>.json), written under owner decisions
// L1 to L3 (docs/specs/INTEGRATION_DECISIONS.md): invented history is allowed and labelled `proposed`; the vault's
// established facts are `established`; nothing here contradicts the vault or closes an open question.
// validateHistory(file) returns a list of problem strings (empty when the file is valid).

export const CANON = ['established', 'proposed'];
export const ROLES = ['capital', 'port', 'fortress', 'market', 'holy', 'ruin', 'town', 'mine', 'farm', 'academy', 'shrine', 'pass', 'crossing'];
export const POP_CLASSES = ['hamlet', 'village', 'town', 'city', 'great_city'];

const isStr = v => typeof v === 'string' && v.trim().length > 0;
const isYear = v => Number.isInteger(v);
const arr = v => Array.isArray(v);

// Banned shapes of invented text: placeholders and separators in names. Modern words are checked by the build's text scan.
const BAD_NAME = /[\/\\|_]|\d|\b(TODO|TBD|FIXME|placeholder|lorem)\b/i;

function checkLabel(problems, where, entry) {
  if (!CANON.includes(entry.canon)) problems.push(`${where}: canon must be one of ${CANON.join(', ')}`);
}

// Owner decision K64: an age or an event older than the numbered years carries year 0 and `beforeAen`, a whole number of years before
// 1A 1 that orders it; the game shows such a date only as "long before Aen", so an entry with a written date writes exactly that.
export const BEFORE_AEN_TEXT = 'long before Aen';
function checkBeforeAen(problems, where, entry, yearZero, date) {
  if (entry.beforeAen === undefined) return;
  if (!Number.isInteger(entry.beforeAen) || entry.beforeAen < 1) problems.push(`${where}: beforeAen must be a positive whole number of years before 1A 1`);
  if (!yearZero) problems.push(`${where}: an entry dated before Aen carries year 0`);
  if (date !== undefined && date !== null && date !== BEFORE_AEN_TEXT) problems.push(`${where}: a date before Aen is written "${BEFORE_AEN_TEXT}"`);
  if (entry.fromDate !== undefined && entry.fromDate !== BEFORE_AEN_TEXT && entry.fromDate !== 'before 1A') problems.push(`${where}: fromDate before Aen is "${BEFORE_AEN_TEXT}"`);
}

export function validateHistory(h, { roster = null } = {}) {
  const problems = [], ids = new Set();
  const need = (cond, msg) => { if (!cond) problems.push(msg); };
  need(h && typeof h === 'object', 'file is not an object');
  if (!h || typeof h !== 'object') return problems;
  need(h.version === 1, 'version must be 1');
  need(isStr(h.region), 'region missing');
  need(isStr(h.overview) && h.overview.length >= 400, 'overview must be real prose (400+ characters)');
  need(arr(h.ages) && h.ages.length >= 3, 'at least three ages (older than the Fourth Age) are required');
  for (const a of h.ages ?? []) {
    const w = `age ${a?.id}`;
    need(isStr(a.id) && isStr(a.name) && isStr(a.summary) && a.summary.length >= 120, `${w}: id, name and a real summary are required`);
    need(isYear(a.from) && isYear(a.to) && a.from <= a.to, `${w}: from/to must be integer years`);
    checkLabel(problems, w, a);
    checkBeforeAen(problems, w, a, a.from === 0 && a.to === 0, null);
    if (ids.has('age:' + a.id)) problems.push(`${w}: duplicate id`); ids.add('age:' + a.id);
  }
  need(arr(h.countries) && h.countries.length >= 1, 'countries missing');
  for (const c of h.countries ?? []) {
    const w = `country ${c?.name}`;
    need(isStr(c.name) && !BAD_NAME.test(c.name), `${w}: bad name`);
    if (roster && !roster.has(c.name)) problems.push(`${w}: not in the roster`);
    if (ids.has('country:' + c.name)) problems.push(`${w}: duplicate`); ids.add('country:' + c.name);
    need(isStr(c.founding?.story) && c.founding.story.length >= 160 && isYear(c.founding?.year), `${w}: founding needs a year and a story (160+ characters)`);
    need(arr(c.dynasties) && c.dynasties.length >= 1, `${w}: at least one dynasty or ruling line`);
    for (const d of c.dynasties ?? []) need(isStr(d.name) && isYear(d.from) && isStr(d.notable), `${w}: dynasty needs name, from, notable`);
    need(arr(c.events) && c.events.length >= 3, `${w}: at least three past events (wars, treaties, plagues, reforms, migrations)`);
    for (const e of c.events ?? []) {
      need(isStr(e.name) && isYear(e.year) && isStr(e.summary) && e.summary.length >= 60, `${w}: event ${e?.name} needs name, year and a summary`);
      checkBeforeAen(problems, `${w}: event ${e?.name}`, e, e.year === 0, e.date);
    }
    need(arr(c.rivalries), `${w}: rivalries array`);
    need(isStr(c.capitalReason), `${w}: capitalReason (why the seat is where it is; never because the lore names the place)`);
    need(isStr(c.today) && c.today.length >= 120, `${w}: today (the state of the realm in 4A 1748)`);
    need(arr(c.divergence) && c.divergence.length >= 2, `${w}: at least two divergence hooks (what could go differently)`);
    for (const d of c.divergence ?? []) need(isStr(d.id) && isStr(d.what) && isStr(d.consequence), `${w}: divergence needs id, what, consequence`);
    checkLabel(problems, w, c);
  }
  need(arr(h.cities) && h.cities.length >= 5, 'cities missing (at least five)');
  for (const c of h.cities ?? []) {
    const w = `city ${c?.name}`;
    need(isStr(c.name) && !BAD_NAME.test(c.name), `${w}: bad name`);
    need(isStr(c.country), `${w}: country missing`);
    need(ROLES.includes(c.role), `${w}: role must be one of ${ROLES.join(', ')}`);
    need(POP_CLASSES.includes(c.size), `${w}: size must be one of ${POP_CLASSES.join(', ')}`);
    need(isYear(c.founded) && isStr(c.legend) && c.legend.length >= 80, `${w}: founded year and a local legend (80+ characters)`);
    need(isStr(c.economy), `${w}: economy`);
    checkLabel(problems, w, c);
    if (ids.has('city:' + c.name + ':' + c.country)) problems.push(`${w}: duplicate`); ids.add('city:' + c.name + ':' + c.country);
  }
  need(arr(h.figures), 'figures array required');
  for (const f of h.figures ?? []) {
    const w = `figure ${f?.name}`;
    need(isStr(f.name) && !BAD_NAME.test(f.name) && isStr(f.country) && isStr(f.role), `${w}: name, country, role`);
    need(isYear(f.born) && (f.died === null || isYear(f.died)), `${w}: born and died (null when alive in 4A 1748)`);
    need(isStr(f.biography) && f.biography.length >= 100, `${w}: biography (100+ characters)`);
    checkLabel(problems, w, f);
  }
  need(arr(h.addedCultures) && arr(h.addedFaiths), 'addedCultures and addedFaiths arrays required (may be empty)');
  for (const x of [...(h.addedCultures ?? []), ...(h.addedFaiths ?? [])]) need(isStr(x.id) && isStr(x.name) && isStr(x.summary) && x.summary.length >= 120, `added culture or faith ${x?.id}: id, name, summary`);
  need(arr(h.lawsAndCustoms), 'lawsAndCustoms array required');
  return problems;
}
