// Technology tree layout (docs/specs/03_gameplay/07_industry_and_electronics_techs.md section 5, owner decision K51).
// Pure functions: bands, costs, absolute slots, gridboxes, tile rectangles and the connectors the engine draws. No coordinate is
// typed by hand except a tile's column: a tile's band is a function of its year (era bands for the Third Age and the early Fourth
// Age, year bands after), a folder shows only the bands it uses, in order, and a tile's column is its own `x` or its line's column.
//
// Every gridbox of a folder sits at the folder origin (the way the vanilla infantry folder stacks support_weapons_tree and
// night_vision_tree on one position), so a tile's position relative to its gridbox is its absolute slot. That makes every connector
// the engine draws, including the one from a second path parent in another gridbox, land where the slots say it does.
// Format "UP": x runs left to right, y top to bottom, one slot is 70 by 70 pixels (the line items are 70-pixel cells).

export const SLOT = 70;
// Pixel origin of slot (0, 0) in a folder window: a left gutter for the era captions (and the left wing of a large tile at column 0)
// and a top header for the folder title.
export const ORIGIN = { x: 210, y: 70 };
// The item containers (lib/tech_tree_gui.mjs clones them from the installed infantry folder): the small item is 72 by 72 at the slot
// origin, the large equipment item 183 by 84 at (-56, -7), so its centre is the slot centre.
export const ITEM = { small: { dx: 0, dy: 0, w: 72, h: 72 }, large: { dx: -56, dy: -7, w: 183, h: 84 } };
// The smallest clear gap in pixels between two tiles, and between a connector and a tile it does not belong to.
export const MIN_GAP = 6;

// The band table is { to, y } sorted by `to`; the last band reaches 9999.
export function bandY(year, bands) {
  for (const b of bands) if (year <= b.to) return b.y;
  throw new Error(`Year ${year} is beyond the last band`);
}

