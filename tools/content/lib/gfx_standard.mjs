// The gfx standard of Hearts of Iron IV for shaped emblems (docs/design/validation/gfx_standard.md). Vanilla focus, idea, decision,
// technology and trait icons are shaped emblems drawn over a frame: a transparent ground with the emblem's own outline, never an
// opaque rectangle. The vanilla families measured in the installed game are at least 14% transparent (focus icons 14.5%, decision
// icons 15%, technology icons 24%, trait icons 27%) with all four corners clear. This module judges a shipped texture against that
// and reports the rule GFX_OPAQUE_EMBLEM; checks/assets.mjs calls it.
//
//   alphaProfile(rgba, w, h)          -> { transparent, corners, minAlpha, maxAlpha }
//   judgeEmblem(profile, alpha)       -> string[]    why the texture is not a shaped emblem ([] when it is)
//   checkGfxStandard(input)           -> { files, pending, blocked, strict }   findings are added through input.add
//
// input: { cfg, files: Map rel -> { ext, info }, read(rel) -> Buffer, sprites: Map name -> [{ file, line, textures: [{ key, path }] }],
//          resolve(path) -> { where, path } | null, add(code, severity, file, message, subject) }
import { decodeRgba } from './dds_info.mjs';

export const DEFAULT_ALPHA = { minTransparent: 0.1, minCorners: 3 };

export function alphaProfile(rgba, w, h) {
  const n = w * h; let clear = 0, min = 255, max = 0;
  for (let i = 0; i < n; i++) { const a = rgba[i * 4 + 3]; if (a < 16) clear++; if (a < min) min = a; if (a > max) max = a; }
  const corners = [0, w - 1, (h - 1) * w, n - 1].filter(p => rgba[p * 4 + 3] < 16).length;
  return { transparent: n ? clear / n : 0, corners, minAlpha: min, maxAlpha: max };
}

export function judgeEmblem(profile, alpha = DEFAULT_ALPHA) {
  const why = [];
  if (profile.maxAlpha === 0) why.push('it is fully transparent (nothing is drawn)');
  else if (profile.minAlpha === 255) why.push('it has no transparent pixel (an opaque rectangle)');
  if (profile.transparent < alpha.minTransparent) why.push(`${(profile.transparent * 100).toFixed(1)}% of its pixels are transparent, fewer than the ${(alpha.minTransparent * 100).toFixed(0)}% every vanilla icon of this kind has`);
  if (profile.corners < alpha.minCorners) why.push(`${profile.corners} of its 4 corners are transparent, fewer than ${alpha.minCorners}`);
  return why;
}

const compile = (rows, field) => (rows ?? []).map(r => ({ ...r, re: new RegExp(r[field]) }));
const pct = x => `${(x * 100).toFixed(0)}%`;

export function checkGfxStandard({ cfg, files, read, sprites, resolve, add }) {
  const out = { files: 0, strict: [], pending: [], blocked: [], unreadable: [] };
  if (!cfg || !Array.isArray(cfg.emblem_files)) return out;
  const alpha = { ...DEFAULT_ALPHA, ...(cfg.alpha ?? {}) }, rules = compile(cfg.emblem_files, 'match'), pending = compile(cfg.pending_files, 'match');
  const emblemFile = new Set(), strictCount = new Map(), pendingFiles = new Map();
  // Files: every shipped texture of an emblem family.
  for (const [rel, f] of files) {
    const rule = rules.find(r => r.re.test(rel));
    if (!rule || !f.info?.valid) continue;
    emblemFile.add(rel); out.files++;
    const px = decodeRgba(read(rel), f.ext, f.info);
    if (!px) { out.unreadable.push(rel); add('GFX_ALPHA_UNREADABLE', 'warning', rel, `${rel} is a ${rule.id} in format ${f.info.format}; its alpha cannot be read, so the shaped-emblem rule is not checked.`, 'unreadable'); continue; }
    const problems = judgeEmblem(alphaProfile(px, f.info.width, f.info.height), alpha);
    strictCount.set(rule.id, (strictCount.get(rule.id) ?? 0) + 1);
    if (!problems.length) continue;
    const hold = pending.find(p => p.re.test(rel));
    if (hold) { (pendingFiles.get(hold.why) ?? pendingFiles.set(hold.why, []).get(hold.why)).push(rel); add('GFX_OPAQUE_EMBLEM', 'warning', rel, `${rel} (${rule.id}) is not a shaped emblem: ${problems.join('; ')}. Report-level until its sheet is regenerated: ${hold.why}.`, `${rule.id}:pending`); }
    else add('GFX_OPAQUE_EMBLEM', 'error', rel, `${rel} (${rule.id}) is not a shaped emblem: ${problems.join('; ')}. A ${rule.id} is drawn over a frame, so its ground must be transparent (docs/design/validation/gfx_standard.md).`, rule.id);
  }
  out.strict = [...strictCount].sort(([a], [b]) => (a < b ? -1 : 1)).map(([id, files]) => ({ id, files }));
  out.pending = [...pendingFiles].map(([why, list]) => ({ why, files: list.sort() }));
  // Sprites: an emblem sprite whose texture is not one of the emblem files (a placeholder panel, a reused picture) is judged by its pixels.
  const families = compile(cfg.emblem_sprites, 'sprite'), hits = new Map();
  for (const [name, defs] of [...sprites].sort(([a], [b]) => (a < b ? -1 : 1))) {
    const fam = families.find(r => r.re.test(name));
    if (!fam) continue;
    for (const d of defs) {
      const tex = d.textures.find(t => t.key === 'texturefile'); if (!tex) continue;
      const r = resolve(tex.path); if (!r || r.where !== 'zin' || emblemFile.has(r.path)) continue;
      const f = files.get(r.path); if (!f?.info?.valid) continue;
      const px = decodeRgba(read(r.path), f.ext, f.info); if (!px) continue;
      const problems = judgeEmblem(alphaProfile(px, f.info.width, f.info.height), alpha);
      if (!problems.length) continue;
      const row = hits.get(fam.id) ?? hits.set(fam.id, { fam, sprites: [], textures: new Set(), file: d.file, problems }).get(fam.id);
      row.sprites.push(name); row.textures.add(r.path);
    }
  }
  for (const { fam, sprites: list, textures, file, problems } of hits.values()) {
    const tex = [...textures].sort(), ex = list.slice(0, 3).join(', '), more = list.length > 3 ? `, ... ${list.length - 3} more` : '';
    const msg = `${list.length} ${fam.id} sprites (${ex}${more}) draw ${tex.length === 1 ? tex[0] : `${tex.length} textures (for example ${tex[0]})`}, which is not a shaped emblem: ${problems[0]}. ${fam.why}`;
    if (fam.state === 'fixed') for (const s of list) add('GFX_OPAQUE_EMBLEM', 'error', file, `Sprite ${s} (${fam.id}) draws an opaque texture. ${fam.why}`, `${fam.id}:${s}`);
    else { add('GFX_OPAQUE_EMBLEM', 'warning', file, `${msg} Report-level: the art of this family is not generated yet.`, `${fam.id}:blocked`); out.blocked.push({ id: fam.id, sprites: list.length, textures: tex, examples: list.slice(0, 5), why: fam.why }); }
  }
  out.blocked.sort((a, b) => (a.id < b.id ? -1 : 1));
  void pct;
  return out;
}
