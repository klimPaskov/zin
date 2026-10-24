// Validator of the workspace form of `create_world.countries` (map tool ADR 0069, request ZR-8).
//
// The map tool's published schema (`schemas/map-operation.schema.json`) does not yet carry the realm definitions (its
// implementation branch `claude/zr8-workspace-countries` holds only the ADR at commit 867807d), so this module
// implements the ADR's rules itself. It checks the shape (`source`, 1 to 512 realms, three-character tags, points
// and polygons in the 5,120 x 2,560 world frame, weights 0.05 to 100, the `islands` and `connectedMainland` values)
// and the ADR's validation before planning:
//   - every capital and seed stands on land (MAP_WORLD_REALM_POINT_WATER in the tool);
//   - no capital or seed lies inside another realm's claim, its own exclusion or the unowned area;
//   - claims of two realms do not overlap;
//   - every overlord is a listed tag other than the realm itself, and the overlord relation has no cycle;
//   - every tag is known (the caller passes the tags the workspace declares; MAP_WORLD_REALM_TAG_UNKNOWN in the tool).
// It adds three checks of its own that the generator relies on: a realm's claim must not overlap its own exclusion
// or the unowned area (a province cannot be forced and blocked at once), and points of two realms closer than
// `minSeparationPx` are reported as a warning (they may fall into one province).
//
// Land is the caller's predicate `isLand(x, y)` on integer pixels: the tool names "the province under its pixel", so
// the pixel (floor x, floor y) is tested. The error codes are this module's own except the two the ADR names.
import { FRAME, pointInPolygons, ringsOverlap, ringValid } from './geometry.mjs';

export const RULES = Object.freeze({
  source: 'workspace',
  minRealms: 1,
  maxRealms: 512,
  tagPattern: /^[A-Z0-9]{3}$/u,
  weightMin: 0.05,
  weightMax: 100,
  islands: Object.freeze(['nearest', 'one-owner', 'unowned']),
});
export const DEFAULT_MIN_SEPARATION_PX = 12;

const isPoint = p => Array.isArray(p) && p.length === 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]);
const inFrame = p => p[0] >= 0 && p[1] >= 0 && p[0] < FRAME.width && p[1] < FRAME.height;

/**
 * @param {object} countries the `countries` object of a `create_world` operation
 * @param {{ isLand?: (x: number, y: number) => boolean, knownTags?: Set<string>, minSeparationPx?: number }} ctx
 * @returns {{ ok: boolean, errors: object[], warnings: object[] }}
 */
