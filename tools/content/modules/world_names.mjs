// Natural names for the states, victory points and strategic regions of the map that is in the mod now.
//
// The map tool (HOI4 Agent Tools create_world) names what the geography model names and gives every other state, strategic region and
// victory point a machine name: a compass word with a land name and a numeral ("Southwestern Cold Lands II"), "<state> Town",
// "<realm> District N", "<realm> Settlement N", "Region N". The tool owns localisation/replace/world_l_english.yml and rewrites it on
// every map write, so this step never edits it. It stages localisation/replace/zin_world_names_l_english.yml, which loads after it
// (replace files load in name order) and carries the same keys with natural values. Keys, ids and every name the model gave stay as
// they are. docs/plans/zin-map/naming_request.md asks the tool for a naming input, which would make this file unnecessary.
//
// What gets a name, and in which speech
//   state            a land name in the language of its owner (the placeNames "state" kind: half settlements, half land names, shaped
//                    by the state's terrain and coast). A state that holds a realm's capital takes the capital's name. Unowned land
//                    takes the language of the nearest owned state, the people who roam it.
//   victory point    a settlement name in the owner's language, sized by its victory points (hamlet, village, town, city). The
//                    25-point seat of every realm is the capital of the roster, even where the model put a feature name there (that name
//                    stays on the seat's state when it fits a land, or names a sea region when it is a bay). The 60 largest Aenoran towns
//                    take hand-composed names (data/world/hand_names.json) so that the busiest language does not run on shared syllables.
//   land region      a land name in the language of the realm that holds most of it; a range name where mountains dominate, a wood
//                    name where forest does.
//   sea region       "Bay of X", "X Reach", "X Deep" and the like, where X is the single-word name of the nearest coastal state.
//   Zol's Mistake and the Mushroom Forest have no language. Their states, towns and regions take English compounds of a small theme
//                    list (ash and barrow for the black north, morel and dell for the fungal wood).
// A name the model gave is kept. A name is replaced when it carries a compass word, a numeral, "District", "Settlement", "Region N",
// a trailing "Town" or a trailing "Coast" (the tool's formulas). Šodolôrō is written Šodolôro, as all game text writes it.
//
// Every key is keyed by geography, not by id: a feature's entity id is the position of its anchor province, so a map write that
// renumbers the states keeps each place's name while the land stays where it is.
//
//   nameWorld(options)      -> { names, kept, report }         pure, on a loaded map (readWorldMap) and the current names
//   buildWorldNames(staged) stages localisation/replace/zin_world_names_l_english.yml and docs/design/world_names.json
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { rng } from '../lib/core.mjs';
import { ZIN } from '../lib/paths.mjs';
import { countryTable } from '../lib/roster.mjs';
import { fileURLToPath } from 'node:url';
import { BANNED_SUBSTRINGS, REAL_WORLD_WORDS, composeRecipe, keyOf } from '../lib/language_generator.mjs';
import { placeNames, sharedNaming } from './names.mjs';

export const NAMES_FILE = 'localisation/replace/zin_world_names_l_english.yml';
export const NAMES_DOC = 'docs/design/world_names.json';
const HAND_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/world/hand_names.json');
export const readHandNames = () => JSON.parse(readFileSync(HAND_FILE, 'utf8')).languages;
const WORLD_FILE = 'localisation/replace/world_l_english.yml';

// ----------------------------------------------------------------------------------------------------- the machine names
const COMPASS = /^(Central|Northern|Southern|Eastern|Western|Northeastern|Northwestern|Southeastern|Southwestern) /;
const NUMERAL = / (II|III|IV|V|VI|VII|VIII|IX|X|\d+)$/;
// True for a name the map tool built by formula and that this step replaces.
export const isGenericName = name => / District \d+$/.test(name) || / Settlement \d+$/.test(name) || /^Region \d+$/.test(name)
  || COMPASS.test(name) || NUMERAL.test(name) || / Town$/.test(name) || / Coast$/.test(name);

// The game's fonts draw Windows-1252 only; a macron is written plain (the canon spelling of game text, 06_languages.md).
const FONT_SAFE = { ō: 'o', Ō: 'O', ā: 'a', ē: 'e', ī: 'i', ū: 'u' };
export const fontSafe = name => [...name].map(ch => FONT_SAFE[ch] ?? ch).join('');

