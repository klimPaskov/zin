// Provenance links of the asset manifest: from a shipped file back to the generated picture it was cut from and the
// generation and review lines that prove where that picture came from (art pipeline section 2, checks 2 to 4).
// Reads the provenance log, the per-module manifests (art/source/*_manifest.json) and the path rules of
// data/assets/families.json. Never writes.
import path from 'node:path';
import { sha256 } from './loaded_assets.mjs';

export function parseJsonl(text) {
  const lines = [], errors = [];
  text.split(/\r?\n/).forEach((l, i) => { if (!l.trim()) return; try { lines.push(JSON.parse(l)); } catch (e) { errors.push({ line: i + 1, message: String(e.message).slice(0, 80) }); } });
  return { lines, errors };
}

export const isGeneration = l => typeof l.prompt === 'string';
export const isReview = l => !isGeneration(l) && typeof l.accepted === 'boolean';

// The raw path a provenance line names, relative to art/source/ ("../raw/events/x.png" -> "events/x.png").
export const rawRel = out => String(out ?? '').replace(/^\.\.\/raw\//, '').replace(/^raw\//, '');

const FOREIGN = /steamapps|workshop[\\/]content|Hearts of Iron IV|\.paradoxinteractive|Documents[\\/]Paradox/i;

export function loadProvenance(view, file = 'art/source/provenance.jsonl') {
  if (!view.has(file)) return { lines: [], errors: [], missing: true };
  return { ...parseJsonl(view.utf8(file)), missing: false };
}

// Module manifests: out -> { manifest, line, decisions }.
export function loadModuleManifests(view) {
  const byOut = new Map(), decisions = new Map(), problems = [];
  for (const rel of view.paths.filter(p => /^art\/source\/[^/]+_manifest\.json$/.test(p))) {
    if (rel === 'art/source/asset_manifest.json') continue;
    let json; try { json = JSON.parse(view.utf8(rel)); } catch (e) { problems.push({ file: rel, message: `unreadable manifest: ${String(e.message).slice(0, 80)}` }); continue; }
    for (const f of json.files ?? []) {
      if (!f.out) continue;
      if (byOut.has(f.out)) problems.push({ file: rel, message: `${f.out} has a line in two manifests (${byOut.get(f.out).manifest})` });
      byOut.set(f.out, { manifest: rel, ...f });
    }
    for (const d of json.decisions ?? []) if (d.source) decisions.set(d.source, { manifest: rel, ...d });
  }
  return { byOut, decisions, problems };
}

const fill = (tpl, m) => (tpl == null ? null : tpl.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? ''));

export function compileRules(families) {
  return families.rules.map(r => ({ ...r, re: new RegExp(r.match) }));
}

export function classify(rules, rel) {
  for (const r of rules) {
    const m = r.re.exec(rel);
    if (m) return { rule: r, m };
  }
  return null;
}

