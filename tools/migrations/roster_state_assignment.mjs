// The old map's states for the new roster (requirements R-20 to R-29; decisions K35 and K36). Until the new map from the owner's
// drawing replaces the old generated map, the 156 realms of tools/content/data/world/roster.json live on the old map's 1,332 states:
//
//   kept, renamed   the row's states stay with the realm it became
//   merged          the row's states go to the realm it joined
//   split           the row's states go to the nearest capital among its targets (the first target keeps the row's own capital;
//                   the others are anchored at the state named in SPLIT_ANCHORS)
//   removed         the row's land goes to the realm the migration names, or, for a wild land, to the realm that holds it on the map
//                   (WILD_HOLDERS)
//   carved          a realm with no old row (dwarf holds, goblin realms, Olodor, Tirlan, the Aenor Forest, the Mushroom Forest ...)
//                   takes the states its dossier describes (CARVE), before any other rule
//
// Every state carries the rule and the reason that placed it, so the politics step can redo the assignment on the new map. The output is
// tools/content/data/world/state_assignment.json; the builder reads it through tools/content/lib/roster.mjs.
//
//   node tools/migrations/roster_state_assignment.mjs            dry run: prints the summary, writes nothing
//   node tools/migrations/roster_state_assignment.mjs --apply    writes the file (deterministic: a second run changes nothing)
//
// Inputs (read-only): roster.json, the old country table data/world/legacy_countries.json, the map generator's history/states and
// localisation/english/state_names_l_english.yml, and the state centres of data/forces_geography.json (by state id).
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ZIN = path.resolve(here, '../..');
const DATA = path.join(ZIN, 'tools/content/data');
const OUT = path.join(DATA, 'world/state_assignment.json');
const readJson = f => JSON.parse(readFileSync(f, 'utf8'));

