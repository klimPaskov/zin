// Technology tree layout (docs/specs/03_gameplay/07_industry_and_electronics_techs.md section 5).
// Pure functions: bands, costs, absolute slots, gridboxes and the pixel positions a folder window needs. No coordinate is
// typed by hand: a tile's row is a function of its year (the same in every folder) and its column is its line's column.
// A root is a technology without a path parent; every root gets one gridbox, and its descendants carry coordinates
// relative to it (format "UP": x runs left to right, y top to bottom, one slot is 70 by 70 pixels).

export const SLOT = 70;
// Pixel origin of slot (0, 0) in a folder window: a left gutter for the row captions and a top header for the folder title.
export const ORIGIN = { x: 150, y: 60 };
export const GRIDBOX_SIZE = { width: 100, height: 140 };

// The band table is { to, y } sorted by `to`; the last band reaches 9999.
export function bandY(year, bands) {
  for (const b of bands) if (year <= b.to) return b.y;
  throw new Error(`Year ${year} is beyond the last band`);
}

// Cost multiplier of the BASE_TECH_COST by the cost rule of the spec (1.5, 2.0, 2.5 by era).
export function ruleCost(year, rule) {
  return year >= rule.sandboxFrom ? rule.sandbox : year >= rule.campaignFrom ? rule.campaign : rule.start;
}

// Absolute slot of every technology: x is the row's own `x` or its line's column, y comes from the year.
// `techs` are loaded rows (key, line, year, x?, requires[]), `lines` maps line key to { folder, column }.
export function absoluteSlots(techs, lines, bands) {
  const out = new Map();
  for (const t of techs) {
    const line = lines.get(t.line);
    out.set(t.key, { folder: line.folder, x: t.x ?? line.column, y: bandY(t.year, bands) });
  }
  return out;
}

// Roots (no path parent) and, for every technology, the root of its chain. A chain never crosses a folder.
export function chains(techs) {
  const byKey = new Map(techs.map(t => [t.key, t]));
  const rootOf = new Map();
  const find = key => {
    if (rootOf.has(key)) return rootOf.get(key);
    const t = byKey.get(key);
    const root = t && t.requires.length && byKey.has(t.requires[0]) ? find(t.requires[0]) : key;
    rootOf.set(key, root);
    return root;
  };
  for (const t of techs) find(t.key);
  return { rootOf, roots: techs.filter(t => rootOf.get(t.key) === t.key).map(t => t.key) };
}

// Everything the folder window writer needs, per folder: tiles with absolute and relative coordinates, the gridbox of each
// root with its pixel position, and the row captions. Collisions and band clashes are reported, not thrown.
export function layoutFolders(techs, lines, bands) {
  const slots = absoluteSlots(techs, lines, bands);
  const { rootOf, roots } = chains(techs);
  const problems = [];
  const folders = new Map();
  const get = f => { if (!folders.has(f)) folders.set(f, { tiles: [], gridboxes: [], rows: new Set() }); return folders.get(f); };
  const seen = new Map();
  for (const t of techs) {
    const s = slots.get(t.key), root = slots.get(rootOf.get(t.key));
    const tile = { key: t.key, x: s.x, y: s.y, rx: s.x - root.x, ry: s.y - root.y, root: rootOf.get(t.key) };
    get(s.folder).tiles.push(tile);
    get(s.folder).rows.add(s.y);
    const slotId = `${s.folder}:${s.x},${s.y}`;
    if (seen.has(slotId)) problems.push(`${t.key} and ${seen.get(slotId)} share the slot ${s.x},${s.y} of ${s.folder}`);
    else seen.set(slotId, t.key);
    // A path child must sit in a later row than its parent, or the connector has nothing to draw.
    for (const p of t.requires) if (slots.get(p) && slots.get(p).y >= s.y) problems.push(`${t.key} (year ${t.year}) is not in a later row than its path parent ${p}`);
  }
  for (const r of roots) {
    const s = slots.get(r);
    get(s.folder).gridboxes.push({ name: `${r}_tree`, root: r, x: s.x, y: s.y, px: ORIGIN.x + s.x * SLOT, py: ORIGIN.y + s.y * SLOT, ...GRIDBOX_SIZE, slotsize: SLOT, format: 'UP' });
  }
  const result = {};
  for (const [f, v] of [...folders].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    v.tiles.sort((a, b) => a.y - b.y || a.x - b.x || a.key.localeCompare(b.key, 'en'));
    v.gridboxes.sort((a, b) => a.y - b.y || a.x - b.x || a.name.localeCompare(b.name, 'en'));
    const maxY = Math.max(...v.tiles.map(t => t.y)), maxX = Math.max(...v.tiles.map(t => t.x));
    result[f] = { tiles: v.tiles, gridboxes: v.gridboxes, rows: [...v.rows].sort((a, b) => a - b), width: ORIGIN.x + (maxX + 3) * SLOT, height: ORIGIN.y + (maxY + 3) * SLOT };
  }
  return { folders: result, problems };
}

// Does a clause admit a profile? A clause is { people?, country?, region? } and an empty clause admits everyone.
export function clauseAdmits(clause, profile) {
  if (clause.people && clause.people !== profile.people) return false;
  if (clause.country && clause.country !== profile.country) return false;
  if (clause.region && clause.region !== profile.region) return false;
  return true;
}
// A list of clauses is an OR; an empty list admits everyone.
export const whoAdmits = (who, profile) => !who.length || who.some(c => clauseAdmits(c, profile));

// Is every actor admitted by `inner` also admitted by `outer`? `peopleOf` maps a country name to its people. Used to check
// that a technology is not visible to someone who cannot research a prerequisite.
export function whoCovered(inner, outer, peopleOf) {
  if (!outer.length) return true;
  if (!inner.length) return false;
  return inner.every(c => outer.some(p => {
    if (p.people && (c.people ? c.people !== p.people : !(c.country && peopleOf(c.country) === p.people))) return false;
    if (p.country && c.country !== p.country) return false;
    if (p.region && c.region !== p.region) return false;
    return true;
  }));
}
