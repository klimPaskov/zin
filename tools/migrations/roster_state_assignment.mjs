// The states of the realms, read from the map that is in the mod (history/states, written by the map tool's create_world). Requirements
// R-20 to R-29 and the state table: the state table is keyed by geography features, so every capital is found through its point and
// never through a state id, and a state id renumbers whenever the map is written.
//
// The map tool gives every owned state its realm tag (ownership follows the realms' capital points, exclusions, claims and weight-balanced
// growth, tools/politics/data/create_world_call.json). This script carries that ownership into tools/content/data/world/state_assignment.json
// with the realm key, the rule and the reason of each state, and resolves each realm's capital through the realm's point of the
// create_world call (lib/map_features.mjs): the state under the point, or the nearest state the realm owns when the point lies on water.
// States without an owner (unowned land on purpose) carry no entry.
//
//   node tools/migrations/roster_state_assignment.mjs            dry run: prints the summary, writes nothing
//   node tools/migrations/roster_state_assignment.mjs --apply    writes the file (deterministic: a second run changes nothing)
//
// Inputs (read-only): data/world/roster.json, tools/politics/data/create_world_call.json, history/states, localisation/replace/world_l_english.yml,
// map/provinces.bmp, map/definition.csv, data/geography/import/aoaz.geography.json, data/world/former_states.json (a frozen record).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadMap, LAND_SEARCH_PIXELS } from '../content/lib/map_features.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ZIN = path.resolve(here, '../..');
const DATA = path.join(ZIN, 'tools/content/data');
const OUT = path.join(DATA, 'world/state_assignment.json');
const readJson = f => JSON.parse(readFileSync(f, 'utf8'));

// Wild lands: removed rows with no realm of their own. The realm that borders the wild land holds it on the map, so a row that the migration
// removed without a target still has a holder for its role (successor() in lib/roster.mjs).
export const WILD_HOLDERS = {
  Y7V: { holder: 'herrodon', reason: 'The Lustras Hills of the krors lie south of the Herrodon Mountains (magical_lands.md 2); Herrodon borders both of the old Sacomananos states and holds the wild hills on the map.' },
  Y7Y: { holder: 'eldafaen', reason: 'The Lost Lands are the empty shore under the Herrodon rim (magical_lands.md 7 and 11); Eldafaen borders five of the old Filion states, through its capital, and holds the empty coast on the map.' },
  Y3O: { holder: 'benan', reason: 'The Cursed Square is a reef where islanders live on wrecks, held on the map by Benan (tritons_islands.md 11).' },
};