// Build the resolver. `tables` holds the country table and the flag cell map for the world-owned flags.
export function createSourceResolver({ view, provenance, manifests, rules, tables = {} }) {
  const gens = provenance.lines.filter(isGeneration), reviews = provenance.lines.filter(isReview);
  const countries = new Map((tables.countries ?? []).map(c => [c.tag, c.name]));
  const cellsByName = new Map((tables.flagCells ?? []).map(c => [c.name, c]));
  const shaOf = rel => (view.has(rel) ? view.sha(rel) : null);

  // Generation and review lines of one tracked source picture.
  function linkSource(srcRel) {
    const problems = [];
    if (!view.has(srcRel)) return { problems: [{ code: 'PROV_SOURCE_MISSING', message: `source picture ${srcRel} is not tracked`, sourcePath: srcRel }], source: { path: srcRel } };
    const sha = shaOf(srcRel), raw = srcRel.replace(/^art\/source\//, '');
    const byPath = gens.filter(g => rawRel(g.out) === raw), bySha = gens.filter(g => g.sha256 === sha);
    const gen = bySha.at(-1) ?? byPath.at(-1);
    if (!gen) problems.push({ code: 'PROV_NO_GENERATION', message: `no generation record for ${srcRel}` });
    const rv = reviews.filter(l => l.sha256 === sha), last = rv.at(-1);
    const decision = manifests.decisions.get(srcRel);
    const decided = decision && decision.sha256 === sha;
    let review = null;
    if (last?.accepted === true) review = { id: last.id, sha256: sha, reviewer: last.reviewer ?? null };
    else if (decided) review = { id: `decision:${decision.basis}`, sha256: sha, reviewer: 'decision' };
    else problems.push({ code: 'PROV_UNREVIEWED', message: last ? `the last review of ${srcRel} rejects these bytes` : `no review line for the exact bytes of ${srcRel}` });
    for (const g of gens.filter(x => x === gen)) {
      for (const ref of g.references ?? []) {
        const s = String(ref);
        if (FOREIGN.test(s)) problems.push({ code: 'PROV_REF_FOREIGN', message: `${gen.id} references a path inside a game or mod folder: ${s}` });
        else if (/^private:/i.test(s)) problems.push({ code: 'PROV_REF_PRIVATE', message: `${gen.id} uses a private reference (${s}); allowed only for reviewed subjects` });
        else if (!/^(art\/source\/|\.\.\/raw\/|raw\/)/.test(s) && !s.replace(/\\/g, '/').includes('/zin-art/raw/')) problems.push({ code: 'PROV_REF_OUTSIDE', message: `${gen.id} references ${s}, outside art/source/` });
      }
    }
    return { problems: problems.map(p => ({ ...p, sourcePath: srcRel })), source: { path: srcRel, rawSha256: sha, jobs: gen ? [gen.id] : [], review } };
  }

  // Resolve one shipped file. Returns { route, source, ops, manifest, problems, exempt }.
  function resolve(rel, cls) {
    const rule = cls?.rule;
    const route = rule?.route ?? 'imagegen';
    if (route === 'derived' || route === 'kept' || route === 'synth') return { route, source: null, ops: [], manifest: null, problems: [], exempt: true };
    if (route === 'meshy') {
      const job = fill(rule.job, cls.m);
      const ok = job && (view.has(`${job}/job.yaml`) || view.has(`${job}/manifest.md`));
      return { route, source: { path: job, jobs: [path.posix.basename(job ?? '')] }, ops: [], manifest: null, problems: ok ? [] : [{ code: 'PROV_NO_JOB', message: `no tracked 3D job root for ${rel} at ${job}` }], exempt: false };
    }
    const line = manifests.byOut.get(rel);
    if (line) {
      const problems = [];
      const here = view.has(rel) ? view.sha(rel) : null;
      if (here && line.sha256 !== here) problems.push({ code: 'MANIFEST_STALE', message: `${line.manifest} records sha256 ${String(line.sha256).slice(0, 12)} but the shipped bytes are ${here.slice(0, 12)}` });
      const srcRel = line.source;
      const linked = linkSource(srcRel);
      if (line.sourceSha256 && linked.source.rawSha256 && line.sourceSha256 !== linked.source.rawSha256) problems.push({ code: 'MANIFEST_STALE', message: `${line.manifest} records source ${String(line.sourceSha256).slice(0, 12)} but ${srcRel} is ${linked.source.rawSha256.slice(0, 12)}` });
      return { route, source: { ...linked.source, ops: line.ops ?? [] }, ops: line.ops ?? [], manifest: line.manifest, problems: [...problems, ...linked.problems], exempt: false };
    }
    // No module manifest line (older modules): fall back to the rule's source mapping.
    let srcRel = fill(rule?.source, cls?.m ?? []);
    let sheet = null, cell = null;
    if (rule?.flagTag) {
      const tag = fill(rule.flagTag, cls.m), name = countries.get(tag), c = name ? cellsByName.get(name) : null;
      if (!c) return { route, source: null, ops: [], manifest: null, problems: [{ code: 'PROV_SOURCE_UNKNOWN', message: `flag ${tag} has no country-table name or flag-sheet cell, so its source sheet is unknown` }], exempt: false };
      srcRel = `art/source/flags/${c.sheet}.png`; sheet = c.sheet; cell = { row: c.row, col: c.col, index: c.index };
    }
    if (!srcRel) return { route, source: null, ops: [], manifest: null, problems: [{ code: 'PROV_NO_MANIFEST_LINE', message: `no module manifest line and no source rule for ${rel}` }], exempt: false };
    const linked = linkSource(srcRel);
    return { route, source: { ...linked.source, ...(sheet ? { sheet, cell } : {}) }, ops: [], manifest: null, problems: linked.problems, exempt: false };
  }

  return { resolve, linkSource, gens, reviews };
}

export { sha256 };
