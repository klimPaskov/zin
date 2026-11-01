// Icon registry and concept extractor (UI overhaul step D3, docs/plans/ui_overhaul/02_plan.md; rules in
// docs/specs/07_interface/07_design_system.md §4). It lists every concept a player can see by name (focus, national spirit, law,
// officer-corps spirit, decision, mission, decision category and its picture, event, news event, technology, equipment type and
// archetype, sub-unit, leader trait, special project, operation, agency upgrade, agency logo, MIO and MIO trait, scholar trait,
// doctrine, faction, map mode, resource, super-event moment) with the sprite the engine draws for it and that sprite's texture file,
// and counts how many concepts share each texture.
//
// It reads a staged tree (a Map of staged path -> Buffer, as staged.files) and the installed game's .gfx files as the fallback
// for sprites ZIN does not define, exactly as the engine resolves them. The audit of 31 October 2026 (01_audit.md §3) used the
// same resolution; AUDIT_31_OCTOBER keeps its numbers so a test and the build can show drift.
//
//   spriteIndex(files, { game })         sprite name (lower case) -> { name, texture, frames, origin }
//   extractConcepts(files, { sprites })  [{ family, id, sprite, texture, frame?, kind?, file }] in a stable order
//   generalFocusGroups(files)            the "genuinely general" focus groups of K69: same name and same template slug in two or more trees
//   iconRegistry(files, opts)            { concepts, families (stats), crossFamily, textures (texture -> concept keys) }
//   targets(registry, shares)            K69 target counts per family
//   registryFile(registry)               the compact committed form (data/ui/icon_registry.json)
//   CLI: node tools/content/modules/icon_registry.mjs [stagedDir]   refreshes data/ui/icon_registry.json from a staged build
import { readFileSync, readdirSync, existsSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GAME, stagingDir } from '../lib/paths.mjs';
import { parse, scriptText } from '../lib/clausewitz.mjs';

export const REGISTRY_FILE = fileURLToPath(new URL('../data/ui/icon_registry.json', import.meta.url));
export const SHARES_FILE = fileURLToPath(new URL('../data/ui/icon_shares.json', import.meta.url));
export const DESIGN_FILE = fileURLToPath(new URL('../data/ui/design_system.json', import.meta.url));

// The deliberate reuse kinds of design system §4.3, plus K69's general focuses. Anything else on a shared texture is accidental.
export const SHARE_KINDS = ['same_concept', 'tiers', 'family_badge', 'engine_fallback', 'general_focus'];

// Registry families, in report order. `audit` names the family key of the 31 October count (01_audit.md §3.1).
export const FAMILIES = [
  { id: 'focus', audit: 'focus' },
  { id: 'spirit', audit: 'ideas:country' },
  { id: 'law', audit: 'ideas:economy+trade_laws+mobilization_laws' },
  { id: 'officer_spirit', audit: 'ideas:*_spirit' },
  { id: 'decision', audit: 'decision' },
  { id: 'decision_category', audit: 'decision_category_icon' },
  { id: 'decision_category_picture', audit: 'decision_category_picture' },
  { id: 'event', audit: 'event' },
  { id: 'news_event', audit: 'news_event' },
  { id: 'technology', audit: 'technology' },
  { id: 'equipment', audit: 'equipment' },
  { id: 'equipment_archetype', audit: 'equipment_archetype' },
  { id: 'subunit', audit: 'subunit_icon' },
  { id: 'trait', audit: 'leader_trait' },
  { id: 'special_project' }, { id: 'operation' }, { id: 'agency_upgrade' }, { id: 'agency_logo' }, { id: 'mio' }, { id: 'mio_trait' },
  { id: 'scholar_trait' }, { id: 'doctrine' }, { id: 'faction' }, { id: 'map_mode' }, { id: 'resource' }, { id: 'super_event' },
];
const FAMILY_IDS = FAMILIES.map(f => f.id);

