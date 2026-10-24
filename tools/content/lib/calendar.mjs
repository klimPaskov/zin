// The Reckoning of the Twelve, the calendar of Aoaz (docs/lore/references/calendar.md, requirement R-31, decisions K28 and K30).
// One source for the start date, the month names and the local reckonings: the content builder, the politics step and the
// story-date helper all read it. The month names, short forms, abbreviations, seasons and per-language formulas come from
// data/world/pantheon.json (gods[].monthName, monthShort, monthAbbr, monthIndex, and the calendar block); the local
// reckonings of the realms that keep their own count come from data/world/reckonings.json. Nothing here repeats a name.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const readJson = rel => JSON.parse(readFileSync(path.join(here, '..', rel), 'utf8'));
export const PANTHEON = readJson('data/world/pantheon.json');
export const RECKONINGS = readJson('data/world/reckonings.json');
const CAL = PANTHEON.calendar;

export const START_DATE = '1748.3.1.12';       // 1 Lumae, 4A 1748 (the Lamp-Lighting)
export const END_DATE = '1800.1.1.1';          // the sandbox runs to 4A 1800 (V3)
export const LAST_ELECTION = '1746.3.1';       // two years before the start: no election falls on day one
export const START_YEAR = 1748;
if (CAL.startDate !== START_DATE) throw new Error(`pantheon.json starts the game on ${CAL.startDate}, the calendar on ${START_DATE}`);

// The engine counts twelve months with Earth's lengths; these are its own month keys, in order. Vanilla has no short "May":
// the key May serves both forms, so the fifth month reads in full in both.
const ENGINE_KEYS = [
  ['January', 'Jan'], ['February', 'Feb'], ['March', 'Mar'], ['April', 'Apr'], ['May', 'May'], ['June', 'Jun'],
  ['July', 'Jul'], ['August', 'Aug'], ['September', 'Sep'], ['October', 'Oct'], ['November', 'Nov'], ['December', 'Dec'],
];
export const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const seasonOf = index => Object.entries(CAL.seasons).find(([, months]) => months.includes(index))?.[0];

/** The twelve god-months in calendar order: { index, key, short, name, shortForm, abbr, god, season }. */
export const MONTHS = (() => {
  const gods = PANTHEON.gods.filter(g => g.monthIndex).sort((a, b) => a.monthIndex - b.monthIndex);
  if (gods.length !== 12 || gods.some((g, i) => g.monthIndex !== i + 1)) throw new Error('pantheon.json must give exactly one god for each month 1 to 12');
  return gods.map((g, i) => {
    for (const f of ['monthName', 'monthShort', 'monthAbbr']) if (typeof g[f] !== 'string' || !g[f]) throw new Error(`pantheon.json: ${g.name} has no ${f}`);
    const season = seasonOf(i + 1);
    if (!season) throw new Error(`pantheon.json: month ${i + 1} is in no season`);
    return { index: i + 1, key: ENGINE_KEYS[i][0], short: ENGINE_KEYS[i][1], name: g.monthName, shortForm: g.monthShort, abbr: g.monthAbbr, god: g.name, season };
  });
})();

/** The month names the calendar used before the god-months (pantheon.json calendar.oldNames), name -> index. */
export const FORMER_MONTHS = new Map(Object.entries(CAL.oldNames));
const BY_NAME = new Map(MONTHS.map(m => [m.name, m.index]));

/**
 * The month index (1-12) of a god-month name, or of a former name that data files written before the god-months still use
 * for timing (event windows, festival months). Anything else is null.
 */
export function monthIndex(name) {
  return BY_NAME.get(name) ?? FORMER_MONTHS.get(name) ?? null;
}

/** The start date as players read it: 1 Lumae 4A 1748. */
export const START_SHOWN = (() => {
  const [y, m, d] = START_DATE.split('.').map(Number);
  const shown = `${d} ${MONTHS[m - 1].name} 4A ${y}`;
  if (shown !== CAL.startShown) throw new Error(`pantheon.json shows the start as ${CAL.startShown}, the calendar as ${shown}`);
  return shown;
})();

export const LANGUAGE_FORMULA = CAL.languageFormula;
const fill = (formula, m) => formula.replaceAll('{name}', m.name).replaceAll('{abbr}', m.abbr).replaceAll('{short}', m.shortForm);

// Localisation keys the engine reads for dates, in one language: the full key takes the language's full formula, the short
// key its short formula. Every key here is checked against the game files.
export function monthKeys(language = 'english') {
  const f = LANGUAGE_FORMULA[language];
  if (!f) throw new Error(`pantheon.json has no month formula for ${language}`);
  const keys = {};
  for (const m of MONTHS) {
    keys[m.key] = fill(f.full, m);
    if (m.short !== m.key) keys[m.short] = fill(f.short, m);
  }
  return keys;
}

// The engine's date string for the history files: `1748.3.1`.
export const historyDate = (year, month, day) => `${year}.${month}.${day}`;

