// The Fourth Age calendar of Erdae (docs/specs/00_foundation/01_start_and_calendar.md). One source for the start date
// and the month names: the content builder, the politics step and the story-date helper all read it.
export const START_DATE = '1748.3.1.12';       // 1 Thaw, 4A 1748
export const END_DATE = '1800.1.1.1';          // the sandbox runs to 4A 1800 (V3)
export const LAST_ELECTION = '1746.3.1';       // two years before the start: no election falls on day one
export const START_YEAR = 1748;

// The engine counts twelve months with Earth's lengths; the key is the engine's own month key.
export const MONTHS = [
  { key: 'January',   short: 'Jan', name: 'Deepwinter', abbr: 'Dpw' },
  { key: 'February',  short: 'Feb', name: 'Ironfrost',  abbr: 'Irf' },
  { key: 'March',     short: 'Mar', name: 'Thaw',       abbr: 'Tha' },
  { key: 'April',     short: 'Apr', name: 'Rainwake',   abbr: 'Rnw' },
  { key: 'May',       short: 'May', name: 'Sowing',     abbr: 'Sow' },
  { key: 'June',      short: 'Jun', name: 'Highsun',    abbr: 'Hsn' },
  { key: 'July',      short: 'Jul', name: 'Goldfield',  abbr: 'Gld' },
  { key: 'August',    short: 'Aug', name: 'Harvest',    abbr: 'Hrv' },
  { key: 'September', short: 'Sep', name: 'Fallowing',  abbr: 'Fal' },
  { key: 'October',   short: 'Oct', name: 'Emberleaf',  abbr: 'Emb' },
  { key: 'November',  short: 'Nov', name: 'Mistfall',   abbr: 'Mis' },
  { key: 'December',  short: 'Dec', name: 'Longnight',  abbr: 'Lng' },
];

// Localisation keys the engine reads for dates. Vanilla has no short "May": the key May serves both forms, so the
// fifth month reads in full in both (the spec's open point). Every key here is checked against the game files.
export function monthKeys() {
  const keys = {};
  for (const m of MONTHS) {
    keys[m.key] = m.name;
    if (m.short !== m.key) keys[m.short] = m.abbr;
  }
  return keys;
}

// The engine's date string for the history files: `1748.3.1`.
export const historyDate = (year, month, day) => `${year}.${month}.${day}`;