// Realms with no old row, and the old states their dossiers describe (research of 24 October 2026; the dossier and section are in each
// realm's roster `source`). No carved state is an old row's capital, and no giving realm is left without land.
export const CARVE = [
  { realm: 'burrikkrit', states: [1288, 1286], capital: 1288, reason: 'The Cursed Mountains and the south of the Giant Mountains above the Forests of Darkhere, 2 states (middle_lands.md 3.7 and 11): 1288 at the south end of the Cursed Mountains ridge, where the throne-cave Glimzig lies, and 1286 under the Giant Mountains on the south-east edge of the Darkhere wood; the two border each other.' },
  { realm: 'olodor', states: [240], capital: 240, reason: 'The gnome holts of the Deodolor Hills north of the Stone Forest, within a day\'s walk of Parim, 1 state (middle_lands.md 3.7): 240 (Stone Forest) is the state between the Deodolor ridge and the petrified wood.' },
  { realm: 'aenor_forest', states: [133, 131, 879], capital: 133, reason: 'The north-coast forest between Selen, Konori and the Bloody Forest, 3 states (middle_lands.md 2.5a): 133 (Aenor Forest) and 131 lie inside the coast forest and 879 carries it east under the Crown Mountains. Selen falls to the roster\'s about 9 states; its two eastern states (876 Kolula, 878) are cut off from its west on the old map.' },
  { realm: 'tirlan', states: [749], capital: 749, reason: 'The three Hilorn valleys inside Hirolon\'s ring, 1 state (hirolon.md 11, decision K35): 749 lies on the River Hilorn inside the ring; Hirolon keeps Bedogus (241) and Hunfeler (966).' },
  { realm: 'hrakbrund', states: [1130, 1140], capital: 1130, reason: 'The High Mountains at the centre of the island, joined to the Loso heights (north_lands.md 2 and 11): 1130 on the Loso line inside the Dwarc and Swy Forests, and 1140, which borders it.' },
  { realm: 'brundahrim', states: [263, 264], capital: 263, reason: 'The Herlitz and Dusty Mountains on the west spine of the Kradlon Peninsula; the Kradlon row gives the Herlitz range to the dwarves (west_lands.md 2 and 11): 263 and 264 are the peninsula\'s tail, Kradlon\'s only hill states; Kradlon keeps the rest in one piece.' },
  { realm: 'gromkerm', states: [116], capital: 116, reason: 'The Bolpor and Boldor Mountains on the east flank of the Kulolo valley, with the Outer Gate above the Kulolo (west_lands.md 2 and 11): 116 lies on that line just east of the river; Lambin keeps 9 states.' },
  { realm: 'burnikit', states: [1151], capital: 1151, reason: 'The warm deep caves under the Goldoroth Mountains, heated by the volcano (dark_lands.md 2 and 11): 1151 (South Goldor) lies at the Goldoroth Volcano under the west end of the range, and taking it keeps Goldoroth in one piece. It is carved before the Goldoroth split.' },
  { realm: 'hoorunoron', states: [440, 1078], capital: 440, reason: 'The Giant Forest by the Giant River behind the Borderline of Giants (dark_lands.md 11): 440 and 1078 are both named The Borderline of Giants and border each other; one state each comes from The Darks and Blackton.' },
  { realm: 'wahatud', states: [944, 981, 982, 507], capital: 944, reason: 'The oases of the dune sea in the south-west of the Sun Desert, about 4 states (south_lands.md 11), while Miaed keeps the Hardtmuth passes and the south coast: four contiguous desert states of Miaed around the centre of the Sun Desert.' },
  { realm: 'god_forest', states: [72], capital: 72, reason: 'The Keepers\' God Forest south of Sun Lake, 1 state (lands_of_the_sun.md 11): 72 lies at the centre of the God Forest; Tor Luni keeps its capital and the other Godland states.' },
  { realm: 'mushroom_forest', states: [1236, 604, 37], capital: 1236, reason: 'The fungal belt along the rift shore east of the Elwen, 3 states (magical_lands.md 2 and 11): three bordering states inside the fungal belt, 1236 nearest the Mushroom Forest. The old state 146 named Mushroom Forest lies far south-west of the belt and stays where it is.' },
];
// The capital seat of each split target that does not continue the split row (the first target keeps the row's own capital).
export const SPLIT_ANCHORS = {
  veshazel: { state: 313, reason: 'The Goldoroth Ash Fields face the Sea of Dolon on the south of the Goldoroth arm (dark_lands.md 2 and 11): 313 (Goldoroth Islands) is the old Goldoroth state nearest that coast.' },
  nether: { state: 143, reason: 'The Nether is the volcanic island south of the Ember Lands (nether.md): 143 (Death Islands) is the old Volgan state nearest the Nether.' },
  ghaahu: { state: 374, reason: 'Ghaahu is the north-east snow plain among the Cold Mountains (cold_lands.md 11): the old Yeti Lands row lies in two clusters, and 374 anchors the north-east one.' },
};
// Wild lands: removed rows with no realm. HOI4 needs an owner for every state, so the realm that borders the wild land holds it on the map.
export const WILD_HOLDERS = {
  Y7V: { holder: 'herrodon', reason: 'The Lustras Hills of the krors lie south of the Herrodon Mountains (magical_lands.md 2); Herrodon borders both of the old Sacomananos states and holds the wild hills on the map.' },
  Y7Y: { holder: 'eldafaen', reason: 'The Lost Lands are the empty shore under the Herrodon rim (magical_lands.md 7 and 11); Eldafaen borders five of the old Filion states, through its capital, and holds the empty coast on the map.' },
  Y3O: { holder: 'benan', reason: 'The Cursed Square is a reef where islanders live on wrecks, held on the map by Benan (tritons_islands.md 11).' },
};

function stateFiles() {
  const dir = path.join(ZIN, 'history/states'), out = [];
  for (const f of readdirSync(dir).filter(n => n.endsWith('.txt')).sort()) {
    const t = readFileSync(path.join(dir, f), 'utf8');
    const id = Number(/\bid\s*=\s*(\d+)/.exec(t)?.[1]), owner = /\bowner\s*=\s*([A-Za-z0-9]+)/.exec(t)?.[1];
    if (!Number.isInteger(id) || !owner) throw new Error(`State file ${f} has no id or owner`);
    out.push({ id, oldOwner: owner });
  }
  return out.sort((a, b) => a.id - b.id);
}