export function assignStates() {
  const roster = readJson(path.join(DATA, 'world/roster.json'));
  const createWorld = readJson(path.join(ZIN, 'tools/politics/data/create_world_call.json'));
  const realmByTag = new Map(roster.realms.map(r => [r.tag, r]));
  const pointByTag = new Map(createWorld.arguments.operations[0].countries.realms.map(r => [r.tag, r.capital]));
  const map = loadMap(ZIN);
  const problems = [];

  const out = [];
  for (const s of map.states) {
    if (s.owner === null) continue;
    const r = realmByTag.get(s.owner);
    if (!r) { problems.push(`state ${s.id}: owner ${s.owner} is no realm of the roster`); continue; }
    out.push({ id: s.id, name: s.name, realm: r.key, owner: r.tag, rule: 'map', reason: `Held by ${r.name} on the map written by create_world (its seat and weight-balanced growth from it, with the realm's exclusions and claims).` });
  }
  const ownerOf = new Map(out.map(s => [s.id, s.owner]));
  const ownedBy = new Map();
  for (const s of out) (ownedBy.get(s.realm) ?? ownedBy.set(s.realm, []).get(s.realm)).push(s.id);

  const capitals = [];
  for (const r of roster.realms) {
    const mine = ownedBy.get(r.key) ?? [];
    if (!mine.length) { problems.push(`${r.key}: no state on the map`); continue; }
    const point = pointByTag.get(r.tag);
    if (!point) { problems.push(`${r.key}: no capital point in the create_world call`); continue; }
    const [x, y] = [point.x, point.y];
    const direct = map.pointState(x, y);
    const accept = id => ownerOf.get(id) === r.tag;
    let state, reason;
    if (direct !== null && accept(direct)) {
      state = direct;
      reason = `The seat of ${r.name}: its capital point ${r.capital?.siteId ?? '(no site)'} lies in this state.`;
    } else {
      state = map.landStateNear(x, y, LAND_SEARCH_PIXELS, accept);
      reason = `The seat of ${r.name}: its capital point lies on water or another realm's land, so the nearest state it owns is its seat.`;
    }
    if (state === null) { problems.push(`${r.key}: no state it owns within ${LAND_SEARCH_PIXELS} pixels of its capital point`); continue; }
    capitals.push({ realm: r.key, tag: r.tag, state, name: map.stateName(state), site: r.capital?.siteId ?? null, point: [x, y], reason });
  }
  for (const c of capitals) {
    const st = out.find(s => s.id === c.state);
    if (st) { st.rule = 'capital'; st.reason = `${st.reason} ${c.reason}`; }
  }

  const realms = roster.realms.map(r => {
    const n = (ownedBy.get(r.key) ?? []).length, target = /(\d+)\s+states?\b/.exec(r.extent ?? '')?.[1];
    return { realm: r.key, tag: r.tag, states: n, extentStates: target ? Number(target) : null };
  });
  const landless = realms.filter(r => !r.states).map(r => r.realm);
  if (landless.length) problems.push(`realms without land: ${landless.join(', ')}`);
  const removed = roster.migration.filter(m => m.fate === 'removed').map(m => ({ oldTag: m.oldTag, oldName: m.oldName, holder: m.into[0] ?? WILD_HOLDERS[m.oldTag]?.holder ?? null, wild: !m.into[0], reason: m.into[0] ? m.reason : WILD_HOLDERS[m.oldTag]?.reason ?? null }));
  const unowned = map.states.filter(s => s.owner === null).map(s => ({ id: s.id, name: s.name, reason: 'Unowned land on purpose: no realm holds it on the map (the create_world call leaves it unowned).' }));
  if (problems.length) throw new Error(`State assignment failed:\n  ${problems.join('\n  ')}`);
  const rule = out.reduce((a, s) => ({ ...a, [s.rule]: (a[s.rule] ?? 0) + 1 }), {});
  return {
    schema: 2,
    owner: 'tools/migrations/roster_state_assignment.mjs; regenerate with node tools/migrations/roster_state_assignment.mjs --apply, never by hand',
    note: 'The owned states of the map in the mod (history/states), each given to its realm, with the realm\'s capital resolved through the realm\'s capital point of the create_world call. Ids renumber whenever the map is written: regenerate this file after any map write. Unowned states carry no entry (`unowned`).',
    counts: { states: out.length, unowned: unowned.length, ...rule, realms: realms.filter(r => r.states).length, landless: landless.length, mapStates: map.states.length },
    rules: { capitalSearchPixels: LAND_SEARCH_PIXELS, wildHolders: WILD_HOLDERS },
    removed,
    capitals,
    realms,
    unowned,
    states: out.map(({ id, name, owner, realm, rule: ru, reason }) => ({ id, name, owner, realm, rule: ru, reason })),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = assignStates();
  const text = JSON.stringify(result, null, 1) + '\n';
  const same = existsSync(OUT) && readFileSync(OUT, 'utf8') === text;
  const apply = process.argv.includes('--apply');
  if (apply && !same) writeFileSync(OUT, text);
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry run', changed: !same, file: path.relative(ZIN, OUT).split(path.sep).join('/'), counts: result.counts, smallest: result.realms.filter(r => r.states).sort((a, b) => a.states - b.states).slice(0, 5) }, null, 1));
}