// ------------------------------------------------------------------------------------------------------------ the map
function bitmap(buf) {
  if (buf.toString('ascii', 0, 2) !== 'BM') throw new Error('provinces.bmp is not a BMP');
  const offset = buf.readUInt32LE(10), width = buf.readInt32LE(18), height = buf.readInt32LE(22), bpp = buf.readUInt16LE(28);
  if (bpp !== 24 || height <= 0) throw new Error(`Unsupported provinces.bmp (bpp ${bpp})`);
  return { buf, offset, width, height, stride: Math.ceil(width * 3 / 4) * 4 };
}

// Every state, strategic region and province of the mod, with the province areas and centres of provinces.bmp.
export function readWorldMap(zin = ZIN) {
  const defs = new Map(), byColour = new Map();
  for (const line of readFileSync(path.join(zin, 'map/definition.csv'), 'utf8').split(/\r?\n/)) {
    const f = line.split(';');
    if (f.length < 7 || !/^\d+$/.test(f[0]) || f[0] === '0') continue;
    const id = Number(f[0]);
    defs.set(id, { type: f[4], coastal: f[5] === 'true', terrain: f[6] });
    byColour.set((Number(f[1]) << 16) | (Number(f[2]) << 8) | Number(f[3]), id);
  }
  const stateDir = path.join(zin, 'history/states'), states = [];
  for (const f of readdirSync(stateDir).filter(n => n.endsWith('.txt')).sort()) {
    const t = readFileSync(path.join(stateDir, f), 'utf8');
    const id = Number(/\bid\s*=\s*(\d+)/.exec(t)?.[1]);
    if (!Number.isInteger(id)) throw new Error(`State file ${f} has no id`);
    states.push({
      id, owner: /\bowner\s*=\s*([A-Za-z0-9]+)/.exec(t)?.[1] ?? null,
      provinces: (/\bprovinces\s*=\s*\{([^}]*)\}/.exec(t)?.[1] ?? '').trim().split(/\s+/).filter(Boolean).map(Number),
      vps: [...t.matchAll(/victory_points\s*=\s*\{\s*(\d+)\s+(\d+)\s*\}/g)].map(m => ({ province: Number(m[1]), value: Number(m[2]) })),
    });
  }
  states.sort((a, b) => a.id - b.id);
  const regionDir = path.join(zin, 'map/strategicregions'), regions = [];
  for (const f of readdirSync(regionDir).filter(n => n.endsWith('.txt'))) {
    const t = readFileSync(path.join(regionDir, f), 'utf8');
    regions.push({ id: Number(/\bid\s*=\s*(\d+)/.exec(t)[1]), provinces: (/provinces\s*=\s*\{([^}]*)\}/.exec(t)?.[1] ?? '').trim().split(/\s+/).filter(Boolean).map(Number) });
  }
  regions.sort((a, b) => a.id - b.id);
  // Area and centre of every province from the bitmap (rows are stored bottom first).
  const bmp = bitmap(readFileSync(path.join(zin, 'map/provinces.bmp')));
  const area = new Map(), sx = new Map(), sy = new Map();
  let last = -1, lastId = null;
  for (let y = 0; y < bmp.height; y++) {
    let o = bmp.offset + (bmp.height - 1 - y) * bmp.stride;
    for (let x = 0; x < bmp.width; x++, o += 3) {
      const c = (bmp.buf[o + 2] << 16) | (bmp.buf[o + 1] << 8) | bmp.buf[o];
      if (c !== last) { last = c; lastId = byColour.get(c) ?? null; }
      if (lastId === null) continue;
      area.set(lastId, (area.get(lastId) ?? 0) + 1); sx.set(lastId, (sx.get(lastId) ?? 0) + x); sy.set(lastId, (sy.get(lastId) ?? 0) + y);
    }
  }
  const centre = new Map();
  for (const [id, n] of area) centre.set(id, { x: sx.get(id) / n, y: sy.get(id) / n, area: n });
  return { defs, states, regions, centre };
}

// The current values of the keys of the map tool's localisation file.
export function readCurrentNames(zin = ZIN) {
  const out = new Map();
  for (const l of readFileSync(path.join(zin, WORLD_FILE), 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Za-z0-9_]+):\d?\s*"(.*)"\s*$/.exec(l);
    if (m) out.set(m[1], m[2]);
  }
  return out;
}