// The numbers of the audit (01_audit.md §3.1, staged build of c34eecc7, 31 October 2026): concepts, distinct textures, concepts on a
// shared texture, textures serving exactly one concept, most concepts on one texture, median concepts per texture, cross-family textures.
export const AUDIT_31_OCTOBER = {
  focus: { concepts: 4817, withoutIcon: 20, textures: 178, onShared: 4790, single: 7, max: 155, median: 16 },
  spirit: { concepts: 1614, withoutIcon: 0, textures: 175, onShared: 1598, single: 16, max: 53, median: 5 },
  law: { concepts: 18, withoutIcon: 0, textures: 18, onShared: 0, single: 18, max: 1, median: 1 },
  officer_spirit: { concepts: 27, withoutIcon: 0, textures: 27, onShared: 0, single: 27, max: 1, median: 1 },
  decision: { concepts: 249, withoutIcon: 0, textures: 105, onShared: 203, single: 46, max: 12, median: 2 },
  decision_category: { concepts: 50, withoutIcon: 0, textures: 39, onShared: 19, single: 31, max: 3, median: 1 },
  decision_category_picture: { concepts: 15, withoutIcon: 0, textures: 15, onShared: 0, single: 15, max: 1, median: 1 },
  event: { concepts: 1213, withoutIcon: 0, textures: 42, onShared: 1213, single: 0, max: 239, median: 11 },
  news_event: { concepts: 84, withoutIcon: 0, textures: 26, onShared: 70, single: 14, max: 28, median: 1 },
  technology: { concepts: 292, withoutIcon: 0, textures: 2, onShared: 292, single: 0, max: 285, median: 7 },
  equipment: { concepts: 116, withoutIcon: 0, textures: 4, onShared: 113, single: 3, max: 113, median: 1 },
  equipment_archetype: { concepts: 35, withoutIcon: 0, textures: 4, onShared: 32, single: 3, max: 32, median: 1 },
  subunit: { concepts: 85, withoutIcon: 20, textures: 2, onShared: 64, single: 1, max: 64, median: 1 },
  trait: { concepts: 306, withoutIcon: 306, textures: 0, onShared: 0, single: 0, max: 0, median: 0 },
  crossFamilyAudit: 110,
  frameSprites: 648,
};

const ord = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const toMap = files => files instanceof Map ? files : files?.files instanceof Map ? files.files : new Map(Object.entries(files ?? {}));
const text = bytes => scriptText(Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes)).replace(/#[^\n]*/g, '');
const slashLower = p => String(p).replace(/\\/g, '/').replace(/\/+/g, '/').toLowerCase();
// Staged files under a folder, sorted, with their text.
function under(files, prefix, ext = '.txt') {
  const out = [];
  for (const [k, v] of files) if (k.startsWith(prefix) && k.toLowerCase().endsWith(ext)) out.push([k, v]);
  return out.sort(([a], [b]) => ord(a, b)).map(([k, v]) => ({ file: k, text: text(v) }));
}
// "key = { ... }" blocks matched by a regex, with brace matching (the audit's scanner, kept so the counts stay comparable).
function blocks(src, keyRe) {
  const res = [], re = new RegExp(keyRe.source, keyRe.flags.replace('g', '') + 'g');
  let m;
  while ((m = re.exec(src))) {
    const i = src.indexOf('{', m.index + m[0].length - 1);
    if (i < 0) break;
    let d = 0, j = i;
    for (; j < src.length; j++) { if (src[j] === '{') d++; else if (src[j] === '}') { d--; if (!d) break; } }
    res.push({ head: m, body: src.slice(i + 1, j) });
    re.lastIndex = j;
  }
  return res;
}

// ---------------------------------------------------------------------------------------------------- sprites
const SPRITE_RE = /(?:spriteType|SpriteType|frameAnimatedSpriteType|corneredTileSpriteType|progressbartype|maskedShieldType)\s*=\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
export function parseSprites(src, origin, file) {
  const out = [];
  for (const m of src.matchAll(SPRITE_RE)) {
    const b = m[1], n = /name\s*=\s*"?([^"\s}]+)"?/i.exec(b), tx = /texture[Ff]ile1?\s*=\s*"([^"]+)"/.exec(b);
    if (!n || !tx) continue;
    const frames = Number(/noOfFrames\s*=\s*(\d+)/i.exec(b)?.[1] ?? 1);
    out.push({ name: n[1], texture: slashLower(tx[1]), frames, origin, file });
  }
  return out;
}
const vanillaCache = new Map();
function vanillaSprites(game) {
  if (vanillaCache.has(game)) return vanillaCache.get(game);
  const list = [], dir = `${game}/interface`;
  const walk = d => { if (!existsSync(d)) return; for (const n of readdirSync(d).sort(ord)) { const p = `${d}/${n}`; if (statSync(p).isDirectory()) walk(p); else if (n.toLowerCase().endsWith('.gfx')) list.push(...parseSprites(text(readFileSync(p)), 'vanilla', p.slice(game.length + 1))); } };
  walk(dir);
  vanillaCache.set(game, list);
  return list;
}
// Mod sprites override vanilla sprites of the same name (case-insensitive), as the audit and the engine resolve them.
export function spriteIndex(files, { game = GAME, vanilla } = {}) {
  const idx = new Map();
  for (const s of vanilla ?? vanillaSprites(game)) idx.set(s.name.toLowerCase(), s);
  for (const { file, text: t } of under(toMap(files), 'interface/', '.gfx')) for (const s of parseSprites(t, 'mod', file)) idx.set(s.name.toLowerCase(), s);
  return idx;
}

