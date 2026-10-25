// Validator of the workspace form of `create_world.countries` (map tool ADR 0069, request ZR-8), in the shape of the
// tool's schema (`schemas/map-operation.schema.json` on the tool's main branch since PR 44, release 4.5.0):
//
//   { source: "workspace", realms: [{ tag, capital, seeds?, claim?, exclude?, weight? }], unowned?, islands? }
//
// Points are { x, y } objects of non-negative integer world pixels, top-left origin; a polygon is a list of 3 to 10,000
// points; a realm has at most 256 seeds, 1 to 64 claim polygons and 1 to 64 exclusion polygons; at most 256 unowned
// polygons; 1 to 512 realms; tags match ^[A-Z][A-Z0-9]{2}$; weights 0.05 to 100; islands nearest, one-owner or
// unowned. Every object is strict (no other keys). The schema itself is checked with the tool's Ajv
// (realm_seeds.mjs --schema); this module adds the rules the schema cannot express, from the ADR:
//   - every capital and seed stands on land (MAP_WORLD_REALM_POINT_WATER in the tool);
//   - no capital or seed lies inside another realm's claim, its own exclusion or the unowned area;
//   - claims of two realms do not overlap;
//   - every tag is known (the caller passes the tags the workspace declares; MAP_WORLD_REALM_TAG_UNKNOWN in the tool);
//   - points stay inside the 5,120 x 2,560 frame.
// It adds checks of its own: a realm's claim must not overlap its own exclusion or the unowned area (a province
// cannot be forced and blocked at once), and points of two realms closer than `minSeparationPx` are a warning.
// Subject relations are not part of the workspace form (ADR 0069 leaves subjects out); `validateSubjects` checks the
// roster's relations for unknown overlords and cycles, for the report and the mod's own build.
//
// Land is the caller's predicate `isLand(x, y)` on integer pixels: the tool names "the province under its pixel".
// The error codes are this module's own except the two the ADR names.
import { FRAME, pointInPolygons, ringsOverlap, ringValid } from './geometry.mjs';

export const RULES = Object.freeze({
  source: 'workspace',
  minRealms: 1,
  maxRealms: 512,
  tagPattern: /^[A-Z][A-Z0-9]{2}$/u,
  weightMin: 0.05,
  weightMax: 100,
  maxSeeds: 256,
  maxClaimPolygons: 64,
  maxExcludePolygons: 64,
  maxUnownedPolygons: 256,
  minPolygonPoints: 3,
  maxPolygonPoints: 10000,
  islands: Object.freeze(['nearest', 'one-owner', 'unowned']),
  countriesFields: Object.freeze(['source', 'realms', 'unowned', 'islands']),
  realmFields: Object.freeze(['tag', 'capital', 'seeds', 'claim', 'exclude', 'weight']),
});
export const DEFAULT_MIN_SEPARATION_PX = 12;

