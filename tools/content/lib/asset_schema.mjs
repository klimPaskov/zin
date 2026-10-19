// Strict schema of the asset manifest (05_asset_manifest.md section 2.1). Unknown fields are errors, like
// focus_schema.mjs. validateManifest returns a list of problems; an empty list means the manifest is valid (AC1).

export const KINDS = [
  'focus_icon', 'idea_icon', 'trait_icon', 'decision_icon', 'decision_category', 'symbol', 'faction_emblem',
  'tech_icon', 'tech_folder', 'doctrine_icon', 'equipment_picture', 'unit_icon', 'counter', 'template_icon',
  'tactic_picture', 'portrait_large', 'portrait_small', 'event_picture', 'news_picture', 'loading_screen', 'menu_background', 'frontend',
  'ui_chrome', 'ui_panel', 'map_icon', 'stat_icon', 'texticon', 'flag', 'chronicle_plate', 'cursor', 'map_texture', 'particle_texture',
  'model', 'sound', 'music', 'font',
];
export const FILE_FORMATS = ['a8r8g8b8', 'x8r8g8b8', 'r8g8b8', 'bc1', 'bc2', 'bc3', 'bc4', 'bc5', 'bc7', 'dx10', 'tga32', 'tga24', 'tga8', 'tga_rle', 'tga_other', 'png', 'bmp8', 'bmp24', 'bmp32', 'bmp_other', 'cur', 'ani', 'ico', 'mesh', 'anim', 'wav', 'ogg', 'mp3', 'fnt', 'other', 'invalid'];
export const BOUND_BY = ['sprite', 'path_convention', 'entity', 'sound_effect', 'music_asset', 'flag_tag', 'font_asset', 'map_file', 'cursor_name'];
export const ROUTES = ['imagegen', 'meshy', 'synth', 'derived', 'kept'];
export const STATES = ['planned', 'generated', 'accepted', 'shipped', 'kept', 'hidden', 'blocked'];
export const REACH = ['visible', 'conditional', 'hidden', 'engine'];
export const TIERS = ['A', 'B', 'C', ''];

const RECORD_FIELDS = ['id', 'family', 'kind', 'subject', 'files', 'sprites', 'bound_by', 'source', 'owner_spec', 'people', 'culture', 'region', 'tier', 'gate', 'uniqueness_group', 'perceptual', 'state', 'reach', 'replaces', 'inventory_rows'];
const FILE_FIELDS = ['path', 'bytes', 'sha256', 'width', 'height', 'format', 'mips', 'frames'];
const SOURCE_FIELDS = ['route', 'jobs', 'sheet', 'cell', 'rawSha256', 'review', 'ops', 'manifest', 'path'];
const PERCEPTUAL_FIELDS = ['dhash', 'ahash', 'luma_mean'];

const isStr = v => typeof v === 'string';
const isInt = v => Number.isInteger(v) && v >= 0;
const isHex = (v, n) => isStr(v) && new RegExp(`^[0-9a-f]{${n}}$`).test(v);

