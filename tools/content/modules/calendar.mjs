// The Fourth Age calendar: Erdae month names in every language folder (docs/specs/00_foundation/01_start_and_calendar.md,
// implementation step 4). The start date itself is a define (modules/defines.mjs) and the bookmark date comes from the
// same constant (lib/calendar.mjs), so nothing shows 1936.
import { readFile } from 'node:fs/promises';
import { yml } from '../lib/core.mjs';
import { GAME } from '../lib/paths.mjs';
import { MONTHS, monthKeys } from '../lib/calendar.mjs';

export const LANGUAGES = ['english', 'braz_por', 'french', 'german', 'japanese', 'korean', 'polish', 'russian', 'simp_chinese', 'spanish'];

// Every month key must exist in the installed game's localisation, or the replacement would silently do nothing.
export async function assertKeysExist(keys) {
  const text = (await readFile(`${GAME}/localisation/english/core_l_english.yml`, 'utf8')) + (await readFile(`${GAME}/localisation/english/combat_l_english.yml`, 'utf8'));
  const missing = Object.keys(keys).filter(k => !new RegExp(`^ ${k}:`, 'm').test(text));
  if (missing.length) throw new Error(`Calendar keys the game does not define: ${missing.join(', ')}`);
}

export async function buildCalendar(staged) {
  const keys = monthKeys();
  await assertKeysExist(keys);
  // The same English text in every language folder until translations exist; `replace` wins over the vanilla files.
  for (const lang of LANGUAGES) staged.add(`localisation/replace/zin_calendar_l_${lang}.yml`, yml(keys, lang));
  return { months: MONTHS.length, keys: Object.keys(keys).length, languages: LANGUAGES.length };
}