export function assignStates() {
  const roster = readJson(path.join(DATA, 'world/roster.json'));
  const legacyFile = path.join(DATA, 'world/legacy_countries.json');
  const legacy = readJson(existsSync(legacyFile) ? legacyFile : path.join(DATA, 'countries.json')).countries;
  const oldByTag = new Map(legacy.map(c => [c.tag, c]));
  const realmByKey = new Map(roster.realms.map(r => [r.key, r]));
  const rowByTag = new Map(roster.migration.map(m => [m.oldTag, m]));
  const names = new Map();
  for (const l of readFileSync(path.join(ZIN, 'localisation/english/state_names_l_english.yml'), 'utf8').split(/\r?\n/)) { const m = /STATE_(\d+):\d?\s*"(.*)"/.exec(l); if (m) names.set(+m[1], m[2]); }
  const centre = new Map();
  for (const list of Object.values(readJson(path.join(DATA, 'forces_geography.json')).countries)) for (const s of list) centre.set(s.id, s.centre);
  const states = stateFiles();
  const problems = [];

  const carvedBy = new Map();
  for (const c of CARVE) {
    if (!realmByKey.has(c.realm)) problems.push(`carve: unknown realm ${c.realm}`);
    for (const id of c.states) { if (carvedBy.has(id)) problems.push(`carve: state ${id} carved twice`); carvedBy.set(id, c); }
    if (!c.states.includes(c.capital)) problems.push(`carve: ${c.realm}'s capital ${c.capital} is not one of its states`);
  }
  const oldCapitals = new Set(legacy.map(c => c.capitalState));
  for (const id of carvedBy.keys()) if (oldCapitals.has(id)) problems.push(`carve: state ${id} is an old capital`);

  // The anchor of every split target: the row's own capital for the first target, SPLIT_ANCHORS for the others.
  const anchorOf = (m, key) => (key === m.into[0] ? oldByTag.get(m.oldTag).capitalState : SPLIT_ANCHORS[key]?.state);
  const out = [];
  for (const s of states) {
    const m = rowByTag.get(s.oldOwner);
    if (!m) { problems.push(`state ${s.id}: owner ${s.oldOwner} has no migration row`); continue; }
    const base = { id: s.id, name: names.get(s.id) ?? null, oldOwner: s.oldOwner, oldName: m.oldName };
    const carve = carvedBy.get(s.id);
    if (carve) { out.push({ ...base, realm: carve.realm, rule: 'carved', reason: `Carved for ${realmByKey.get(carve.realm).name}: ${carve.reason}` }); continue; }
    if (m.fate === 'kept' || m.fate === 'renamed' || m.fate === 'merged') {
      const to = realmByKey.get(m.into[0]);
      const why = m.fate === 'merged' ? `${m.oldName} (${m.oldTag}) joins ${to.name}.` : m.fate === 'renamed' ? `${m.oldName} (${m.oldTag}) is ${to.name}.` : `${m.oldName} (${m.oldTag}) continues as ${to.name}.`;
      out.push({ ...base, realm: to.key, rule: m.fate, reason: why });
      continue;
    }
    if (m.fate === 'split') {
      const c = centre.get(s.id);
      const scored = m.into.map(key => {
        const a = anchorOf(m, key);
        if (!a) { problems.push(`split ${m.oldTag}: no anchor for ${key}`); return { key, d: Infinity }; }
        const ac = centre.get(a);
        return { key, a, d: Math.hypot(c[0] - ac[0], c[1] - ac[1]) };
      }).sort((x, y) => x.d - y.d || (x.key < y.key ? -1 : 1));
      const to = realmByKey.get(scored[0].key);
      out.push({ ...base, realm: to.key, rule: 'split', reason: `${m.oldName} (${m.oldTag}) is split between ${m.into.map(k => realmByKey.get(k).name).join(' and ')}; this state lies nearest ${to.name}'s seat (state ${scored[0].a}).` });
      continue;
    }
    // removed
    const holder = m.into[0] ?? WILD_HOLDERS[m.oldTag]?.holder;
    if (!holder) { problems.push(`state ${s.id}: removed row ${m.oldTag} has no target and no wild-land holder`); continue; }
    const to = realmByKey.get(holder);
    out.push({ ...base, realm: to.key, rule: m.into[0] ? 'removed' : 'wild', reason: m.into[0] ? `${m.oldName} (${m.oldTag}) is no realm; its land goes to ${to.name}. ${m.reason}` : `${m.oldName} (${m.oldTag}) is no realm. ${WILD_HOLDERS[m.oldTag].reason}` });
  }
  for (const s of out) s.owner = realmByKey.get(s.realm).tag;

  // Capitals: a carved realm's chosen capital; a split target's anchor; otherwise the capital of the row the realm continues, or of its
  // largest former row, when the realm still holds that state; otherwise its state with the highest victory point.
  const owned = new Map();
  for (const s of out) (owned.get(s.realm) ?? owned.set(s.realm, []).get(s.realm)).push(s.id);
  const vpOf = new Map();
  for (const list of Object.values(readJson(path.join(DATA, 'forces_geography.json')).countries)) for (const s of list) vpOf.set(s.id, s.vp ?? 0);
  const capitals = [];
  for (const r of roster.realms) {
    const mine = new Set(owned.get(r.key) ?? []);
    if (!mine.size) continue;
    const carve = CARVE.find(c => c.realm === r.key);
    let state = null, reason = null;
    if (carve) { state = carve.capital; reason = 'The seat chosen when its land was carved.'; }
    else if (SPLIT_ANCHORS[r.key] && mine.has(SPLIT_ANCHORS[r.key].state)) { state = SPLIT_ANCHORS[r.key].state; reason = SPLIT_ANCHORS[r.key].reason; }
    else {
      const rows = roster.migration.filter(m => m.into[0] === r.key || (m.fate === 'split' && m.into.includes(r.key)));
      const main = rows.find(m => m.fate === 'kept' || m.fate === 'renamed') ?? rows.find(m => m.fate === 'split' && m.into[0] === r.key);
      const cands = [main, ...rows.filter(m => m !== main).sort((a, b) => (owned.get(r.key) ?? []).filter(id => out.find(s => s.id === id).oldOwner === b.oldTag).length - (owned.get(r.key) ?? []).filter(id => out.find(s => s.id === id).oldOwner === a.oldTag).length || (a.oldTag < b.oldTag ? -1 : 1))].filter(Boolean);
      for (const m of cands) { const cs = oldByTag.get(m.oldTag)?.capitalState; if (mine.has(cs)) { state = cs; reason = `The old capital of ${m.oldName} (${m.oldTag}).`; break; } }
      if (state === null) { state = [...mine].sort((a, b) => (vpOf.get(b) ?? 0) - (vpOf.get(a) ?? 0) || a - b)[0]; reason = 'Its state with the highest victory point (no old capital is left to it).'; }
    }
    if (!mine.has(state)) problems.push(`${r.key}: capital ${state} is not its own state`);
    capitals.push({ realm: r.key, tag: r.tag, state, name: names.get(state) ?? null, rosterCapital: r.capital?.name ?? null, reason });
  }
  const realms = roster.realms.map(r => {
    const n = (owned.get(r.key) ?? []).length, target = /(\d+)\s+states?\b/.exec(r.extent ?? '')?.[1];
    return { realm: r.key, tag: r.tag, states: n, extentStates: target ? Number(target) : null };
  });
  const landless = realms.filter(r => !r.states).map(r => r.realm);
  if (landless.length) problems.push(`realms without land: ${landless.join(', ')}`);
  const removed = roster.migration.filter(m => m.fate === 'removed').map(m => ({ oldTag: m.oldTag, oldName: m.oldName, holder: m.into[0] ?? WILD_HOLDERS[m.oldTag]?.holder ?? null, wild: !m.into[0], reason: m.into[0] ? m.reason : WILD_HOLDERS[m.oldTag]?.reason ?? null }));
  if (problems.length) throw new Error(`State assignment failed:\n  ${problems.join('\n  ')}`);
  const counts = out.reduce((a, s) => ({ ...a, [s.rule]: (a[s.rule] ?? 0) + 1 }), {});
  return {
    schema: 1,
    owner: 'tools/migrations/roster_state_assignment.mjs; regenerate with node tools/migrations/roster_state_assignment.mjs --apply, never by hand',
    note: 'The old generated map\'s 1,332 states given to the 156 realms of roster.json until the new map from the owner\'s drawing replaces it. Every state carries its rule and reason so that the politics step can redo the assignment on the new map: kept and renamed rows keep their states, merged rows give them to the target, split rows divide them by nearest seat, removed rows give them to the realm or the wild-land holder named in `rules`, and realms with no old row take the states their dossier describes (`rules.carve`). The extent of most realms on this map differs from their roster `extent`; `realms` lists both counts. Owner decisions K35 (Tirlan) and K36 (the Concord) are followed.',
    counts: { states: out.length, ...counts, realms: realms.filter(r => r.states).length, landless: landless.length },
    rules: { carve: CARVE, splitAnchors: SPLIT_ANCHORS, wildHolders: WILD_HOLDERS },
    removed,
    capitals,
    realms,
    states: out.map(({ id, name, oldOwner, oldName, owner, realm, rule, reason }) => ({ id, name, oldOwner, oldName, owner, realm, rule, reason })),
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