export function validateRecord(r, where = r?.id ?? '(record)') {
  const problems = [], add = m => problems.push(`${where}: ${m}`);
  if (r === null || typeof r !== 'object' || Array.isArray(r)) return [`${where}: not an object`];
  for (const k of Object.keys(r)) if (!RECORD_FIELDS.includes(k)) add(`unknown field ${k}`);
  for (const k of ['id', 'family', 'kind', 'subject', 'bound_by', 'owner_spec', 'state', 'reach', 'uniqueness_group']) if (!isStr(r[k]) || (k !== 'owner_spec' && !r[k])) add(`${k} must be a non-empty string`);
  if (isStr(r.id) && isStr(r.family) && !r.id.startsWith(`${r.family}/`)) add(`id must start with the family and a slash (${r.family}/)`);
  if (isStr(r.kind) && !KINDS.includes(r.kind)) add(`kind ${r.kind} is not in the enum`);
  if (isStr(r.bound_by) && !BOUND_BY.includes(r.bound_by)) add(`bound_by ${r.bound_by} is not in the enum`);
  if (isStr(r.state) && !STATES.includes(r.state)) add(`state ${r.state} is not in the enum`);
  if (isStr(r.reach) && !REACH.includes(r.reach)) add(`reach ${r.reach} is not in the enum`);
  if (r.tier !== undefined && !TIERS.includes(r.tier)) add(`tier ${r.tier} is not A, B, C or empty`);
  for (const k of ['sprites', 'people', 'inventory_rows']) if (!Array.isArray(r[k]) || !r[k].every(isStr)) add(`${k} must be an array of strings`);
  for (const k of ['culture', 'region', 'gate', 'replaces']) if (!isStr(r[k])) add(`${k} must be a string (empty when unused)`);
  if (!Array.isArray(r.files)) add('files must be an array');
  else {
    if (r.state === 'shipped' && r.files.length === 0) add('a shipped record needs at least one file');
    r.files.forEach((f, i) => {
      const w = `files[${i}]`;
      if (f === null || typeof f !== 'object') { add(`${w} is not an object`); return; }
      for (const k of Object.keys(f)) if (!FILE_FIELDS.includes(k)) add(`${w} unknown field ${k}`);
      if (!isStr(f.path) || !f.path) add(`${w}.path must be a non-empty string`);
      if (!isInt(f.bytes)) add(`${w}.bytes must be a non-negative integer`);
      if (!isHex(f.sha256, 64)) add(`${w}.sha256 must be 64 hex digits`);
      if (!isInt(f.width) || !isInt(f.height)) add(`${w} width and height must be non-negative integers`);
      if (!FILE_FORMATS.includes(f.format)) add(`${w}.format ${f.format} is not in the enum`);
      if (!isInt(f.mips) || !isInt(f.frames)) add(`${w} mips and frames must be non-negative integers`);
    });
  }
  const s = r.source;
  if (s === null || typeof s !== 'object' || Array.isArray(s)) add('source must be an object');
  else {
    for (const k of Object.keys(s)) if (!SOURCE_FIELDS.includes(k)) add(`source unknown field ${k}`);
    if (!ROUTES.includes(s.route)) add(`source.route ${s.route} is not in the enum`);
    if (!Array.isArray(s.jobs) || !s.jobs.every(isStr)) add('source.jobs must be an array of strings');
    if (!Array.isArray(s.ops) || !s.ops.every(isStr)) add('source.ops must be an array of strings');
  }
  const p = r.perceptual;
  if (p === null || typeof p !== 'object' || Array.isArray(p)) add('perceptual must be an object (empty when unused)');
  else {
    for (const k of Object.keys(p)) if (!PERCEPTUAL_FIELDS.includes(k)) add(`perceptual unknown field ${k}`);
    if (Object.keys(p).length) { if (!isHex(p.dhash, 16) || !isHex(p.ahash, 16) || typeof p.luma_mean !== 'number') add('perceptual needs dhash, ahash (16 hex digits) and luma_mean'); }
  }
  return problems;
}

// AC1: every record validates, ids are unique, file paths are unique across records, and records are sorted by id.
export function validateManifest(manifest) {
  const problems = [];
  if (!manifest || !Array.isArray(manifest.records)) return ['manifest has no records array'];
  const ids = new Set(), paths = new Map();
  let previous = '';
  for (const r of manifest.records) {
    problems.push(...validateRecord(r));
    if (ids.has(r?.id)) problems.push(`${r.id}: duplicate id`);
    ids.add(r?.id);
    if (isStr(r?.id)) { if (previous && r.id < previous) problems.push(`${r.id}: records are not sorted by id`); previous = r.id; }
    for (const f of r?.files ?? []) {
      if (!isStr(f?.path)) continue;
      if (paths.has(f.path)) problems.push(`${f.path}: file listed by two records (${paths.get(f.path)} and ${r.id})`);
      paths.set(f.path, r.id);
    }
  }
  return problems;
}