// -------------------------------------------------------------------------------------------- Zol's Mistake and the Mushroom Forest
// English compounds for the two realms that have no language. A compound is a theme word with a head, closed ("Ashmoor") or open
// ("Raven Crag"); every head and word is plain English and none carries a banned substring.
const THEMES = {
  ZOL: {
    words: ['Ash', 'Cinder', 'Soot', 'Slate', 'Rime', 'Raven', 'Crow', 'Gaunt', 'Sable', 'Pale', 'Grey', 'Black', 'Bone', 'Cairn', 'Dusk', 'Gloam', 'Hush', 'Thorn', 'Gall', 'Rue',
      'Wraith', 'Cold', 'Iron', 'Salt', 'Tar', 'Frost', 'Wane', 'Hag', 'Bleak', 'Dour', 'Lorn', 'Murk', 'Pyre', 'Veil', 'Wolf', 'Gibbet', 'Mist', 'Sleet', 'Sorrow', 'Lich', 'Grave', 'Sunken', 'Hollow',
      'Withered', 'Gnarl', 'Shade', 'Dim', 'Wan', 'Slag', 'Char', 'Flint', 'Barrow', 'Mire', 'Fell', 'Bale', 'Cowl', 'Dirge', 'Knell'],
    land: ['moor', 'fen', 'mere', 'tarn', 'fell', 'tor', 'crag', 'scar', 'heath', 'flat', 'reach', 'holm', 'strand', 'ridge', 'dale', 'cleft', 'down', 'wold', 'shelf', 'sands', 'rig', 'mount', 'barrow', 'slade'],
    place: ['hold', 'watch', 'stead', 'ford', 'garth', 'well', 'rest', 'gate', 'cross', 'hall', 'wick', 'haven', 'post', 'toft', 'ward', 'stone'],
    region: ['Moors', 'Fens', 'Fells', 'Wastes', 'Flats', 'Barrows', 'Heaths', 'Downs', 'Wolds', 'Reaches', 'Scars', 'Marches', 'Crags', 'Sands', 'Meres', 'Tors'],
  },
  MSH: {
    words: ['Morel', 'Velvet', 'Loam', 'Mulch', 'Gill', 'Spore', 'Truffle', 'Bracket', 'Stipe', 'Pale', 'Dim', 'Dew', 'Damp', 'Moss', 'Lichen', 'Fern', 'Bloom', 'Puffball', 'Rust', 'Amber',
      'Umber', 'Wisp', 'Dapple', 'Fawn', 'Ochre', 'Soft', 'Still', 'Glim', 'Rime', 'Hazel', 'Sallow', 'Russet', 'Ember', 'Duff', 'Husk', 'Cobweb', 'Mildew', 'Cap', 'Pith', 'Bole'],
    land: ['dell', 'glade', 'hollow', 'bower', 'warren', 'grove', 'copse', 'shaw', 'den', 'mound', 'thicket', 'mere', 'bank', 'holt', 'combe', 'wold', 'rise', 'dene'],
    place: ['gate', 'hall', 'stead', 'ford', 'cot', 'wick', 'rest', 'well', 'garth', 'hold', 'stone', 'cross'],
    region: ['Glades', 'Hollows', 'Groves', 'Thickets', 'Dells', 'Warrens', 'Holts', 'Banks', 'Mounds', 'Dens', 'Combes', 'Shaws'],
  },
};
// Substrings no name may carry: the generator's banned list, real-world names, and "waith" (the owner retired the -waith names on 24 October 2026).
const BAD = [...BANNED_SUBSTRINGS, ...REAL_WORLD_WORDS, 'waith'];
// Plain English words that would read as a label ("Tarwe-West"): a generated name is a name, not a description.
const ENGLISH_WORD = /(^|[\s'-])(north|south|east|west|central|upper|lower|old|new|great|little|gold|silver|wind|fire|king|queen|lord)($|[\s'-])/i;
const unclean = text => BAD.some(b => keyOf(text).includes(b)) || ENGLISH_WORD.test(text);
// Letters a generated name may have before it reads as a mouthful; the Long Speech names are long by design.
const LONG_OK = { longspeech: 16 };
const maxLetters = language => LONG_OK[language] ?? 12;