// ---------------------------------------------------------------------------------------------------- concepts
const IDEA_SKIP = /^(allowed|available|modifier|on_add|on_remove|cancel|ai_will_do|equipment_bonus|research_bonus|targeted_modifier|rule|allowed_civil_war|visible|do_effect|traits)$/;
const LAW_GROUPS = new Set(['economy', 'trade_laws', 'mobilization_laws']);
const prefixed = (v, pre) => v.toLowerCase().startsWith('gfx_') ? v : `${pre}${v}`;
// Blocks of a parsed file that carry one of `keys` directly, with the block's key: the generic reader for the institution families.
function iconBlocks(src, keys) {
  const out = [];
  const walk = (entries, depth) => {
    for (const e of entries) {
      if (!Array.isArray(e.v)) continue;
      const hit = e.v.find(c => keys.includes(String(c.k).toLowerCase()) && typeof c.v === 'string');
      if (hit) out.push({ key: e.k, icon: hit.v, block: e.v, depth });
      walk(e.v, depth + 1);
    }
  };
  try { walk(parse(src), 0); } catch { /* an unreadable file contributes nothing; the engine-form and text checks report it */ }
  return out;
}
const val = (block, key) => block.find(c => String(c.k).toLowerCase() === key && typeof c.v === 'string')?.v;