/** A point of the schema: { x, y }, non-negative integers, no other keys. */
export const isPoint = p => !!p && typeof p === 'object' && !Array.isArray(p) && Object.keys(p).length === 2 && Number.isInteger(p.x) && Number.isInteger(p.y) && p.x >= 0 && p.y >= 0;
const xy = p => [p.x, p.y];
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
  for (const k of Object.keys(countries)) if (!RULES.countriesFields.includes(k)) err('COUNTRIES_FORM_INVALID', `unknown field countries.${k}`);
  if (countries.source !== RULES.source) err('COUNTRIES_FORM_INVALID', `countries.source must be "${RULES.source}"`);
  if (countries.islands !== undefined && !RULES.islands.includes(countries.islands)) err('COUNTRIES_FORM_INVALID', `countries.islands must be one of ${RULES.islands.join(', ')}`);
  const realms = Array.isArray(countries.realms) ? countries.realms : [];
  if (!Array.isArray(countries.realms) || realms.length < RULES.minRealms || realms.length > RULES.maxRealms) err('COUNTRIES_FORM_INVALID', `countries.realms must hold ${RULES.minRealms} to ${RULES.maxRealms} realms`);

  /** A list of polygons of the schema, as rings of [x, y]; invalid ones are reported and left out. */
  const polygonsOk = (list, where, tag, { min = 1, max }) => {
    if (list === undefined) return [];
    if (!Array.isArray(list) || list.length < min || list.length > max) { err('REALM_POLYGON_INVALID', `${where} must be a list of ${min} to ${max} polygons`, { tag }); return []; }
    const good = [];
    list.forEach((poly, k) => {
      if (!Array.isArray(poly) || poly.length < RULES.minPolygonPoints || poly.length > RULES.maxPolygonPoints || !poly.every(isPoint)) { err('REALM_POLYGON_INVALID', `${where}[${k}] is not a polygon of ${RULES.minPolygonPoints} to ${RULES.maxPolygonPoints} { x, y } points`, { tag }); return; }
      const ring = poly.map(xy);
      if (!ringValid(ring)) err('REALM_POLYGON_INVALID', `${where}[${k}] has no area`, { tag });
      else if (!ring.every(inFrame)) err('REALM_POLYGON_INVALID', `${where}[${k}] leaves the world frame`, { tag });
      else good.push(ring);
    });
    return good;
  };
  const unowned = polygonsOk(countries.unowned, 'countries.unowned', null, { min: 0, max: RULES.maxUnownedPolygons });

  const byTag = new Map();
  const entries = realms.map((r, index) => {
    const tag = r?.tag;
    for (const k of Object.keys(r ?? {})) if (!RULES.realmFields.includes(k)) err('COUNTRIES_FORM_INVALID', `realm ${tag ?? index} has unknown field ${k}`, { tag });
    if (typeof tag !== 'string' || !RULES.tagPattern.test(tag)) err('REALM_TAG_INVALID', `realm ${index} has tag ${JSON.stringify(tag)}, not a capital letter and two capital letters or digits`, { tag });
    else if (byTag.has(tag)) err('REALM_TAG_DUPLICATE', `tag ${tag} appears more than once`, { tag });
    else byTag.set(tag, index);
    if (ctx.knownTags && typeof tag === 'string' && !ctx.knownTags.has(tag)) err('MAP_WORLD_REALM_TAG_UNKNOWN', `tag ${tag} is not declared by the workspace`, { tag });
    const points = [];
    if (!isPoint(r?.capital)) err('REALM_POINT_INVALID', `realm ${tag} has no capital { x, y } point`, { tag });
    else points.push({ kind: 'capital', p: xy(r.capital) });
    if (r?.seeds !== undefined) {
      if (!Array.isArray(r.seeds) || r.seeds.length > RULES.maxSeeds) err('REALM_POINT_INVALID', `realm ${tag} seeds must be a list of at most ${RULES.maxSeeds} points`, { tag });
      else r.seeds.forEach((s, k) => (isPoint(s) ? points.push({ kind: `seeds[${k}]`, p: xy(s) }) : err('REALM_POINT_INVALID', `realm ${tag} seeds[${k}] is not a { x, y } point`, { tag })));
    }
    for (const pt of points) if (!inFrame(pt.p)) err('REALM_POINT_OUTSIDE_FRAME', `realm ${tag} ${pt.kind} (${pt.p.join(', ')}) lies outside the ${FRAME.width} x ${FRAME.height} frame`, { tag });
    if (r?.weight !== undefined && !(Number.isFinite(r.weight) && r.weight >= RULES.weightMin && r.weight <= RULES.weightMax)) err('REALM_WEIGHT_RANGE', `realm ${tag} weight ${r.weight} is outside ${RULES.weightMin} to ${RULES.weightMax}`, { tag });
    return { tag, index, points: points.filter(pt => inFrame(pt.p)), claim: polygonsOk(r?.claim, `realm ${tag} claim`, tag, { max: RULES.maxClaimPolygons }), exclude: polygonsOk(r?.exclude, `realm ${tag} exclude`, tag, { max: RULES.maxExcludePolygons }) };
  });

  for (const e of entries) {
    for (const pt of e.points) {
      const [x, y] = pt.p, at = `(${x}, ${y})`;
      if (ctx.isLand && !ctx.isLand(x, y)) err('MAP_WORLD_REALM_POINT_WATER', `realm ${e.tag} ${pt.kind} ${at} is not on land`, { tag: e.tag, point: pt.p });
      if (pointInPolygons(x, y, e.exclude)) err('REALM_POINT_IN_OWN_EXCLUSION', `realm ${e.tag} ${pt.kind} ${at} lies inside its own exclusion`, { tag: e.tag, point: pt.p });
      if (pointInPolygons(x, y, unowned)) err('REALM_POINT_UNOWNED', `realm ${e.tag} ${pt.kind} ${at} lies inside the unowned area`, { tag: e.tag, point: pt.p });
      for (const o of entries) if (o !== e && pointInPolygons(x, y, o.claim)) err('REALM_POINT_IN_CLAIM', `realm ${e.tag} ${pt.kind} ${at} lies inside the claim of ${o.tag}`, { tag: e.tag, other: o.tag, point: pt.p });
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
  return { ok: errors.length === 0, errors, warnings };
}

/**
 * Subject relations ([{ tag, overlord }]): every overlord a listed tag other than the subject, and no cycle.
 * @returns {{ ok: boolean, errors: object[] }}
 */
export function validateSubjects(relations, tags) {
  const errors = [], known = new Set(tags);
  const over = new Map();
  for (const { tag, overlord } of relations) {
    if (!known.has(overlord)) errors.push({ code: 'REALM_OVERLORD_UNKNOWN', message: `realm ${tag} names overlord ${JSON.stringify(overlord)}, which is not a listed realm`, tag, other: overlord });
    else if (overlord === tag) errors.push({ code: 'REALM_OVERLORD_CYCLE', message: `realm ${tag} is its own overlord`, tag, other: tag });
    else over.set(tag, overlord);
  }
  const reported = new Set();
  for (const start of over.keys()) {
    const path = [start], seen = new Set([start]);
    let cur = over.get(start);
    while (cur !== undefined) {
      if (seen.has(cur)) {
        const cycle = path.slice(path.indexOf(cur)), key = [...cycle].sort().join(',');
        if (!reported.has(key)) { reported.add(key); errors.push({ code: 'REALM_OVERLORD_CYCLE', message: `the overlord relation forms a cycle: ${[...cycle, cur].join(' -> ')}`, tag: cycle[0], other: cycle[cycle.length - 1] }); }
        break;
      }
      seen.add(cur); path.push(cur); cur = over.get(cur);
    }
  }
  return { ok: errors.length === 0, errors };
}