// ------------------------------------------------------------------------------------------------ the shared year count
// Years run in one count from the victory of Aen: 1A 1 is year 1 (reckonings.json `ages`, after the East Lands history).
const AGES = RECKONINGS.ages;
/** The shared year of `year` in `age` ('1A' to '4A'): 4A 1748 is 6816. */
export function sharedYear(age, year) {
  const a = AGES[age];
  if (!a) throw new Error(`No age ${age}`);
  if (!Number.isInteger(year) || year < 1 || (a.years && year > a.years)) throw new Error(`${age} has no year ${year}`);
  return a.first + year - 1;
}

// ------------------------------------------------------------------------------------------------ local reckonings
export const CALENDARS = RECKONINGS.calendars;
export const SEASON_WORDS = RECKONINGS.seasonWords;
for (const s of Object.keys(CAL.seasons)) if (typeof SEASON_WORDS[s] !== 'string') throw new Error(`reckonings.json has no word for the season ${s}`);
const calendarOf = id => { const c = CALENDARS[id]; if (!c) throw new Error(`No reckoning ${id}`); return c; };

/** The offset that turns a 4A year into the year of an era count (Wells, Ledger): local = 4A + offset. */
export function eraOffset(id) {
  const c = calendarOf(id);
  if (c.kind !== 'era') throw new Error(`${id} does not count years from an era`);
  return c.anchor.localYear - c.anchor.year4A;
}
/** The year of an era count in 4A `year`, or null before the era began. */
export function eraYear(id, year) {
  const n = year + eraOffset(id);
  return n >= 1 ? n : null;
}

/** The day the river rises (the Count of the Floods begins its year): { month, day }. */
export function risingDay() {
  const c = calendarOf('flood_count');
  const month = CAL.seasonalMechanic[c.risingFrom];
  if (!Number.isInteger(month)) throw new Error(`pantheon.json has no seasonal month ${c.risingFrom}`);
  return { month, day: c.risingDay };
}
const risen = (month, day) => { const r = risingDay(); return month > r.month || (month === r.month && day >= r.day); };
/** The 4A year of the first Rising of a reign that is in its `rising`-th Rising on the given date. */
export function firstRisingYear(rising, { year, month, day }) {
  if (!Number.isInteger(rising) || rising < 1) throw new Error(`A reign has no Rising ${rising}`);
  return year - rising + (risen(month, day) ? 1 : 0);
}
/** The number of the Rising a reign whose first Rising fell in `first` is in on the given date; 0 before its first Rising. */
export function risingOf(first, { year, month, day }) {
  return Math.max(0, year - first + (risen(month, day) ? 1 : 0));
}

const ONES = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const TENTHS = ['', '', 'twentieth', 'thirtieth', 'fortieth', 'fiftieth', 'sixtieth', 'seventieth', 'eightieth', 'ninetieth'];
export const ORDINAL_WORDS = { ones: ONES, tens: TENS, tenths: TENTHS };
/** "3952nd", "11th", "101st". */
export function ordinalSuffix(n) {
  const h = n % 100, t = n % 10;
  return h >= 11 && h <= 13 ? 'th' : t === 1 ? 'st' : t === 2 ? 'nd' : t === 3 ? 'rd' : 'th';
}
/** "twelfth", "twenty-first", "ninetieth"; from 100 on, digits with a suffix. */
export function ordinalWord(n) {
  if (!Number.isInteger(n) || n < 1) throw new Error(`No ordinal for ${n}`);
  if (n < 20) return ONES[n];
  if (n < 100) return n % 10 ? `${TENS[Math.floor(n / 10)]}-${ONES[n % 10]}` : TENTHS[n / 10];
  return `${n}${ordinalSuffix(n)}`;
}
const cap = s => s[0].toUpperCase() + s.slice(1);

/**
 * A date as a realm of the given reckoning writes it, the same text the scripted localisation zin_reckoning_date gives:
 * `date` is { year (4A), month, day }, `leader` the ruler's name, `firstRising` the 4A year of the ruler's first Rising
 * (the Count of the Floods; null or absent when it is not known).
 */
export function reckonDate(id, date, { leader = '', firstRising = null } = {}) {
  const c = calendarOf(id);
  const m = MONTHS[date.month - 1];
  if (!m || !Number.isInteger(date.day) || date.day < 1 || date.day > MONTH_DAYS[date.month - 1]) throw new Error(`No day ${date.day} of month ${date.month}`);
  const tokens = { year: String(date.year), month: m.name, season: SEASON_WORDS[m.season], muster: cap(ONES[m.index]), leader };
  let form = c.form;
  if (c.kind === 'era') {
    const n = eraYear(id, date.year);
    if (n === null) form = c.formBefore; else tokens.yearOrdinal = `${n}${ordinalSuffix(n)}`;
  } else if (c.kind === 'reign') {
    const n = Number.isInteger(firstRising) ? risingOf(firstRising, date) : 0;
    if (n < 1) form = c.formNoReign; else tokens.reignOrdinal = ordinalWord(n);
  }
  return fillForm(form, tokens);
}
export const fillForm = (form, tokens) => form.replace(/\{([a-zA-Z]+)\}/g, (all, k) => { if (!(k in tokens)) throw new Error(`The form "${form}" names {${k}}, which this reckoning lacks`); return tokens[k]; });
