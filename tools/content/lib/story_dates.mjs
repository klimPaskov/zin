// Story dates at every story pace (decisions V4 and R2, docs/design/alternate_history.md section 3).
// A story date d becomes start + (d - start) x pace, where the start is 1 Lumae 4A 1748 (engine 1748.3.1) and the pace is the value
// that zin_rule_story_pace writes into global.zin_story_pace: 1 (STANDARD), 1.5 (SLOW) or 0.75 (FAST).
// The engine calendar has no leap days: every year has 365 days and the month lengths of lib/calendar.mjs MONTH_DAYS. The day count
// is therefore taken in that calendar, never in the Gregorian one, so a shifted date can never be 29 Sulethe.
// Exports:
//   paceDate(date, pace)      the engine date (y.m.d) that the standard date `date` takes at `pace`
//   shiftDays(days, pace)     a span of days at `pace`, rounded to whole days (relative windows such as "CP11 + 180 days")
//   addDays(date, days)       the engine date `days` after `date` (negative goes back)
//   dayBefore(date)           the day before `date` (a `date >` test is true from the day after its argument)
//   compareDates(a, b)        negative, zero or positive, as a sort comparator
//   PACES                     the three pace values in the rule's option order
//   paceTest(pace)            the check_variable lines that select one pace branch (an unset pace reads as STANDARD)
//   dateTrigger(name, date)   a scripted trigger true from `date` (paced) on, one branch per pace
import { MONTH_DAYS } from './calendar.mjs';

export const START = '1748.3.1';
export const PACES = [1, 1.5, 0.75];
const YEAR = MONTH_DAYS.reduce((a, b) => a + b, 0);

function parse(date) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(date));
  if (!m) throw new Error(`story_dates: ${date} is not an engine date such as 1755.4.1`);
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > MONTH_DAYS[mo - 1]) throw new Error(`story_dates: ${date} is not a day of the engine calendar`);
  return [y, mo, d];
}
const serial = ([y, m, d]) => y * YEAR + MONTH_DAYS.slice(0, m - 1).reduce((a, b) => a + b, 0) + d - 1;
function unserial(n) {
  const y = Math.floor(n / YEAR);
  let rest = n - y * YEAR, m = 0;
  while (rest >= MONTH_DAYS[m]) { rest -= MONTH_DAYS[m]; m++; }
  return `${y}.${m + 1}.${rest + 1}`;
}

export function paceDate(date, pace) {
  if (!PACES.includes(pace)) throw new Error(`story_dates: pace ${pace} is not one of ${PACES.join(', ')}`);
  const a = serial(parse(START)), b = serial(parse(date));
  return unserial(a + Math.round((b - a) * pace));
}
export const shiftDays = (days, pace) => Math.round(days * pace);
export const addDays = (date, days) => unserial(serial(parse(date)) + days);
export const dayBefore = date => addDays(date, -1);
export const compareDates = (a, b) => serial(parse(a)) - serial(parse(b));

// The pace branches read global.zin_story_pace with margins, so a value written as 1.5 or 0.75 in fixed point always selects its branch.
// An unset pace (0, before on_startup has run) reads as STANDARD.
export function paceTest(pace) {
  const v = 'global.zin_story_pace';
  if (pace === 1.5) return [`check_variable = { ${v} > 1.25 }`];
  if (pace === 0.75) return [`check_variable = { ${v} > 0.1 }`, `check_variable = { ${v} < 0.9 }`];
  return [`NOT = { check_variable = { ${v} > 1.25 } }`, `NOT = { AND = { check_variable = { ${v} > 0.1 } check_variable = { ${v} < 0.9 } } }`];
}

// A trigger body (lines) that is true from the paced `date` on.
export function afterDate(date) {
  return ['OR = {', ...PACES.flatMap(p => ['\tAND = {', ...paceTest(p).map(l => `\t\t${l}`), `\t\tdate > ${dayBefore(paceDate(date, p))}`, '\t}']), '}'];
}
export function dateTrigger(name, date, note) {
  return [`# ${note ?? `${date} at the standard pace, shifted by zin_story_pace (R2); true from that day on.`}`, `${name} = {`, ...afterDate(date).map(l => `\t${l}`), '}'].join('\n');
}