// Cost multiplier of the BASE_TECH_COST by the cost rule of the spec: lost knowledge, then the start, campaign, sandbox and late eras.
export function ruleCost(year, rule, lost = false) {
  if (lost) return rule.lost;
  return year >= rule.lateFrom ? rule.late : year >= rule.sandboxFrom ? rule.sandbox : year >= rule.campaignFrom ? rule.campaign : rule.start;
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

// Roots (no path parent) and, for every technology, the root of its chain (followed through the first path parent, the one that
// decides the gridbox; a second parent's path carries ignore_for_layout).
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

// ---------- geometry ----------
const centre = (x, y) => ({ cx: ORIGIN.x + x * SLOT + SLOT / 2, cy: ORIGIN.y + y * SLOT + SLOT / 2 });
// The pixel rectangle of a tile: [left, top, right, bottom].
export function tileRect(tile) {
  const it = tile.large ? ITEM.large : ITEM.small, px = ORIGIN.x + tile.x * SLOT, py = ORIGIN.y + tile.y * SLOT;
  return [px + it.dx, py + it.dy, px + it.dx + it.w, py + it.dy + it.h];
}
// The segments the engine draws for one path in an "UP" gridbox: one unit down from the parent, across in that gutter row, then down
// to the child. Each segment is { x1, y1, x2, y2 } in pixels between slot centres.
export function connectorSegments(parent, child) {
  const a = centre(parent.x, parent.y), gutter = centre(child.x, parent.y + 1), b = centre(child.x, child.y);
  const turn = centre(parent.x, parent.y + 1);
  const segs = [{ x1: a.cx, y1: a.cy, x2: turn.cx, y2: turn.cy, part: 'stub' }];
  if (parent.x !== child.x) segs.push({ x1: turn.cx, y1: turn.cy, x2: gutter.cx, y2: gutter.cy, part: 'across' });
  segs.push({ x1: gutter.cx, y1: gutter.cy, x2: b.cx, y2: b.cy, part: 'down' });
  return segs;
}
const overlap1 = (a1, a2, b1, b2) => Math.min(Math.max(a1, a2), Math.max(b1, b2)) - Math.max(Math.min(a1, a2), Math.min(b1, b2));
// Does an axis-aligned segment pass through a rectangle (shrunk by `inset`)?
function segmentHitsRect(s, r, inset) {
  const [l, t, rr, b] = [r[0] + inset, r[1] + inset, r[2] - inset, r[3] - inset];
  if (s.x1 === s.x2) return s.x1 > l && s.x1 < rr && overlap1(s.y1, s.y2, t, b) > 0;
  return s.y1 > t && s.y1 < b && overlap1(s.x1, s.x2, l, rr) > 0;
}
// Do two axis-aligned segments touch (cross, overlap or meet)? Returns the kind or null.
function segmentsMeet(s, u) {
  const sv = s.x1 === s.x2, uv = u.x1 === u.x2;
  if (sv && uv) return s.x1 === u.x1 && overlap1(s.y1, s.y2, u.y1, u.y2) > 0 ? 'overlap' : null;
  if (!sv && !uv) return s.y1 === u.y1 && overlap1(s.x1, s.x2, u.x1, u.x2) > 0 ? 'overlap' : null;
  const [v, h] = sv ? [s, u] : [u, s];
  const inX = v.x1 >= Math.min(h.x1, h.x2) && v.x1 <= Math.max(h.x1, h.x2), inY = h.y1 >= Math.min(v.y1, v.y2) && h.y1 <= Math.max(v.y1, v.y2);
  if (!(inX && inY)) return null;
  const endOfV = h.y1 === v.y1 || h.y1 === v.y2, endOfH = v.x1 === h.x1 || v.x1 === h.x2;
  return endOfV && endOfH ? 'corner' : endOfV || endOfH ? 'tee' : 'cross';
}

// Geometry problems of one folder: tiles that overlap or sit closer than MIN_GAP, a connector through a tile it does not join, two
// connectors of unrelated paths that cross or run on top of each other, an exclusive pair that is not side by side, and a path child
// that is not below its parent. `tiles` carry { key, x, y, large }, `edges` are { from, to }, `xor` pairs are [a, b].
export function folderGeometry(tiles, edges, xorPairs = []) {
  const problems = [];
  const at = new Map(tiles.map(t => [t.key, t]));
  const rects = tiles.map(t => ({ t, r: tileRect(t) }));
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const a = rects[i].r, b = rects[j].r;
    if (a[0] < b[2] + MIN_GAP && b[0] < a[2] + MIN_GAP && a[1] < b[3] + MIN_GAP && b[1] < a[3] + MIN_GAP) problems.push(`tiles ${rects[i].t.key} and ${rects[j].t.key} overlap or touch`);
  }
  const drawn = [];
  for (const e of edges) {
    const p = at.get(e.from), c = at.get(e.to);
    if (!p || !c) continue;
    if (c.y < p.y + 2) { problems.push(`${e.to} is not at least one row below its path parent ${e.from}`); continue; }
    const segs = connectorSegments(p, c);
    for (const s of segs) for (const { t, r } of rects) if (t.key !== e.from && t.key !== e.to && segmentHitsRect(s, r, -MIN_GAP / 2)) problems.push(`the connector ${e.from} > ${e.to} runs through ${t.key}`);
    drawn.push({ e, segs });
  }
  for (let i = 0; i < drawn.length; i++) for (let j = i + 1; j < drawn.length; j++) {
    const A = drawn[i], B = drawn[j];
    // A split from one parent, a rejoin into one child, or a chain through one tile meets by design.
    if (A.e.from === B.e.from || A.e.to === B.e.to || A.e.to === B.e.from || A.e.from === B.e.to) continue;
    for (const s of A.segs) for (const u of B.segs) {
      const kind = segmentsMeet(s, u);
      if (kind) { problems.push(`the connectors ${A.e.from} > ${A.e.to} and ${B.e.from} > ${B.e.to} ${kind === 'overlap' ? 'run on top of each other' : 'cross'}`); break; }
    }
  }
  for (const [a, b] of xorPairs) {
    const ta = at.get(a), tb = at.get(b);
    if (!ta || !tb) continue;
    if (ta.y !== tb.y || Math.abs(ta.x - tb.x) !== 2) problems.push(`the exclusive pair ${a} and ${b} is not side by side in one row, two slots apart`);
  }
  return [...new Set(problems)];
}

