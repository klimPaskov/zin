// Converter-independent checker of the geography model of Aoaz (tools/content/data/geography/aoaz.json).
//
// It reads the model in its own dialect (GeoJSON-like features with `geometry`) and asserts the physical and naming
// rules of docs/specs/01_map/05_geography_model.md and docs/design/world/geography_review.md without going through
// any converter to the HOI4 Agent Tools schema. A converter bug can therefore never hide a model defect, and a model
// defect can never be blamed on a converter.
//
//   checkModel(model, options) -> { errors, warnings, info, stats }      (each finding is { code, id, message })
//   node tools/content/geography/check_model.mjs [path-to-model.json]     prints the findings, exits 1 on errors
//
// The module is pure: no file is written, no clock or random number is read, and the findings come out in a stable
// order. It depends on nothing but node:fs for the command line entry.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_MODEL_PATH = path.join(here, '../data/geography/aoaz.json');

export const FRAME = Object.freeze({ widthPx: 5120, heightPx: 2560 });
/** The open-sea band that no land feature of the model may enter (map pipeline decision P2): 4% east and west, 64 px north and south. */
export const EDGE_BAND = Object.freeze({ x: 0.04, y: 0.025 });

/** The feature arrays of the model, in the order the findings are reported. */
export const FEATURE_ARRAYS = Object.freeze([
  'seas', 'lands', 'ranges', 'volcanoes', 'rivers', 'lakes', 'forests', 'deserts', 'marshes', 'ice', 'plains',
  'straits', 'passes', 'sites', 'regions', 'roads', 'coasts', 'hills',
]);
const AREA_ARRAYS = ['seas', 'lands', 'lakes', 'forests', 'deserts', 'marshes', 'ice', 'plains', 'hills', 'regions'];
const LINE_ARRAYS = ['ranges', 'rivers', 'straits', 'roads'];
const POINT_ARRAYS = ['volcanoes', 'sites', 'coasts'];
const POINT_OR_LINE_ARRAYS = ['passes'];
const GRID = Object.freeze({ w: 1280, h: 640 });
const EPS = 1e-9;
const MAX_RING_VERTICES = 2000;
const MAX_POINTS = 200000;

// ---------------------------------------------------------------------------------------------------- geometry
export const ringsOf = geometry => {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
};
const isFiniteCoord = p => Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]);
/** Signed area of a ring (positive counter-clockwise in a y-up frame); the unit is the whole frame. */
export function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return a / 2;
}
/** Area of a polygon part (outer ring minus its holes), in frame units. */
export const partArea = part => Math.abs(ringArea(part[0])) - part.slice(1).reduce((s, r) => s + Math.abs(ringArea(r)), 0);
export const featureArea = geometry => ringsOf(geometry).reduce((s, part) => s + partArea(part), 0);
export const areaPx = geometry => featureArea(geometry) * FRAME.widthPx * FRAME.heightPx;

export function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[j], b = ring[i];
    if ((a[1] > y) !== (b[1] > y) && x < a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1])) inside = !inside;
  }
  return inside;
}
export function pointInPart(x, y, part) {
  if (!pointInRing(x, y, part[0])) return false;
  for (let k = 1; k < part.length; k++) if (pointInRing(x, y, part[k])) return false;
  return true;
}
export const pointInGeometry = (x, y, geometry) => ringsOf(geometry).some(part => pointInPart(x, y, part));

function distSegPoint(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  let t = l2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
/** Distance in frame units (x and y in the same unit scale of the frame width) from a point to a polyline or ring. */
export function distanceToPath(x, y, path, closed = false) {
  const A = FRAME.heightPx / FRAME.widthPx;
  let best = Infinity;
  const n = path.length;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = path[i], b = path[(i + 1) % n];
    best = Math.min(best, distSegPoint(x, y * A, a[0], a[1] * A, b[0], b[1] * A));
  }
  return best;
}
export function distanceToGeometry(x, y, geometry) {
  let best = Infinity;
  if (geometry.type === 'LineString') return distanceToPath(x, y, geometry.coordinates);
  if (geometry.type === 'Point') return Math.hypot(x - geometry.coordinates[0], (y - geometry.coordinates[1]) * (FRAME.heightPx / FRAME.widthPx));
  for (const part of ringsOf(geometry)) for (const ring of part) best = Math.min(best, distanceToPath(x, y, ring, true));
  return best;
}

const orient = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
const onSegment = (a, b, p) => Math.abs(orient(a, b, p)) <= EPS && p[0] >= Math.min(a[0], b[0]) - EPS && p[0] <= Math.max(a[0], b[0]) + EPS && p[1] >= Math.min(a[1], b[1]) - EPS && p[1] <= Math.max(a[1], b[1]) + EPS;
/** 'cross' for a proper crossing, 'touch' when an endpoint of one lies on the other, '' otherwise. */
export function segmentRelation(a, b, c, d) {
  const o1 = orient(a, b, c), o2 = orient(a, b, d), o3 = orient(c, d, a), o4 = orient(c, d, b);
  if (((o1 > EPS && o2 < -EPS) || (o1 < -EPS && o2 > EPS)) && ((o3 > EPS && o4 < -EPS) || (o3 < -EPS && o4 > EPS))) return 'cross';
  if (onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b)) return 'touch';
  return '';
}

/** Self-crossings and self-touches of one ring (the closing edge is implied). Adjacent edges only share their common vertex. */
export function ringSelfIntersections(ring) {
  const n = ring.length;
  const out = { crossings: 0, touches: 0, spikes: 0 };
  const bb = ring.map((p, i) => { const q = ring[(i + 1) % n]; return [Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[0], q[0]), Math.max(p[1], q[1])]; });
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n];
    for (let j = i + 1; j < n; j++) {
      const adjacent = j === i + 1 || (i === 0 && j === n - 1);
      const c = ring[j], d = ring[(j + 1) % n];
      if (bb[i][2] < bb[j][0] - EPS || bb[j][2] < bb[i][0] - EPS || bb[i][3] < bb[j][1] - EPS || bb[j][3] < bb[i][1] - EPS) continue;
      if (adjacent) {
        // The shared vertex is fine; a fold-back along the same line is a spike.
        const shared = j === i + 1 ? b : a, far1 = j === i + 1 ? a : b, far2 = j === i + 1 ? d : c;
        if (Math.abs(orient(far1, shared, far2)) <= EPS && ((far1[0] - shared[0]) * (far2[0] - shared[0]) + (far1[1] - shared[1]) * (far2[1] - shared[1])) > EPS) out.spikes++;
        continue;
      }
      const rel = segmentRelation(a, b, c, d);
      if (rel === 'cross') out.crossings++; else if (rel === 'touch') out.touches++;
    }
  }
  return out;
}