// ------------------------------------------------------------------------------------------------------- sea region names
const SEA_FORMS = {
  small: [['Bay of {x}', 3], ['{x} Bay', 3], ['{x} Sound', 2], ['{x} Roads', 1], ['{x} Narrows', 1], ['Gulf of {x}', 1]],
  middle: [['Gulf of {x}', 3], ['{x} Reach', 3], ['{x} Sound', 1], ['{x} Passage', 1], ['{x} Waters', 2], ['Bay of {x}', 1]],
  large: [['Sea of {x}', 3], ['{x} Deep', 3], ['{x} Sea', 2], ['Waters of {x}', 2]],
};
const weighted = (list, r) => { const total = list.reduce((a, [, w]) => a + w, 0); let t = r() * total; for (const [v, w] of list) { t -= w; if (t < 0) return v; } return list.at(-1)[0]; };

// ------------------------------------------------------------------------------------------------------------- the naming
const SIZE_OF = value => (value >= 12 ? 'great_city' : value >= 8 ? 'city' : value <= 2 ? 'hamlet' : undefined);
const gridKey = point => `${Math.round(point.x / 4) * 4},${Math.round(point.y / 4) * 4}`;
const byPoint = (a, b) => a.y - b.y || a.x - b.x;

// Terrain features the generator's patterns prefer, from the terrain of a set of provinces.
function featuresOf(defs, provinces) {
  const land = provinces.filter(p => defs.get(p)?.type === 'land');
  if (!land.length) return [];
  const share = terrain => land.filter(p => defs.get(p).terrain === terrain).length / land.length;
  const out = [];
  if (share('forest') >= 0.5) out.push('forest');
  if (share('mountain') >= 0.4) out.push('mountain');
  else if (share('hills') >= 0.4) out.push('hill');
  if (land.some(p => defs.get(p).coastal)) out.push('coast');
  return out;
}