export function validateCountries(countries, ctx = {}) {
  const errors = [], warnings = [];
  const err = (code, message, extra = {}) => errors.push({ code, message, ...extra });
  const minSep = ctx.minSeparationPx ?? DEFAULT_MIN_SEPARATION_PX;
  if (!countries || typeof countries !== 'object' || Array.isArray(countries)) { err('COUNTRIES_FORM_INVALID', 'countries must be an object of the workspace form'); return { ok: false, errors, warnings }; }
  const allowed = new Set(['source', 'realms', 'unowned', 'islands', 'connectedMainland']);
  for (const k of Object.keys(countries)) if (!allowed.has(k)) err('COUNTRIES_FORM_INVALID', `unknown field countries.${k}`);
  if (countries.source !== RULES.source) err('COUNTRIES_FORM_INVALID', `countries.source must be "${RULES.source}"`);
  if (countries.islands !== undefined && !RULES.islands.includes(countries.islands)) err('COUNTRIES_FORM_INVALID', `countries.islands must be one of ${RULES.islands.join(', ')}`);
  if (countries.connectedMainland !== undefined && typeof countries.connectedMainland !== 'boolean') err('COUNTRIES_FORM_INVALID', 'countries.connectedMainland must be a boolean');
  const realms = Array.isArray(countries.realms) ? countries.realms : [];
  if (!Array.isArray(countries.realms) || realms.length < RULES.minRealms || realms.length > RULES.maxRealms) err('COUNTRIES_FORM_INVALID', `countries.realms must hold ${RULES.minRealms} to ${RULES.maxRealms} realms`);

  const polygonsOk = (list, where, tag) => {
    if (list === undefined) return [];
    if (!Array.isArray(list)) { err('REALM_POLYGON_INVALID', `${where} must be a list of polygons`, { tag }); return []; }
    const good = [];
    list.forEach((ring, k) => {
      if (!ringValid(ring)) err('REALM_POLYGON_INVALID', `${where}[${k}] is not a polygon of at least three finite points with an area`, { tag });
      else if (!ring.every(inFrame)) err('REALM_POLYGON_INVALID', `${where}[${k}] leaves the world frame`, { tag });
      else good.push(ring);
    });
    return good;
  };
  const unowned = polygonsOk(countries.unowned, 'countries.unowned', null);

  const realmFields = new Set(['tag', 'capital', 'seeds', 'claim', 'exclude', 'weight', 'overlord']);
  const byTag = new Map();
  const entries = realms.map((r, index) => {
    const tag = r?.tag;
    for (const k of Object.keys(r ?? {})) if (!realmFields.has(k)) err('COUNTRIES_FORM_INVALID', `realm ${tag ?? index} has unknown field ${k}`, { tag });
    if (typeof tag !== 'string' || !RULES.tagPattern.test(tag)) err('REALM_TAG_INVALID', `realm ${index} has tag ${JSON.stringify(tag)}, not three capital letters or digits`, { tag });
    else if (byTag.has(tag)) err('REALM_TAG_DUPLICATE', `tag ${tag} appears more than once`, { tag });
    else byTag.set(tag, index);
    if (ctx.knownTags && typeof tag === 'string' && !ctx.knownTags.has(tag)) err('MAP_WORLD_REALM_TAG_UNKNOWN', `tag ${tag} is not declared by the workspace`, { tag });
    const points = [];
    if (!isPoint(r?.capital)) err('REALM_POINT_INVALID', `realm ${tag} has no capital point`, { tag });
    else points.push({ kind: 'capital', p: r.capital });
    if (r?.seeds !== undefined) {
      if (!Array.isArray(r.seeds)) err('REALM_POINT_INVALID', `realm ${tag} seeds must be a list of points`, { tag });
      else r.seeds.forEach((s, k) => (isPoint(s) ? points.push({ kind: `seeds[${k}]`, p: s }) : err('REALM_POINT_INVALID', `realm ${tag} seeds[${k}] is not a point`, { tag })));
    }
    for (const pt of points) if (!inFrame(pt.p)) err('REALM_POINT_OUTSIDE_FRAME', `realm ${tag} ${pt.kind} ${JSON.stringify(pt.p)} lies outside the ${FRAME.width} x ${FRAME.height} frame`, { tag });
    if (r?.weight !== undefined && !(Number.isFinite(r.weight) && r.weight >= RULES.weightMin && r.weight <= RULES.weightMax)) err('REALM_WEIGHT_RANGE', `realm ${tag} weight ${r.weight} is outside ${RULES.weightMin} to ${RULES.weightMax}`, { tag });
    return { tag, index, points: points.filter(pt => inFrame(pt.p)), claim: polygonsOk(r?.claim, `realm ${tag} claim`, tag), exclude: polygonsOk(r?.exclude, `realm ${tag} exclude`, tag), overlord: r?.overlord };
  });

  for (const e of entries) {
    for (const pt of e.points) {
      const [x, y] = pt.p;
      if (ctx.isLand && !ctx.isLand(Math.floor(x), Math.floor(y))) err('MAP_WORLD_REALM_POINT_WATER', `realm ${e.tag} ${pt.kind} ${JSON.stringify(pt.p)} is not on land`, { tag: e.tag, point: pt.p });
      if (pointInPolygons(x, y, e.exclude)) err('REALM_POINT_IN_OWN_EXCLUSION', `realm ${e.tag} ${pt.kind} ${JSON.stringify(pt.p)} lies inside its own exclusion`, { tag: e.tag, point: pt.p });
      if (pointInPolygons(x, y, unowned)) err('REALM_POINT_UNOWNED', `realm ${e.tag} ${pt.kind} ${JSON.stringify(pt.p)} lies inside the unowned area`, { tag: e.tag, point: pt.p });
      for (const o of entries) if (o !== e && pointInPolygons(x, y, o.claim)) err('REALM_POINT_IN_CLAIM', `realm ${e.tag} ${pt.kind} ${JSON.stringify(pt.p)} lies inside the claim of ${o.tag}`, { tag: e.tag, other: o.tag, point: pt.p });
    }
    for (const c of e.claim) {
      if (e.exclude.some(x => ringsOverlap(c, x))) err('REALM_CLAIM_EXCLUDED', `realm ${e.tag} claims land its own exclusion blocks`, { tag: e.tag });
      if (unowned.some(u => ringsOverlap(c, u))) err('REALM_CLAIM_UNOWNED', `realm ${e.tag} claims land inside the unowned area`, { tag: e.tag });
    }
  }
  for (let i = 0; i < entries.length; i++) for (let j = i + 1; j < entries.length; j++) {
    const a = entries[i], b = entries[j];
    if (a.claim.some(c => b.claim.some(d => ringsOverlap(c, d)))) err('REALM_CLAIMS_OVERLAP', `the claims of ${a.tag} and ${b.tag} overlap`, { tag: a.tag, other: b.tag });
    for (const p of a.points) for (const q of b.points) {
      const d = Math.hypot(p.p[0] - q.p[0], p.p[1] - q.p[1]);
      if (d < minSep) warnings.push({ code: 'REALM_POINTS_CLOSE', message: `${a.tag} ${p.kind} and ${b.tag} ${q.kind} are ${d.toFixed(1)} px apart (under ${minSep}); they may fall into one province`, tag: a.tag, other: b.tag });
    }
  }
  // overlords: known, not self, no cycle
  for (const e of entries) {
    if (e.overlord === undefined) continue;
    if (typeof e.overlord !== 'string' || !byTag.has(e.overlord)) err('REALM_OVERLORD_UNKNOWN', `realm ${e.tag} names overlord ${JSON.stringify(e.overlord)}, which is not a listed realm`, { tag: e.tag, other: e.overlord });
    else if (e.overlord === e.tag) err('REALM_OVERLORD_CYCLE', `realm ${e.tag} is its own overlord`, { tag: e.tag, other: e.tag });
  }
  const over = new Map(entries.filter(e => typeof e.overlord === 'string' && byTag.has(e.overlord) && e.overlord !== e.tag).map(e => [e.tag, e.overlord]));
  const reported = new Set();
  for (const start of over.keys()) {
    const path = [start], seen = new Set([start]);
    let cur = over.get(start);
    while (cur !== undefined) {
      if (seen.has(cur)) {
        const cycle = path.slice(path.indexOf(cur));
        const key = [...cycle].sort().join(',');
        if (!reported.has(key)) { reported.add(key); err('REALM_OVERLORD_CYCLE', `the overlord relation forms a cycle: ${[...cycle, cur].join(' -> ')}`, { tag: cycle[0], other: cycle[cycle.length - 1] }); }
        break;
      }
      seen.add(cur); path.push(cur); cur = over.get(cur);
    }
  }
  return { ok: errors.length === 0, errors, warnings };
}