/** Crossings and touches between the boundaries of two rings. */
export function ringsInteract(r1, r2) {
  let cross = 0, touch = 0;
  const n = r1.length, m = r2.length;
  for (let i = 0; i < n; i++) {
    const a = r1[i], b = r1[(i + 1) % n];
    const x0 = Math.min(a[0], b[0]) - EPS, x1 = Math.max(a[0], b[0]) + EPS, y0 = Math.min(a[1], b[1]) - EPS, y1 = Math.max(a[1], b[1]) + EPS;
    for (let j = 0; j < m; j++) {
      const c = r2[j], d = r2[(j + 1) % m];
      if (Math.max(c[0], d[0]) < x0 || Math.min(c[0], d[0]) > x1 || Math.max(c[1], d[1]) < y0 || Math.min(c[1], d[1]) > y1) continue;
      const rel = segmentRelation(a, b, c, d);
      if (rel === 'cross') cross++; else if (rel === 'touch') touch++;
    }
  }
  return { cross, touch };
}
const boundsOf = ring => ring.reduce((b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])], [Infinity, Infinity, -Infinity, -Infinity]);
const boundsOverlap = (a, b) => a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3];

/** Even-odd raster of a geometry on the check grid; 1 where the cell centre is inside. */
export function rasterize(geometry, gw = GRID.w, gh = GRID.h) {
  const m = new Uint8Array(gw * gh);
  for (const part of ringsOf(geometry)) {
    const bounds = boundsOf(part[0]);
    const yStart = Math.max(0, Math.floor(bounds[1] * gh - 1)), yEnd = Math.min(gh - 1, Math.ceil(bounds[3] * gh + 1));
    for (let y = yStart; y <= yEnd; y++) {
      const yy = (y + 0.5) / gh;
      const xs = [];
      for (const r of part) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const a = r[j], b = r[i];
        if ((a[1] > yy) !== (b[1] > yy)) xs.push(a[0] + ((yy - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
      }
      xs.sort((u, v) => u - v);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const x0 = Math.max(0, Math.ceil(xs[k] * gw - 0.5)), x1 = Math.min(gw - 1, Math.floor(xs[k + 1] * gw - 0.5));
        for (let x = x0; x <= x1; x++) m[y * gw + x] ^= 1;
      }
    }
  }
  return m;
}
const countSet = m => { let c = 0; for (let i = 0; i < m.length; i++) c += m[i]; return c; };
const overlapCount = (a, b) => { let c = 0; for (let i = 0; i < a.length; i++) if (a[i] && b[i]) c++; return c; };

// ---------------------------------------------------------------------------------------------------- names
/** Patterns no name of the model may contain: digits, slashes, brackets, bureaucratic words, placeholders, superseded names. */
export const BANNED_NAME_PATTERNS = Object.freeze([
  ['digit', /\d/u],
  ['slash', /[\\/]/u],
  ['bracket', /[()[\]{}<>]/u],
  ['bureaucratic word', /\b(district|region|settlement|province|zone|sector|area|unnamed|unknown|placeholder|tbd|sheet|drawing|reference|island\s+of\s+the\s+(?:north|south))\b/iu],
  ['placeholder island', /\bisland\b.*\b(windwaith|west_lands|zols_mistake|east_lands|tritons_islands|islands_south|lands_sun|ember_lands|dark_lands|north_lands|cold_lands)\b/iu],
  ['underscore', /_/u],
  ['superseded name', /\b(rush|edvoid|einendil|klinti)\b/iu],
  ['dardan', /\bdardan\b/iu],
  ['edge whitespace', /^\s|\s$|\s{2,}/u],
  ['punctuation run', /[.,;:!?]{1}/u],
]);
/** Words that carry no meaning of their own when two sea names are compared. */
const NAME_NOISE = new Set(['the', 'of', 'sea', 'seas', 'ocean', 'oceans', 'strait', 'sound', 'channel', 'gulf', 'bay', 'reach', 'wides', 'narrows', 'passage', 'deep', 'waters', 'water', 'lake', 'great', 'north', 'south', 'east', 'west', 'northern', 'southern', 'eastern', 'western', 'left', 'long']);
/** Words that name the same thing; two sea names whose stems fall in one family share a meaning. */
export const STEM_FAMILIES = Object.freeze({
  death: ['dead', 'death', 'deaths', 'deadly', 'grave', 'graves', 'bone', 'bones', 'ghost', 'ghosts', 'shade', 'shades'],
  dark: ['dark', 'darkness', 'dim', 'shadow', 'shadows', 'black', 'night', 'gloom', 'dun'],
  light: ['light', 'lights', 'sun', 'sunlit', 'bright', 'radiant', 'dawn', 'noon', 'gold', 'golden', 'gods', 'god', 'heaven', 'pale'],
  cold: ['frozen', 'frost', 'frosts', 'ice', 'icy', 'cold', 'white', 'winter', 'rime', 'hoarfrost', 'snow'],
  fire: ['lava', 'fire', 'flame', 'flames', 'ember', 'embers', 'ash', 'ashen', 'burning', 'molten', 'volcano'],
  storm: ['storm', 'storms', 'tempest', 'gale', 'gales', 'windy', 'wind', 'winds', 'tornado'],
  peace: ['peace', 'calm', 'still', 'quiet', 'serene'],
  demon: ['demon', 'demons', 'demonic', 'nether', 'netherborn', 'infernal', 'hell'],
  crown: ['crown', 'king', 'kings', 'royal', 'queen'],
  monster: ['monster', 'monsters', 'leviathan', 'serpent', 'kraken'],
  sharp: ['sharp', 'razor', 'knife', 'blade', 'spear'],
  wide: ['wide', 'wides', 'broad', 'vast'],
});
const STEM_OF = new Map(Object.entries(STEM_FAMILIES).flatMap(([family, words]) => words.map(w => [w, family])));
const simplifyWord = w => w.replace(/'s$/u, '').replace(/s$/u, s => s);
/** The meaning stems of a name: lower-case words minus noise words, plurals and possessives folded, synonym families collapsed. */
export function nameStems(name) {
  const words = String(name).normalize('NFD').replace(/[̀-ͯ]/gu, '').toLowerCase().replace(/['’]s\b/gu, '').replace(/[^a-z\s-]/gu, ' ').split(/[\s-]+/u).filter(Boolean);
  const stems = [];
  for (const raw of words) {
    if (NAME_NOISE.has(raw)) continue;
    const w = simplifyWord(raw);
    const stem = STEM_OF.get(raw) ?? STEM_OF.get(w) ?? (w.endsWith('s') && w.length > 4 ? w.slice(0, -1) : w);
    stems.push(stem);
  }
  return stems;
}
/** The folded form of a whole name, so that names differing only by case, accent, plural or article collide. */
export function nameKey(name) {
  return String(name).normalize('NFD').replace(/[̀-ͯ]/gu, '').toLowerCase().replace(/\b(the|of)\b/gu, ' ').replace(/['’]s\b/gu, '').replace(/[^a-z]/gu, '').replace(/s$/u, '');
}
/** Semantic classes of a name: the families of its stems. */
export const nameClasses = name => new Set(nameStems(name).filter(s => Object.hasOwn(STEM_FAMILIES, s)));
/** Pairs of classes that contradict one another when their waters touch or share a basin. */
export const CONTRADICTORY_CLASSES = Object.freeze([['death', 'light'], ['death', 'peace'], ['cold', 'light'], ['cold', 'fire'], ['peace', 'storm'], ['dark', 'light'], ['light', 'demon'], ['peace', 'demon'], ['cold', 'demon']]);

// ---------------------------------------------------------------------------------------------------- the checker
class Report {
  constructor() { this.errors = []; this.warnings = []; this.info = []; }
  error(code, id, message) { this.errors.push({ code, id, message }); }
  warn(code, id, message) { this.warnings.push({ code, id, message }); }
  note(code, id, message) { this.info.push({ code, id, message }); }
}

export const featuresOf = model => FEATURE_ARRAYS.flatMap(array => (model[array] ?? []).map(feature => ({ array, feature })));

function checkStructure(model, rep) {
  if (model.schemaVersion !== 1) rep.error('MODEL_VERSION', 'model', `schemaVersion must be 1, found ${model.schemaVersion}`);
  if (model.frame?.widthPx !== FRAME.widthPx || model.frame?.heightPx !== FRAME.heightPx) rep.error('MODEL_FRAME', 'model', `frame must be ${FRAME.widthPx} x ${FRAME.heightPx}`);
  const ids = new Map();
  let points = 0;
  for (const { array, feature } of featuresOf(model)) {
    const id = feature.id;
    if (typeof id !== 'string' || !/^[A-Za-z][A-Za-z0-9_.-]{0,63}$/u.test(id)) { rep.error('ID_FORMAT', String(id), `${array}: id is not a valid identifier`); continue; }
    if (ids.has(id)) rep.error('ID_DUPLICATE', id, `${array}: id also used in ${ids.get(id)}`); else ids.set(id, array);
    if (typeof feature.name !== 'string' || !feature.name.trim()) rep.error('NAME_MISSING', id, `${array}: feature has no name`);
    if (typeof feature.kind !== 'string' || !feature.kind) rep.error('KIND_MISSING', id, `${array}: feature has no kind`);
    if (typeof feature.established !== 'boolean') rep.error('ESTABLISHED_MISSING', id, `${array}: feature has no established flag`);
    const g = feature.geometry;
    if (!g || !['Point', 'LineString', 'Polygon', 'MultiPolygon'].includes(g.type)) { rep.error('GEOMETRY_MISSING', id, `${array}: geometry missing or of an unknown type`); continue; }
    const expectArea = AREA_ARRAYS.includes(array), expectLine = LINE_ARRAYS.includes(array), expectPoint = POINT_ARRAYS.includes(array);
    if (expectArea && !['Polygon', 'MultiPolygon'].includes(g.type)) rep.error('GEOMETRY_TYPE', id, `${array}: expected an area, found ${g.type}`);
    if (expectLine && g.type !== 'LineString') rep.error('GEOMETRY_TYPE', id, `${array}: expected a line, found ${g.type}`);
    if (expectPoint && g.type !== 'Point') rep.error('GEOMETRY_TYPE', id, `${array}: expected a point, found ${g.type}`);
    if (POINT_OR_LINE_ARRAYS.includes(array) && !['Point', 'LineString'].includes(g.type)) rep.error('GEOMETRY_TYPE', id, `${array}: expected a point or a line, found ${g.type}`);
    const all = g.type === 'Point' ? [g.coordinates] : g.type === 'LineString' ? g.coordinates : ringsOf(g).flat(2).length ? ringsOf(g).flatMap(part => part.flat()) : [];
    points += all.length;
    for (const p of all) if (!isFiniteCoord(p) || p[0] < 0 || p[0] > 1 || p[1] < 0 || p[1] > 1) { rep.error('COORD_RANGE', id, `${array}: a coordinate is not a number in 0..1`); break; }
  }
  if (points > MAX_POINTS) rep.error('POINT_LIMIT', 'model', `${points} vertices exceed the tool limit of ${MAX_POINTS}`);
  return points;
}

function checkNames(model, rep) {
  const byArray = new Map();
  for (const { array, feature } of featuresOf(model)) {
    const name = feature.name;
    if (typeof name !== 'string') continue;
    if (name.length > 64) rep.error('NAME_LENGTH', feature.id, `${array}: name is longer than 64 characters`);
    const hits = BANNED_NAME_PATTERNS.filter(([, re]) => re.test(name)).map(([label]) => label);
    if (hits.length) rep.error('NAME_BANNED', feature.id, `${array}: "${name}" contains a banned pattern (${hits.join(', ')})`);
    const key = nameKey(name);
    if (!byArray.has(array)) byArray.set(array, new Map());
    const seen = byArray.get(array);
    if (seen.has(key)) rep.error('NAME_DUPLICATE', feature.id, `${array}: "${name}" repeats the name of ${seen.get(key)}`); else seen.set(key, feature.id);
  }
  // Water bodies and straits share one namespace: a lake and a sea may not both be "Evian Sea".
  const water = new Map();
  for (const array of ['seas', 'lakes', 'straits']) for (const f of model[array] ?? []) {
    const key = nameKey(f.name ?? '');
    if (water.has(key)) rep.error('NAME_DUPLICATE_WATER', f.id, `"${f.name}" repeats the name of the water body ${water.get(key)}`); else water.set(key, f.id);
  }
}

function checkRings(model, rep) {
  for (const { array, feature } of featuresOf(model)) {
    const g = feature.geometry;
    if (!g) continue;
    if (g.type === 'LineString') {
      if (g.coordinates.length < 2) rep.error('LINE_SHORT', feature.id, `${array}: a line needs two vertices`);
      if (g.coordinates.length > MAX_RING_VERTICES) rep.error('LINE_LONG', feature.id, `${array}: more than ${MAX_RING_VERTICES} vertices`);
      for (let i = 1; i < g.coordinates.length; i++) if (Math.hypot(g.coordinates[i][0] - g.coordinates[i - 1][0], g.coordinates[i][1] - g.coordinates[i - 1][1]) < EPS) { rep.error('LINE_REPEAT', feature.id, `${array}: two consecutive vertices coincide`); break; }
      continue;
    }
    if (!['Polygon', 'MultiPolygon'].includes(g.type)) continue;
    const parts = ringsOf(g);
    parts.forEach((part, pi) => {
      part.forEach((ring, ri) => {
        const where = `${array} ${feature.id} part ${pi} ${ri === 0 ? 'outer ring' : `hole ${ri}`}`;
        if (ring.length < 3) { rep.error('RING_SHORT', feature.id, `${where}: fewer than 3 vertices`); return; }
        if (ring.length > MAX_RING_VERTICES) rep.error('RING_LONG', feature.id, `${where}: ${ring.length} vertices exceed ${MAX_RING_VERTICES}`);
        const first = ring[0], last = ring[ring.length - 1];
        if (Math.abs(first[0] - last[0]) < EPS && Math.abs(first[1] - last[1]) < EPS) rep.error('RING_CLOSED_COPY', feature.id, `${where}: the first vertex is repeated at the end (rings close implicitly)`);
        for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length]; if (Math.abs(p[0] - q[0]) < EPS && Math.abs(p[1] - q[1]) < EPS) { rep.error('RING_REPEAT', feature.id, `${where}: consecutive vertices coincide`); break; } }
        if (Math.abs(ringArea(ring)) * FRAME.widthPx * FRAME.heightPx < 1) rep.error('RING_AREA', feature.id, `${where}: area under one pixel`);
        const s = ringSelfIntersections(ring);
        if (s.crossings) rep.error('RING_SELF_CROSS', feature.id, `${where}: crosses itself ${s.crossings} time(s)`);
        if (s.touches) rep.error('RING_SELF_TOUCH', feature.id, `${where}: touches itself ${s.touches} time(s)`);
        if (s.spikes) rep.error('RING_SPIKE', feature.id, `${where}: ${s.spikes} zero-width spike(s)`);
      });
      // A hole lies strictly inside its outer ring and does not touch it or another hole.
      for (let h = 1; h < part.length; h++) {
        const hole = part[h];
        if (!hole.every(p => pointInRing(p[0], p[1], part[0]))) rep.error('HOLE_OUTSIDE', feature.id, `${array} ${feature.id} part ${pi}: hole ${h} leaves its outer ring`);
        const touch = ringsInteract(hole, part[0]);
        if (touch.cross || touch.touch) rep.error('HOLE_TOUCH', feature.id, `${array} ${feature.id} part ${pi}: hole ${h} touches its outer ring`);
        for (let k = h + 1; k < part.length; k++) { const t = ringsInteract(hole, part[k]); if (t.cross || t.touch) rep.error('HOLE_TOUCH', feature.id, `${array} ${feature.id} part ${pi}: holes ${h} and ${k} touch`); }
      }
    });
    // The parts of one feature do not overlap.
    for (let a = 0; a < parts.length; a++) for (let b = a + 1; b < parts.length; b++) {
      if (!boundsOverlap(boundsOf(parts[a][0]), boundsOf(parts[b][0]))) continue;
      const t = ringsInteract(parts[a][0], parts[b][0]);
      if (t.cross) rep.error('PARTS_OVERLAP', feature.id, `${array} ${feature.id}: parts ${a} and ${b} cross`);
      else if (pointInRing(parts[a][0][0][0], parts[a][0][0][1], parts[b][0]) || pointInRing(parts[b][0][0][0], parts[b][0][0][1], parts[a][0])) rep.error('PARTS_OVERLAP', feature.id, `${array} ${feature.id}: parts ${a} and ${b} lie inside one another`);
    }
  }
}

function landMask(model) {
  const land = new Uint8Array(GRID.w * GRID.h);
  for (const l of model.lands ?? []) { const m = rasterize(l.geometry); for (let i = 0; i < m.length; i++) if (m[i]) land[i] = 1; }
  return land;
}
function lakeMask(model) {
  const lake = new Uint8Array(GRID.w * GRID.h);
  for (const l of model.lakes ?? []) { const m = rasterize(l.geometry); for (let i = 0; i < m.length; i++) if (m[i]) lake[i] = 1; }
  return lake;
}
const cellOf = (x, y) => Math.min(GRID.h - 1, Math.max(0, Math.floor(y * GRID.h))) * GRID.w + Math.min(GRID.w - 1, Math.max(0, Math.floor(x * GRID.w)));

function checkWater(model, rep, ctx) {
  const { land, lake } = ctx;
  const seas = model.seas ?? [];
  const masks = seas.map(s => rasterize(s.geometry));
  ctx.seaMasks = masks;
  const owner = new Int16Array(GRID.w * GRID.h).fill(-1);
  const cells = masks.map(countSet);
  // Seas stay on water and do not overlap each other.
  seas.forEach((s, k) => {
    const onLand = overlapCount(masks[k], land);
    if (cells[k] && onLand / cells[k] > 0.02) rep.error('SEA_ON_LAND', s.id, `${s.name}: ${(100 * onLand / cells[k]).toFixed(1)}% of the sea lies on land`);
  });
  const pair = new Map();
  for (let i = 0; i < owner.length; i++) for (let k = 0; k < masks.length; k++) if (masks[k][i]) {
    if (owner[i] >= 0) { const key = `${owner[i]}|${k}`; pair.set(key, (pair.get(key) ?? 0) + 1); }
    owner[i] = k;
  }
  for (const [key, count] of [...pair].sort((a, b) => a[0].localeCompare(b[0]))) {
    const [a, b] = key.split('|').map(Number);
    const smaller = Math.min(cells[a], cells[b]);
    if (count / Math.max(1, smaller) > 0.03 && count > 8) rep.error('SEAS_OVERLAP', seas[a].id, `${seas[a].name} and ${seas[b].name} overlap by ${count} cells (${(100 * count / smaller).toFixed(1)}% of the smaller)`);
  }
  ctx.owner = owner;
  // Water that no sea claims.
  let water = 0, unclaimed = 0;
  for (let i = 0; i < owner.length; i++) if (!land[i] && !lake[i]) { water++; if (owner[i] < 0) unclaimed++; }
  ctx.water = { water, unclaimed };
  if (water && unclaimed / water > 0.01) rep.error('WATER_UNCLAIMED', 'seas', `${(100 * unclaimed / water).toFixed(2)}% of the open water belongs to no sea`);
  // Adjacent seas whose names contradict each other (death beside light, ice beside fire).
  const neighbours = new Set();
  for (let y = 0; y < GRID.h; y++) for (let x = 0; x < GRID.w; x++) {
    const i = y * GRID.w + x, a = owner[i];
    if (a < 0) continue;
    for (const j of [x + 1 < GRID.w ? i + 1 : -1, y + 1 < GRID.h ? i + GRID.w : -1]) if (j >= 0 && owner[j] >= 0 && owner[j] !== a) neighbours.add(a < owner[j] ? `${a}|${owner[j]}` : `${owner[j]}|${a}`);
  }
  ctx.seaNeighbours = [...neighbours].map(k => k.split('|').map(Number));
  for (const [a, b] of ctx.seaNeighbours) {
    const ca = nameClasses(seas[a].name), cb = nameClasses(seas[b].name);
    for (const [p, q] of CONTRADICTORY_CLASSES) if ((ca.has(p) && cb.has(q)) || (ca.has(q) && cb.has(p))) rep.error('SEA_CONTRADICTION', seas[a].id, `${seas[a].name} (${[...ca]}) borders ${seas[b].name} (${[...cb]}): the names contradict each other`);
  }
}

/** Seas: no two share a name or a meaning stem; every name fits its place. */
function checkSeaNames(model, rep, ctx) {
  const seas = model.seas ?? [];
  const keys = new Map(), stems = new Map(), families = new Map();
  for (const s of seas) {
    const key = nameKey(s.name);
    if (keys.has(key)) rep.error('SEA_NAME_DUPLICATE', s.id, `${s.name} repeats the name of ${keys.get(key)}`); else keys.set(key, s.id);
    for (const stem of new Set(nameStems(s.name))) {
      if (stems.has(stem)) rep.error('SEA_STEM_DUPLICATE', s.id, `${s.name} and ${stems.get(stem).name} share the stem "${stem}"`); else stems.set(stem, s);
    }
    for (const family of nameClasses(s.name)) {
      if (families.has(family)) rep.error('SEA_MEANING_DUPLICATE', s.id, `${s.name} and ${families.get(family).name} both mean "${family}"`); else families.set(family, s);
    }
  }
  const centre = s => { const r = ringsOf(s.geometry); let sx = 0, sy = 0, n = 0; for (const part of r) for (const p of part[0]) { sx += p[0]; sy += p[1]; n++; } return [sx / n, sy / n]; };
  const deadLands = (model.lands ?? []).filter(l => (l.regions ?? []).includes('ember_lands') || l.id === 'land_nether' || l.region === 'ember_lands' || l.region === 'nether');
  for (const s of seas) {
    const classes = nameClasses(s.name), [cx, cy] = centre(s);
    const climate = s.climate;
    if (classes.has('cold') && (cy > 0.5 || (climate && !['arctic', 'cold'].includes(climate)))) rep.error('SEA_NAME_CLIMATE', s.id, `${s.name}: a cold name on a water that is not in the cold north`);
    if (classes.has('light') && climate && !['warm', 'hot', 'temperate'].includes(climate)) rep.error('SEA_NAME_CLIMATE', s.id, `${s.name}: a name of light on a ${climate} sea`);
    if (classes.has('fire') && climate && !['volcanic', 'hot', 'stormy'].includes(climate) && !/lava/iu.test(s.name)) rep.error('SEA_NAME_CLIMATE', s.id, `${s.name}: a name of fire on a ${climate} sea`);
    if (classes.has('death') || classes.has('demon')) {
      const near = deadLands.some(l => distanceToGeometry(cx, cy, l.geometry) < 0.09) || (model.lands ?? []).some(l => (l.regions ?? []).includes('zols_mistake') && l.id === 'land_northern_wastes' && distanceToGeometry(cx, cy, l.geometry) < 0.09);
      if (!near) rep.error('SEA_NAME_PLACE', s.id, `${s.name}: a name of death or demons far from the Ember Lands and Zol's Mistake`);
    }
    if (classes.has('light') || classes.has('peace')) {
      const beside = deadLands.some(l => distanceToGeometry(cx, cy, l.geometry) < 0.05);
      if (beside) rep.error('SEA_NAME_PLACE', s.id, `${s.name}: a name of light or peace beside the Ember Lands`);
    }
  }
}

function checkLakes(model, rep, ctx) {
  const lakes = model.lakes ?? [];
  const lakeMasks = lakes.map(l => rasterize(l.geometry));
  lakes.forEach((l, k) => {
    const cells = countSet(lakeMasks[k]);
    if (!cells) { rep.error('LAKE_EMPTY', l.id, `${l.name}: lake has no area at the check grid`); return; }
    const onLand = overlapCount(lakeMasks[k], ctx.land);
    if (onLand / cells < 0.97) rep.error('LAKE_OUTSIDE_LAND', l.id, `${l.name}: only ${(100 * onLand / cells).toFixed(0)}% of the lake lies on land`);
    for (const part of ringsOf(l.geometry)) for (const p of part[0]) {
      if (!(model.lands ?? []).some(land => pointInGeometry(p[0], p[1], land.geometry))) { rep.error('LAKE_VERTEX_OFF_LAND', l.id, `${l.name}: a vertex lies off land`); break; }
    }
    if (!(model.lands ?? []).some(land => ringsOf(land.geometry).some(part => ringsOf(l.geometry).every(lp => ringsInteract(lp[0], part[0]).cross === 0)))) rep.error('LAKE_CROSSES_COAST', l.id, `${l.name}: lake crosses a coast`);
  });
  for (let a = 0; a < lakes.length; a++) for (let b = a + 1; b < lakes.length; b++) if (overlapCount(lakeMasks[a], lakeMasks[b]) > 4) rep.error('LAKES_OVERLAP', lakes[a].id, `${lakes[a].name} overlaps ${lakes[b].name}`);
  ctx.lakeMasks = lakeMasks;
}

function checkLands(model, rep, ctx) {
  const lands = model.lands ?? [];
  const bounds = lands.map(l => ringsOf(l.geometry).map(p => boundsOf(p[0])));
  for (let a = 0; a < lands.length; a++) for (let b = a + 1; b < lands.length; b++) {
    if (!bounds[a].some(ba => bounds[b].some(bb => boundsOverlap(ba, bb)))) continue;
    let bad = false;
    for (const pa of ringsOf(lands[a].geometry)) for (const pb of ringsOf(lands[b].geometry)) {
      if (!boundsOverlap(boundsOf(pa[0]), boundsOf(pb[0]))) continue;
      const t = ringsInteract(pa[0], pb[0]);
      if (t.cross) bad = true;
      else if (pointInPart(pa[0][0][0], pa[0][0][1], pb) || pointInPart(pb[0][0][0], pb[0][0][1], pa)) bad = true;
    }
    if (bad) rep.error('LANDS_OVERLAP', lands[a].id, `${lands[a].name} overlaps ${lands[b].name}`);
  }
}

/** Features that must lie on land: share of the feature on land, with per-array limits. */
function checkOnLand(model, rep, ctx) {
  const { land, lake } = ctx;
  const lakeOrLand = (x, y) => land[cellOf(x, y)] === 1;
  const share = geometry => { const m = rasterize(geometry); const c = countSet(m); return c ? overlapCount(m, land) / c : 1; };
  for (const array of ['forests', 'deserts', 'marshes', 'ice', 'plains', 'hills']) for (const f of model[array] ?? []) {
    const s = share(f.geometry);
    if (s < 0.7) rep.error('BIOME_OFF_LAND', f.id, `${f.name}: only ${(100 * s).toFixed(0)}% of the ${array} polygon lies on land (the spec asks for 70%)`);
  }
  for (const r of model.ranges ?? []) {
    const c = r.geometry.coordinates;
    const dense = [];
    for (let i = 0; i + 1 < c.length; i++) for (let t = 0; t < 8; t++) dense.push([c[i][0] + ((c[i + 1][0] - c[i][0]) * t) / 8, c[i][1] + ((c[i + 1][1] - c[i][1]) * t) / 8]);
    dense.push(c[c.length - 1]);
    const on = dense.filter(p => lakeOrLand(p[0], p[1])).length / dense.length;
    if (on < 0.9) rep.error('RANGE_OVER_WATER', r.id, `${r.name}: only ${(100 * on).toFixed(0)}% of the spine lies on land`);
  }
  for (const array of ['volcanoes', 'sites']) for (const f of model[array] ?? []) {
    const [x, y] = f.geometry.coordinates;
    const onWaterOk = f.onWater === true || f.kind === 'port' || f.kind === 'chasm';
    const inLake = ctx.lakeMasks?.some(m => m[cellOf(x, y)]);
    if (inLake && array === 'sites' && !f.lake) rep.error('SITE_IN_LAKE', f.id, `${f.name}: stands inside a lake polygon and names no lake (give it \`lake\` and put it on the shore)`);
    if (!land[cellOf(x, y)] && !onWaterOk && !inLake) {
      const near = (model.lands ?? []).some(l => distanceToGeometry(x, y, l.geometry) < 0.004);
      if (!near) rep.error(array === 'sites' ? 'SITE_OFF_LAND' : 'VOLCANO_OFF_LAND', f.id, `${f.name}: not on land`);
    }
  }
  for (const f of model.sites ?? []) {
    const [x, y] = f.geometry.coordinates;
    if (ctx.lakeMasks?.some(m => m[cellOf(x, y)])) rep.error('SITE_IN_LAKE', f.id, `${f.name}: stands inside a lake polygon; put it on the shore`);
  }
  for (const f of [...(model.roads ?? []), ...(model.passes ?? [])]) {
    const c = f.geometry.type === 'LineString' ? f.geometry.coordinates : [f.geometry.coordinates];
    const on = c.filter(p => land[cellOf(p[0], p[1])] || (model.lands ?? []).some(l => distanceToGeometry(p[0], p[1], l.geometry) < 0.004)).length / c.length;
    if (on < 0.75) rep.error('PATH_OFF_LAND', f.id, `${f.name}: only ${(100 * on).toFixed(0)}% of its vertices lie on land`);
  }
}

function checkEdgeBand(model, rep) {
  const policy = new Set(model.edgePolicy?.runsOffEdge ?? []);
  const inBand = p => p[0] < EDGE_BAND.x || p[0] > 1 - EDGE_BAND.x || p[1] < EDGE_BAND.y || p[1] > 1 - EDGE_BAND.y;
  let tolerated = 0;
  for (const { array, feature } of featuresOf(model)) {
    if (array === 'seas' || array === 'regions' || array === 'lakes' && false) continue;
    const g = feature.geometry;
    const pts = g.type === 'Point' ? [g.coordinates] : g.type === 'LineString' ? g.coordinates : ringsOf(g).flatMap(part => part[0]);
    if (!pts.some(inBand)) continue;
    if (policy.has(feature.id)) { tolerated++; continue; }
    rep.error('EDGE_BAND_LAND', feature.id, `${array}: ${feature.name} enters the open-sea band (x under ${EDGE_BAND.x} or over ${1 - EDGE_BAND.x}, y under ${EDGE_BAND.y} or over ${1 - EDGE_BAND.y}) and is not listed in edgePolicy.runsOffEdge`);
  }
  if (tolerated) rep.note('EDGE_BAND_TOLERATED', 'edgePolicy', `${tolerated} feature(s) run off the map by policy and are cleared by the tool's edge option`);
}

// ---------------------------------------------------------------------------------------------------- relief and rivers
const CLASS_OF = { peak: 5 };
/** The relief class (0 sea, 1 lowland, 2 upland, 3 hills, 4 mountain, 5 high peak) the model gives to a point. */
export function reliefClassAt(model, x, y, ctx = {}) {
  const A = FRAME.heightPx / FRAME.widthPx;
  let h = ctx.land ? (ctx.land[cellOf(x, y)] ? 1 : 0) : 1;
  if (h === 0) return 0;
  for (const range of model.ranges ?? []) {
    const hw = range.halfWidth ?? 0.005, peak = range.peakClass ?? range.elevation ?? 4;
    const d = distanceToPath(x, y, range.geometry.coordinates);
    if (d <= hw) h = Math.max(h, peak);
    else if (d <= hw * 2.2) h = Math.max(h, 3);
    else if (d <= hw * 3.6) h = Math.max(h, 2);
  }
  for (const v of model.volcanoes ?? []) if (Math.hypot(x - v.geometry.coordinates[0], (y - v.geometry.coordinates[1]) * A) < 0.012) h = Math.max(h, 5);
  for (const hill of model.hills ?? []) if (hill.kind !== 'chasm' && pointInGeometry(x, y, hill.geometry)) h = Math.max(h, 2);
  return h;
}

function checkRivers(model, rep, ctx) {
  const A = FRAME.heightPx / FRAME.widthPx;
  const rivers = model.rivers ?? [];
  const seaAt = (x, y) => { const k = ctx.owner[cellOf(x, y)]; return k >= 0 ? (model.seas ?? [])[k] : null; };
  const lakeAt = (x, y) => (model.lakes ?? []).find((l, k) => ctx.lakeMasks[k][cellOf(x, y)] || distanceToGeometry(x, y, l.geometry) < 0.004);
  const landAt = (x, y) => ctx.land[cellOf(x, y)] === 1 && !ctx.lake[cellOf(x, y)];
  for (const r of rivers) {
    const c = r.geometry.coordinates;
    const src = c[0], end = c[c.length - 1];
    if (c.length < 2) continue;
    // The source is on land (or in a lake that feeds it), never in the sea.
    if (!landAt(src[0], src[1]) && !lakeAt(src[0], src[1]) && !(model.lands ?? []).some(l => distanceToGeometry(src[0], src[1], l.geometry) < 0.004)) rep.error('RIVER_SOURCE_OFF_LAND', r.id, `${r.name}: the source is not on land`);
    // The mouth reaches the sea, a lake or another river; a dry river says so.
    const drains = r.drainsTo ?? null;
    const dryEnd = r.endorheic === true;
    const lake = lakeAt(end[0], end[1]);
    const nearSea = (model.lands ?? []).every(l => !pointInGeometry(end[0], end[1], l.geometry)) || (model.lands ?? []).some(l => { const d = distanceToGeometry(end[0], end[1], l.geometry); return d < 0.003; });
    const joins = rivers.find(o => o !== r && distanceToPath(end[0], end[1], o.geometry.coordinates) < 0.004);
    const reachesWater = !!lake || (landAt(end[0], end[1]) === false) || nearSea || !!joins;
    if (!reachesWater && !dryEnd) rep.error('RIVER_MOUTH_ON_LAND', r.id, `${r.name}: the mouth ends on land (${end[0].toFixed(3)}, ${end[1].toFixed(3)}) and the river is not marked endorheic`);
    if (dryEnd && (lake || joins)) rep.warn('RIVER_ENDORHEIC_REACHES_WATER', r.id, `${r.name}: marked endorheic but reaches water`);
    if (drains) {
      const target = [...(model.seas ?? []), ...(model.lakes ?? []), ...rivers].find(f => f.id === drains);
      if (!target) rep.error('RIVER_DRAINS_UNKNOWN', r.id, `${r.name}: drainsTo ${drains} is not a feature`);
      else if (target.geometry.type !== 'LineString' && distanceToGeometry(end[0], end[1], target.geometry) > 0.006 && !pointInGeometry(end[0], end[1], target.geometry)) rep.error('RIVER_DRAINS_ELSEWHERE', r.id, `${r.name}: the mouth is not at ${target.name}`);
      else if (target.geometry.type === 'LineString' && distanceToPath(end[0], end[1], target.geometry.coordinates) > 0.006) rep.error('RIVER_DRAINS_ELSEWHERE', r.id, `${r.name}: the mouth is not on ${target.name}`);
    }
    // Monotone relief: the class never rises along the river; no crossing of a range core except in a pass or at the source.
    const classes = [];
    let length = 0;
    for (let i = 0; i + 1 < c.length; i++) {
      const steps = Math.max(2, Math.ceil(Math.hypot(c[i + 1][0] - c[i][0], (c[i + 1][1] - c[i][1]) * A) / 0.003));
      for (let t = 0; t < steps; t++) classes.push(reliefClassAt(model, c[i][0] + ((c[i + 1][0] - c[i][0]) * t) / steps, c[i][1] + ((c[i + 1][1] - c[i][1]) * t) / steps, ctx));
      length += Math.hypot(c[i + 1][0] - c[i][0], (c[i + 1][1] - c[i][1]) * A);
    }
    classes.push(reliefClassAt(model, end[0], end[1], ctx));
    let low = Infinity, uphill = null;
    classes.forEach((v, i) => { if (v > low && !uphill && classes.slice(0, i).some(q => q < v)) uphill = [i, low, v]; low = Math.min(low, v === 0 ? Infinity : v); });
    r.__classes = undefined;
    if (uphill && length > 0.012) rep.error('RIVER_UPHILL', r.id, `${r.name}: the relief class rises from ${uphill[1]} to ${uphill[2]} along the river (a river does not run uphill or through a range)`);
    if (classes[0] < Math.min(...classes.slice(1).filter(v => v > 0)) && length > 0.02) rep.error('RIVER_SOURCE_LOW', r.id, `${r.name}: the source (class ${classes[0]}) is lower than the rest of the course`);
  }
}

function checkRegions(model, rep, ctx) {
  const regions = (model.regions ?? []).filter(r => r.kind === 'region');
  for (const r of model.regions ?? []) {
    if (!r.name) rep.error('REGION_NAME', r.id, 'region has no name');
    const a = areaPx(r.geometry);
    if (!(a > 0)) rep.error('REGION_AREA', r.id, `${r.name}: region has no area`);
    if (r.kind === 'region' && (!r.areaPx || Math.abs(r.areaPx - a) / a > 0.25)) rep.error('REGION_AREA_STALE', r.id, `${r.name}: areaPx ${r.areaPx} does not match the outline (${Math.round(a)})`);
  }
  const masks = regions.map(r => rasterize(r.geometry));
  for (let a = 0; a < regions.length; a++) for (let b = a + 1; b < regions.length; b++) {
    const c = overlapCount(masks[a], masks[b]);
    if (c > 12) rep.error('REGIONS_OVERLAP', regions[a].id, `${regions[a].name} and ${regions[b].name} claim the same ground (${c} cells)`);
  }
  // Every land cell belongs to a region.
  let orphan = 0, total = 0;
  for (let i = 0; i < ctx.land.length; i++) if (ctx.land[i]) { total++; if (!masks.some(m => m[i])) orphan++; }
  if (total && orphan / total > 0.002) rep.error('REGION_COVERAGE', 'regions', `${orphan} land cells (${(100 * orphan / total).toFixed(2)}%) belong to no region`);
  // A region name may not contradict its terrain.
  const ruleSets = [
    [/\b(desert|dunes?|sands?)\b/iu, r => (r.terrain?.desert ?? 0) >= 0.25, 'a desert name needs at least 25% desert'],
    [/\b(forest|woods?|weald)\b/iu, r => (r.terrain?.forest ?? 0) >= 0.25, 'a forest name needs at least 25% forest'],
    [/\b(cold|frozen|snow|ice|winter)\b/iu, r => (r.snowShare ?? 0) >= 0.4 || (r.terrain?.snow ?? 0) >= 0.4 || (r.climate && /arctic|cold|frozen/iu.test(r.climate)), 'a cold name needs a cold climate'],
    [/\b(sun)\b/iu, r => !(r.climate && /arctic|frozen|snow/iu.test(r.climate)), 'a sun name cannot be arctic'],
    [/\b(marsh|fen|swamp|mire)\b/iu, r => (r.terrain?.marsh ?? 0) >= 0.2, 'a marsh name needs at least 20% marsh'],
    // only a plural claims several islands: "Aenor Isle" is one isle, "the Pupor Isles" are many
    [/\b(isles|islands)\b/iu, r => ringsOf(r.geometry).length >= 2, 'an island-group name needs several islands'],
  ];
  for (const r of regions) for (const [re, ok, why] of ruleSets) if (re.test(r.name) && !ok(r)) rep.error('REGION_NAME_TERRAIN', r.id, `${r.name}: ${why}`);
}

function checkRequired(model, rep, ctx) {
  const lands = model.lands ?? [];
  const dead = lands.filter(l => l.region === 'ember_lands' || (l.regions ?? []).includes('ember_lands'));
  const nether = lands.find(l => /nether/iu.test(l.name) || l.id === 'land_nether' || l.region === 'nether');
  const deadIsland = lands.find(l => l.id === 'land_ember_lands_island');
  if (!nether) { rep.error('NETHER_MISSING', 'nether', 'the Nether has no land in the model'); return; }
  if (!deadIsland) { rep.error('NETHER_EMBER_LANDS_MISSING', 'land_ember_lands_island', 'the Ember Lands island is missing'); return; }
  const cen = g => { let sx = 0, sy = 0, n = 0; for (const part of ringsOf(g)) for (const p of part[0]) { sx += p[0]; sy += p[1]; n++; } return [sx / n, sy / n]; };
  const [nx, ny] = cen(nether.geometry), [dx, dy] = cen(deadIsland.geometry);
  if (!(ny > dy + 0.02)) rep.error('NETHER_NOT_BELOW', nether.id, `the Nether (centre y ${ny.toFixed(3)}) does not lie below the Ember Lands island (centre y ${dy.toFixed(3)})`);
  if (Math.abs(nx - dx) > 0.12) rep.error('NETHER_NOT_BELOW', nether.id, `the Nether is ${Math.abs(nx - dx).toFixed(3)} frame widths away from the Ember Lands island sideways`);
  if (areaPx(nether.geometry) < 18000) rep.error('NETHER_TOO_SMALL', nether.id, `the Nether covers ${Math.round(areaPx(nether.geometry))} px, too small to hold three provinces of 900 px per state`);
  const b = boundsOf(ringsOf(nether.geometry)[0][0]);
  if (b[1] < EDGE_BAND.y || b[3] > 1 - EDGE_BAND.y || b[0] < EDGE_BAND.x || b[2] > 1 - EDGE_BAND.x) rep.error('NETHER_IN_EDGE', nether.id, 'the Nether enters the edge band');
  const region = (model.regions ?? []).find(r => r.id === 'region_nether');
  if (!region) rep.error('NETHER_REGION', 'region_nether', 'no region_nether');
  // the seat of the Nether: site_nether (named for its capital in the roster, Zarath-Nazur) or a site named The Nether
  if (!(model.sites ?? []).some(s => s.id === 'site_nether' || /^the nether$/iu.test(s.name))) rep.error('NETHER_SITE', 'site_nether', 'no seat of the Nether (site_nether)');
  if (!(model.ranges ?? []).some(r => /nether/iu.test(r.name) && ringsOf(nether.geometry).some(part => pointInRing(...r.geometry.coordinates[Math.floor(r.geometry.coordinates.length / 2)], part[0])))) rep.error('NETHER_RANGE', 'range_nether', 'the Nether Mountains do not stand on the Nether');
  if (!(model.volcanoes ?? []).some(v => pointInGeometry(v.geometry.coordinates[0], v.geometry.coordinates[1], nether.geometry))) rep.error('NETHER_VOLCANO', 'volcano_nether', 'no volcano stands on the Nether');
  if (!(model.seas ?? []).some(s => /lava/iu.test(s.name))) rep.error('NETHER_SEA', 'sea_lava', 'the Nether has no Sea of Lava');
  void dead; void ctx;
}

function checkCounts(model, rep) {
  const floors = { seas: 20, lands: 60, ranges: 55, volcanoes: 16, rivers: 28, lakes: 12, forests: 30, deserts: 8, marshes: 9, ice: 8, plains: 18, straits: 12, passes: 18, sites: 80, regions: 19, roads: 5, coasts: 25, hills: 3 };
  for (const array of FEATURE_ARRAYS) {
    const n = (model[array] ?? []).length;
    if (n < (floors[array] ?? 1)) rep.error('COUNT_FLOOR', array, `${array}: ${n} features, at least ${floors[array]} expected`);
    if (model.featureCounts && model.featureCounts[array] !== n) rep.error('COUNT_STALE', array, `featureCounts.${array} says ${model.featureCounts[array]} but the model holds ${n}`);
  }
}

function checkCoherence(model, rep) {
  // No feature is named Dardan; Dardan stays unplaced.
  for (const { array, feature } of featuresOf(model)) if (/dardan/iu.test(feature.name ?? '')) rep.error('DARDAN_PLACED', feature.id, `${array}: Dardan must not be placed`);
  // Every renamed feature keeps the owner's label and is marked as a proposal.
  for (const s of model.seas ?? []) if (s.formerLabel && s.established !== false) rep.error('RENAME_NOT_PROPOSAL', s.id, `${s.name}: a renamed sea (formerLabel ${JSON.stringify(s.formerLabel)}) must be marked established:false`);
  // Climate coherence of deserts and ice: ice in the north or on high ground, hot deserts not in the arctic.
  for (const f of model.ice ?? []) {
    const ys = ringsOf(f.geometry).flatMap(part => part[0].map(p => p[1]));
    const y = ys.reduce((a, b) => a + b, 0) / ys.length;
    if (y > 0.5 && !/woqood|cliff/iu.test(f.name)) rep.warn('ICE_SOUTH', f.id, `${f.name}: snow south of the middle of the map`);
  }
}

/**
 * Check a model. `options.sections` may name the sections to run (default: all).
 * Returns the findings and some statistics (counts per array, point count, sea statistics).
 */
export function checkModel(model, options = {}) {
  const rep = new Report();
  const stats = { counts: {}, points: 0 };
  for (const array of FEATURE_ARRAYS) stats.counts[array] = (model[array] ?? []).length;
  stats.points = checkStructure(model, rep);
  checkNames(model, rep);
  checkRings(model, rep);
  if (rep.errors.some(e => ['GEOMETRY_MISSING', 'GEOMETRY_TYPE', 'COORD_RANGE', 'RING_SHORT'].includes(e.code))) return { ...rep, stats };
  const ctx = { land: landMask(model), lake: lakeMask(model) };
  // The lake mask carves land for the relief model only through the land mask; rivers use both.
  checkLands(model, rep, ctx);
  checkWater(model, rep, ctx);
  checkSeaNames(model, rep, ctx);
  checkLakes(model, rep, ctx);
  checkOnLand(model, rep, ctx);
  checkEdgeBand(model, rep);
  checkRivers(model, rep, ctx);
  checkRegions(model, rep, ctx);
  checkRequired(model, rep, ctx);
  checkCounts(model, rep);
  checkCoherence(model, rep);
  stats.seas = (model.seas ?? []).map(s => s.name);
  stats.water = ctx.water;
  stats.seaAdjacency = ctx.seaNeighbours?.length ?? 0;
  return { errors: rep.errors, warnings: rep.warnings, info: rep.info, stats };
}

export function loadModel(file = DEFAULT_MODEL_PATH) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function main(argv) {
  const file = argv[2] ?? DEFAULT_MODEL_PATH;
  const result = checkModel(loadModel(file));
  const line = f => `${f.code.padEnd(28)} ${String(f.id).padEnd(34)} ${f.message}`;
  const limit = Number(process.env.GEO_CHECK_LIMIT ?? 6);
  const show = (label, list) => { const seen = {}; for (const f of list) { seen[f.code] = (seen[f.code] ?? 0) + 1; if (seen[f.code] <= limit) console.log(`${label} ${line(f)}`); } for (const [code, n] of Object.entries(seen)) if (n > limit) console.log(`${label} ${code.padEnd(28)} ... ${n - limit} more`); };
  show('ERROR  ', result.errors); show('WARNING', result.warnings); show('INFO   ', result.info);
  const byCode = {};
  for (const f of result.errors) byCode[f.code] = (byCode[f.code] ?? 0) + 1;
  console.log(`\n${result.errors.length} error(s), ${result.warnings.length} warning(s); ${Object.entries(byCode).map(([k, v]) => `${k} x${v}`).join(', ')}`);
  process.exitCode = result.errors.length ? 1 : 0;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv);