// names: Map<key, { name, kind, language, layer, gloss, anchor }> for every key whose value changes; kept: the keys whose names stay.
export function nameWorld({ map, current, roster = countryTable(), naming = sharedNaming(), handNames = readHandNames() }) {
  const { defs, states, regions, centre } = map;
  const registry = naming.generator.registry;
  const tagInfo = new Map(roster.map(r => [r.tag, r]));
  const stateOfProvince = new Map();
  for (const s of states) for (const p of s.provinces) stateOfProvince.set(p, s);

  // ---- state geometry: the anchor is the centre of the largest province, the mass the area-weighted centre
  const geo = new Map();
  for (const s of states) {
    let best = null, area = 0, cx = 0, cy = 0;
    for (const p of s.provinces) {
      const c = centre.get(p); if (!c) continue;
      area += c.area; cx += c.x * c.area; cy += c.y * c.area;
      if (!best || c.area > best.area) best = c;
    }
    if (!best) throw new Error(`State ${s.id} has no province on the bitmap`);
    geo.set(s.id, { anchor: best, mass: { x: cx / area, y: cy / area }, coastal: s.provinces.some(p => defs.get(p)?.coastal && defs.get(p).type === 'land') });
  }
  const owned = states.filter(s => s.owner);
  // The owner of a point: the owner of the nearest owned state (unowned land takes the language of the people around it).
  const nearestOwner = point => {
    let best = null, bd = Infinity;
    for (const o of owned) { const m = geo.get(o.id).mass, d = (m.x - point.x) ** 2 + (m.y - point.y) ** 2; if (d < bd || (d === bd && o.id < best.id)) { best = o; bd = d; } }
    return best.owner;
  };
  const ownerOf = new Map(states.map(s => [s.id, s.owner ?? nearestOwner(geo.get(s.id).mass)]));

  // ---- which keys exist, which names are formulas
  const kindOf = key => (key.startsWith('STATE_') ? 'state' : key.startsWith('VICTORY_POINTS_') ? 'vp' : key.startsWith('STRATEGICREGION_') ? 'region' : null);
  const kinds = new Map(), nameOf = new Map(), kept = new Set(), generic = new Set();
  for (const [key, value] of current) {
    const kind = kindOf(key); if (!kind) continue;
    kinds.set(key, kind); nameOf.set(key, value);
    (isGenericName(value) ? generic : kept).add(key);
  }
  const expected = states.length + states.reduce((n, s) => n + s.vps.length, 0) + regions.length;
  if (expected !== kinds.size) throw new Error(`The map has ${expected} states, victory points and regions, the localisation ${kinds.size}: the map and ${WORLD_FILE} disagree`);

  // A kept name that appears twice is a site the tool set on two states or two points. The best claim keeps it and the others are renamed:
  // the realm's capital seat first, then the state that bears the name, then the larger point, then the lower id. A state and one of its
  // own points may share a name; no other pair may.
  const stateKeyOf = s => `STATE_${s.id}`;
  const vpStateOf = key => stateOfProvince.get(Number(key.slice('VICTORY_POINTS_'.length)));
  const lowerOf = key => nameOf.get(key).toLowerCase();
  const capitalClaim = new Map();   // lower-case capital name -> the 25-point key of its realm
  for (const s of states) {
    const seat = s.vps.find(v => v.value === 25), cap = s.owner ? tagInfo.get(s.owner)?.capital : null, capName = typeof cap === 'string' ? cap : cap?.name;
    if (seat && capName) capitalClaim.set(fontSafe(capName).toLowerCase(), `VICTORY_POINTS_${seat.province}`);
  }
  // The roster capital wins the seat's point. A model name that stood there stays as the name of the seat's state when it fits a land
  // (The Cursed Square, South Gate Fortress, Sun Desert), and a bay or sea name goes to a sea region beside the state (Bay of Safeton).
  const displaced = new Map(), displacedWater = new Map();   // state id -> the model name that stood on its seat
  const WATER_NAME = /^(The )?(Bay|Gulf|Sea|Seas|Cape|Strait|Reach) /;
  for (const s of states) {
    const seat = s.vps.find(v => v.value === 25), cap = s.owner ? tagInfo.get(s.owner)?.capital : null, capName = typeof cap === 'string' ? cap : cap?.name;
    const key = seat ? `VICTORY_POINTS_${seat.province}` : null;
    if (!key || !capName || !kept.has(key) || fontSafe(capName) === fontSafe(nameOf.get(key))) continue;
    (WATER_NAME.test(nameOf.get(key)) ? displacedWater : displaced).set(s.id, nameOf.get(key));
    kept.delete(key); generic.add(key);
  }
  const groupBy = (keys, by) => { const g = new Map(); for (const k of keys) (g.get(by(k)) ?? g.set(by(k), []).get(by(k))).push(k); return g; };
  const stateBearer = new Map();   // lower-case name -> the id of the state that keeps it
  for (const [name, seat] of capitalClaim) {   // the state of a capital bears the capital's name; a site of the same name elsewhere is renamed
    const home = vpStateOf(seat);
    stateBearer.set(name, home.id);
    for (const k of [...kept]) if (kinds.get(k) === 'state' && lowerOf(k) === name && k !== stateKeyOf(home)) { kept.delete(k); generic.add(k); }
  }
  for (const [name, group] of groupBy([...kept].filter(k => kinds.get(k) === 'state'), lowerOf)) {
    const sorted = group.slice().sort((a, b) => {
      const own = k => states.find(s => stateKeyOf(s) === k)?.vps.some(v => nameOf.get(`VICTORY_POINTS_${v.province}`)?.toLowerCase() === name) ? 0 : 1;
      return own(a) - own(b) || Number(a.slice(6)) - Number(b.slice(6));
    });
    if (!stateBearer.has(name)) stateBearer.set(name, Number(sorted[0].slice(6)));
    for (const k of sorted) if (Number(k.slice(6)) !== stateBearer.get(name)) { kept.delete(k); generic.add(k); }
  }
  const valueOf = key => states.flatMap(s => s.vps).find(v => `VICTORY_POINTS_${v.province}` === key)?.value ?? 0;
  for (const [name, group] of groupBy([...kept].filter(k => kinds.get(k) === 'vp'), lowerOf)) {
    const allowed = group.filter(k => (!stateBearer.has(name) || vpStateOf(k)?.id === stateBearer.get(name)) && (!capitalClaim.has(name) || capitalClaim.get(name) === k));
    const winner = allowed.sort((a, b) => valueOf(b) - valueOf(a) || Number(a.slice(15)) - Number(b.slice(15)))[0];
    for (const k of group) if (k !== winner) { kept.delete(k); generic.add(k); }
  }

  const names = new Map(), used = new Set();
  const put =(key, made, anchor = null) => {
    names.set(key, { name: made.name, kind: kinds.get(key), language: made.language ?? null, layer: made.layer ?? null, gloss: made.gloss ?? null, anchor });
    used.add(made.name.toLowerCase()); generic.delete(key);
  };
  const rewritten = [];
  for (const key of kept) {
    const safe = fontSafe(nameOf.get(key));
    used.add(safe.toLowerCase()); registry.reserve(safe, 'map-kept'); registry.reserve(nameOf.get(key), 'map-kept');
    if (safe !== nameOf.get(key)) { names.set(key, { name: safe, kind: kinds.get(key), language: null, layer: 'kept', gloss: 'the spelling game text uses for a canon name', anchor: null }); rewritten.push(key); }
  }

  // ---- English compounds for the realms without a language
  const themed = (theme, kind, entityId) => {
    const t = THEMES[theme], pool = kind === 'vp' ? t.place : t.land;
    for (let attempt = 0; attempt < 400; attempt++) {
      const r = rng(`zin-world-names:${theme}:${kind}:${entityId}#${attempt}`);
      const word = t.words[Math.floor(r() * t.words.length)];
      let text;
      if (kind === 'region') text = `${word} ${t.region[Math.floor(r() * t.region.length)]}`;
      else { const head = pool[Math.floor(r() * pool.length)]; text = r() < 0.5 ? `${word}${head}` : `${word} ${head[0].toUpperCase()}${head.slice(1)}`; }
      if (unclean(text) || used.has(text.toLowerCase()) || registry.has(text)) continue;
      registry.reserve(text, 'world-names');
      return { name: text, language: null, layer: `theme:${theme}`, gloss: null };
    }
    throw new Error(`The ${theme} theme list is exhausted at ${entityId}`);
  };
  // A name in the language of a realm; a redraw with a new seed when the text is banned or already used.
  const generated = (tag, kind, entityId, options = {}) => {
    if (THEMES[tag]) return themed(tag, kind === 'settlement' ? 'vp' : kind === 'state' ? 'land' : 'region', entityId);
    // A settlement takes no chart ending (-dor names a land); a draw that is too long or reads as an English label is redrawn,
    // and the shortest usable draw is taken when every redraw is long.
    // When the dictionary and registry of a busy language run dry, the redraws move on to the older layers and then to a neighbouring kind.
    let fallback = null;
    const KINDS = { settlement: ['settlement', 'settlement', 'city', 'site'], state: ['state', 'state', 'region', 'settlement'], region: ['region', 'region', 'state', 'settlement'], mountain: ['mountain', 'mountain', 'region', 'state'], forest: ['forest', 'forest', 'region', 'state'] }[kind];
    for (let retry = 0; retry < 16; retry++) {
      const step = Math.min(KINDS.length - 1, Math.floor(retry / 4));
      let n;
      try { [n] = placeNames(tag, KINDS[step], 1, { ...options, ...(retry >= 8 ? { layers: false } : {}), seed: `${entityId}:${retry ? `r${retry}:` : ''}` }); } catch (error) { if (/exhausted/.test(error.message)) continue; throw error; }
      if (unclean(n.text) || used.has(n.text.toLowerCase()) || (kind === 'settlement' && n.layer === 'chart')) continue;
      const made = { name: n.text, language: n.language, layer: n.layer, gloss: n.gloss };
      if (keyOf(n.text).length <= maxLetters(n.language)) return made;
      if (!fallback || keyOf(n.text).length < keyOf(fallback.name).length) fallback = made;
    }
    if (fallback) return fallback;
    throw new Error(`Cannot name ${kind} ${entityId} for ${tag}`);
  };

  // ---- the 25-point seat of every realm is its capital, and the state that holds it takes the capital's name
  for (const s of states) {
    const seat = s.vps.find(v => v.value === 25);
    if (!seat || !s.owner) continue;
    const cap = tagInfo.get(s.owner)?.capital, capName = fontSafe(typeof cap === 'string' ? cap : cap?.name ?? '');
    if (!capName) continue;
    const meta = { language: tagInfo.get(s.owner).language, layer: 'roster' };
    if (generic.has(`VICTORY_POINTS_${seat.province}`)) { put(`VICTORY_POINTS_${seat.province}`, { ...meta, name: capName, gloss: 'the capital of the realm' }); registry.reserve(capName, 'capital'); }
    if (generic.has(`STATE_${s.id}`)) {
      const model = displaced.get(s.id);
      if (model && !used.has(model.toLowerCase())) { put(`STATE_${s.id}`, { ...meta, layer: 'model', name: model, gloss: "the model's name of the capital's site, kept for its state" }); registry.reserve(model, 'map-kept'); }
      else put(`STATE_${s.id}`, { ...meta, name: capName, gloss: "the state of the realm's capital" });
    }
  }

  // ---- hand-composed town names for a language whose generator runs short (data/world/hand_names.json): the largest unnamed points of its
  // realms, by points and then by position, take the recipes in order; a recipe the generator refuses or the registry holds is skipped
  for (const [language, spec] of Object.entries(handNames)) {
    const info = naming.generator.infoOf(language), queue = spec.settlements.slice();
    const towns = states.flatMap(s => s.vps.map(v => ({ s, v })))
      .filter(({ s, v }) => v.value < 25 && generic.has(`VICTORY_POINTS_${v.province}`) && tagInfo.get(ownerOf.get(s.id))?.language === language)
      .sort((a, b) => b.v.value - a.v.value || byPoint(centre.get(a.v.province), centre.get(b.v.province)));
    let given = 0;
    for (const { v } of towns) {
      if (given >= spec.count) break;
      while (queue.length) {
        const recipe = queue.shift(), { text } = composeRecipe(info, recipe, 'place');
        if (!text || unclean(text) || used.has(text.toLowerCase()) || naming.generator.validate(language, text, { kind: 'place' }).length) continue;
        if (!registry.claim(text, { language, unique: true, kind: 'settlement' }).ok) continue;
        put(`VICTORY_POINTS_${v.province}`, { name: text, language, layer: 'hand', gloss: recipe }, gridKey(centre.get(v.province)));
        given++;
        break;
      }
    }
  }

  // ---- strategic regions: land first, in the order of their centres
  const info = new Map();
  for (const r of regions) {
    let w = 0, cx = 0, cy = 0; const owners = new Map(), land = [], sea = [];
    for (const p of r.provinces) {
      const c = centre.get(p), d = defs.get(p); if (!c || !d) continue;
      w += c.area; cx += c.x * c.area; cy += c.y * c.area;
      if (d.type === 'land') { land.push(p); const st = stateOfProvince.get(p); if (st) { const o = ownerOf.get(st.id); owners.set(o, (owners.get(o) ?? 0) + 1); } }
      else if (d.type === 'sea') sea.push(p);
    }
    const mass = { x: cx / w, y: cy / w };
    info.set(r.id, { mass, land, sea, lead: [...owners].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0] ?? nearestOwner(mass), isSea: land.length <= sea.length });
  }
  const regionsByPoint = regions.slice().sort((a, b) => byPoint(info.get(a.id).mass, info.get(b.id).mass));
  for (const r of regionsByPoint) {
    const key = `STRATEGICREGION_${r.id}`, ri = info.get(r.id);
    if (!generic.has(key) || ri.isSea) continue;
    const feats = featuresOf(defs, ri.land), kind = feats.includes('mountain') ? 'mountain' : feats.includes('forest') ? 'forest' : 'region';
    put(key, generated(ri.lead, kind, `region@${gridKey(ri.mass)}`, { features: feats.filter(f => f !== 'coast') }), gridKey(ri.mass));
  }

  // ---- states, in the order of their anchors
  const statesByPoint = states.slice().sort((a, b) => byPoint(geo.get(a.id).anchor, geo.get(b.id).anchor));
  for (const s of statesByPoint) {
    const key = `STATE_${s.id}`; if (!generic.has(key)) continue;
    const at = gridKey(geo.get(s.id).anchor);
    put(key, generated(ownerOf.get(s.id), 'state', `state@${at}`, { features: featuresOf(defs, s.provinces) }), at);
  }

  // ---- victory points
  for (const s of statesByPoint) {
    for (const v of s.vps) {
      const key = `VICTORY_POINTS_${v.province}`; if (!generic.has(key)) continue;
      const at = gridKey(centre.get(v.province));
      put(key, generated(ownerOf.get(s.id), 'settlement', `vp@${at}`, { size: SIZE_OF(v.value), features: featuresOf(defs, [v.province]) }), at);
    }
  }

  // ---- sea regions: a form and the single-word name of the nearest coastal state
  const coastal = states.filter(s => geo.get(s.id).coastal);
  const stateName = s => names.get(`STATE_${s.id}`)?.name ?? nameOf.get(`STATE_${s.id}`);
  const bases = new Set();
  // A bay the model named on a capital's seat goes to the nearest unnamed sea region.
  const seaRegions = regionsByPoint.filter(r => generic.has(`STRATEGICREGION_${r.id}`) && info.get(r.id).isSea);
  for (const [stateId, bay] of displacedWater) {
    const m = geo.get(stateId).mass;
    const r = seaRegions.filter(x => generic.has(`STRATEGICREGION_${x.id}`)).sort((p, q) => ((info.get(p.id).mass.x - m.x) ** 2 + (info.get(p.id).mass.y - m.y) ** 2) - ((info.get(q.id).mass.x - m.x) ** 2 + (info.get(q.id).mass.y - m.y) ** 2))[0];
    if (r && !used.has(bay.toLowerCase())) { put(`STRATEGICREGION_${r.id}`, { name: bay, language: null, layer: 'model', gloss: "the model's name of a capital's site, kept for the water beside it" }, gridKey(info.get(r.id).mass)); registry.reserve(bay, 'map-kept'); }
  }
  for (const r of regionsByPoint) {
    const key = `STRATEGICREGION_${r.id}`, ri = info.get(r.id);
    if (!generic.has(key) || !ri.isSea) continue;
    const at = gridKey(ri.mass), n = ri.sea.length, forms = n <= 3 ? SEA_FORMS.small : n <= 9 ? SEA_FORMS.middle : SEA_FORMS.large;
    const near = coastal.map(s => { const m = geo.get(s.id).mass; return { s, d: (m.x - ri.mass.x) ** 2 + (m.y - ri.mass.y) ** 2 }; }).sort((a, b) => a.d - b.d || a.s.id - b.s.id).slice(0, 40);
    let made = null;
    for (const { s } of near) {
      const base = stateName(s);
      if (!base || /\s/.test(base) || keyOf(base).length > 10 || bases.has(base.toLowerCase())) continue;
      for (let t = 0; t < 8 && !made; t++) {
        const text = weighted(forms, rng(`zin-world-names:sea@${at}:${base}#${t}`)).replace('{x}', base);
        if (!used.has(text.toLowerCase()) && !unclean(text)) made = { name: text, base };
      }
      if (made) break;
    }
    if (!made) throw new Error(`No sea name for region ${r.id} at ${at}`);
    bases.add(made.base.toLowerCase());
    put(key, { name: made.name, language: null, layer: 'coast', gloss: `named for ${made.base}` }, at);
  }
  if (generic.size) throw new Error(`${generic.size} formula names remain, for example ${[...generic].slice(0, 5).join(', ')}`);

  const changed = [...names.values()].filter(n => n.layer !== 'kept');
  const count = kind => changed.filter(n => n.kind === kind).length;
  const languages = {};
  for (const n of changed) { const k = n.language ?? n.layer ?? 'none'; languages[k] = (languages[k] ?? 0) + 1; }
  return { names, kept, rewritten, report: { states: count('state'), victoryPoints: count('vp'), regions: count('region'), kept: kept.size, rewritten: rewritten.length, languages } };
}