export function extractConcepts(files, { sprites, game = GAME } = {}) {
  const f = toMap(files), idx = sprites ?? spriteIndex(f, { game });
  const has = n => idx.has(String(n).toLowerCase());
  const tex = n => idx.get(String(n).toLowerCase())?.texture ?? null;
  const out = [];
  const add = (family, id, sprite, file, extra = {}) => out.push({ family, id, sprite: sprite ?? null, texture: sprite && !String(sprite).includes(':') ? tex(sprite) : null, file, ...extra });

  // Focuses (focus, shared_focus, joint_focus blocks).
  for (const { file, text: t } of under(f, 'common/national_focus/')) for (const b of blocks(t, /\b(?:focus|shared_focus|joint_focus)\s*=\s*\{/)) {
    const id = /\bid\s*=\s*([\w.]+)/.exec(b.body)?.[1], icons = [...b.body.matchAll(/\bicon\s*=\s*([\w.]+)/g)].map(x => x[1]);
    // Only ZIN's own focuses (lane I4, lead decision): vanilla trees left in the staged tree are not shipped art and are not counted.
    if (id && /^zin_/.test(id)) add('focus', id, icons[icons.length - 1] ?? icons[0] ?? null, file);
  }
  // Ideas: national spirits, laws, officer-corps spirits; hidden ideas are not shown and are left out.
  for (const { file, text: t } of under(f, 'common/ideas/')) for (const cat of blocks(t, /\bideas\s*=\s*\{/)) for (const grp of blocks(cat.body, /\b([\w]+)\s*=\s*\{/)) {
    const g = grp.head[1];
    if (g === 'hidden_ideas') continue;
    const family = g === 'country' ? 'spirit' : LAW_GROUPS.has(g) ? 'law' : /_spirit$/.test(g) ? 'officer_spirit' : 'spirit';
    for (const idea of blocks(grp.body, /\b([\w.]+)\s*=\s*\{/)) {
      const name = idea.head[1];
      if (IDEA_SKIP.test(name)) continue;
      const pic = /\bpicture\s*=\s*([\w.]+)/.exec(idea.body)?.[1];
      add(family, name, pic ? prefixed(pic, 'GFX_idea_') : `GFX_idea_${name}`, file, g === 'country' ? {} : { kind: g });
    }
  }
  // Decision categories (icon and picture) and decisions; a decision with a mission timeout is a mission.
  for (const { file, text: t } of under(f, 'common/decisions/categories/')) for (const b of blocks(t, /^\s*([\w.]+)\s*=\s*\{/m)) {
    const ic = /\bicon\s*=\s*([\w.]+)/.exec(b.body)?.[1], pic = /\bpicture\s*=\s*([\w.]+)/.exec(b.body)?.[1];
    add('decision_category', b.head[1], ic ? prefixed(ic, 'GFX_decision_category_') : null, file);
    if (pic) add('decision_category_picture', b.head[1], pic, file);
  }
  for (const { file, text: t } of under(f, 'common/decisions/').filter(x => !/\/categories\//.test(x.file))) for (const cat of blocks(t, /^([\w.]+)\s*=\s*\{/m)) for (const d of blocks(cat.body, /^\t([\w.]+)\s*=\s*\{/m)) {
    const ic = /^\t\ticon\s*=\s*([\w.]+)/m.exec(d.body)?.[1];
    add('decision', d.head[1], ic ? prefixed(ic, 'GFX_decision_') : 'GFX_decision_generic_decision', file, /\bdays_mission_timeout\s*=/.test(d.body) ? { kind: 'mission' } : {});
  }
  // Visible events and news events (the first picture).
  for (const { file, text: t } of under(f, 'events/')) for (const b of blocks(t, /\b(country_event|news_event|state_event|unit_leader_event|operative_leader_event)\s*=\s*\{/)) {
    const id = /\bid\s*=\s*([\w.]+)/.exec(b.body)?.[1], pics = [...b.body.matchAll(/\bpicture\s*=\s*([\w.]+)/g)].map(x => x[1]);
    if (id && !/\bhidden\s*=\s*yes/.test(b.body)) add(b.head[1] === 'news_event' ? 'news_event' : 'event', id, pics[0] ?? null, file);
  }
  // Technologies (engine convention GFX_<tech>_medium), equipment and archetypes, sub-unit icons.
  for (const { file, text: t } of under(f, 'common/technologies/')) for (const tb of blocks(t, /\btechnologies\s*=\s*\{/)) for (const b of blocks(tb.body, /^\t([\w]+)\s*=\s*\{/m)) {
    const n = b.head[1];
    if (!n.startsWith('@')) add('technology', n, has(`gfx_${n}_medium`) ? `GFX_${n}_medium` : 'GFX_technology_medium', file);
  }
  for (const { file, text: t } of under(f, 'common/units/equipment/')) for (const eb of blocks(t, /\bequipments\s*=\s*\{/)) for (const b of blocks(eb.body, /^\t([\w]+)\s*=\s*\{/m)) {
    const n = b.head[1], pic = /\bpicture\s*=\s*([\w]+)/.exec(b.body)?.[1], arch = /\barchetype\s*=\s*([\w]+)/.exec(b.body)?.[1];
    const spr = has(`gfx_${n}_medium`) ? `GFX_${n}_medium` : pic && has(`gfx_${pic}_medium`) ? `GFX_${pic}_medium` : arch && has(`gfx_${arch}_medium`) ? `GFX_${arch}_medium` : null;
    add(/is_archetype\s*=\s*yes/.test(b.body) ? 'equipment_archetype' : 'equipment', n, spr, file);
  }
  for (const { file, text: t } of under(f, 'common/units/').filter(x => !/equipment|names/.test(x.file))) for (const sb of blocks(t, /\bsub_units\s*=\s*\{/)) for (const b of blocks(sb.body, /^\t([\w]+)\s*=\s*\{/m)) {
    const n = b.head[1];
    add('subunit', n, has(`gfx_unit_${n}_icon_medium`) ? `GFX_unit_${n}_icon_medium` : null, file);
  }
  // Leader traits: a gui_icon, or a frame of the engine's trait strip.
  for (const { file, text: t } of [...under(f, 'common/unit_leader/'), ...under(f, 'common/country_leader/')]) for (const lb of blocks(t, /\b(leader_traits)\s*=\s*\{/)) for (const b of blocks(lb.body, /^\t([\w]+)\s*=\s*\{/m)) {
    const s = /\bsprite\s*=\s*(\d+)/.exec(b.body)?.[1], g = /\bgui_icon\s*=\s*([\w]+)/.exec(b.body)?.[1];
    add('trait', b.head[1], g ?? (s ? `sprite_frame:${s}` : null), file);
  }

  // Institutions and the other families of the plan (D3), read with the script parser.
  const generic = (family, prefix, keys, { depth, idOf } = {}) => {
    for (const { file, text: t } of under(f, prefix)) for (const b of iconBlocks(t, keys)) {
      if (depth !== undefined && b.depth !== depth) continue;
      const id = idOf ? idOf(b) : b.key;
      if (id) add(family, id, b.icon, file);
    }
  };
  generic('special_project', 'common/special_projects/projects/', ['icon'], { depth: 0 });
  generic('operation', 'common/operations/', ['icon'], { depth: 0 });
  generic('agency_upgrade', 'common/intelligence_agency_upgrades/', ['picture'], { depth: 1 });
  generic('agency_logo', 'common/intelligence_agencies/', ['picture'], { depth: 0, idOf: b => `${val(b.block, 'picture')}` });
  generic('mio', 'common/military_industrial_organization/organizations/', ['icon'], { depth: 0 });
  generic('mio_trait', 'common/military_industrial_organization/organizations/', ['icon'], { idOf: b => b.depth > 0 ? val(b.block, 'token') : null });
  generic('scholar_trait', 'common/scientist_traits/', ['icon'], { depth: 0 });
  for (const sub of ['grand_doctrines', 'tracks', 'subdoctrines']) generic('doctrine', `common/doctrines/${sub}/`, ['icon'], { depth: 0, idOf: b => `${sub}:${b.key}` });
  generic('faction', 'common/factions/templates/', ['icon'], { depth: 0 });
  // Map modes: the scripted map modes ZIN defines, drawn by the engine with GFX_mapmode_buttons_(de)selected_small_<key>.
  for (const { file, text: t } of under(f, 'common/map_modes/')) for (const b of blocks(t, /\bscripted_map_modes\s*=\s*\{/)) for (const m of blocks(b.body, /^\t([\w]+)\s*=\s*\{/m)) {
    const key = m.head[1], sel = `GFX_mapmode_buttons_selected_small_${key}`, de = `GFX_mapmode_buttons_deselected_small_${key}`;
    add('map_mode', key, has(de) ? de : null, file, { states: [de, sel].filter(has).map(s => ({ sprite: s, texture: tex(s) })) });
  }
  // Resources: a frame of the engine strip GFX_resources_strip.
  for (const { file, text: t } of under(f, 'common/resources/')) for (const r of blocks(t, /\bresources\s*=\s*\{/)) for (const b of blocks(r.body, /^\t([\w]+)\s*=\s*\{/m)) {
    const frame = /\bicon_frame\s*=\s*(\d+)/.exec(b.body)?.[1];
    if (frame) out.push({ family: 'resource', id: b.head[1], sprite: 'GFX_resources_strip', texture: tex('GFX_resources_strip'), frame: Number(frame), file });
  }
  // Super-event moments: one picture sprite each in the super-event file.
  for (const { file, text: t } of under(f, 'interface/', '.gfx').filter(x => /zin_super_events\.gfx$/.test(x.file))) for (const s of parseSprites(t, 'mod', file)) if (/^GFX_zin_se_/.test(s.name)) add('super_event', s.name.replace(/^GFX_zin_se_/, ''), s.name, file);
  return out;
}

// ---------------------------------------------------------------------------------------------------- general focuses (K69)
// A focus is "genuinely general" when two or more trees carry a focus of the same name built from the same template: the id is
// <tree file stem>_<slug> with the same slug, and the localised name is the same. Those may share one icon (share kind general_focus);
// every other focus gets its own. Returns groups sorted by size then slug.
export function generalFocusGroups(files) {
  const f = toMap(files), loc = new Map();
  for (const [k, v] of [...f].filter(([k]) => /^localisation\/english\/.*\.yml$/i.test(k)).sort(([a], [b]) => ord(a, b))) for (const line of v.toString('utf8').split('\n')) {
    const m = /^\s*([\w.]+):\d*\s*"(.*)"\s*$/.exec(line);
    if (m && !loc.has(m[1])) loc.set(m[1], m[2]);
  }
  const groups = new Map();
  for (const { file, text: t } of under(f, 'common/national_focus/')) {
    const stem = path.posix.basename(file, '.txt');
    for (const tree of blocks(t, /\bfocus_tree\s*=\s*\{/)) {
      const treeId = /\bid\s*=\s*([\w.]+)/.exec(tree.body)?.[1];
      for (const b of blocks(tree.body, /\b(?:focus|shared_focus)\s*=\s*\{/)) {
        const id = /\bid\s*=\s*([\w.]+)/.exec(b.body)?.[1], name = loc.get(id);
        if (!id || !name || !id.startsWith(`${stem}_`)) continue;
        const slug = id.slice(stem.length + 1), key = `${name}|${slug}`;
        if (!groups.has(key)) groups.set(key, { name, slug, ids: [], trees: new Set() });
        groups.get(key).ids.push(id); groups.get(key).trees.add(treeId);
      }
    }
  }
  return [...groups.values()].filter(g => g.ids.length > 1 && g.trees.size > 1)
    .map(g => ({ name: g.name, slug: g.slug, count: g.ids.length, ids: g.ids.sort(ord) }))
    .sort((a, b) => b.count - a.count || ord(a.slug, b.slug));
}

// ---------------------------------------------------------------------------------------------------- registry
const keyOf = c => `${c.family}:${c.id}`;
const texKey = c => c.texture ? (c.frame !== undefined ? `${c.texture}#${c.frame}` : c.texture) : `unresolved:${c.sprite}`;
function statsOf(rows) {
  const byTex = new Map(), bySpr = new Set();
  let withoutIcon = 0, unresolved = 0;
  for (const r of rows) {
    if (!r.sprite) { withoutIcon++; continue; }
    if (!r.texture) unresolved++;
    const k = texKey(r);
    if (!byTex.has(k)) byTex.set(k, []);
    byTex.get(k).push(r.id);
    bySpr.add(r.sprite);
  }
  const sizes = [...byTex.values()].map(a => a.length).sort((a, b) => b - a), shared = [...byTex.values()].filter(a => a.length > 1);
  return {
    concepts: rows.length, withoutIcon, unresolved, sprites: bySpr.size, textures: byTex.size,
    onShared: shared.reduce((s, a) => s + a.length, 0), sharedTextures: shared.length, single: sizes.filter(n => n === 1).length,
    max: sizes[0] ?? 0, median: sizes.length ? sizes[Math.floor(sizes.length / 2)] : 0,
    top: [...byTex].sort((a, b) => b[1].length - a[1].length || ord(a[0], b[0])).slice(0, 5).map(([t, a]) => ({ texture: t, count: a.length })),
  };
}
// The audit grouped every idea category as one family "ideas" and counted only its own families across families.
const AUDIT_GROUP = { spirit: 'ideas', law: 'ideas', officer_spirit: 'ideas' };
const AUDIT_FAMILIES = new Set(FAMILIES.filter(f => f.audit).map(f => f.id));
export function iconRegistry(files, opts = {}) {
  const f = toMap(files), sprites = opts.sprites ?? spriteIndex(f, opts);
  const concepts = extractConcepts(f, { ...opts, sprites });
  const families = {};
  for (const id of FAMILY_IDS) families[id] = statsOf(concepts.filter(c => c.family === id));
  const textures = new Map(), famOf = new Map(), famOfAudit = new Map();
  for (const c of concepts) {
    if (!c.texture) continue;
    const k = texKey(c);
    if (!textures.has(k)) textures.set(k, []);
    textures.get(k).push(keyOf(c));
    if (!famOf.has(c.texture)) famOf.set(c.texture, new Set());
    famOf.get(c.texture).add(c.family);
    if (AUDIT_FAMILIES.has(c.family)) { if (!famOfAudit.has(c.texture)) famOfAudit.set(c.texture, new Set()); famOfAudit.get(c.texture).add(AUDIT_GROUP[c.family] ?? c.family); }
  }
  const crossFamily = [...famOf].filter(([, s]) => s.size > 1).map(([texture, s]) => ({ texture, families: [...s].sort(ord) })).sort((a, b) => ord(a.texture, b.texture));
  const crossFamilyAudit = [...famOfAudit.values()].filter(s => s.size > 1).length;
  const design = opts.design ?? loadDesign();
  const placeholder = new Set((opts.placeholders ?? design.placeholderTextures ?? []).map(slashLower)), owners = new Set((design.placeholderOwners ?? []).map(n => n.toLowerCase()));
  const frameSprites = [...sprites.values()].filter(s => s.origin === 'mod' && placeholder.has(s.texture) && !owners.has(s.name.toLowerCase())).length;
  return { concepts, families, textures, crossFamily, crossFamilyAudit, frameSprites, sprites };
}

// ---------------------------------------------------------------------------------------------------- shares and targets
export function loadShares(file = SHARES_FILE) { return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { shares: [], targets: {} }; }
export function loadDesign(file = DESIGN_FILE) { return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}; }
// Problems of the hand-kept share list itself: unknown kind, missing reason, fewer than two members, a member in two entries.
export function validateShares(shares) {
  const problems = [], seen = new Map();
  for (const [i, s] of (shares.shares ?? []).entries()) {
    const where = s.id ?? `#${i}`;
    if (!SHARE_KINDS.includes(s.kind)) problems.push(`${where}: unknown kind ${s.kind}`);
    if (!s.reason || String(s.reason).length < 12) problems.push(`${where}: no reason`);
    if (!Array.isArray(s.concepts) || s.concepts.length < 2) problems.push(`${where}: a share needs two or more concepts`);
    for (const c of s.concepts ?? []) { if (seen.has(c)) problems.push(`${where}: ${c} is also in ${seen.get(c)}`); seen.set(c, where); }
  }
  return problems;
}
// K69 targets: one picture per concept, minus the members a deliberate share lets go (a share of n concepts needs one picture).
export function targets(registry, shares) {
  const saved = {};
  for (const s of shares.shares ?? []) {
    if (!SHARE_KINDS.includes(s.kind)) continue;
    const fams = new Map();
    for (const c of s.concepts ?? []) { const fam = c.split(':')[0]; fams.set(fam, (fams.get(fam) ?? 0) + 1); }
    for (const [fam, n] of fams) if (n > 1) saved[fam] = (saved[fam] ?? 0) + n - 1;
  }
  const out = {};
  for (const id of FAMILY_IDS) {
    const st = registry.families[id], rule = shares.targets?.[id];
    out[id] = { concepts: st.concepts, pictures: st.concepts - (saved[id] ?? 0), today: st.textures, rule: rule?.rule ?? 'one picture per concept' };
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------- committed form
// Compact and stable: summary per family, the audit comparison, and one row [family, id, sprite, texture(#frame)] per concept.
export function registryFile(registry, shares = loadShares()) {
  const summary = Object.fromEntries(FAMILY_IDS.map(id => { const { top, ...rest } = registry.families[id]; return [id, rest]; }));
  return {
    format: 1,
    generator: 'tools/content/modules/icon_registry.mjs',
    rules: 'docs/specs/07_interface/07_design_system.md §4; deliberate reuse in data/ui/icon_shares.json',
    summary, crossFamily: registry.crossFamily.length, crossFamilyAudit: registry.crossFamilyAudit, frameSprites: registry.frameSprites,
    targets: targets(registry, shares),
    concepts: registry.concepts.map(c => [c.family, c.id, c.sprite, c.texture ? texKey(c) : null]),
  };
}
// The audit counted laws and officer-corps spirits per idea category and added the categories up (01_audit.md §3.1), so a picture used
// in two categories counted once in each; the registry counts the family as a whole. The comparison sums per category as the audit did.
const PER_KIND = new Set(['law', 'officer_spirit']);
function summedByKind(registry, fam) {
  const kinds = new Map();
  for (const c of registry.concepts) if (c.family === fam) { if (!kinds.has(c.kind)) kinds.set(c.kind, []); kinds.get(c.kind).push(c); }
  const parts = [...kinds.values()].map(statsOf), sum = k => parts.reduce((s, p) => s + p[k], 0);
  return { concepts: sum('concepts'), withoutIcon: sum('withoutIcon'), textures: sum('textures'), onShared: sum('onShared'), single: sum('single'), max: Math.max(0, ...parts.map(p => p.max)), median: parts.length ? parts.map(p => p.median).sort((a, b) => a - b)[Math.floor(parts.length / 2)] : 0 };
}
// Drift against the audit numbers: [{ family, field, audit, now }].
export function auditDrift(registry) {
  const out = [];
  for (const [fam, want] of Object.entries(AUDIT_31_OCTOBER)) {
    if (typeof want !== 'object') continue;
    const have = PER_KIND.has(fam) ? summedByKind(registry, fam) : registry.families[fam];
    for (const [k, v] of Object.entries(want)) if (have[k] !== v) out.push({ family: fam, field: k, audit: v, now: have[k] });
  }
  if (registry.crossFamilyAudit !== AUDIT_31_OCTOBER.crossFamilyAudit) out.push({ family: 'cross-family', field: 'textures', audit: AUDIT_31_OCTOBER.crossFamilyAudit, now: registry.crossFamilyAudit });
  if (registry.frameSprites !== AUDIT_31_OCTOBER.frameSprites) out.push({ family: 'frame.dds', field: 'sprites', audit: AUDIT_31_OCTOBER.frameSprites, now: registry.frameSprites });
  return out;
}
export const summariseRegistry = registry => `icon registry: ${registry.concepts.length} concepts in ${FAMILY_IDS.filter(id => registry.families[id].concepts).length} families; ` +
  ['focus', 'spirit', 'decision', 'event', 'technology'].map(id => `${id} ${registry.families[id].concepts} on ${registry.families[id].textures}`).join(', ') +
  `; ${registry.crossFamily.length} textures in two or more families; ${registry.frameSprites} sprites on a placeholder texture`;

// Read a staged directory from disk into a Map (the CLI and the render harness use it).
export function readStagedTree(dir, prefixes = ['common/', 'events/', 'interface/', 'localisation/english/']) {
  const out = new Map();
  const wanted = r => prefixes.some(p => r.startsWith(p) || p.startsWith(r));
  const walk = (abs, rel) => {
    for (const n of readdirSync(abs).sort(ord)) {
      const a = `${abs}/${n}`, r = rel ? `${rel}/${n}` : n, dir = statSync(a).isDirectory();
      if (!wanted(dir ? `${r}/` : r)) continue;
      if (dir) walk(a, r); else out.set(r, readFileSync(a));
    }
  };
  walk(dir.replace(/\\/g, '/'), '');
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const dir = stagingDir(process.argv[2]);
  const reg = iconRegistry(readStagedTree(dir));
  writeFileSync(REGISTRY_FILE, JSON.stringify(registryFile(reg)) .replace(/\],\[/g, '],\n[') + '\n');
  console.log(summariseRegistry(reg));
  const drift = auditDrift(reg);
  console.log(drift.length ? `drift from the 31 October audit: ${drift.map(d => `${d.family}.${d.field} ${d.audit} -> ${d.now}`).join('; ')}` : 'matches the 31 October audit');
}