// Everything the folder window writer needs, per folder: tiles with absolute coordinates (relative = absolute, since every gridbox
// sits at the folder origin), the gridbox of each root, the drawn edges and the row captions. Collisions and geometry problems are
// reported, not thrown. A tech may carry `large` (it unlocks equipment) and `xor` (keys).
export function layoutFolders(techs, lines, bands) {
  const slots = absoluteSlots(techs, lines, bands);
  // Rows are compacted per folder: a folder keeps only the bands it uses, in year order, two slots apart, so no folder shows an empty
  // era. A tile's `band` is the band row of the year (the caption key), its `y` the folder row.
  const used = new Map();
  for (const s of slots.values()) { if (!used.has(s.folder)) used.set(s.folder, new Set()); used.get(s.folder).add(s.y); }
  const rowOf = new Map([...used].map(([f, ys]) => [f, new Map([...ys].sort((a, b) => a - b).map((y, i) => [y, i * 2]))]));
  for (const s of slots.values()) { s.band = s.y; s.y = rowOf.get(s.folder).get(s.band); }
  const { rootOf, roots } = chains(techs);
  const problems = [];
  const folders = new Map();
  const get = f => { if (!folders.has(f)) folders.set(f, { tiles: [], gridboxes: [], rows: new Set(), edges: [], xor: [] }); return folders.get(f); };
  const seen = new Map();
  for (const t of techs) {
    const s = slots.get(t.key);
    const tile = { key: t.key, x: s.x, y: s.y, band: s.band, rx: s.x, ry: s.y, root: rootOf.get(t.key), large: !!t.large };
    const f = get(s.folder);
    f.tiles.push(tile);
    f.rows.add(`${s.y}:${s.band}`);
    const slotId = `${s.folder}:${s.x},${s.y}`;
    if (seen.has(slotId)) problems.push(`${t.key} and ${seen.get(slotId)} share the slot ${s.x},${s.y} of ${s.folder}`);
    else seen.set(slotId, t.key);
    // A path child must sit in a later row than its parent, or the connector has nothing to draw.
    for (const p of t.requires) {
      const ps = slots.get(p);
      if (!ps) continue;
      if (ps.y >= s.y) problems.push(`${t.key} (year ${t.year}) is not in a later row than its path parent ${p}`);
      if (ps.folder === s.folder) f.edges.push({ from: p, to: t.key });
    }
    for (const x of t.xor ?? []) if (t.key < x) f.xor.push([t.key, x]);
  }
  for (const r of roots) {
    const s = slots.get(r);
    get(s.folder).gridboxes.push({ name: `${r}_tree`, root: r, x: s.x, y: s.y, px: ORIGIN.x, py: ORIGIN.y, slotsize: SLOT, format: 'UP' });
  }
  const result = {};
  for (const [f, v] of [...folders].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    v.tiles.sort((a, b) => a.y - b.y || a.x - b.x || a.key.localeCompare(b.key, 'en'));
    v.gridboxes.sort((a, b) => a.y - b.y || a.x - b.x || a.name.localeCompare(b.name, 'en'));
    v.edges.sort((a, b) => a.from.localeCompare(b.from, 'en') || a.to.localeCompare(b.to, 'en'));
    const maxY = Math.max(...v.tiles.map(t => t.y)), maxX = Math.max(...v.tiles.map(t => t.x));
    const width = ORIGIN.x + (maxX + 3) * SLOT, height = ORIGIN.y + (maxY + 3) * SLOT;
    for (const g of v.gridboxes) Object.assign(g, { width: width - ORIGIN.x, height: height - ORIGIN.y });
    for (const p of folderGeometry(v.tiles, v.edges, v.xor)) problems.push(`${f}: ${p}`);
    // rows: { y, band } in order; `band` names the caption (zin_techtree_year_<band>).
    const rows = [...v.rows].map(r => r.split(':').map(Number)).map(([y, band]) => ({ y, band })).sort((a, b) => a.y - b.y);
    result[f] = { tiles: v.tiles, gridboxes: v.gridboxes, edges: v.edges, xor: v.xor, rows, width, height };
  }
  return { folders: result, problems };
}

// Does a clause admit a profile? A clause is { people?, country?, region? } and an empty clause admits everyone.
export function clauseAdmits(clause, profile) {
  if (clause.people && clause.people !== profile.people) return false;
  if (clause.country && clause.country !== profile.country) return false;
  if (clause.region && clause.region !== profile.region) return false;
  if (clause.flag && !(profile.flags ?? []).includes(clause.flag)) return false;
  if (clause.way && clause.way !== profile.way) return false;
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
    if (p.flag && c.flag !== p.flag) return false;
    if (p.way && c.way !== p.way) return false;
    return true;
  }));
}