// ------------------------------------------------------------------------------------------------------------ the staged files
const KEY_ORDER = { STATE: 0, STRATEGICREGION: 1, VICTORY_POINTS: 2 };
const keyCompare = (a, b) => {
  const [, ka, na] = /^([A-Z_]+?)_(\d+)$/.exec(a), [, kb, nb] = /^([A-Z_]+?)_(\d+)$/.exec(b);
  return KEY_ORDER[ka] - KEY_ORDER[kb] || Number(na) - Number(nb);
};

// Stage the override file and the name document. Returns the report, or null when the map tool's file is absent.
export async function buildWorldNames(staged, { zin = ZIN } = {}) {
  if (!existsSync(path.join(zin, WORLD_FILE))) return null;
  const result = nameWorld({ map: readWorldMap(zin), current: readCurrentNames(zin) });
  const keys = [...result.names.keys()].sort(keyCompare);
  const body = keys.map(k => ` ${k}: "${result.names.get(k).name.replace(/"/g, '\\"')}"`).join('\n');
  staged.add(NAMES_FILE, Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(`l_english:\n${body}\n`)]));
  const head = { schema: 'zin-world-names/1', spec: 'docs/specs/02_lore/06_languages.md section 8; docs/plans/zin-map/naming_request.md', generatedBy: 'tools/content/modules/world_names.mjs', counts: result.report, columns: ['key', 'name', 'language', 'layer', 'gloss', 'anchor'] };
  const entries = keys.map(k => { const n = result.names.get(k); return JSON.stringify([k, n.name, n.language, n.layer, n.gloss, n.anchor]); });
  staged.text(NAMES_DOC, `{\n${Object.entries(head).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n')},\n"entries": [\n${entries.join(',\n')}\n]\n}`);
  return result.report;
}
